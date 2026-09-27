import { decompress } from 'fzstd';
import JSZip from 'jszip';
import type { Database, SqlJsStatic } from 'sql.js';
import type { BaralhoImportado } from '../db/repo';
import { htmlToText, mimeFromName } from './html';

export class AnkiError extends Error {}

export interface ResultadoImport {
  baralhos: BaralhoImportado[];
  /** Chave = nome da imagem citado nos cards. */
  media: Map<string, Blob>;
}

const isZstd = (b: Uint8Array) => b.length > 4 && b[0] === 0x28 && b[1] === 0xb5 && b[2] === 0x2f && b[3] === 0xfd;
const unz = (b: Uint8Array) => (isZstd(b) ? decompress(b) : b);

// ---------- protobuf mínimo (mapa de mídia do formato novo) ----------

function varint(b: Uint8Array, pos: number): [number, number] {
  let v = 0;
  let mul = 1;
  for (;;) {
    const byte = b[pos++];
    v += (byte & 0x7f) * mul;
    if (byte < 0x80) return [v, pos];
    mul *= 128;
  }
}

function fields(b: Uint8Array, onField: (num: number, wt: number, val: number | Uint8Array) => void) {
  let pos = 0;
  while (pos < b.length) {
    const [tag, p1] = varint(b, pos);
    pos = p1;
    const num = Math.floor(tag / 8);
    const wt = tag & 7;
    if (wt === 0) {
      const [v, p2] = varint(b, pos);
      pos = p2;
      onField(num, wt, v);
    } else if (wt === 2) {
      const [len, p2] = varint(b, pos);
      onField(num, wt, b.subarray(p2, p2 + len));
      pos = p2 + len;
    } else if (wt === 1) pos += 8;
    else if (wt === 5) pos += 4;
    else throw new AnkiError('mapa de mídia corrompido');
  }
}

/** MediaEntries { repeated MediaEntry entries = 1 }; MediaEntry { string name = 1; uint32 legacy_zip_filename = 255 } */
export function parseMediaEntries(b: Uint8Array): Map<string, string> {
  const out = new Map<string, string>();
  let i = 0;
  const dec = new TextDecoder();
  fields(b, (num, wt, val) => {
    if (num !== 1 || wt !== 2) return;
    let name = '';
    let legacy: number | null = null;
    fields(val as Uint8Array, (n, w, v) => {
      if (n === 1 && w === 2) name = dec.decode(v as Uint8Array);
      if (n === 255 && w === 0) legacy = v as number;
    });
    out.set(String(legacy ?? i), name);
    i++;
  });
  return out;
}

async function readMediaMap(zip: JSZip): Promise<Map<string, string>> {
  const f = zip.file('media');
  if (!f) return new Map();
  const raw = await f.async('uint8array');
  if (!isZstd(raw)) {
    try {
      return new Map(Object.entries(JSON.parse(new TextDecoder().decode(raw)) as Record<string, string>));
    } catch {
      return parseMediaEntries(raw);
    }
  }
  return parseMediaEntries(decompress(raw));
}

// ---------- coleção ----------

function readDecks(db: Database): Map<number, string> {
  const out = new Map<number, string>();
  const clean = (n: string) => n.split(/\x1f|::/).map((s) => s.trim()).filter(Boolean).join(' › ');
  try {
    const r = db.exec('SELECT id, name FROM decks');
    for (const [id, name] of r[0]?.values ?? []) out.set(Number(id), clean(String(name)));
  } catch {
    const r = db.exec('SELECT decks FROM col');
    const json = JSON.parse(String(r[0]?.values[0]?.[0] ?? '{}')) as Record<string, { id: number; name: string }>;
    for (const d of Object.values(json)) out.set(Number(d.id), clean(d.name));
  }
  return out;
}

const CLOZE = /\{\{c(\d+)::([\s\S]*?)(?:::([\s\S]*?))?\}\}/g;

