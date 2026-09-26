import { DAY_MS, MIN_MS, dayKey, diffDays, isoWeek, parseDayKey } from './dates';

export const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export const fmtNum = (n: number) => n.toLocaleString('pt-BR');
export const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios);

/** Intervalo até o card voltar: "1 min", "10 min", "3 h", "4 dias", "2 meses", "1,5 ano". */
export function formatInterval(ms: number): string {
  const min = Math.max(1, Math.round(ms / MIN_MS));
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(ms / DAY_MS);
  if (d < 31) return `${d} ${plural(d, 'dia', 'dias')}`;
  const m = Math.round(d / 30);
  if (m < 12) return `${m} ${plural(m, 'mês', 'meses')}`;
  const y = Math.round((d / 365) * 10) / 10;
  return `${String(y).replace('.', ',')} ${plural(y, 'ano', 'anos')}`;
}

/** "sáb · 26 set 2026 · semana 39" */
export function todayLabel(k: string): string {
  const d = parseDayKey(k);
  return `${DIAS_SEMANA[d.getDay()]} · ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()} · semana ${isoWeek(k)}`;
}

export function shortDate(k: string): string {
  const d = parseDayKey(k);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

/** "hoje, 08:40" · "ontem" · "há 3 dias" · "—" */
export function lastStudyLabel(ts: number | undefined, now: number): string {
  if (!ts) return '—';
  const days = diffDays(dayKey(ts), dayKey(now));
  if (days <= 0) {
    const d = new Date(ts);
    return `hoje, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const m = Math.round(days / 30);
  return `há ${m} ${plural(m, 'mês', 'meses')}`;
}

/** Quando um card volta: "hoje", "amanhã", "em 4 dias", "em 2 meses". */
export function nextDueLabel(due: number, now: number): string {
  const days = diffDays(dayKey(now), dayKey(due));
  if (days <= 0) return 'hoje';
  if (days === 1) return 'amanhã';
  if (days < 31) return `em ${days} dias`;
  const m = Math.round(days / 30);
  return `em ${m} ${plural(m, 'mês', 'meses')}`;
}

export function fmtMinutes(ms: number): string {
  const min = Math.max(1, Math.round(ms / MIN_MS));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60} min`;
}
