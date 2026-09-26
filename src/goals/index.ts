import { addDays, mondayOf, weekdayIndex } from '../lib/dates';

export interface DiaRec {
  data: string;
  respondidos: number;
  criados: number;
  novosVistos: number;
  metaRespondidos: number;
  metaCriados: number;
  descanso: boolean;
  escudoUsado: boolean;
}

export interface GoalCfg {
  metaRespondidos: number;
  /** Seg..Dom */
  diasDescanso: boolean[];
  /** Primeiro dia de uso: dias anteriores não contam como falha. */
  inicio: string;
}

export type DayStatus = 'antes' | 'futuro' | 'hoje' | 'cumprido' | 'descanso' | 'escudo' | 'pouco' | 'falhou';

export type DiasMap = ReadonlyMap<string, DiaRec>;

/** A meta vale a do registro do dia (copiada no primeiro evento); sem registro, vale a atual. */
export function dayStatus(key: string, today: string, dias: DiasMap, cfg: GoalCfg): DayStatus {
  if (key < cfg.inicio) return 'antes';
  if (key > today) return 'futuro';
  const rec = dias.get(key);
  const meta = rec?.metaRespondidos ?? cfg.metaRespondidos;
  if (rec && rec.respondidos >= meta) return 'cumprido';
  if (key === today) return 'hoje';
  const descanso = rec ? rec.descanso : cfg.diasDescanso[weekdayIndex(key)];
  if (descanso) return 'descanso';
  if (rec?.escudoUsado) return 'escudo';
  if (rec && rec.respondidos > 0) return 'pouco';
  return 'falhou';
}

/** Ofensiva: dias seguidos cumpridos. Descanso não conta nem quebra; escudo conta como cumprido. */
export function streak(today: string, dias: DiasMap, cfg: GoalCfg): { atual: number; recorde: number } {
  let atual = dayStatus(today, today, dias, cfg) === 'cumprido' ? 1 : 0;
  for (let k = addDays(today, -1); k >= cfg.inicio; k = addDays(k, -1)) {
    const s = dayStatus(k, today, dias, cfg);
    if (s === 'cumprido' || s === 'escudo') atual++;
    else if (s !== 'descanso') break;
  }
  let recorde = 0;
  let run = 0;
  for (let k = cfg.inicio; k <= today; k = addDays(k, 1)) {
    const s = dayStatus(k, today, dias, cfg);
    if (s === 'cumprido' || s === 'escudo') recorde = Math.max(recorde, ++run);
    else if (s !== 'descanso' && s !== 'hoje') run = 0;
  }
  return { atual, recorde: Math.max(recorde, atual) };
}

export interface Disciplina {
  cumpridos: number;
  contados: number;
  dias: { data: string; status: DayStatus; respondidos: number; meta: number }[];
}

/**
 * % de dias cumpridos nos 30 dias até ontem, descontando descanso.
 * O dia coberto pelo escudo continua falhado aqui: a medição não pode mentir.
 */
export function disciplina30(today: string, dias: DiasMap, cfg: GoalCfg): Disciplina {
  const out: Disciplina = { cumpridos: 0, contados: 0, dias: [] };
  for (let i = 30; i >= 1; i--) {
    const k = addDays(today, -i);
    const status = dayStatus(k, today, dias, cfg);
    const rec = dias.get(k);
    out.dias.push({ data: k, status, respondidos: rec?.respondidos ?? 0, meta: rec?.metaRespondidos ?? cfg.metaRespondidos });
    if (status === 'antes' || status === 'descanso') continue;
    out.contados++;
    if (status === 'cumprido') out.cumpridos++;
  }
  return out;
}

export interface EscudoState {
  escudoDisponivel: boolean;
  /** Segunda-feira da semana a que a disponibilidade se refere. */
  escudoRecarregadoEm: string;
}

function recarregar(s: EscudoState, segunda: string): EscudoState {
  return s.escudoRecarregadoEm < segunda ? { escudoDisponivel: true, escudoRecarregadoEm: segunda } : s;
}

/**
 * Roda ao abrir o app. Cobre automaticamente o último dia útil falhado (até 7 dias atrás),
 * usando o escudo da semana daquele dia, e recarrega na segunda.
 */
export function aplicarEscudo(
  today: string,
  dias: DiasMap,
  cfg: GoalCfg,
  estado: EscudoState,
): EscudoState & { usarEm: string | null } {
  let alvo: string | null = null;
  for (let i = 1; i <= 7; i++) {
    const k = addDays(today, -i);
    const s = dayStatus(k, today, dias, cfg);
    if (s === 'descanso') continue;
    if (s === 'falhou' || s === 'pouco') alvo = k;
    break;
  }
  let s = estado;
  let usarEm: string | null = null;
  if (alvo) {
    s = recarregar(s, mondayOf(alvo));
    if (s.escudoDisponivel) {
      usarEm = alvo;
      s = { ...s, escudoDisponivel: false };
    }
  }
  s = recarregar(s, mondayOf(today));
  return { ...s, usarEm };
}
