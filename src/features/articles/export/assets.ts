export function articleImageUrl(url: string): string {
  return `/api/article-image?${new URLSearchParams({ url })}`;
}

export interface ExportImage { bytes: Uint8Array; width: number; height: number }
/** Normalize web formats once, so DOCX and PDF use the same decoded pixels. */
export async function loadExportImage(url: string): Promise<ExportImage> {
  const response = await fetch(articleImageUrl(url), { signal: AbortSignal.timeout(15_000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('插图无法读取');
  const blob = await response.blob();
  if (blob.size > 4 * 1024 * 1024) throw new Error('插图过大');
  const bitmap = await createImageBitmap(blob);
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error('插图尺寸过大');
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('浏览器暂不支持插图转换');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('插图转换失败')), 'image/png'));
    if (png.size > 5 * 1024 * 1024) throw new Error('插图转换后过大');
    return { bytes: new Uint8Array(await png.arrayBuffer()), width: canvas.width, height: canvas.height };
  } finally { bitmap.close(); }
}

export function downloadArticleFile(bytes: Uint8Array | Blob, filename: string, type: string) {
  const blob = bytes instanceof Blob ? bytes : new Blob([bytes as BlobPart], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = Array.from(filename, (character) => character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character) ? '_' : character).join('').slice(0, 180);
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
