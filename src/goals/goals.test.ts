import { describe, expect, it } from 'vitest';
import { aplicarEscudo, dayStatus, disciplina30, streak, type DiaRec, type GoalCfg } from './index';

// 2026-09-26 é um sábado; 2026-09-21 é segunda.
const TODAY = '2026-09-26';
const NO_REST = [false, false, false, false, false, false, false];

function cfg(over: Partial<GoalCfg> = {}): GoalCfg {
  return { metaRespondidos: 30, diasDescanso: NO_REST, inicio: '2026-01-01', ...over };
}

function dia(data: string, respondidos: number, over: Partial<DiaRec> = {}): DiaRec {
  return { data, respondidos, criados: 0, novosVistos: 0, metaRespondidos: 30, metaCriados: 5, descanso: false, escudoUsado: false, ...over };
}

const map = (...ds: DiaRec[]) => new Map(ds.map((d) => [d.data, d]));

describe('dayStatus', () => {
  it('cumpre e falha a meta', () => {
    const m = map(dia('2026-09-24', 30), dia('2026-09-25', 12));
    expect(dayStatus('2026-09-24', TODAY, m, cfg())).toBe('cumprido');
    expect(dayStatus('2026-09-25', TODAY, m, cfg())).toBe('pouco');
    expect(dayStatus('2026-09-23', TODAY, m, cfg())).toBe('falhou');
  });

  it('hoje ainda em andamento não é falha', () => {
    expect(dayStatus(TODAY, TODAY, map(dia(TODAY, 3)), cfg())).toBe('hoje');
  });

  it('dias antes do primeiro uso são neutros', () => {
    expect(dayStatus('2026-09-20', TODAY, map(), cfg({ inicio: '2026-09-25' }))).toBe('antes');
  });

  it('mudar a meta hoje não reescreve ontem', () => {
    const m = map(dia('2026-09-25', 30, { metaRespondidos: 30 }));
    expect(dayStatus('2026-09-25', TODAY, m, cfg({ metaRespondidos: 60 }))).toBe('cumprido');
  });
});

describe('streak', () => {
  it('conta dias seguidos e para no primeiro falhado', () => {
    const m = map(dia('2026-09-22', 30), dia('2026-09-23', 30), dia('2026-09-24', 30), dia('2026-09-25', 31));
    expect(streak(TODAY, m, cfg()).atual).toBe(4);
  });

  it('inclui hoje quando já cumprido, sem quebrar quando ainda não', () => {
    const m = map(dia('2026-09-25', 30), dia(TODAY, 30));
    expect(streak(TODAY, m, cfg()).atual).toBe(2);
    expect(streak(TODAY, map(dia('2026-09-25', 30), dia(TODAY, 2)), cfg()).atual).toBe(1);
  });

  it('dia de descanso não quebra a ofensiva', () => {
    // 2026-09-24 é quinta (índice 3)
    const rest = [false, false, false, true, false, false, false];
    const m = map(dia('2026-09-23', 30), dia('2026-09-25', 30));
    expect(streak(TODAY, m, cfg({ diasDescanso: rest })).atual).toBe(2);
  });

  it('escudo conta como cumprido para a ofensiva', () => {
    const m = map(dia('2026-09-23', 30), dia('2026-09-24', 0, { escudoUsado: true }), dia('2026-09-25', 30));
    expect(streak(TODAY, m, cfg()).atual).toBe(3);
  });

  it('guarda o recorde', () => {
    const m = map(dia('2026-09-10', 30), dia('2026-09-11', 30), dia('2026-09-12', 30), dia('2026-09-25', 30));
    const r = streak(TODAY, m, cfg({ inicio: '2026-09-10' }));
    expect(r.atual).toBe(1);
    expect(r.recorde).toBe(3);
  });
});

describe('disciplina30', () => {
  it('desconta descansos e dias antes do início', () => {
    const rest = [false, false, false, false, false, false, true]; // domingo
    const m = map(dia('2026-09-24', 30), dia('2026-09-25', 30));
    const d = disciplina30(TODAY, m, cfg({ inicio: '2026-09-19', diasDescanso: rest }));
    // 19..25 = 7 dias, domingo 20 é descanso
    expect(d.contados).toBe(6);
    expect(d.cumpridos).toBe(2);
    expect(d.dias).toHaveLength(30);
  });

  it('dia coberto pelo escudo continua falhado na disciplina', () => {
    const m = map(dia('2026-09-24', 0, { escudoUsado: true }), dia('2026-09-25', 30));
    const d = disciplina30(TODAY, m, cfg({ inicio: '2026-09-24' }));
    expect(d.contados).toBe(2);
    expect(d.cumpridos).toBe(1);
  });
});

describe('aplicarEscudo', () => {
  const base = { escudoDisponivel: true, escudoRecarregadoEm: '2026-09-21' };

  it('cobre ontem automaticamente quando ontem falhou', () => {
    const r = aplicarEscudo(TODAY, map(dia('2026-09-25', 4)), cfg(), base);
    expect(r.usarEm).toBe('2026-09-25');
    expect(r.escudoDisponivel).toBe(false);
  });

  it('não faz nada quando ontem foi cumprido', () => {
    const r = aplicarEscudo(TODAY, map(dia('2026-09-25', 30)), cfg(), base);
    expect(r.usarEm).toBeNull();
    expect(r.escudoDisponivel).toBe(true);
  });

  it('um por semana: sem escudo, a falha fica', () => {
    const r = aplicarEscudo(TODAY, map(), cfg(), { escudoDisponivel: false, escudoRecarregadoEm: '2026-09-21' });
    expect(r.usarEm).toBeNull();
  });

  it('recarrega na segunda', () => {
    const monday = '2026-09-28';
    const r = aplicarEscudo(monday, map(dia('2026-09-27', 30)), cfg(), { escudoDisponivel: false, escudoRecarregadoEm: '2026-09-21' });
    expect(r.escudoDisponivel).toBe(true);
    expect(r.escudoRecarregadoEm).toBe(monday);
  });

  it('pula dias de descanso até achar o último dia útil', () => {
    const rest = [false, false, false, false, true, false, false]; // sexta
    const r = aplicarEscudo(TODAY, map(dia('2026-09-24', 2)), cfg({ diasDescanso: rest }), base);
    expect(r.usarEm).toBe('2026-09-24');
  });

  it('falha no domingo usa o escudo daquela semana e ainda recarrega na segunda', () => {
    const r = aplicarEscudo('2026-09-28', map(), cfg(), { escudoDisponivel: true, escudoRecarregadoEm: '2026-09-21' });
    expect(r.usarEm).toBe('2026-09-27');
    expect(r.escudoDisponivel).toBe(true);
  });
});
