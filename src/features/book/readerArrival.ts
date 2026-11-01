import gsap from 'gsap';

type Letter = { text: string; rect: DOMRect };

// Start only the selected public reader while the paper is dissolving. A cold lazy route
// otherwise spends the title transfer's entire preparation budget downloading its module.
function prepareReader(path: string) {
  switch (path.split('/')[1]) {
    case 'daily':
      return import('@/pages/DailyDetailPage/DailyDetailPage');
    case 'events':
      return import('@/pages/EventDetailPage/EventDetailPage');
    case 'quotes':
      return import('@/pages/QuoteDetailPage/QuoteDetailPage');
    case 'essay':
      return import('@/pages/EssayPage/EssayPage');
    case 'guanlan':
      return import('@/pages/GuanlanEventPage/GuanlanEventPage');
    case 'world':
      return import('@/pages/WorldStoryPage/WorldStoryPage');
  }
}

function insideClippingParents(heading: HTMLElement) {
  const rect = heading.getBoundingClientRect();
  let parent = heading.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    if (/(auto|scroll|hidden|clip)/.test(style.overflowY + style.overflowX)) {
      const clip = parent.getBoundingClientRect();
      if (
        rect.top < clip.top ||
        rect.bottom > clip.bottom ||
        rect.left < clip.left ||
        rect.right > clip.right
      )
        return false;
    }
    parent = parent.parentElement;
  }
  return true;
}

/** Real line breaks, including nested text. Never reflow a heading during its transfer. */
function lettersOf(heading: HTMLElement): Letter[] {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const letters: Letter[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    let offset = 0;
    for (const text of node.textContent || '') {
      range.setStart(node, offset);
      offset += text.length;
      range.setEnd(node, offset);
      if (text.trim()) letters.push({ text, rect: range.getBoundingClientRect() });
    }
  }
  range.detach();
  return letters;
}

/** Catalogue ink becomes reader ink; the photographic book dissolves into the same paper.
 * Public text only. No page snapshot, React reparenting or reader scroll interception. */
