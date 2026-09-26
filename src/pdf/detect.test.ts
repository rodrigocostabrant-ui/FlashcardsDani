import { describe, expect, it } from 'vitest';
import { detectCards, paginasDeTexto, type EstrategiaId } from './detect';

const run = (txt: string) => detectCards(paginasDeTexto(txt));
const of = (txt: string, id: EstrategiaId) => run(txt).estrategias.find((e) => e.id === id)!;

describe('detectCards', () => {
  it('prefixos P:/R: com continuação de linha', () => {
    const r = run(`P: Antídoto do paracetamol?
R: N-acetilcisteína,
que repõe a glutationa.
P: Tríade de Virchow
R: Estase, lesão endotelial e hipercoagulabilidade.`);
    expect(r.melhor).toBe('pre');
    const e = of('P: a\nR: b', 'pre');
    expect(e.pares).toEqual([{ frente: 'a', verso: 'b' }]);
    const pre = r.estrategias.find((x) => x.id === 'pre')!;
    expect(pre.pares[0]).toEqual({ frente: 'Antídoto do paracetamol?', verso: 'N-acetilcisteína, que repõe a glutationa.' });
    expect(pre.pares).toHaveLength(2);
  });

  it('aceita Pergunta:/Resposta: e Frente:/Verso:', () => {
    const e = of('Pergunta: x\nResposta: y\nFrente: z\nVerso: w', 'pre');
    expect(e.pares).toHaveLength(2);
  });

  it('duas colunas, com célula da direita quebrando em duas linhas', () => {
    const r = run(`Captopril\tIECA; tosse seca
\tpor bradicinina.
Losartana\tBRA; sem tosse.
Furosemida\tDiurético de alça.`);
    expect(r.melhor).toBe('col');
    const col = r.estrategias.find((e) => e.id === 'col')!;
    expect(col.pares[0]).toEqual({ frente: 'Captopril', verso: 'IECA; tosse seca por bradicinina.' });
    expect(col.pares).toHaveLength(3);
  });

  it('separador na linha: travessão, barra e hífen', () => {
    const r = run(`Captopril — IECA; tosse seca.
Losartana | BRA; bloqueia AT1.
Furosemida - diurético de alça.
Espironolactona — poupador de potássio.`);
    expect(r.melhor).toBe('sep');
    expect(r.estrategias.find((e) => e.id === 'sep')!.pares).toHaveLength(4);
  });

  it('lista numerada, com resposta na linha seguinte ou após o ponto de interrogação', () => {
    const r = run(`1. Qual o antídoto da heparina?
Sulfato de protamina.
2. Qual o antídoto dos benzodiazepínicos? Flumazenil.
3) Tipo de necrose da tuberculose
Caseosa.`);
    expect(r.melhor).toBe('num');
    const num = r.estrategias.find((e) => e.id === 'num')!;
    expect(num.pares).toEqual([
      { frente: 'Qual o antídoto da heparina?', verso: 'Sulfato de protamina.' },
      { frente: 'Qual o antídoto dos benzodiazepínicos?', verso: 'Flumazenil.' },
      { frente: 'Tipo de necrose da tuberculose', verso: 'Caseosa.' },
    ]);
  });

  it('linhas alternadas quando não há outra estrutura', () => {
    const r = run(`Nervo da mão em garra
Ulnar
Nervo do punho caído
Radial`);
    expect(r.melhor).toBe('alt');
    expect(r.estrategias.find((e) => e.id === 'alt')!.pares[1]).toEqual({ frente: 'Nervo do punho caído', verso: 'Radial' });
  });

  it('blocos separados por linha em branco', () => {
    const r = run(`Tríade de Beck
Hipotensão, turgência jugular
e abafamento de bulhas.

Tríade de Virchow
Estase, lesão endotelial
e hipercoagulabilidade.

CURB-65
Confusão, ureia, FR, PA e idade.`);
    expect(r.melhor).toBe('blo');
    const blo = r.estrategias.find((e) => e.id === 'blo')!;
    expect(blo.pares).toHaveLength(3);
    expect(blo.pares[0].verso).toBe('Hipotensão, turgência jugular e abafamento de bulhas.');
  });

  it('texto sem estrutura devolve confiança baixa em vez de lixo', () => {
    const r = run(`Este capítulo discute a fisiologia cardiovascular de forma introdutória, sem perguntas.

Outro parágrafo corrido que também não tem pares.

Mais um parágrafo.`);
    const melhor = r.estrategias.find((e) => e.id === r.melhor)!;
    expect(melhor.confianca).toBeLessThan(0.6);
  });

  it('descarta pares longos demais', () => {
    const e = of(`P: ${'x'.repeat(301)}\nR: y`, 'pre');
    expect(e.pares).toHaveLength(0);
    expect(e.confianca).toBe(0);
  });

  it('página nova sempre quebra bloco', () => {
    const r = detectCards([
      { numero: 1, linhas: [{ segs: [{ texto: 'A', x: 0 }], quebraAntes: false }, { segs: [{ texto: 'a', x: 0 }], quebraAntes: false }] },
      { numero: 2, linhas: [{ segs: [{ texto: 'B', x: 0 }], quebraAntes: false }, { segs: [{ texto: 'b', x: 0 }], quebraAntes: false }] },
    ]);
    expect(r.estrategias.find((e) => e.id === 'blo')!.pares).toHaveLength(2);
  });
});
