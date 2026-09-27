export type TipoArquivo = 'pdf' | 'texto' | 'anki' | 'json';

/** Tipo de importação pela extensão. Fica fora de zip.ts para não puxar o jszip no carregamento inicial. */
export function tipoPorNome(nome: string): TipoArquivo | null {
  const n = nome.toLowerCase();
  if (n.endsWith('.pdf')) return 'pdf';
  if (n.endsWith('.apkg') || n.endsWith('.colpkg')) return 'anki';
  if (n.endsWith('.json')) return 'json';
  if (/\.(txt|csv|tsv|text)$/.test(n)) return 'texto';
  return null;
}
