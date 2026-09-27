import type { BaralhoImportado } from '../db/repo';
import type { FlashcardsDB } from '../db/schema';
import type { ResultadoImport } from './anki';

export interface DeckFile {
  app: 'flashcards-dani';
  tipo: 'baralhos';
  versao: 1;
  baralhos: (BaralhoImportado & { descricao: string; cor: number })[];
  media: Record<string, { mime: string; base64: string }>;
}

export class DeckFileInvalido extends Error {}

export async function blobToBase64(b: Blob): Promise<string> {
  const bytes = new Uint8Array(await b.arrayBuffer());
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Exporta baralhos com cards e imagens, sem progresso: quem importa começa do zero. */
export async function buildDeckFile(db: FlashcardsDB, deckIds: string[]): Promise<DeckFile> {
  const baralhos: DeckFile['baralhos'] = [];
  const mediaIds = new Set<string>();
  for (const id of deckIds) {
    const d = await db.decks.get(id);
    if (!d) continue;
    const cards = (await db.cards.where('deckId').equals(id).sortBy('criadoEm')).map((c) => {
      for (const m of [...(c.imgsFrente ?? []), ...(c.imgsVerso ?? [])]) mediaIds.add(m);
      return { frente: c.frente, verso: c.verso, tags: c.tags, imgsFrente: c.imgsFrente ?? [], imgsVerso: c.imgsVerso ?? [] };
    });
    baralhos.push({ nome: d.nome, descricao: d.descricao, cor: d.cor, cards });
  }
  const media: DeckFile['media'] = {};
  for (const m of await db.media.bulkGet([...mediaIds])) {
    if (m) media[m.id] = { mime: m.mime, base64: await blobToBase64(m.blob) };
  }
  return { app: 'flashcards-dani', tipo: 'baralhos', versao: 1, baralhos, media };
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const strArr = (x: unknown) => Array.isArray(x) && x.every((s) => typeof s === 'string');

export function parseDeckFile(x: unknown): ResultadoImport {
  if (!isObj(x) || x.app !== 'flashcards-dani' || x.tipo !== 'baralhos' || !Array.isArray(x.baralhos) || !isObj(x.media)) {
    throw new DeckFileInvalido('não é um arquivo de baralho do app');
  }
  const baralhos = (x.baralhos as unknown[]).map((b) => {
    if (!isObj(b) || typeof b.nome !== 'string' || !Array.isArray(b.cards)) throw new DeckFileInvalido('baralho inválido');
    return {
      nome: b.nome,
      descricao: typeof b.descricao === 'string' ? b.descricao : '',
      cor: typeof b.cor === 'number' ? b.cor : 0,
      cards: (b.cards as unknown[]).map((c) => {
        if (!isObj(c) || typeof c.frente !== 'string' || typeof c.verso !== 'string') throw new DeckFileInvalido('card inválido');
        return {
          frente: c.frente,
          verso: c.verso,
          tags: strArr(c.tags) ? (c.tags as string[]) : [],
          imgsFrente: strArr(c.imgsFrente) ? (c.imgsFrente as string[]) : [],
          imgsVerso: strArr(c.imgsVerso) ? (c.imgsVerso as string[]) : [],
        };
      }),
    };
  });
  const media = new Map<string, Blob>();
  for (const [k, v] of Object.entries(x.media)) {
    if (isObj(v) && typeof v.mime === 'string' && typeof v.base64 === 'string') media.set(k, base64ToBlob(v.base64, v.mime));
  }
  return { baralhos, media };
}
