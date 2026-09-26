// Converte design/markup.src.html (formato sc-if/sc-for do Claude Design) em componentes React tipados.
// Uso: node scripts/design-to-tsx.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'htmlparser2';

const SRC = 'design/markup.src.html';
const OUT = 'src/ui/generated';
const SCREENS = {
  isInicio: 'Inicio', isEstudar: 'Estudar', isSessao: 'Sessao', isResultado: 'Resultado',
  isBaralhos: 'Baralhos', isBaralho: 'Baralho', isCriar: 'Criar', isImportar: 'Importar',
  isEvolucao: 'Evolucao', isAjustes: 'Ajustes',
};
const VOID = new Set(['input', 'br', 'img', 'hr', 'meta', 'link']);
const NUMERIC_ATTRS = new Set(['rows', 'cols', 'tabindex']);
const BINDING = /\{\{(.*?)\}\}/g;

const hoverRules = new Map();
const screenFiles = {};

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function resolve(expr, scope) {
  const e = expr.trim();
  if (e === 'true' || e === 'false') return e;
  if (!/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(e)) throw new Error('Expressão não suportada: ' + e);
  return scope.has(e.split('.')[0]) ? e : 'v.' + e;
}

function isSingleBinding(s) {
  const m = s.trim().match(/^\{\{(.*?)\}\}$/);
  return m ? m[1] : null;
}

function interp(s, scope) {
  const single = isSingleBinding(s);
  if (single !== null) return resolve(single, scope);
  if (!s.includes('{{')) return JSON.stringify(s);
  const body = s.replace(/`/g, '\\`').replace(BINDING, (_, e) => '${' + resolve(e, scope) + '}');
  return '`' + body + '`';
}

function splitDecls(str) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out.map((d) => d.trim()).filter(Boolean);
}

function styleObj(str, scope) {
  let custom = false;
  const props = splitDecls(str).map((d) => {
    const i = d.indexOf(':');
    const name = d.slice(0, i).trim();
    const value = d.slice(i + 1).trim();
    let key;
    if (name.startsWith('--')) { custom = true; key = JSON.stringify(name); }
    else key = camel(name.startsWith('-webkit-') ? 'Webkit' + name.slice(7) : name);
    return `${key}: ${interp(value, scope)}`;
  });
  const obj = `{ ${props.join(', ')} }`;
  return custom ? `${obj} as CSSProperties` : obj;
}

function hoverClass(attribs) {
  const parts = {};
  for (const k of ['style-hover', 'style-active', 'style-focus']) {
    if (attribs[k]) {
      if (attribs[k].includes('{{')) throw new Error('Binding em ' + k + ' não suportado');
      parts[k] = attribs[k];
    }
  }
  if (!Object.keys(parts).length) return null;
  const key = JSON.stringify(parts);
  if (!hoverRules.has(key)) hoverRules.set(key, { name: 'dh' + (hoverRules.size + 1), parts });
  return hoverRules.get(key).name;
}

