export interface Segmento {
  texto: string;
  x: number;
}

export interface Linha {
  /** Segmentos separados por um vão horizontal grande (colunas, tabs). */
  segs: Segmento[];
  /** Há um espaço vertical maior que o normal antes desta linha (ou é o começo de página). */
  quebraAntes: boolean;
}

export interface Pagina {
  numero: number;
  linhas: Linha[];
}

export interface Par {
  frente: string;
  verso: string;
}

export type EstrategiaId = 'pre' | 'col' | 'sep' | 'num' | 'alt' | 'blo';

export interface ResultadoEstrategia {
  id: EstrategiaId;
  label: string;
  pares: Par[];
  descartadas: number;
  /** 0..1 */
  confianca: number;
}

export interface ResultadoDeteccao {
  estrategias: ResultadoEstrategia[];
  melhor: EstrategiaId;
}

export const ESTRATEGIAS: { id: EstrategiaId; label: string; peso: number }[] = [
  { id: 'pre', label: 'Prefixos (P: / R:)', peso: 1 },
  { id: 'col', label: 'Duas colunas', peso: 1 },
  { id: 'sep', label: 'Separador na linha (termo — definição)', peso: 1 },
  { id: 'num', label: 'Lista numerada', peso: 1 },
  // Genéricas casam com quase qualquer texto; o peso impede que vençam só por não descartar linhas.
  { id: 'alt', label: 'Linhas alternadas', peso: 0.6 },
  { id: 'blo', label: 'Blocos por linha em branco', peso: 0.8 },
];

export const MAX_FRENTE = 300;
export const MAX_VERSO = 1000;

const texto = (l: Linha) => l.segs.map((s) => s.texto).join(' ').replace(/\s+/g, ' ').trim();
const join = (a: string, b: string) => (a ? `${a} ${b}` : b).trim();

export function parValido(p: Par): boolean {
  const f = p.frente.trim();
  const v = p.verso.trim();
  return !!f && !!v && f.length <= MAX_FRENTE && v.length <= MAX_VERSO;
}

interface Bruto {
  pares: Par[];
  descartadas: number;
}

function flatten(paginas: Pagina[]): Linha[] {
  const out: Linha[] = [];
  for (const p of paginas) {
    p.linhas.forEach((l, i) => {
      if (texto(l)) out.push(i === 0 ? { ...l, quebraAntes: true } : l);
    });
  }
  return out;
}

const RE_PERG = /^(?:P|Q|Pergunta|Frente)\s*:\s*/i;
const RE_RESP = /^(?:R|A|Resposta|Verso)\s*:\s*/i;

function prefixos(linhas: Linha[]): Bruto {
  const pares: Par[] = [];
  let descartadas = 0;
  let cur: Par | null = null;
  let modo: 'q' | 'a' = 'q';
  for (const l of linhas) {
    const t = texto(l);
    if (RE_PERG.test(t)) {
      if (cur) pares.push(cur);
      cur = { frente: t.replace(RE_PERG, ''), verso: '' };
      modo = 'q';
    } else if (RE_RESP.test(t)) {
      if (cur && modo === 'q') {
        cur.verso = t.replace(RE_RESP, '');
        modo = 'a';
      } else descartadas++;
    } else if (cur) {
      if (modo === 'q') cur.frente = join(cur.frente, t);
      else cur.verso = join(cur.verso, t);
    } else descartadas++;
  }
  if (cur) pares.push(cur);
  return { pares, descartadas };
}

function mediana(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function duasColunas(linhas: Linha[]): Bruto {
  const comVao = linhas.filter((l) => l.segs.length >= 2);
  if (comVao.length < 2) return { pares: [], descartadas: linhas.length };
  const corte = mediana(comVao.map((l) => l.segs[1].x)) - 10;
  const pares: Par[] = [];
  let descartadas = 0;
  let cur: Par | null = null;
  for (const l of linhas) {
    const esq = l.segs.filter((s) => s.x < corte).map((s) => s.texto).join(' ').trim();
    const dir = l.segs.filter((s) => s.x >= corte).map((s) => s.texto).join(' ').trim();
    if (esq && dir) {
      if (cur) pares.push(cur);
      cur = { frente: esq, verso: dir };
    } else if (cur && !l.quebraAntes) {
      if (dir) cur.verso = join(cur.verso, dir);
      else cur.frente = join(cur.frente, esq);
    } else {
      if (cur) pares.push(cur);
      cur = null;
      descartadas++;
    }
  }
  if (cur) pares.push(cur);
  return { pares, descartadas };
}

const RE_SEP = /\s+[—–]\s+|\s+-\s+|\s*\|\s*|\t/;

function separador(linhas: Linha[]): Bruto {
  const pares: Par[] = [];
  let descartadas = 0;
  let cur: Par | null = null;
  for (const l of linhas) {
    const t = l.segs.length >= 2 ? l.segs.map((s) => s.texto.trim()).join('\t') : texto(l);
    const m = t.match(RE_SEP);
    const termo = m ? t.slice(0, m.index).trim() : '';
    if (m && termo && termo.length <= 120) {
      if (cur) pares.push(cur);
      cur = { frente: termo, verso: t.slice(m.index! + m[0].length).replace(/\t/g, ' ').trim() };
    } else if (cur && !l.quebraAntes) {
      cur.verso = join(cur.verso, texto(l));
    } else {
      if (cur) pares.push(cur);
      cur = null;
      descartadas++;
    }
  }
  if (cur) pares.push(cur);
  return { pares, descartadas };
}

const RE_NUM = /^\d{1,3}\s*[.)]\s+/;

