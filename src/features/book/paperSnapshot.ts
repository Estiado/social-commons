/** Rasterize only the visible public page into a temporary animation texture.
 * Text comes from DOM ranges and the browser's loaded fonts. This never replaces the live reader,
 * captures private routes, sends pixels anywhere, or depends on cross-origin SVG/font embedding. */
export function paperSnapshot(main: HTMLElement, bounds: DOMRect) {
  const canvas = document.createElement('canvas');
  const scale = Math.min(1.5, devicePixelRatio || 1, 1800 / bounds.width);
  canvas.width = Math.max(1, Math.round(bounds.width * scale));
  canvas.height = Math.max(1, Math.round(bounds.height * scale));
  const context = canvas.getContext('2d')!;
  context.scale(scale, scale);
  context.fillStyle = '#f3f0e8';
  context.fillRect(0, 0, bounds.width, bounds.height);
  const inFrame = (r: DOMRect) =>
    r.bottom > bounds.top &&
    r.top < bounds.bottom &&
    r.right > bounds.left &&
    r.left < bounds.right;
  const visible = (style: CSSStyleDeclaration) =>
    style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.05;
  const catalogue = main.querySelector('.book-catalogue');
  if (catalogue) {
    const r = catalogue.getBoundingClientRect();
    const gradient = context.createLinearGradient(
      r.left - bounds.left,
      0,
      r.right - bounds.left,
      0,
    );
    for (const [at, color] of [
      [0, '#eee9de'],
      [0.08, '#faf8f2'],
      [0.43, '#f8f5ed'],
      [0.5, '#c7bfac'],
      [0.52, '#faf8f2'],
      [1, '#eee9dd'],
    ] as const)
      gradient.addColorStop(at, color);
    context.fillStyle = gradient;
    context.fillRect(r.left - bounds.left, r.top - bounds.top, r.width, r.height);
  }
  // Backgrounds first, then live text. Public content is bounded to the visible viewport.
  for (const element of main.querySelectorAll<HTMLElement>('*')) {
    const r = element.getBoundingClientRect();
    if (!inFrame(r)) continue;
    const style = getComputedStyle(element);
    if (!visible(style)) continue;
    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
      context.fillStyle = style.backgroundColor;
      context.fillRect(r.left - bounds.left, r.top - bounds.top, r.width, r.height);
    }
    if (element instanceof HTMLImageElement && element.complete && element.naturalWidth) {
      // Only same-origin assets can become a WebGL texture.
      if (new URL(element.currentSrc).origin !== location.origin) continue;
      context.save();
      context.globalAlpha = Number(style.opacity);
      if (element.matches('.book-paper-photo')) {
        const layer = document.createElement('canvas');
        layer.width = Math.ceil(r.width);
        layer.height = Math.ceil(r.height);
        const paint = layer.getContext('2d')!;
        const cover = Math.max(r.width / element.naturalWidth, r.height / element.naturalHeight);
        const sw = r.width / cover,
          sh = r.height / cover;
        paint.filter = style.filter;
        paint.drawImage(
          element,
          (element.naturalWidth - sw) * 0.5,
          (element.naturalHeight - sh) * 0.65,
          sw,
          sh,
          0,
          0,
          r.width,
          r.height,
        );
        const mask = paint.createLinearGradient(0, 0, 0, r.height);
        mask.addColorStop(0, 'transparent');
        mask.addColorStop(0.19, 'black');
        mask.addColorStop(0.82, 'black');
        mask.addColorStop(1, 'transparent');
        paint.globalCompositeOperation = 'destination-in';
        paint.fillStyle = mask;
        paint.fillRect(0, 0, r.width, r.height);
        context.drawImage(layer, r.left - bounds.left, r.top - bounds.top, r.width, r.height);
      } else
        context.drawImage(element, r.left - bounds.left, r.top - bounds.top, r.width, r.height);
      context.restore();
    }
    if (element instanceof HTMLCanvasElement && element.matches('.book-mist')) {
      const gl = element.getContext('webgl');
      if (gl && !gl.isContextLost()) {
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        context.save();
        context.globalAlpha = Number(style.opacity);
        context.filter = style.filter;
        context.drawImage(element, r.left - bounds.left, r.top - bounds.top, r.width, r.height);
        context.restore();
      }
    }
  }
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node: Node | null;
  let drawn = 0;
  while ((node = walker.nextNode()) && drawn < 4500) {
    const parent = node.parentElement;
    if (!parent || parent.closest('svg,script,style,canvas')) continue;
    const style = getComputedStyle(parent);
    if (!visible(style) || !inFrame(parent.getBoundingClientRect())) continue;
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.fillStyle = style.color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const text = node.textContent || '';
    let offset = 0;
    for (const character of text) {
      range.setStart(node, offset);
      offset += character.length;
      range.setEnd(node, offset);
      const r = range.getBoundingClientRect();
      if (!character.trim() || !inFrame(r) || r.width === 0) continue;
      context.fillText(
        character,
        r.left + r.width / 2 - bounds.left,
        r.top + r.height / 2 - bounds.top,
      );
      drawn++;
    }
  }
  range.detach();
  return canvas;
}
