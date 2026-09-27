import JSZip from 'jszip';
import initSqlJs, { type SqlJsStatic } from 'sql.js';
import { zstdCompressSync } from 'node:zlib';
import { beforeAll, describe, expect, it } from 'vitest';
import { AnkiError, noteToCards, parseApkg, parseMediaEntries } from './anki';
import { DeckFileInvalido, parseDeckFile } from './deckFile';
import { htmlToText } from './html';
import { parseDelimited, textToPairs } from './text';
import { ZipInvalido, lerZip } from './zip';

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);

describe('htmlToText', () => {
  it('quebra linhas, remove tags, decodifica entidades e extrai imagens', () => {
    const r = htmlToText('Antídoto<br>da <b>heparina</b>&nbsp;&rarr; <img src="seta.png"><div>Protamina &amp; cia</div>[sound:a.mp3]');
    expect(r.texto).toBe('Antídoto\nda heparina →\nProtamina & cia');
    expect(r.imgs).toEqual(['seta.png']);
  });

  it('blocos seguidos não geram linha em branco', () => {
    expect(htmlToText('a<div>b</div><div>c</div>').texto).toBe('a\nb\nc');
    expect(htmlToText('a<br><br>b').texto).toBe('a\n\nb');
  });

  it('entidades numéricas', () => {
    expect(htmlToText('Ca&#178;&#x207A;').texto).toBe('Ca²⁺');
  });
});

describe('texto em colunas', () => {
  it('CSV com aspas, vírgula dentro do campo e cabeçalho', () => {
    const csv = 'Frente,Verso\n"Tríade de Beck","Hipotensão, turgência jugular e ""abafamento"""\nCURB-65,Critério de gravidade\n';
    expect(textToPairs(csv, 'x.csv')).toEqual([
      { frente: 'Tríade de Beck', verso: 'Hipotensão, turgência jugular e "abafamento"' },
      { frente: 'CURB-65', verso: 'Critério de gravidade' },
    ]);
  });

  it('CSV com ponto e vírgula (Excel em português)', () => {
    expect(textToPairs('a;b\nc;d', 'planilha.csv')).toHaveLength(2);
  });

  it('exportação de texto do Anki com cabeçalhos e HTML', () => {
    const txt = '#separator:tab\n#html:true\n#guid column:1\nabc123\tQual nervo?<br>(mão)\tUlnar\nxyz\tFrente 2\tVerso 2';
    expect(textToPairs(txt, 'deck.txt')).toEqual([
      { frente: 'Qual nervo?\n(mão)', verso: 'Ulnar' },
      { frente: 'Frente 2', verso: 'Verso 2' },
    ]);
  });

  it('exportação do Quizlet (termo TAB definição)', () => {
    expect(textToPairs('Captopril\tIECA\nLosartana\tBRA\n')).toHaveLength(2);
  });

  it('texto corrido sem colunas devolve null', () => {
    expect(textToPairs('Um parágrafo qualquer.\nOutro parágrafo.')).toBeNull();
  });

  it('campo entre aspas com quebra de linha', () => {
    expect(parseDelimited('"a\nb",c', ',')).toEqual([['a\nb', 'c']]);
  });
});

describe('noteToCards', () => {
  it('nota básica: primeiro campo é a frente, o resto é o verso', () => {
    expect(noteToCards(['Frente', 'Verso', 'Extra'], ['t'])).toEqual([
      { frente: 'Frente', verso: 'Verso\nExtra', tags: ['t'], imgsFrente: [], imgsVerso: [] },
    ]);
  });

  it('cloze vira um card por lacuna, com dica', () => {
    const cards = noteToCards(['{{c1::Captopril}} é um {{c2::IECA::classe}}', 'causa tosse'], []);
    expect(cards.map((c) => c.frente)).toEqual(['[…] é um IECA', 'Captopril é um [classe]']);
    expect(cards[0].verso).toBe('Captopril é um IECA\n\ncausa tosse');
  });

  it('aceita card só com imagem na frente', () => {
    const [c] = noteToCards(['<img src="ecg.png">', 'Fibrilação atrial'], []);
    expect(c.frente).toBe('');
    expect(c.imgsFrente).toEqual(['ecg.png']);
  });

  it('descarta nota vazia', () => {
    expect(noteToCards(['', ''], [])).toEqual([]);
  });
});

async function legacyApkg(): Promise<Uint8Array> {
  const db = new SQL.Database();
  db.run('CREATE TABLE col (id integer primary key, decks text); CREATE TABLE notes (id integer primary key, flds text, tags text); CREATE TABLE cards (id integer primary key, nid integer, did integer, ord integer);');
  db.run('INSERT INTO col VALUES (1, ?)', [JSON.stringify({ 1: { id: 1, name: 'Default' }, 1700: { id: 1700, name: 'Medicina::Farmaco' } })]);
  db.run('INSERT INTO notes VALUES (1, ?, ?)', ['Qual droga?<img src="seta.png">\x1fCaptopril', ' farmaco ']);
  db.run('INSERT INTO notes VALUES (2, ?, ?)', ['{{c1::Losartana}} é um {{c2::BRA}}\x1f', '']);
  db.run('INSERT INTO cards VALUES (10, 1, 1700, 0), (11, 2, 1700, 0), (12, 2, 1700, 1)');
  const zip = new JSZip();
  zip.file('collection.anki2', db.export());
  zip.file('media', JSON.stringify({ 0: 'seta.png', 1: 'nao-usada.png' }));
  zip.file('0', PNG);
  zip.file('1', PNG);
  db.close();
  return zip.generateAsync({ type: 'uint8array' });
}

