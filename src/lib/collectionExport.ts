/** 导出层只依赖规范化的数据，不依赖 Supabase 返回结构或 React state。 */
export interface ExportItem {
  index: number;
  type: '段落' | '划线';
  content: string;
  title: string;
  source: string;
  author: string;
  url: string;
}

export interface ExportCollection {
  name: string;
  description?: string | null;
}

export type ExportFormat = 'txt' | 'md' | 'docx' | 'pdf';

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

const attribution = (item: ExportItem) => `—— 摘自《${item.title}》（${item.source}）${item.author ? ` · ${item.author}` : ''}`;

export function buildText(collection: ExportCollection, items: readonly ExportItem[]): string {
  return `【${collection.name}】\n\n${collection.description ? `${collection.description}\n\n` : ''}${items.map((item) => `${item.index}. ${item.content}\n${attribution(item)}\n原文：${item.url}`).join('\n\n')}\n\n—— 由社科通识·素材包导出`;
}

export function buildMarkdown(collection: ExportCollection, items: readonly ExportItem[]): string {
  return `# ${collection.name}\n\n${collection.description ? `> ${collection.description}\n\n` : ''}${items.map((item) => `### ${item.index}. ${item.type}\n\n${item.content}\n\n> ${attribution(item)}\n\n原文：${item.url}`).join('\n\n---\n\n')}\n\n*由社科通识·素材包导出*`;
}

/** 所有用户输入和抓取文本都先转义，避免打印窗口执行文章中的 HTML。 */
export function buildPrintHtml(collection: ExportCollection, items: readonly ExportItem[]): string {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${escapeHtml(collection.name)}</title>
    <style>body{font-family:SimSun,serif;max-width:700px;margin:40px auto;padding:0 20px;color:#333}h1{text-align:center}article{margin-bottom:24px;break-inside:avoid}p{line-height:1.8;white-space:pre-wrap}.source,footer{font-size:12px;color:#666}a{overflow-wrap:anywhere}@media print{body{margin:20px}}</style>
    </head><body><h1>${escapeHtml(collection.name)}</h1>${collection.description ? `<p>${escapeHtml(collection.description)}</p>` : ''}
    ${items.map((item) => `<article><p>${item.index}. ${escapeHtml(item.content)}</p><p class="source">${escapeHtml(attribution(item))}</p><p class="source">原文：${escapeHtml(item.url)}</p></article>`).join('')}
    <footer>由社科通识·素材包导出</footer></body></html>`;
}

function downloadBlob(blob: Blob, name: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = Array.from(name, (char) => char.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(char) ? '_' : char).join('');
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // 下载接管 Blob 后释放，避免过早撤销使某些浏览器得到空文件。
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export async function exportCollection(format: ExportFormat, collection: ExportCollection, items: readonly ExportItem[]) {
  if (!items.length) return;
  if (format === 'pdf') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) throw new Error('请允许弹出窗口以导出 PDF');
    printWindow.opener = null;
    printWindow.document.write(buildPrintHtml(collection, items));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    return;
  }
  if (format === 'docx') {
    // Word 的压缩/打包代码较大，只有点击导出时才下载和初始化。
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const children = [new Paragraph({ text: collection.name, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER })];
    if (collection.description) children.push(new Paragraph({ text: collection.description }));
    for (const item of items) {
      children.push(new Paragraph({ text: `${item.index}. ${item.content}`, spacing: { before: 200, after: 100 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: attribution(item), size: 20, color: '666666' })] }));
      children.push(new Paragraph({ text: `原文：${item.url}` }));
    }
    const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
    downloadBlob(blob, `${collection.name}.docx`);
    return;
  }
  const content = format === 'txt' ? buildText(collection, items) : buildMarkdown(collection, items);
  const type = format === 'txt' ? 'text/plain;charset=utf-8' : 'text/markdown;charset=utf-8';
  downloadBlob(new Blob([content], { type }), `${collection.name}.${format}`);
}
