import { describe, expect, it } from 'vitest';
import { DAY_MS, MIN_MS } from '../lib/dates';
import { State, buildQueue, faixa, newSchedFields, previewIntervals, rate, type Nota, type QueueCard } from './index';

const NOW = new Date(2026, 8, 26, 10, 0).getTime();

function reviewCard() {
  let s = newSchedFields(NOW - 30 * DAY_MS);
  let t = NOW - 30 * DAY_MS;
  for (let i = 0; i < 4; i++) {
    s = rate(s, 3, t).next;
    t = Math.max(s.due, t + MIN_MS);
  }
  return { ...s, due: NOW };
}

describe('rate', () => {
  it('Errei num card novo o devolve em cerca de um minuto, ainda na sessão', () => {
    const r = rate(newSchedFields(NOW), 1, NOW);
    expect(r.estadoDepois).toBe(State.Learning);
    expect(r.next.due - NOW).toBeLessThanOrEqual(5 * MIN_MS);
  });

  it('Errei num card em revisão incrementa lapses e vira Reaprendendo', () => {
    const s = reviewCard();
    expect(s.state).toBe(State.Review);
    const r = rate(s, 1, NOW);
    expect(r.estadoAntes).toBe(State.Review);
    expect(r.estadoDepois).toBe(State.Relearning);
    expect(r.next.lapses).toBe(s.lapses + 1);
  });

  it.each([2, 3, 4] as Nota[])('nota %i empurra um card em revisão para frente', (n) => {
    const s = reviewCard();
    const r = rate(s, n, NOW);
    expect(r.estadoDepois).toBe(State.Review);
    expect(r.next.due).toBeGreaterThan(NOW + DAY_MS / 2);
  });

  it('intervalos crescem com a nota', () => {
    const s = reviewCard();
    const dues = ([1, 2, 3, 4] as Nota[]).map((n) => rate(s, n, NOW).next.due);
    expect(dues[0]).toBeLessThan(dues[1]);
    expect(dues[1]).toBeLessThan(dues[2]);
    expect(dues[2]).toBeLessThan(dues[3]);
  });

  it('não altera o objeto de entrada', () => {
    const s = newSchedFields(NOW);
    const copy = { ...s };
    rate(s, 3, NOW);
    expect(s).toEqual(copy);
  });
});

describe('previewIntervals', () => {
  it('formata as quatro notas de um card novo', () => {
    const p = previewIntervals(newSchedFields(NOW), NOW);
    expect(p[0]).toBe('1 min');
    expect(p).toHaveLength(4);
    expect(p[3]).toMatch(/dias?$/);
  });
});

describe('buildQueue', () => {
  let n = 0;
  const card = (over: Partial<QueueCard>): QueueCard => ({
    id: String(++n), deckId: 'a', state: State.New, due: NOW, suspenso: false, criadoEm: n, ...over,
  });

  it('ordena aprendendo → revisão, e respeita o teto de novos', () => {
    const learn = card({ state: State.Learning, due: NOW - MIN_MS });
    const learnLater = card({ state: State.Learning, due: NOW + 10 * MIN_MS });
    const rev = card({ state: State.Review, due: NOW + 3 * 60 * MIN_MS });
    const revTomorrow = card({ state: State.Review, due: NOW + 2 * DAY_MS });
    const news = [card({}), card({}), card({})];
    const q = buildQueue([rev, learn, learnLater, revTomorrow, ...news], { now: NOW, novosRestantes: 2 });
    expect(q.map((c) => c.id)).not.toContain(learnLater.id);
    expect(q.map((c) => c.id)).not.toContain(revTomorrow.id);
    expect(q.filter((c) => c.state === State.New)).toHaveLength(2);
    const nonNew = q.filter((c) => c.state !== State.New);
    expect(nonNew.map((c) => c.id)).toEqual([learn.id, rev.id]);
  });

  it('espalha os novos em vez de colocá-los no começo', () => {
    const reviews = Array.from({ length: 6 }, (_, i) => card({ state: State.Review, due: NOW - i }));
    const news = [card({}), card({})];
    const q = buildQueue([...news, ...reviews], { now: NOW, novosRestantes: 20 });
    expect(q[0].state).toBe(State.Review);
    const positions = q.map((c, i) => (c.state === State.New ? i : -1)).filter((i) => i >= 0);
    expect(positions[1] - positions[0]).toBeGreaterThan(1);
  });

  it('ignora suspensos e filtra por baralho', () => {
    const q = buildQueue(
      [card({ suspenso: true }), card({ deckId: 'b' }), card({ deckId: 'a' })],
      { now: NOW, novosRestantes: 20, deckIds: new Set(['a']) },
    );
    expect(q).toHaveLength(1);
    expect(q[0].deckId).toBe('a');
  });

  it('teto zerado não traz novos', () => {
    expect(buildQueue([card({})], { now: NOW, novosRestantes: 0 })).toHaveLength(0);
  });
});

describe('faixa', () => {
  it('usa o corte de 21 dias', () => {
    expect(faixa(State.Review, 20)).toBe('Jovem');
    expect(faixa(State.Review, 21)).toBe('Maduro');
    expect(faixa(State.Relearning, 50)).toBe('Aprendendo');
    expect(faixa(State.New, 0)).toBe('Novo');
  });
});
