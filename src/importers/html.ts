const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…',
  laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', middot: '·', bull: '•',
  rarr: '→', larr: '←', uarr: '↑', darr: '↓', harr: '↔', rArr: '⇒', times: '×', divide: '÷', plusmn: '±',
  le: '≤', ge: '≥', ne: '≠', asymp: '≈', deg: '°', micro: 'µ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ',
  Delta: 'Δ', epsilon: 'ε', theta: 'θ', lambda: 'λ', mu: 'μ', pi: 'π', sigma: 'σ', omega: 'ω', ordm: 'º', ordf: 'ª',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e] ?? m;
  });
}

/** Marca provisória para <br>, distinta das quebras vindas de blocos. */
const BR = String.fromCharCode(1);
const BR_RE = new RegExp(BR, 'g');

/** Converte um campo em HTML (Anki, planilhas exportadas) em texto simples e lista as imagens citadas. */
export function htmlToText(html: string): { texto: string; imgs: string[] } {
  const imgs: string[] = [];
  let s = html.replace(/<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi, (_, a, b, c) => {
    const src = decodeEntities(a ?? b ?? c ?? '').trim();
    if (src) imgs.push(src);
    return ' ';
  });
  s = s
    .replace(/\[sound:[^\]]*\]/gi, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, BR)
    .replace(/<\/?(div|p|tr|h[1-6]|ul|ol)\b[^>]*>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '• ')
    .replace(/<\/t[dh]>/gi, ' ')
    .replace(/<[^>]+>/g, '');
  // Blocos seguidos (</div><div>) viram uma quebra só; linhas em branco só vêm de <br> explícito.
  const texto = decodeEntities(s)
    .replace(/[ \t ]+/g, ' ')
    .replace(/\n(\s*\n)+/g, '\n')
    .replace(BR_RE, '\n')
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { texto, imgs };
}

const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
  svg: 'image/svg+xml', bmp: 'image/bmp', avif: 'image/avif',
};

export function mimeFromName(name: string): string | null {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MIME[ext] ?? null;
}
