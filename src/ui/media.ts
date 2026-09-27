import { useEffect, useState } from 'react';
import { db } from '../db/schema';

const MAX_LADO = 1600;

/** Reduz fotos grandes (celular, prints em 4K) antes de guardar. GIF e SVG passam intactos. */
export async function prepareImage(file: Blob): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    return file;
  }
  const scale = Math.min(1, MAX_LADO / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 500_000) {
    bmp.close();
    return file;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const encode = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q));
  let out = await encode('image/webp', 0.86);
  // Safari antigo não gera WebP e devolve PNG (maior que a foto original); aí vai de JPEG.
  if (!out || out.type !== 'image/webp') out = await encode('image/jpeg', 0.85);
  return out && out.size < file.size ? out : file;
}

/** Tela de toque (celular/tablet): mostra o botão de câmera. */
export const temCamera = () => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

export function imagesFromClipboard(e: ClipboardEvent | React.ClipboardEvent): File[] {
  return [...(e.clipboardData?.files ?? [])].filter((f) => f.type.startsWith('image/'));
}

const urls = new Map<string, string>();

/** Carrega do IndexedDB só as imagens que estão na tela e guarda as URLs para as próximas renderizações. */
export function useMediaUrls(ids: string[]): (id: string) => string {
  const [, rerender] = useState(0);
  const key = ids.join('|');
  useEffect(() => {
    const missing = [...new Set(ids)].filter((id) => !urls.has(id));
    if (!missing.length) return;
    let alive = true;
    void db.media.bulkGet(missing).then((ms) => {
      ms.forEach((m, i) => urls.set(missing[i], m ? URL.createObjectURL(m.blob) : ''));
      if (alive) rerender((x) => x + 1);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (id) => urls.get(id) ?? '';
}