function attrValue(name, raw, scope) {
  const single = isSingleBinding(raw);
  if (single !== null) return `{${resolve(single, scope)}}`;
  if (raw.includes('{{')) return `{${interp(raw, scope)}}`;
  if (NUMERIC_ATTRS.has(name) && /^\d+$/.test(raw)) return `{${raw}}`;
  return /["\\]/.test(raw) ? `{${JSON.stringify(raw)}}` : `"${raw}"`;
}

function emitAttrs(el, scope) {
  const out = [];
  const cls = hoverClass(el.attribs);
  if (cls) out.push(`className="${cls}"`);
  for (const [name, raw] of Object.entries(el.attribs)) {
    if (name.startsWith('hint-placeholder') || name.startsWith('style-')) continue;
    if (name === 'style') { out.push(`style={${styleObj(raw, scope)}}`); continue; }
    let jsxName;
    if (name.startsWith('sc-camel-')) jsxName = camel(name.slice('sc-camel-'.length));
    else if (name === 'class') jsxName = 'className';
    else if (name === 'for') jsxName = 'htmlFor';
    else if (name.startsWith('data-') || name.startsWith('aria-')) jsxName = name;
    else jsxName = camel(name);
    out.push(`${jsxName}=${attrValue(name, raw, scope)}`);
  }
  return out.join(' ');
}

function emitText(raw, scope) {
  const t = raw.replace(/\s+/g, ' ');
  if (t === ' ' && /\n/.test(raw)) return [];
  if (t === '') return [];
  const out = [];
  let last = 0;
  const pushLit = (lit) => {
    if (!lit) return;
    if (/^\s|\s$|[{}<>&]/.test(lit)) out.push(`{${JSON.stringify(lit)}}`);
    else out.push(lit);
  };
  for (const m of t.matchAll(BINDING)) {
    pushLit(t.slice(last, m.index));
    out.push(`{${resolve(m[1], scope)}}`);
    last = m.index + m[0].length;
  }
  pushLit(t.slice(last));
  return out;
}

function emitChildren(nodes, scope, depth) {
  const out = [];
  for (const n of nodes) out.push(...emitNode(n, scope, depth));
  return out;
}

const pad = (d) => '  '.repeat(d);

function wrap(children, depth) {
  if (children.length === 1 && children[0].trimStart().startsWith('<')) return children[0];
  return `${pad(depth)}<>\n${children.map((c) => (c.startsWith(' ') ? c : pad(depth + 1) + c)).join('\n')}\n${pad(depth)}</>`;
}

function emitNode(n, scope, depth) {
  if (n.type === 'text') return emitText(n.data, scope).map((t) => pad(depth) + t);
  if (n.type === 'comment') return [];
  if (n.type !== 'tag') return [];
  const tag = n.name;

  if (tag === 'sc-if') {
    const cond = isSingleBinding(n.attribs.value);
    if (cond === null) throw new Error('sc-if sem binding');
    const screen = SCREENS[cond.trim()];
    if (screen && scope.size === 0) {
      screenFiles[screen] = emitChildren(n.children, new Set(), 2);
      return [`${pad(depth)}{v.${cond.trim()} && <${screen}Screen v={v} />}`];
    }
    const kids = emitChildren(n.children, scope, depth + 2);
    if (!kids.length) return [];
    return [`${pad(depth)}{!!(${resolve(cond, scope)}) && (\n${wrap(kids, depth + 1)}\n${pad(depth)})}`];
  }

  if (tag === 'sc-for') {
    const list = isSingleBinding(n.attribs.list);
    const as = n.attribs.as;
    const inner = new Set(scope);
    inner.add(as);
    const idx = `i_${as}`;
    const kids = emitChildren(n.children, inner, depth + 2);
    const body = kids.map((c) => c).join('\n');
    return [`${pad(depth)}{${resolve(list, scope)}.map((${as}, ${idx}) => (\n${pad(depth + 1)}<Fragment key={${idx}}>\n${body}\n${pad(depth + 1)}</Fragment>\n${pad(depth)}))}`];
  }

  const jsxTag = tag === 'sc-raw-select' ? 'select' : tag;
  const attrs = emitAttrs(n, scope);
  const open = `${pad(depth)}<${jsxTag}${attrs ? ' ' + attrs : ''}`;
  const kids = VOID.has(tag) ? [] : emitChildren(n.children, scope, depth + 1);
  if (!kids.length) return [`${open} />`];
  return [[`${open}>`, ...kids, `${pad(depth)}</${jsxTag}>`].join('\n')];
}

const HEADER = '// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.\n';

function componentFile(name, bodyLines, extraImports = '') {
  const body = bodyLines.join('\n');
  const needsFragment = body.includes('<Fragment');
  const needsCss = body.includes('as CSSProperties');
  const reactImports = [needsFragment && 'Fragment', needsCss && 'type CSSProperties'].filter(Boolean);
  return (
    HEADER +
    (reactImports.length ? `import { ${reactImports.join(', ')} } from 'react';\n` : '') +
    `import type { VM } from '../vm';\n` +
    extraImports +
    `\nexport function ${name}({ v }: { v: VM }) {\n  return (\n${body.includes('\n') || bodyLines.length > 1 ? wrap(bodyLines, 2) : bodyLines[0]}\n  );\n}\n`
  );
}

const src = fs.readFileSync(SRC, 'utf8');
const doc = parseDocument(src, { lowerCaseAttributeNames: true, decodeEntities: true, recognizeSelfClosing: true });
const rootLines = emitChildren(doc.children, new Set(), 2);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const screenImports = Object.keys(screenFiles)
  .map((s) => `import { ${s}Screen } from './${s}Screen';\n`)
  .join('');
fs.writeFileSync(path.join(OUT, 'View.tsx'), componentFile('View', rootLines, screenImports + "import './hover.css';\n"));
for (const [name, lines] of Object.entries(screenFiles)) {
  fs.writeFileSync(path.join(OUT, `${name}Screen.tsx`), componentFile(`${name}Screen`, lines));
}

const pseudo = { 'style-hover': ':hover', 'style-active': ':active', 'style-focus': ':focus' };
let css = '/* Gerado por scripts/design-to-tsx.mjs — não edite à mão. */\n';
for (const { name, parts } of hoverRules.values()) {
  for (const [k, decls] of Object.entries(parts)) {
    const body = splitDecls(decls).map((d) => d + ' !important').join(';');
    css += `.${name}${pseudo[k]}{${body}}\n`;
  }
}
fs.writeFileSync(path.join(OUT, 'hover.css'), css);

console.log(`View + ${Object.keys(screenFiles).length} telas, ${hoverRules.size} classes de hover.`);
