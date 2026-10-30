import gsap from 'gsap';
import { cloudPath } from './cloudPath';

/** One continuous scene: the selected live word becomes the chapter title while the book appears.
 * The temporary ghost is inert and aria-hidden; original React content is never reparented. */
export function homeArrival(
  root: HTMLElement,
  stage: HTMLElement,
  link: HTMLAnchorElement,
  arrive: () => void,
  done: () => void,
) {
  const source = root.querySelector<HTMLElement>('.book-contents')!;
  const main = root.querySelector<HTMLElement>('main')!;
  const bounds = source.getBoundingClientRect();
  const ghost = source.cloneNode(true) as HTMLElement;
  ghost.classList.add('book-home-ghost');
  ghost.inert = true;
  ghost.removeAttribute('id');
  ghost.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  const label = link.getAttribute('aria-label') || link.textContent!.trim();
  const chosen = [...ghost.querySelectorAll<HTMLAnchorElement>('a')].find(
    (node) => node.getAttribute('aria-label') === label,
  )!;
  for (const canvas of ghost.querySelectorAll('canvas')) {
    const original = source.querySelector('canvas');
    if (original) {
      const gl = original.getContext('webgl');
      // WebGL drawing buffers may be cleared after presentation. Refresh before freezing this scene.
      if (gl && !gl.isContextLost()) gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.getContext('2d')?.drawImage(original, 0, 0);
    }
  }
  ghost.querySelector('.book-mist-control')?.remove();
  Object.assign(ghost.style, {
    position: 'absolute',
    left: bounds.left + 'px',
    top: bounds.top + 'px',
    width: bounds.width + 'px',
    height: bounds.height + 'px',
    minHeight: '0',
    overflow: 'visible',
  });
  const originalGlyphs = [...link.querySelectorAll<HTMLElement>('[data-book-glyph]')];
  const floating = originalGlyphs.map((node) => {
    const r = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const glyph = document.createElement('span');
    glyph.className = 'book-travelling-glyph';
    glyph.textContent = node.textContent;
    Object.assign(glyph.style, {
      left: r.left + 'px',
      top: r.top + 'px',
      width: r.width + 'px',
      height: r.height + 'px',
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontSize: style.fontSize,
      color: style.color,
    });
    return { glyph, origin: r, fontSize: parseFloat(style.fontSize) };
  });
  stage.replaceChildren(ghost, ...floating.map((item) => item.glyph));
  chosen.style.visibility = 'hidden';
  gsap.set(stage, { autoAlpha: 1 });
  main.style.visibility = 'hidden';
  root.classList.add('book-is-arriving');
  // Clear the initial entrance's transforms before measuring the ghost's real cloud band.
  const band = ghost.querySelector('.book-mist')!.getBoundingClientRect();
  const falling = [...ghost.querySelectorAll<HTMLElement>('[data-book-glyph]')].filter(
    (node) => !chosen.contains(node),
  );
  const paths = falling.map((node, index) => {
    const r = node.getBoundingClientRect();
    return {
      node,
      path: cloudPath({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, band, index),
    };
  });
  let title: HTMLElement | null = null;
  let book: HTMLElement | null = null;
  let disposed = false;
  let arrival: gsap.core.Timeline | undefined;
  let observer: MutationObserver | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let waitFrame = 0;
  const cleanup = () => {
    disposed = true;
    sequence.kill();
    arrival?.kill();
    observer?.disconnect();
    clearTimeout(timeout);
    cancelAnimationFrame(waitFrame);
    main.style.removeProperty('visibility');
    root.classList.remove('book-is-arriving');
    if (title) title.style.removeProperty('visibility');
    if (book) gsap.set(book, { clearProps: 'transform,opacity,filter' });
    stage.replaceChildren();
  };
  const sequence = gsap.timeline();
  floating.forEach(({ glyph }, index) =>
    sequence.to(glyph, { y: -32 - index * 2, duration: 1.25, ease: 'sine.inOut' }, index * 0.025),
  );
  paths.forEach(({ node, path }, index) => {
    const start = 0.08 + index * 0.018;
    sequence
      .to(node, { motionPath: { path, curviness: 1.3 }, duration: 2.95, ease: 'sine.inOut' }, start)
      .to(
        node,
        { opacity: 0, filter: 'blur(14px)', scale: 0.78, duration: 2.1, ease: 'sine.inOut' },
        start + 0.85,
      );
  });
  const findTitle = () => {
    if (disposed) return;
    title = root.querySelector<HTMLElement>('.book-catalogue-heading h1');
    book = root.querySelector<HTMLElement>('.book-catalogue');
    if (!title || !book) return;
    observer?.disconnect();
    clearTimeout(timeout);
    const targetStyle = getComputedStyle(title);
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const textNode = walker.nextNode();
    if (!textNode) return;
    const range = document.createRange();
    const destinations = floating.map((item, index) => {
      range.setStart(textNode, index);
      range.setEnd(textNode, index + 1);
      const r = range.getBoundingClientRect();
      return {
        ...item,
        x: r.left + r.width / 2 - item.origin.left - item.origin.width / 2,
        y: r.top + r.height / 2 - item.origin.top - item.origin.height / 2,
        scale: parseFloat(targetStyle.fontSize) / item.fontSize,
      };
    });
    range.detach();
    title.style.visibility = 'hidden';
    arrival = gsap
      .timeline({
        onComplete: () => {
          cleanup();
          done();
        },
      })
      .fromTo(
        book,
        { y: 54, scale: 0.96, rotationX: 5, opacity: 0, filter: 'blur(3px)' },
        {
          y: 0,
          scale: 1,
          rotationX: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 2.45,
          ease: 'sine.inOut',
        },
        0,
      )
      .to(
        ghost.querySelector('.book-landscape'),
        { opacity: 0, duration: 2.2, ease: 'sine.inOut' },
        0,
      )
      .to(ghost, { backgroundColor: 'rgba(243,240,232,0)', duration: 1.8, ease: 'sine.inOut' }, 0);
    destinations.forEach(({ glyph, x, y, scale }, index) =>
      arrival!.to(
        glyph,
        {
          x,
          y,
          scale,
          color: targetStyle.color,
          textShadow: '0 0 0 transparent',
          duration: 2.2,
          ease: 'sine.inOut',
        },
        0.12 + index * 0.035,
      ),
    );
    arrival.to(ghost.querySelector('.book-mist'), { opacity: 0, duration: 0.7 }, 1.6);
  };
  sequence.call(
    () => {
      main.style.removeProperty('visibility');
      observer = new MutationObserver(() => {
        cancelAnimationFrame(waitFrame);
        waitFrame = requestAnimationFrame(findTitle);
      });
      observer.observe(main, { childList: true, subtree: true });
      arrive();
      timeout = setTimeout(() => {
        if (!disposed) {
          cleanup();
          done();
        }
      }, 5500);
    },
    [],
    1.2,
  );
  return { dispose: cleanup };
}
