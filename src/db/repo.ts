import { aplicarEscudo, type DiaRec } from '../goals';
import { dayKey, mondayOf, weekdayIndex } from '../lib/dates';
import { State, newSchedFields, rate, type Nota, type RateResult } from '../scheduler';
import type { CardRow, Config, Deck, FlashcardsDB } from './schema';
import { SEED } from './seed';

export const PRESETS = {
  leve: { metaRespondidos: 15, limiteNovosPorDia: 10 },
  firme: { metaRespondidos: 30, limiteNovosPorDia: 20 },
  intenso: { metaRespondidos: 60, limiteNovosPorDia: 30 },
} as const;

const uid = () => crypto.randomUUID();

export function defaultConfig(now: number): Config {
  const today = dayKey(now);
  return {
    id: 'cfg',
    metaRespondidos: 30,
    metaCriados: 5,
    limiteNovosPorDia: 20,
    preset: 'firme',
    diasDescanso: [false, false, false, false, false, false, false],
    escudoDisponivel: true,
    escudoRecarregadoEm: mondayOf(today),
    escudoUltimoUso: null,
    inicio: today,
    ultimoBackup: null,
    lembrete: null,
  };
}

/** Primeiro uso: cria a configuração e os baralhos de exemplo. */
export async function ensureSetup(db: FlashcardsDB, now: number, seed = true): Promise<Config> {
  return db.transaction('rw', db.config, db.decks, db.cards, async () => {
    const existing = await db.config.get('cfg');
    if (existing) return existing;
    const cfg = defaultConfig(now);
    await db.config.put(cfg);
    if (seed) {
      for (const [i, d] of SEED.entries()) {
        const deckId = uid();
        await db.decks.put({ id: deckId, nome: d.nome, descricao: d.descricao, cor: d.cor, criadoEm: now + i, arquivado: false });
        await db.cards.bulkPut(d.cards.map(([frente, verso], j) => newCard(deckId, frente, verso, [], 'manual', now + j)));
      }
    }
    return cfg;
  });
}

function newCard(deckId: string, frente: string, verso: string, tags: string[], origem: CardRow['origem'], now: number): CardRow {
  return { id: uid(), deckId, frente, verso, tags, origem, criadoEm: now, suspenso: false, ...newSchedFields(now) };
}

async function getConfig(db: FlashcardsDB): Promise<Config> {
  const cfg = await db.config.get('cfg');
  if (!cfg) throw new Error('Configuração ausente');
  return cfg;
}

function novoDia(data: string, cfg: Config): DiaRec {
  return {
    data,
    respondidos: 0,
    criados: 0,
    novosVistos: 0,
    metaRespondidos: cfg.metaRespondidos,
    metaCriados: cfg.metaCriados,
    descanso: cfg.diasDescanso[weekdayIndex(data)],
    escudoUsado: false,
  };
}

/** A meta é copiada para o registro no primeiro evento do dia; mudá-la depois não reescreve o passado. */
async function bumpDia(db: FlashcardsDB, data: string, patch: Partial<Pick<DiaRec, 'respondidos' | 'criados' | 'novosVistos'>>) {
  const cfg = await getConfig(db);
  const d = (await db.dias.get(data)) ?? novoDia(data, cfg);
  await db.dias.put({
    ...d,
    respondidos: d.respondidos + (patch.respondidos ?? 0),
    criados: d.criados + (patch.criados ?? 0),
    novosVistos: d.novosVistos + (patch.novosVistos ?? 0),
  });
}

export async function createDeck(db: FlashcardsDB, nome: string, descricao: string, cor: number, now: number): Promise<string> {
  const id = uid();
  await db.decks.put({ id, nome: nome.trim(), descricao: descricao.trim(), cor, criadoEm: now, arquivado: false });
  return id;
}

export async function updateDeck(db: FlashcardsDB, id: string, patch: Partial<Omit<Deck, 'id'>>) {
  await db.decks.update(id, patch);
}

export interface NovoCard {
  frente: string;
  verso: string;
  tags?: string[];
  imgsFrente?: string[];
  imgsVerso?: string[];
}

