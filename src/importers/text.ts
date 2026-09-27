import { htmlToText } from './html';

export interface ParTexto {
  frente: string;
  verso: string;
}

/** CSV com aspas no estilo RFC 4180: campos entre aspas podem conter o separador, aspas dobradas e quebras de linha. */
export function parseDelimited(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
      } else field += ch;
      i++;
      continue;
    }
    if (ch === '"' && field === '') quoted = true;
    else if (ch === delim) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
    i++;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const SEPARADORES: Record<string, string> = { tab: '\t', comma: ',', semicolon: ';', pipe: '|', space: ' ', colon: ':' };
const CABECALHO = /^(frente|front|pergunta|question|term|termo|q)$/i;

/**
 * Arquivo em colunas (planilha, exportação de texto do Anki ou do Quizlet) → pares.
 * Devolve null quando o texto não parece ter colunas; aí quem chama cai nas estratégias de PDF.
 */
export function textToPairs(raw: string, fileName = ''): ParTexto[] | null {
  const text = raw.replace(/^﻿/, '');
  const lines = text.split(/\r?\n/);
  let delim: string | null = null;
  let html = false;
  let start = 0;
  const metaCols = new Set<number>();
  while (start < lines.length && lines[start].startsWith('#')) {
    const m = lines[start].match(/^#(\w[\w ]*):(.*)$/);
    const key = m?.[1].toLowerCase() ?? '';
    const val = m?.[2].trim() ?? '';
    if (key === 'separator') delim = SEPARADORES[val.toLowerCase()] ?? val[0] ?? null;
    if (key === 'html') html = val.toLowerCase() === 'true';
    if (/^(guid|notetype|deck|tags) column$/.test(key) && /^\d+$/.test(val)) metaCols.add(Number(val) - 1);
    start++;
  }
  const body = lines.slice(start).join('\n');
  const nonEmpty = lines.slice(start).filter((l) => l.trim());
  if (!nonEmpty.length) return null;

  if (!delim) {
    const share = (c: string) => nonEmpty.filter((l) => l.includes(c)).length / nonEmpty.length;
    if (share('\t') >= 0.6) delim = '\t';
    else if (/\.csv$/i.test(fileName)) delim = share(';') > share(',') ? ';' : ',';
    else return null;
  }

  let rows = parseDelimited(body, delim)
    .map((r) => r.filter((_, i) => !metaCols.has(i)))
    .filter((r) => r.length >= 2);
  if (!rows.length) return null;
  if (CABECALHO.test(rows[0][0].trim())) rows = rows.slice(1);
  const clean = (s: string) => (html || /<[a-z][\s\S]*>/i.test(s) ? htmlToText(s).texto : s.trim());
  return rows
    .map((r) => ({ frente: clean(r[0]), verso: clean(r.slice(1).filter((c) => c.trim()).join('\n')) }))
    .filter((p) => p.frente && p.verso);
}
