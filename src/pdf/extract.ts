import * as pdfjs from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { Linha, Pagina } from './detect';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export type ErroExtracao = 'senha' | 'escaneado' | 'invalido' | 'cancelado';

export class ExtracaoError extends Error {
  constructor(public tipo: ErroExtracao) {
    super(tipo);
  }
}

export interface Extraido {
  paginas: Pagina[];
  numPaginas: number;
}

interface Item {
  str: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function mediana(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
}

/** Agrupa fragmentos por Y em linhas e, dentro da linha, separa em segmentos quando o vão horizontal é grande. */
export function agruparLinhas(items: Item[]): Linha[] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const grupos: { y: number; items: Item[] }[] = [];
  for (const it of sorted) {
    const g = grupos[grupos.length - 1];
    if (g && Math.abs(g.y - it.y) <= Math.max(2, it.h * 0.4)) g.items.push(it);
    else grupos.push({ y: it.y, items: [it] });
  }
  const deltas = grupos.slice(1).map((g, i) => grupos[i].y - g.y);
  const passo = mediana(deltas);
  return grupos.map((g, i) => {
    const its = g.items.sort((a, b) => a.x - b.x);
    const segs: Linha['segs'] = [];
    let prev: Item | null = null;
    for (const it of its) {
      const gap = prev ? it.x - (prev.x + prev.w) : Infinity;
      if (!prev || gap > Math.max(14, it.h * 1.5)) segs.push({ texto: it.str.trim(), x: it.x });
      else segs[segs.length - 1].texto += (gap > it.h * 0.12 ? ' ' : '') + it.str.trim();
      prev = it;
    }
    return { segs, quebraAntes: i === 0 || (passo > 0 && deltas[i - 1] > passo * 1.5) };
  });
}

export async function extractText(
  file: File,
  onProgress: (feitas: number, total: number) => void,
  cancelado: () => boolean,
): Promise<Extraido> {
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  let doc: pdfjs.PDFDocumentProxy;
  try {
    doc = await task.promise;
  } catch (e) {
    void task.destroy();
    throw new ExtracaoError((e as Error)?.name === 'PasswordException' ? 'senha' : 'invalido');
  }
  const paginas: Pagina[] = [];
  let chars = 0;
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      if (cancelado()) throw new ExtracaoError('cancelado');
      const page = await doc.getPage(n);
      const tc = await page.getTextContent();
      const items: Item[] = tc.items
        .filter((it): it is TextItem => 'str' in it && it.str.trim() !== '')
        .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width, h: it.height || Math.abs(it.transform[3]) || 10 }));
      chars += items.reduce((a, it) => a + it.str.trim().length, 0);
      paginas.push({ numero: n, linhas: agruparLinhas(items) });
      page.cleanup();
      onProgress(n, doc.numPages);
    }
  } finally {
    void task.destroy();
  }
  if (chars < Math.max(20, 10 * paginas.length)) throw new ExtracaoError('escaneado');
  return { paginas, numPaginas: paginas.length };
}
