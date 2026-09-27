import { base64ToBlob, blobToBase64 } from '../importers/deckFile';
import type { CardRow, Config, Deck, Dia, FlashcardsDB, Review } from './schema';

export interface BackupMedia {
  id: string;
  mime: string;
  base64: string;
  criadoEm: number;
}

export interface Backup {
  app: 'flashcards-dani';
  /** 1 = sem imagens; 2 = com imagens em base64. */
  versao: 1 | 2;
  exportadoEm: number;
  decks: Deck[];
  cards: CardRow[];
  reviews: Review[];
  dias: Dia[];
  config: Config;
  media?: BackupMedia[];
}

export class BackupInvalido extends Error {}

export async function exportBackup(db: FlashcardsDB, now: number): Promise<Backup> {
  const snap = await db.transaction('r', [db.decks, db.cards, db.reviews, db.dias, db.config, db.media], async () => ({
    config: await db.config.get('cfg'),
    decks: await db.decks.toArray(),
    cards: await db.cards.toArray(),
    reviews: await db.reviews.toArray(),
    dias: await db.dias.toArray(),
    media: await db.media.toArray(),
  }));
  if (!snap.config) throw new Error('Configuração ausente');
  const media: BackupMedia[] = [];
  for (const m of snap.media) media.push({ id: m.id, mime: m.mime, base64: await blobToBase64(m.blob), criadoEm: m.criadoEm });
  return { app: 'flashcards-dani', versao: 2, exportadoEm: now, ...snap, config: snap.config, media };
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === 'string';
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

function check(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new BackupInvalido(msg);
}

/** Valida tudo antes de gravar qualquer coisa. */
export function validateBackup(x: unknown): Backup {
  check(isObj(x) && x.app === 'flashcards-dani', 'não é um backup do app');
  check(x.versao === 1 || x.versao === 2, 'versão desconhecida');
  for (const k of ['decks', 'cards', 'reviews', 'dias'] as const) check(Array.isArray(x[k]), `${k} ausente`);
  const decks = x.decks as unknown[];
  const cards = x.cards as unknown[];
  const reviews = x.reviews as unknown[];
  const dias = x.dias as unknown[];
  check(decks.every((d) => isObj(d) && isStr(d.id) && isStr(d.nome) && isNum(d.cor)), 'baralho inválido');
  const deckIds = new Set(decks.map((d) => (d as Deck).id));
  check(
    cards.every((c) => isObj(c) && isStr(c.id) && isStr(c.deckId) && deckIds.has(c.deckId) && isStr(c.frente) && isStr(c.verso) && isNum(c.due) && isNum(c.state) && isNum(c.stability)),
    'card inválido',
  );
  check(reviews.every((r) => isObj(r) && isStr(r.cardId) && isNum(r.avaliadoEm) && [1, 2, 3, 4].includes(r.nota as number)), 'revisão inválida');
  check(dias.every((d) => isObj(d) && isStr(d.data) && /^\d{4}-\d{2}-\d{2}$/.test(d.data) && isNum(d.respondidos)), 'dia inválido');
  const cfg = x.config;
  check(isObj(cfg) && cfg.id === 'cfg' && isNum(cfg.metaRespondidos) && Array.isArray(cfg.diasDescanso) && isStr(cfg.inicio), 'configuração inválida');
  if (x.media !== undefined) {
    check(Array.isArray(x.media) && x.media.every((m) => isObj(m) && isStr(m.id) && isStr(m.mime) && isStr(m.base64)), 'imagem inválida');
  }
  return x as unknown as Backup;
}

/** Substitui tudo pelo conteúdo do backup, numa transação só. */
export async function importBackup(db: FlashcardsDB, b: Backup) {
  const media = (b.media ?? []).map((m) => ({ id: m.id, mime: m.mime, criadoEm: m.criadoEm ?? b.exportadoEm, blob: base64ToBlob(m.base64, m.mime) }));
  await db.transaction('rw', [db.decks, db.cards, db.reviews, db.dias, db.config, db.media], async () => {
    await Promise.all([db.decks.clear(), db.cards.clear(), db.reviews.clear(), db.dias.clear(), db.config.clear(), db.media.clear()]);
    await db.decks.bulkPut(b.decks);
    await db.cards.bulkPut(b.cards);
    await db.reviews.bulkPut(b.reviews);
    await db.dias.bulkPut(b.dias);
    await db.config.put(b.config);
    await db.media.bulkPut(media);
  });
}
