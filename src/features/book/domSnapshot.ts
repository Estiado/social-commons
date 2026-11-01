import { toSvg } from 'html-to-image';
import { captureMist } from './mistSnapshot';
import { snapshotFonts } from './snapshotFonts';
let captureId = 0;

/** Browser-layout snapshot, only of the public book shell. No private reader, transmission,
 * per-character baseline approximation or application data capture is involved. */
export async function domSnapshot(root: HTMLElement, bounds: DOMRect, current = () => true) {
  const permitted = () =>
    current() && !/^\/(reading|editor|feedback)(\/|$)/.test(location.pathname);
  if (!permitted()) throw new Error('Public snapshot cancelled');
  const rect = root.getBoundingClientRect();
  // Freeze owner-produced WebGL pixels before html-to-image clones the canvas.
  const mist = root.querySelector<HTMLCanvasElement>('.book-mist');
  if (mist) captureMist(mist);
  // In a cold route, glyph subsets must finish loading before their matching faces are embedded.
  await document.fonts.ready;
  const embedded = await snapshotFonts(root);
  if (!permitted()) throw new Error('Public snapshot cancelled');
  const lines: { node: HTMLElement; id: string; text: string[] }[] = [];
  let glyphs = 0;
  // Preserve actual line breaks: SVG foreignObject uses non-overlay scrollbars, which can
  // otherwise rewrap a heading just before it becomes the moving sheet.
  for (const node of root.querySelectorAll<HTMLElement>('h1,h2,h3,p,a,button')) {
    const rect = node.getBoundingClientRect();
    if (
      node.childNodes.length !== 1 ||
      node.firstChild?.nodeType !== Node.TEXT_NODE ||
      rect.bottom < bounds.top ||
      rect.top > bounds.bottom ||
      glyphs > 5000 ||
      getComputedStyle(node).writingMode !== 'horizontal-tb'
    )
      continue;
    const text = node.firstChild;
    const fontSize = parseFloat(getComputedStyle(node).fontSize);
    const range = document.createRange();
    const rows: string[] = [];
    let offset = 0,
      top = -Infinity;
    for (const char of text.textContent || '') {
      range.setStart(text, offset);
      offset += char.length;
      range.setEnd(text, offset);
      const box = range.getBoundingClientRect();
      if (!box.width && !char.trim()) continue;
      if (Math.abs(box.top - top) > fontSize * 0.55) {
        rows.push('');
        top = box.top;
      }
      rows[rows.length - 1] += char;
      glyphs++;
    }
    range.detach();
    if (!rows.length) continue;
    const id = `${++captureId}`;
    node.dataset.bookCaptureLines = id;
    lines.push({ node, id, text: rows });
  }
  let source: string;
  try {
    source = await toSvg(root, {
      width: bounds.width,
      height: bounds.height,
      pixelRatio: Math.min(1.5, devicePixelRatio || 1, 1800 / bounds.width),
      backgroundColor: '#f3f0e8',
      skipFonts: !embedded,
      fontEmbedCSS: embedded,
      style: {
        width: `${rect.width}px`,
        height: `${root.scrollHeight}px`,
        minHeight: '0',
        margin: '0',
        overflow: 'visible',
        transform: `translate(${rect.left - bounds.left}px, ${rect.top - bounds.top}px)`,
      },
      filter: (node) => {
        if (!permitted()) throw new Error('Public snapshot cancelled');
        return (
          !(node instanceof Element) ||
          !node.matches('.book-turn-stage, .book-section-menu, .book-mist-control')
        );
      },
    });
  } finally {
    for (const item of lines)
      if (item.node.dataset.bookCaptureLines === item.id) delete item.node.dataset.bookCaptureLines;
  }
  // foreignObject does not serialize native scroll offsets. Recreate each bounded directory
  // scroller's presentation inside its existing clipped box before rasterizing the SVG.
  const xml = new DOMParser().parseFromString(
    decodeURIComponent(source.slice(source.indexOf(',') + 1)),
    'image/svg+xml',
  );
  for (const item of lines) {
    const copy = xml.querySelector<HTMLElement>(`[data-book-capture-lines="${item.id}"]`);
    if (!copy) continue;
    copy.replaceChildren();
    for (const line of item.text) {
      const span = xml.createElementNS('http://www.w3.org/1999/xhtml', 'span');
      span.setAttribute('style', 'display:block;white-space:pre;text-wrap:nowrap;');
      span.textContent = line;
      copy.append(span);
    }
    copy.removeAttribute('data-book-capture-lines');
  }
  for (const selector of ['.book-index-page', '.book-preview-page']) {
    const live = root.querySelector<HTMLElement>(selector);
    const copy = xml.querySelector<HTMLElement>(selector);
    if (!live || !copy) continue;
    copy.style.overflow = 'hidden';
    copy.style.scrollbarWidth = 'none';
    if (!live.scrollTop) continue;
    const wrapper = xml.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    wrapper.setAttribute('style', `transform:translateY(${-live.scrollTop}px);width:100%;`);
    while (copy.firstChild) wrapper.append(copy.firstChild);
    copy.append(wrapper);
  }
  const image = new Image();
  image.src =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(new XMLSerializer().serializeToString(xml));
  await image.decode();
  const result = document.createElement('canvas');
  const ratio = Math.min(1.5, devicePixelRatio || 1, 1800 / bounds.width);
  result.width = Math.round(bounds.width * ratio);
  result.height = Math.round(bounds.height * ratio);
  result.getContext('2d')!.drawImage(image, 0, 0, result.width, result.height);
  return result;
}
