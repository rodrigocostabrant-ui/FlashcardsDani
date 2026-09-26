import { State, createEmptyCard, fsrs, type Card, type Grade } from 'ts-fsrs';
import { endOfDay } from '../lib/dates';
import { formatInterval } from '../lib/format';

export { State };
export type Nota = 1 | 2 | 3 | 4;

/** Estado FSRS como fica guardado no IndexedDB (datas em epoch ms). */
export interface SchedFields {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: number;
}

export interface RateResult {
  next: SchedFields;
  estadoAntes: State;
  estadoDepois: State;
  intervaloDias: number;
}

const engine = fsrs();

function toCard(s: SchedFields): Card {
  return { ...s, due: new Date(s.due), last_review: s.last_review ? new Date(s.last_review) : undefined };
}

function fromCard(c: Card): SchedFields {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review ? c.last_review.getTime() : undefined,
  };
}

export function newSchedFields(now: number): SchedFields {
  return fromCard(createEmptyCard(new Date(now)));
}

export function rate(s: SchedFields, nota: Nota, now: number): RateResult {
  const { card } = engine.next(toCard(s), new Date(now), nota as Grade);
  const next = fromCard(card);
  return { next, estadoAntes: s.state, estadoDepois: next.state, intervaloDias: next.scheduled_days };
}

/** Intervalo resultante de cada nota, calculado antes do clique. */
export function previewIntervals(s: SchedFields, now: number): [string, string, string, string] {
  const preview = engine.repeat(toCard(s), new Date(now));
  const fmt = (g: Nota) => formatInterval(preview[g as Grade].card.due.getTime() - now);
  return [fmt(1), fmt(2), fmt(3), fmt(4)];
}

export interface QueueCard {
  id: string;
  deckId: string;
  state: State;
  due: number;
  suspenso: boolean;
  criadoEm: number;
}

export interface QueueOptions {
  now: number;
  novosRestantes: number;
  deckIds?: ReadonlySet<string>;
}

/**
 * Aprendendo/Reaprendendo vencidos agora → Revisão até o fim do dia → Novos até o teto do dia.
 * Os novos são espalhados ao longo da fila em vez de empilhados no começo.
 */
export function buildQueue<T extends QueueCard>(cards: readonly T[], opts: QueueOptions): T[] {
  const eod = endOfDay(opts.now);
  const pool = cards.filter((c) => !c.suspenso && (!opts.deckIds || opts.deckIds.has(c.deckId)));
  const byDue = (a: T, b: T) => a.due - b.due;
  const learning = pool
    .filter((c) => (c.state === State.Learning || c.state === State.Relearning) && c.due <= opts.now)
    .sort(byDue);
  const review = pool.filter((c) => c.state === State.Review && c.due <= eod).sort(byDue);
  const news = pool
    .filter((c) => c.state === State.New)
    .sort((a, b) => a.criadoEm - b.criadoEm)
    .slice(0, Math.max(0, opts.novosRestantes));

  const base = [...learning, ...review];
  if (!base.length) return news;
  const out: T[] = [];
  let ni = 0;
  base.forEach((c, i) => {
    out.push(c);
    while (ni < news.length && (ni + 1) / (news.length + 1) <= (i + 1) / base.length) out.push(news[ni++]);
  });
  while (ni < news.length) out.push(news[ni++]);
  return out;
}

export type Faixa = 'Novo' | 'Aprendendo' | 'Jovem' | 'Maduro';

/** Mesmo corte do Anki: Revisão com intervalo ≥ 21 dias é Maduro. */
export function faixa(state: State, scheduledDays: number): Faixa {
  if (state === State.New) return 'Novo';
  if (state === State.Learning || state === State.Relearning) return 'Aprendendo';
  return scheduledDays >= 21 ? 'Maduro' : 'Jovem';
}
