import JSZip from 'jszip';
import { tipoPorNome, type TipoArquivo } from './tipos';

export interface ArquivoDoZip {
  /** Nome sem pastas, ex.: "Farmaco.pdf". */
  nome: string;
  tipo: TipoArquivo;
  file: File;
}

export class ZipInvalido extends Error {}

const MIME: Record<TipoArquivo, string> = {
  pdf: 'application/pdf', texto: 'text/plain', anki: 'application/octet-stream', json: 'application/json',
};

/**
 * Abre um .zip e devolve os arquivos que o app sabe importar, em ordem alfabética.
 * Pastas, lixo do macOS (__MACOSX, ._arquivo) e formatos desconhecidos são ignorados e contados.
 */
export async function lerZip(data: ArrayBuffer | Uint8Array): Promise<{ arquivos: ArquivoDoZip[]; ignorados: string[] }> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch {
    throw new ZipInvalido('não é um .zip válido');
  }
  const arquivos: ArquivoDoZip[] = [];
  const ignorados: string[] = [];
  const entradas = Object.values(zip.files).filter((f) => !f.dir).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  for (const entrada of entradas) {
    const nome = entrada.name.split('/').pop() ?? entrada.name;
    if (entrada.name.startsWith('__MACOSX/') || nome.startsWith('._') || nome.startsWith('.')) continue;
    const tipo = tipoPorNome(nome);
    if (!tipo) {
      ignorados.push(nome);
      continue;
    }
    const bytes = await entrada.async('uint8array');
    arquivos.push({ nome, tipo, file: new File([bytes as Uint8Array<ArrayBuffer>], nome, { type: MIME[tipo] }) });
  }
  return { arquivos, ignorados };
}