interface CardBruto { frente: string; verso: string; tags: string[]; imgsFrente: string[]; imgsVerso: string[] }

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** Uma nota vira um card (básica) ou um card por lacuna (cloze). */
export function noteToCards(flds: string[], tags: string[]): CardBruto[] {
  const toCard = (frenteHtml: string, versoHtml: string): CardBruto | null => {
    const f = htmlToText(frenteHtml);
    const v = htmlToText(versoHtml);
    const card = { frente: f.texto, verso: v.texto, tags, imgsFrente: f.imgs.map(safeDecode), imgsVerso: v.imgs.map(safeDecode) };
    const temFrente = card.frente || card.imgsFrente.length;
    const temVerso = card.verso || card.imgsVerso.length;
    return temFrente && temVerso ? card : null;
  };

  const texto = flds[0] ?? '';
  const nums = [...new Set([...texto.matchAll(CLOZE)].map((m) => Number(m[1])))].sort((a, b) => a - b);
  if (nums.length) {
    const extra = flds.slice(1).filter((x) => x.trim()).join('<br>');
    const revelado = texto.replace(CLOZE, (_, _n, inner) => inner);
    return nums
      .map((n) =>
        toCard(
          texto.replace(CLOZE, (_, num, inner, hint) => (Number(num) === n ? `[${hint || '…'}]` : inner)),
          extra ? `${revelado}<br><br>${extra}` : revelado,
        ),
      )
      .filter((c): c is CardBruto => !!c);
  }
  const c = toCard(texto, flds.slice(1).filter((x) => x.trim()).join('<br>'));
  return c ? [c] : [];
}

/** Lê um .apkg/.colpkg do Anki. Os cards entram como novos; o histórico de revisões do Anki não é trazido. */
export async function parseApkg(data: ArrayBuffer | Uint8Array, SQL: SqlJsStatic): Promise<ResultadoImport> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch {
    throw new AnkiError('não é um arquivo do Anki');
  }
  const colFile = zip.file('collection.anki21b') ?? zip.file('collection.anki21') ?? zip.file('collection.anki2');
  if (!colFile) throw new AnkiError('não é um arquivo do Anki');
  const db = new SQL.Database(unz(await colFile.async('uint8array')));

  const porDeck = new Map<number, CardBruto[]>();
  let nomes: Map<number, string>;
  try {
    nomes = readDecks(db);
    const deckDaNota = new Map<number, number>();
    for (const [nid, did] of db.exec('SELECT nid, did FROM cards ORDER BY nid, ord')[0]?.values ?? []) {
      if (!deckDaNota.has(Number(nid))) deckDaNota.set(Number(nid), Number(did));
    }
    for (const [id, flds, tags] of db.exec('SELECT id, flds, tags FROM notes ORDER BY id')[0]?.values ?? []) {
      const did = deckDaNota.get(Number(id));
      if (did === undefined) continue;
      const cards = noteToCards(String(flds).split('\x1f'), String(tags).trim().split(/\s+/).filter(Boolean));
      if (!porDeck.has(did)) porDeck.set(did, []);
      porDeck.get(did)!.push(...cards);
    }
  } finally {
    db.close();
  }

  const baralhos: BaralhoImportado[] = [...porDeck]
    .filter(([, cards]) => cards.length)
    .map(([did, cards]) => ({ nome: nomes.get(did) === 'Default' ? 'Padrão' : nomes.get(did) ?? 'Baralho importado', cards }));

  const citadas = new Set(baralhos.flatMap((b) => b.cards.flatMap((c) => [...c.imgsFrente, ...c.imgsVerso])));
  const media = new Map<string, Blob>();
  if (citadas.size) {
    for (const [entry, name] of await readMediaMap(zip)) {
      const mime = mimeFromName(name);
      const f = zip.file(entry);
      if (!citadas.has(name) || !mime || !f) continue;
      media.set(name, new Blob([unz(await f.async('uint8array')) as Uint8Array<ArrayBuffer>], { type: mime }));
    }
  }
  return { baralhos, media };
}
