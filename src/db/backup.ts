import type { CardRow, Config, Deck, Dia, FlashcardsDB, Review } from './schema';

export interface Backup {
  app: 'flashcards-dani';
  versao: 1;
  exportadoEm: number;
  decks: Deck[];
  cards: CardRow[];
  reviews: Review[];
  dias: Dia[];
  config: Config;
}

export class BackupInvalido extends Error {}

export async function exportBackup(db: FlashcardsDB, now: number): Promise<Backup> {
  return db.transaction('r', [db.decks, db.cards, db.reviews, db.dias, db.config], async () => {
    const config = await db.config.get('cfg');
    if (!config) throw new Error('Configuração ausente');
    return {
      app: 'flashcards-dani',
      versao: 1,
      exportadoEm: now,
      decks: await db.decks.toArray(),
      cards: await db.cards.toArray(),
      reviews: await db.reviews.toArray(),
      dias: await db.dias.toArray(),
      config,
    };
  });
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
  check(x.versao === 1, 'versão desconhecida');
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
  return x as unknown as Backup;
}

/** Substitui tudo pelo conteúdo do backup, numa transação só. */
export async function importBackup(db: FlashcardsDB, b: Backup) {
  await db.transaction('rw', [db.decks, db.cards, db.reviews, db.dias, db.config], async () => {
    await Promise.all([db.decks.clear(), db.cards.clear(), db.reviews.clear(), db.dias.clear(), db.config.clear()]);
    await db.decks.bulkPut(b.decks);
    await db.cards.bulkPut(b.cards);
    await db.reviews.bulkPut(b.reviews);
    await db.dias.bulkPut(b.dias);
    await db.config.put(b.config);
  });
}