export async function addCards(
  db: FlashcardsDB,
  deckId: string,
  pares: NovoCard[],
  origem: CardRow['origem'],
  now: number,
  contarCriados = true,
): Promise<number> {
  if (!pares.length) return 0;
  await db.transaction('rw', db.cards, db.dias, db.config, async () => {
    await db.cards.bulkPut(
      pares.map((p, i) => ({
        ...newCard(deckId, p.frente.trim(), p.verso.trim(), p.tags ?? [], origem, now + i),
        imgsFrente: p.imgsFrente ?? [],
        imgsVerso: p.imgsVerso ?? [],
      })),
    );
    if (contarCriados) await bumpDia(db, dayKey(now), { criados: pares.length });
  });
  return pares.length;
}

export async function updateCard(
  db: FlashcardsDB,
  id: string,
  patch: Partial<Pick<CardRow, 'frente' | 'verso' | 'tags' | 'deckId' | 'suspenso' | 'imgsFrente' | 'imgsVerso'>>,
) {
  await db.transaction('rw', db.cards, db.media, async () => {
    const before = await db.cards.get(id);
    await db.cards.update(id, patch);
    if (before) await dropUnusedMedia(db, [...(before.imgsFrente ?? []), ...(before.imgsVerso ?? [])]);
  });
}

export async function deleteCard(db: FlashcardsDB, id: string) {
  await db.transaction('rw', db.cards, db.media, async () => {
    const c = await db.cards.get(id);
    await db.cards.delete(id);
    if (c) await dropUnusedMedia(db, [...(c.imgsFrente ?? []), ...(c.imgsVerso ?? [])]);
  });
}

/** Apaga o baralho e seus cards de vez. As revisões ficam: a Evolução continua contando o que foi estudado. */
export async function deleteDeck(db: FlashcardsDB, id: string) {
  await db.transaction('rw', db.decks, db.cards, db.media, async () => {
    const cards = await db.cards.where('deckId').equals(id).toArray();
    await db.cards.bulkDelete(cards.map((c) => c.id));
    await db.decks.delete(id);
    await dropUnusedMedia(db, cards.flatMap((c) => [...(c.imgsFrente ?? []), ...(c.imgsVerso ?? [])]));
  });
}

// ---------- imagens ----------

export async function saveMedia(db: FlashcardsDB, blob: Blob, now: number): Promise<string> {
  const id = uid();
  await db.media.put({ id, blob, mime: blob.type || 'image/png', criadoEm: now });
  return id;
}

async function dropUnusedMedia(db: FlashcardsDB, ids: string[]) {
  if (!ids.length) return;
  const candidates = new Set(ids);
  await db.cards.each((c) => {
    for (const m of c.imgsFrente ?? []) candidates.delete(m);
    for (const m of c.imgsVerso ?? []) candidates.delete(m);
  });
  if (candidates.size) await db.media.bulkDelete([...candidates]);
}

/**
 * Remove imagens que nenhum card usa (anexadas num card que nunca foi salvo, por exemplo).
 * Só mexe em imagens com mais de um dia, para não apagar o que está sendo editado agora.
 */
export async function gcMedia(db: FlashcardsDB, now: number): Promise<number> {
  return db.transaction('rw', db.cards, db.media, async () => {
    const used = new Set<string>();
    await db.cards.each((c) => {
      for (const m of c.imgsFrente ?? []) used.add(m);
      for (const m of c.imgsVerso ?? []) used.add(m);
    });
    const orphans = (await db.media.toCollection().primaryKeys()).filter((k) => !used.has(k));
    const old = (await db.media.bulkGet(orphans)).filter((m) => m && m.criadoEm < now - 86_400_000).map((m) => m!.id);
    await db.media.bulkDelete(old);
    return old.length;
  });
}

// ---------- importação de baralhos ----------

export interface BaralhoImportado {
  nome: string;
  descricao?: string;
  cor?: number;
  cards: { frente: string; verso: string; tags?: string[]; imgsFrente: string[]; imgsVerso: string[] }[];
}

/**
 * Cria um baralho novo por baralho importado. As imagens chegam por chave (nome no arquivo de origem)
 * e são gravadas na tabela media; os cards entram como novos, sem o progresso de origem.
 */