export function readerArrival(
  root: HTMLElement,
  stage: HTMLElement,
  link: HTMLAnchorElement,
  arrive: () => void,
  done: () => void,
) {
  const destination = new URL(link.href);
  void prepareReader(destination.pathname)?.catch(() => {});
  const main = root.querySelector<HTMLElement>('main')!;
  const source = link.closest('.book-entry-preview')?.querySelector<HTMLElement>('h2');
  const sourceRect = source?.getBoundingClientRect();
  const sourceLetters = source ? lettersOf(source) : [];
  // An offscreen / clipped heading must not suddenly reappear above a scrolled reading button.
  const visible =
    !!sourceRect &&
    sourceRect.top >= 0 &&
    sourceRect.bottom <= innerHeight &&
    sourceRect.left >= 0 &&
    sourceRect.right <= innerWidth &&
    insideClippingParents(source!) &&
    sourceLetters.length <= 160;
  const wash = document.createElement('div');
  wash.className = 'book-reader-paper';
  const style = source ? getComputedStyle(source) : null;
  const floating = visible
    ? sourceLetters.map(({ text, rect }) => {
        const glyph = document.createElement('span');
        glyph.className = 'book-reader-glyph';
        glyph.textContent = text;
        Object.assign(glyph.style, {
          left: rect.left + 'px',
          top: rect.top + 'px',
          fontFamily: style!.fontFamily,
          fontWeight: style!.fontWeight,
          fontSize: style!.fontSize,
          fontStyle: style!.fontStyle,
          color: style!.color,
        });
        return glyph;
      })
    : [];
  stage.replaceChildren(wash, ...floating);
  gsap.set(stage, { autoAlpha: 1 });
  // Match glyph ink baselines instead of assuming the line box equals its Range rectangle.
  const corrections = floating.map((glyph, index) => {
    const range = document.createRange();
    range.selectNodeContents(glyph);
    const actual = range.getBoundingClientRect();
    range.detach();
    return {
      x: sourceLetters[index].rect.left - actual.left,
      y: sourceLetters[index].rect.top - actual.top,
    };
  });
  floating.forEach((glyph, index) => {
    glyph.style.left = sourceLetters[index].rect.left + corrections[index].x + 'px';
    glyph.style.top = sourceLetters[index].rect.top + corrections[index].y + 'px';
  });
  if (floating.length && source) source.style.visibility = 'hidden';
  stage.dataset.bookReaderPhase = 'paper';
  let disposed = false;
  let frame = 0;
  let target: HTMLElement | null = null;
  let sequence: gsap.core.Timeline;
  let navigated = false;
  const restore = () => {
    if (source) source.style.removeProperty('visibility');
    if (target) gsap.set(target, { clearProps: 'visibility,opacity,transform' });
    gsap.set(main, { clearProps: 'opacity' });
  };
  const dispose = () => {
    disposed = true;
    sequence.kill();
    cancelAnimationFrame(frame);
    window.removeEventListener('wheel', skip);
    window.removeEventListener('touchmove', skip);
    restore();
    delete stage.dataset.bookReaderPhase;
    stage.replaceChildren();
  };
  const skip = () => {
    if (disposed) return;
    if (!navigated) arrive();
    done();
  };
  window.addEventListener('wheel', skip, { passive: true });
  window.addEventListener('touchmove', skip, { passive: true });
  const reveal = (ready: boolean) => {
    if (disposed) return;
    stage.dataset.bookReaderPhase = 'title';
    const destinations = ready && target ? lettersOf(target) : [];
    const transfer =
      floating.length > 0 &&
      destinations.length === floating.length &&
      destinations.every((letter, i) => letter.text === sourceLetters[i].text) &&
      destinations.every(({ rect }) => rect.top >= 0 && rect.bottom <= innerHeight);
    if (transfer && target) target.style.visibility = 'hidden';
    sequence = gsap.timeline({ onComplete: done });
    if (transfer) {
      const color = getComputedStyle(target!).color;
      destinations.forEach(({ rect }, index) => {
        const origin = sourceLetters[index].rect;
        const scaleX = rect.width / origin.width;
        const scaleY = rect.height / origin.height;
        sequence.to(
          floating[index],
          {
            x: rect.left - origin.left + corrections[index].x * (scaleX - 1),
            y: rect.top - origin.top + corrections[index].y * (scaleY - 1),
            scaleX,
            scaleY,
            color,
            duration: 0.95,
            ease: 'power3.inOut',
          },
          0,
        );
      });
      // Hand off identical ink while the remaining paper settles; never show both titles.
      sequence.call(
        () => {
          if (target) target.style.removeProperty('visibility');
          gsap.set(floating, { opacity: 0 });
          stage.dataset.bookReaderPhase = 'settle';
        },
        [],
        0.95,
      );
    } else {
      if (floating.length)
        sequence.to(floating, { opacity: 0, duration: 0.35, ease: 'sine.inOut' }, 0);
      if (target)
        sequence.fromTo(
          target,
          { y: 8 },
          { y: 0, duration: 0.75, ease: 'power3.out', clearProps: 'transform' },
          0.1,
        );
    }
    sequence
      .to(main, { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, 0.12)
      .to(wash, { opacity: 0, duration: 0.95, ease: 'sine.inOut' }, 0);
  };
  sequence = gsap
    .timeline()
    .to(wash, { opacity: 1, duration: 0.42, ease: 'sine.inOut' })
    .call(() => {
      gsap.set(main, { opacity: 0 });
      navigated = true;
      arrive();
      const started = performance.now();
      let readyAt = 0;
      const wait = () => {
        if (disposed) return;
        const here = window.location.pathname + window.location.search;
        const ready =
          here === destination.pathname + destination.search &&
          main.matches('.book-reading-main') &&
          !main.querySelector('[data-book-loading], .book-catalogue');
        const essayId =
          destination.pathname === '/essay' ? destination.searchParams.get('id') : null;
        target = ready
          ? essayId
            ? document.getElementById('essay-' + essayId)?.querySelector<HTMLElement>('h2') || null
            : main.querySelector<HTMLElement>('h1')
          : null;
        // Let RouteArrival / essay deep-link positioning and loaded fonts settle before measuring.
        if (target && document.fonts.status === 'loaded') {
          if (!readyAt) readyAt = performance.now();
          if (performance.now() - readyAt >= 80) {
            reveal(true);
            return;
          }
        } else readyAt = 0;
        if (performance.now() - started > 4000) {
          reveal(false);
          return;
        }
        frame = requestAnimationFrame(wait);
      };
      frame = requestAnimationFrame(wait);
    });
  return { dispose };
}
