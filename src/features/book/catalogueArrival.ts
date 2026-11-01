import gsap from 'gsap';

export type CatalogueDeparture = {
  rect: DOMRect;
  text: string;
  font: string;
  fontFamily: string;
  color: string;
  lines: number;
};
export function captureCatalogueDeparture(node?: HTMLElement): CatalogueDeparture | undefined {
  if (!node) return;
  const style = getComputedStyle(node);
  const range = document.createRange();
  range.selectNodeContents(node);
  const lines = range.getClientRects().length;
  const rect = range.getBoundingClientRect();
  range.detach();
  return {
    rect,
    text: node.textContent || '',
    font: style.font,
    fontFamily: style.fontFamily,
    color: style.color,
    lines,
  };
}

/** One clipped, temporary title within the left paper. Live rows never start invisible. */
export function catalogueArrival(
  pane: HTMLElement,
  view: HTMLElement,
  target: HTMLElement | null,
  departure: CatalogueDeparture | undefined,
  done: () => void,
) {
  const clip = pane.getBoundingClientRect();
  const fits = (r: DOMRect) =>
    r.top >= Math.max(clip.top, 0) &&
    r.bottom <= Math.min(clip.bottom, innerHeight) &&
    r.left >= Math.max(clip.left, 0) &&
    r.right <= clip.right;
  const range = document.createRange();
  if (target) range.selectNodeContents(target);
  const sameLine = target && range.getClientRects().length === 1;
  const rect = target ? range.getBoundingClientRect() : undefined;
  range.detach();
  const transfer =
    departure &&
    target &&
    rect &&
    departure.lines === 1 &&
    sameLine &&
    departure.fontFamily === getComputedStyle(target).fontFamily &&
    departure.text === target.textContent &&
    fits(departure.rect) &&
    fits(rect) &&
    document.fonts.status === 'loaded';
  let overlay: HTMLElement | undefined;
  let stopped = false;
  const timeline = gsap.timeline({ paused: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clean = () => {
    if (stopped) return;
    stopped = true;
    timeline?.kill();
    overlay?.remove();
    target?.style.removeProperty('visibility');
    gsap.set(view, { clearProps: 'opacity,transform' });
    pane.removeEventListener('scroll', scroll);
    window.removeEventListener('resize', interrupt);
    window.removeEventListener('keydown', escape);
    document.removeEventListener('click', outside, true);
    window.removeEventListener('popstate', clean);
    reduced.removeEventListener('change', interrupt);
  };
  const interrupt = () => {
    clean();
    done();
  };
  const scroll = () => {
    // Resetting the previous list queues a scroll event for this same frame. It is not
    // a reader interruption; only a real offset change invalidates the measured path.
    if (pane.scrollTop !== 0 || pane.scrollLeft !== 0) interrupt();
  };
  const escape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') interrupt();
  };
  const outside = (event: MouseEvent) => {
    // Before BookMotion captures a different chapter: no travelling label or hidden ink
    // may be carried into that page's source image. Keep the new control's focus.
    if (event.target instanceof Node && !pane.contains(event.target)) clean();
  };
  if (reduced.matches) {
    done();
    return clean;
  }
  timeline.eventCallback('onComplete', () => {
    clean();
    done();
  });
  if (transfer) {
    overlay = document.createElement('div');
    overlay.className = 'book-category-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    const glyph = document.createElement('span');
    glyph.className = 'book-category-traveller';
    glyph.textContent = departure.text;
    Object.assign(glyph.style, {
      left: departure.rect.left - clip.left + 'px',
      top: departure.rect.top - clip.top + 'px',
      font: departure.font,
      color: departure.color,
      width: departure.rect.width + 'px',
    });
    overlay.append(glyph);
    pane.append(overlay);
    // Match text baselines, not flex/heading line boxes; their padding and leading differ.
    const ink = document.createRange();
    ink.selectNodeContents(glyph);
    const actual = ink.getBoundingClientRect();
    ink.detach();
    const dx = departure.rect.left - actual.left;
    const dy = departure.rect.top - actual.top;
    glyph.style.left = departure.rect.left - clip.left + dx + 'px';
    glyph.style.top = departure.rect.top - clip.top + dy + 'px';
    const scaleX = rect.width / departure.rect.width;
    const scaleY = rect.height / departure.rect.height;
    gsap.set(target, { visibility: 'hidden' });
    timeline.to(
      glyph,
      {
        x: rect.left - departure.rect.left + dx * (scaleX - 1),
        y: rect.top - departure.rect.top + dy * (scaleY - 1),
        scaleX,
        scaleY,
        color: getComputedStyle(target).color,
        duration: 0.62,
        ease: 'power3.inOut',
      },
      0,
    );
  }
  timeline.fromTo(
    view,
    { opacity: 0.82 },
    { opacity: 1, duration: 0.38, ease: 'power2.out', clearProps: 'opacity' },
    transfer ? 0.24 : 0,
  );
  pane.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('resize', interrupt);
  window.addEventListener('keydown', escape);
  document.addEventListener('click', outside, true);
  window.addEventListener('popstate', clean);
  reduced.addEventListener('change', interrupt);
  timeline.play();
  return clean;
}