function pbString(field: number, s: string): number[] {
  const b = [...new TextEncoder().encode(s)];
  return [(field << 3) | 2, b.length, ...b];
}

async function modernApkg(): Promise<Uint8Array> {
  const db = new SQL.Database();
  db.run('CREATE TABLE decks (id integer primary key, name text); CREATE TABLE notes (id integer primary key, flds text, tags text); CREATE TABLE cards (id integer primary key, nid integer, did integer, ord integer);');
  db.run('INSERT INTO decks VALUES (1, ?), (5, ?)', ['Default', 'Medicina\x1fAnatomia']);
  db.run('INSERT INTO notes VALUES (1, ?, ?)', ['<img src="plexo.png">\x1fC5 a T1', '']);
  db.run('INSERT INTO cards VALUES (1, 1, 5, 0)');
  const entry = pbString(1, 'plexo.png');
  const entries = new Uint8Array([(1 << 3) | 2, entry.length, ...entry]);
  const zip = new JSZip();
  zip.file('collection.anki21b', zstdCompressSync(db.export()));
  zip.file('collection.anki2', new Uint8Array([0]));
  zip.file('media', zstdCompressSync(entries));
  zip.file('0', zstdCompressSync(PNG));
  db.close();
  return zip.generateAsync({ type: 'uint8array' });
}

describe('parseApkg', () => {
  it('formato antigo: baralho com hierarquia, cloze e só as imagens usadas', async () => {
    const r = await parseApkg(await legacyApkg(), SQL);
    expect(r.baralhos).toHaveLength(1);
    expect(r.baralhos[0].nome).toBe('Medicina › Farmaco');
    expect(r.baralhos[0].cards).toHaveLength(3);
    expect(r.baralhos[0].cards[0]).toMatchObject({ frente: 'Qual droga?', verso: 'Captopril', imgsFrente: ['seta.png'], tags: ['farmaco'] });
    expect([...r.media.keys()]).toEqual(['seta.png']);
    expect(r.media.get('seta.png')!.type).toBe('image/png');
  });

  it('formato novo (anki21b, zstd + protobuf)', async () => {
    const r = await parseApkg(await modernApkg(), SQL);
    expect(r.baralhos).toEqual([
      { nome: 'Medicina › Anatomia', cards: [{ frente: '', verso: 'C5 a T1', tags: [], imgsFrente: ['plexo.png'], imgsVerso: [] }] },
    ]);
    const blob = r.media.get('plexo.png')!;
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(PNG);
  });

  it('recusa arquivo que não é do Anki', async () => {
    await expect(parseApkg(new Uint8Array([1, 2, 3]), SQL)).rejects.toThrow(AnkiError);
  });

  it('protobuf com legacy_zip_filename', () => {
    const name = pbString(1, 'a.png');
    const entry = [...name, 0xf8, 0x0f, 7]; // campo 255, varint 7
    const map = parseMediaEntries(new Uint8Array([(1 << 3) | 2, entry.length, ...entry]));
    expect([...map]).toEqual([['7', 'a.png']]);
  });
});

describe('lerZip', () => {
  it('separa os arquivos suportados, ignora lixo do macOS e conta os desconhecidos', async () => {
    const zip = new JSZip();
    zip.file('Resumos/Farmaco.csv', 'a;b\nc;d');
    zip.file('Resumos/anotacoes.txt', 'P: x\nR: y');
    zip.file('baralho.json', '{}');
    zip.file('Resumos/Aula 3.PDF', new Uint8Array([1]));
    zip.file('foto.jpg', new Uint8Array([1]));
    zip.file('__MACOSX/Resumos/._Farmaco.csv', 'lixo');
    zip.file('.DS_Store', 'lixo');
    zip.folder('vazia');
    const r = await lerZip(await zip.generateAsync({ type: 'uint8array' }));
    expect(r.arquivos.map((a) => [a.nome, a.tipo])).toEqual([
      ['baralho.json', 'json'],
      ['anotacoes.txt', 'texto'],
      ['Aula 3.PDF', 'pdf'],
      ['Farmaco.csv', 'texto'],
    ]);
    expect(r.ignorados).toEqual(['foto.jpg']);
    expect(await r.arquivos[3].file.text()).toBe('a;b\nc;d');
  });

  it('recusa arquivo que não é zip', async () => {
    await expect(lerZip(new Uint8Array([1, 2, 3]))).rejects.toThrow(ZipInvalido);
  });
});

describe('parseDeckFile', () => {
  it('lê baralhos e imagens em base64', async () => {
    const r = parseDeckFile({
      app: 'flashcards-dani', tipo: 'baralhos', versao: 1,
      baralhos: [{ nome: 'Micro', descricao: 'bactérias', cor: 2, cards: [{ frente: 'a', verso: 'b', tags: [], imgsFrente: ['m1'], imgsVerso: [] }] }],
      media: { m1: { mime: 'image/png', base64: btoa(String.fromCharCode(...PNG)) } },
    });
    expect(r.baralhos[0].cards[0].imgsFrente).toEqual(['m1']);
    expect(new Uint8Array(await r.media.get('m1')!.arrayBuffer())).toEqual(PNG);
  });

  it('recusa outro tipo de arquivo', () => {
    expect(() => parseDeckFile({ app: 'flashcards-dani', versao: 1 })).toThrow(DeckFileInvalido);
  });
});
