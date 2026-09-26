export const MIN_MS = 60_000;
export const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, '0');

/** Chave local YYYY-MM-DD. Ordenável como string. */
export function dayKey(d: Date | number): string {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}

export function parseDayKey(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(k: string, n: number): string {
  const d = parseDayKey(k);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

/** b − a em dias de calendário. */
export function diffDays(a: string, b: string): number {
  return Math.round((parseDayKey(b).getTime() - parseDayKey(a).getTime()) / DAY_MS);
}

export function startOfDay(d: Date | number): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export function endOfDay(d: Date | number): number {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x.getTime();
}

/** 0 = segunda … 6 = domingo. */
export function weekdayIndex(k: string): number {
  return (parseDayKey(k).getDay() + 6) % 7;
}

export function mondayOf(k: string): string {
  return addDays(k, -weekdayIndex(k));
}

/** Semana ISO-8601. */
export function isoWeek(k: string): number {
  const thursday = parseDayKey(addDays(k, 3 - weekdayIndex(k)));
  const jan4 = new Date(thursday.getFullYear(), 0, 4);
  const firstThursday = parseDayKey(addDays(dayKey(jan4), 3 - ((jan4.getDay() + 6) % 7)));
  return 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * DAY_MS));
}