export async function importDecks(
  db: FlashcardsDB,
  baralhos: BaralhoImportado[],
  media: Map<string, Blob>,
  origem: CardRow['origem'],
  now: number,
): Promise<{ decks: string[]; cards: number; imagens: number }> {
  return db.transaction('rw', [db.decks, db.cards, db.media, db.dias, db.config], async () => {
    const existentes = new Set((await db.decks.toArray()).filter((d) => !d.arquivado).map((d) => d.nome.toLowerCase()));
    const mediaIds = new Map<string, string>();
    const usar = (keys: string[]) =>
      keys.flatMap((k) => {
        const blob = media.get(k);
        if (!blob) return [];
        let id = mediaIds.get(k);
        if (!id) mediaIds.set(k, (id = uid()));
        return [id];
      });
    const deckIds: string[] = [];
    let total = 0;
    let t = now;
    for (const [i, b] of baralhos.entries()) {
      if (!b.cards.length) continue;
      let nome = b.nome.trim() || 'Baralho importado';
      for (let n = 2; existentes.has(nome.toLowerCase()); n++) nome = `${b.nome.trim()} (${n})`;
      existentes.add(nome.toLowerCase());
      const deckId = uid();
      await db.decks.put({ id: deckId, nome, descricao: b.descricao ?? '', cor: b.cor ?? i % 5, criadoEm: t++, arquivado: false });
      const cards = b.cards.map((c) => ({ frente: c.frente, verso: c.verso, tags: c.tags, imgsFrente: usar(c.imgsFrente), imgsVerso: usar(c.imgsVerso) }));
      await addCards(db, deckId, cards, origem, t, false);
      t += cards.length;
      total += cards.length;
      deckIds.push(deckId);
    }
    await db.media.bulkPut(
      [...mediaIds].map(([k, id]) => {
        const blob = media.get(k)!;
        return { id, blob, mime: blob.type || 'image/png', criadoEm: now };
      }),
    );
    return { decks: deckIds, cards: total, imagens: mediaIds.size };
  });
}

/** Grava a avaliação na hora: card, histórico e contadores do dia numa transação só. */
export async function recordReview(
  db: FlashcardsDB,
  card: CardRow,
  nota: Nota,
  now: number,
  tempoMs: number,
  r: RateResult = rate(card, nota, now),
): Promise<RateResult> {
  await db.transaction('rw', db.cards, db.reviews, db.dias, db.config, async () => {
    await db.cards.put({ ...card, ...r.next });
    await db.reviews.add({
      cardId: card.id,
      deckId: card.deckId,
      avaliadoEm: now,
      nota,
      estadoAntes: r.estadoAntes,
      estadoDepois: r.estadoDepois,
      intervaloDias: r.intervaloDias,
      tempoMs: Math.round(tempoMs),
    });
    await bumpDia(db, dayKey(now), { respondidos: 1, novosVistos: card.state === State.New ? 1 : 0 });
  });
  return r;
}

/** Mudanças de meta/descanso valem para hoje em diante; dias passados mantêm a meta da época. */
export async function updateConfig(db: FlashcardsDB, patch: Partial<Omit<Config, 'id'>>, now: number) {
  await db.transaction('rw', db.config, db.dias, async () => {
    const cfg = { ...(await getConfig(db)), ...patch };
    await db.config.put(cfg);
    const today = dayKey(now);
    const d = await db.dias.get(today);
    if (d) {
      await db.dias.put({
        ...d,
        metaRespondidos: cfg.metaRespondidos,
        metaCriados: cfg.metaCriados,
        descanso: cfg.diasDescanso[weekdayIndex(today)],
      });
    }
  });
}

/** Ao abrir o app: gasta o escudo num dia falhado recente e recarrega na segunda. Devolve o dia coberto. */
export async function runShield(db: FlashcardsDB, now: number): Promise<string | null> {
  return db.transaction('rw', db.config, db.dias, async () => {
    const cfg = await getConfig(db);
    const today = dayKey(now);
    const dias = new Map((await db.dias.toArray()).map((d) => [d.data, d]));
    const r = aplicarEscudo(today, dias, cfg, cfg);
    if (r.usarEm) {
      const d = dias.get(r.usarEm) ?? novoDia(r.usarEm, cfg);
      await db.dias.put({ ...d, escudoUsado: true });
    }
    await db.config.put({
      ...cfg,
      escudoDisponivel: r.escudoDisponivel,
      escudoRecarregadoEm: r.escudoRecarregadoEm,
      escudoUltimoUso: r.usarEm ?? cfg.escudoUltimoUso,
    });
    return r.usarEm;
  });
}