function numerada(linhas: Linha[]): Bruto {
  const pares: Par[] = [];
  let descartadas = 0;
  let cur: Par | null = null;
  for (const l of linhas) {
    const t = texto(l);
    if (RE_NUM.test(t)) {
      if (cur) pares.push(cur);
      const resto = t.replace(RE_NUM, '');
      const q = resto.indexOf('?');
      cur = q >= 0 && q < resto.length - 1
        ? { frente: resto.slice(0, q + 1).trim(), verso: resto.slice(q + 1).trim() }
        : { frente: resto, verso: '' };
    } else if (cur) {
      cur.verso = join(cur.verso, t);
    } else descartadas++;
  }
  if (cur) pares.push(cur);
  return { pares, descartadas };
}

function alternadas(linhas: Linha[]): Bruto {
  const pares: Par[] = [];
  for (let i = 0; i + 1 < linhas.length; i += 2) pares.push({ frente: texto(linhas[i]), verso: texto(linhas[i + 1]) });
  return { pares, descartadas: linhas.length % 2 };
}

function blocos(linhas: Linha[]): Bruto {
  const grupos: Linha[][] = [];
  for (const l of linhas) {
    if (l.quebraAntes || !grupos.length) grupos.push([l]);
    else grupos[grupos.length - 1].push(l);
  }
  if (grupos.length < 2) return { pares: [], descartadas: linhas.length };
  const pares: Par[] = [];
  let descartadas = 0;
  for (const g of grupos) {
    if (g.length < 2) descartadas++;
    else pares.push({ frente: texto(g[0]), verso: g.slice(1).map(texto).join(' ') });
  }
  return { pares, descartadas };
}

const IMPL: Record<EstrategiaId, (l: Linha[]) => Bruto> = {
  pre: prefixos, col: duasColunas, sep: separador, num: numerada, alt: alternadas, blo: blocos,
};

/**
 * Roda as seis estratégias. confiança = pares válidos / (válidos + descartados), ajustada pelo peso.
 * Vence a maior; empate desempata pela ordem, da mais específica para a mais genérica.
 */
export function detectCards(paginas: Pagina[]): ResultadoDeteccao {
  const linhas = flatten(paginas);
  const estrategias = ESTRATEGIAS.map(({ id, label, peso }) => {
    const bruto = IMPL[id](linhas);
    const pares = bruto.pares.filter(parValido).map((p) => ({ frente: p.frente.trim(), verso: p.verso.trim() }));
    const invalidos = bruto.pares.length - pares.length;
    const total = pares.length + invalidos + bruto.descartadas;
    const confianca = pares.length ? (pares.length / total) * peso : 0;
    return { id, label, pares, descartadas: invalidos + bruto.descartadas, confianca };
  });
  let melhor = estrategias[0];
  for (const e of estrategias) if (e.confianca > melhor.confianca) melhor = e;
  return { estrategias, melhor: melhor.id };
}

/** Monta páginas a partir de texto simples: linha em branco = quebra de bloco, tab = vão entre colunas. */
export function paginasDeTexto(txt: string): Pagina[] {
  const linhas: Linha[] = [];
  let quebra = true;
  for (const raw of txt.split('\n')) {
    if (!raw.trim()) {
      quebra = true;
      continue;
    }
    const segs = raw
      .split('\t')
      .map((p, i) => ({ texto: p.trim(), x: i === 0 ? 0 : 300 }))
      .filter((s) => s.texto);
    linhas.push({ segs, quebraAntes: quebra });
    quebra = false;
  }
  return [{ numero: 1, linhas }];
}
