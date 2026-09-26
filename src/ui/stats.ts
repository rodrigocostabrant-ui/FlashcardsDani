import type { CardRow, Config, Deck, Dia, Review } from '../db/schema';
import { addDays, dayKey, diffDays, endOfDay, mondayOf, parseDayKey } from '../lib/dates';
import { MESES, shortDate } from '../lib/format';
import { State, faixa, type Faixa } from '../scheduler';
import { YEAR_LEVELS } from './theme';

export interface Snapshot {
  decks: Deck[];
  cards: CardRow[];
  reviews: Review[];
  dias: Dia[];
  config: Config;
}

export interface DeckStats {
  total: number;
  due: number;
  learn: number;
  rev: number;
  novos: number;
  maduros: number;
  ultimo?: number;
}

const emptyStats = (): DeckStats => ({ total: 0, due: 0, learn: 0, rev: 0, novos: 0, maduros: 0 });

export function deckStats(cards: CardRow[], reviews: Review[], now: number): Map<string, DeckStats> {
  const eod = endOfDay(now);
  const out = new Map<string, DeckStats>();
  const get = (id: string) => {
    let s = out.get(id);
    if (!s) out.set(id, (s = emptyStats()));
    return s;
  };
  for (const c of cards) {
    const s = get(c.deckId);
    s.total++;
    if (c.state === State.Review && c.scheduled_days >= 21) s.maduros++;
    if (c.suspenso) continue;
    if (c.state === State.New) s.novos++;
    else if (c.due <= eod) {
      s.due++;
      if (c.state === State.Review) s.rev++;
      else s.learn++;
    }
  }
  for (const r of reviews) {
    const s = get(r.deckId);
    if (!s.ultimo || r.avaliadoEm > s.ultimo) s.ultimo = r.avaliadoEm;
  }
  return out;
}

/** Revisões agendadas por dia; o índice 0 inclui as atrasadas. */
export function dueByDay(cards: CardRow[], today: string, days: number, deckIds: ReadonlySet<string>): number[] {
  const out = new Array<number>(days).fill(0);
  for (const c of cards) {
    if (c.suspenso || c.state === State.New || !deckIds.has(c.deckId)) continue;
    const i = Math.max(0, diffDays(today, dayKey(c.due)));
    if (i < days) out[i]++;
  }
  return out;
}

export function avgSecondsPerCard(reviews: Review[]): number {
  const last = reviews.slice(-200).filter((r) => r.tempoMs > 0 && r.tempoMs < 5 * 60_000);
  if (!last.length) return 12;
  return last.reduce((a, r) => a + r.tempoMs, 0) / last.length / 1000;
}

export interface YearCell {
  bg: string;
  sh: string;
  t: string;
}

export function yearGrid(dias: Map<string, Dia>, cfg: Config, today: string): { weeks: { days: YearCell[] }[]; months: string[] } {
  const start = addDays(mondayOf(today), -52 * 7);
  const weeks: { days: YearCell[] }[] = [];
  for (let w = 0; w < 53; w++) {
    const days: YearCell[] = [];
    for (let d = 0; d < 7; d++) {
      const k = addDays(start, w * 7 + d);
      if (k > today) {
        days.push({ bg: 'transparent', sh: 'inset 0 0 0 1px #E3D9C4', t: 'futuro' });
        continue;
      }
      const rec = dias.get(k);
      const v = rec?.respondidos ?? 0;
      const meta = rec?.metaRespondidos ?? cfg.metaRespondidos;
      const ratio = v / Math.max(1, meta);
      const lvl = v === 0 ? 0 : ratio < 0.5 ? 1 : ratio < 1 ? 2 : ratio < 1.5 ? 3 : 4;
      days.push({
        bg: YEAR_LEVELS[lvl],
        sh: v >= meta && v > 0 ? 'inset 0 0 0 1.5px #D98CAE' : 'none',
        t: `${shortDate(k)} · ${v ? `${v} cards` : 'sem estudo'}`,
      });
    }
    weeks.push({ days });
  }
  const months = Array.from({ length: 12 }, (_, i) => MESES[parseDayKey(addDays(start, Math.round((i * 53 * 7) / 12) + 14)).getMonth()]);
  return { weeks, months };
}

const isRetentionReview = (r: Review) => r.estadoAntes === State.Review;
const passed = (r: Review) => r.nota >= 3;

/** % de revisões (cards que estavam em Revisão) avaliadas Bom ou Fácil. */
export function retention(reviews: Review[], fromTs: number): number | null {
  let tot = 0;
  let ok = 0;
  for (const r of reviews) {
    if (r.avaliadoEm < fromTs || !isRetentionReview(r)) continue;
    tot++;
    if (passed(r)) ok++;
  }
  return tot ? ok / tot : null;
}

export function retentionWeeks(reviews: Review[], today: string, weeks = 12): { pct: number | null; monday: string }[] {
  const first = addDays(mondayOf(today), -(weeks - 1) * 7);
  const buckets = Array.from({ length: weeks }, (_, i) => ({ tot: 0, ok: 0, monday: addDays(first, i * 7) }));
  for (const r of reviews) {
    if (!isRetentionReview(r)) continue;
    const i = Math.floor(diffDays(first, dayKey(r.avaliadoEm)) / 7);
    if (i < 0 || i >= weeks) continue;
    buckets[i].tot++;
    if (passed(r)) buckets[i].ok++;
  }
  return buckets.map((b) => ({ pct: b.tot ? b.ok / b.tot : null, monday: b.monday }));
}

export const FAIXAS: Faixa[] = ['Novo', 'Aprendendo', 'Jovem', 'Maduro'];

/** Composição da memória no fim de cada mês, reconstruída pelo histórico de revisões. */
export function memoryComposition(cards: CardRow[], reviews: Review[], now: number, months = 6): { label: string; counts: number[] }[] {
  const byCard = new Map<string, Review[]>();
  for (const r of reviews) {
    let l = byCard.get(r.cardId);
    if (!l) byCard.set(r.cardId, (l = []));
    l.push(r);
  }
  for (const l of byCard.values()) l.sort((a, b) => a.avaliadoEm - b.avaliadoEm);
  const d = new Date(now);
  const out: { label: string; counts: number[] }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const end = Math.min(now, new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1).getTime() - 1);
    const counts = [0, 0, 0, 0];
    for (const c of cards) {
      if (c.criadoEm > end) continue;
      const rs = byCard.get(c.id);
      let last: Review | undefined;
      if (rs) for (const r of rs) if (r.avaliadoEm <= end) last = r; else break;
      const f = last ? faixa(last.estadoDepois, last.intervaloDias) : 'Novo';
      counts[FAIXAS.indexOf(f)]++;
    }
    out.push({ label: MESES[monthStart.getMonth()], counts });
  }
  return out;
}

export function leeches(cards: CardRow[], n = 8): CardRow[] {
  return cards.filter((c) => c.lapses >= 8).sort((a, b) => b.lapses - a.lapses).slice(0, n);
}
