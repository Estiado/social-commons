import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import { BOOK_CHAPTERS } from './chapters';
import { homeArrival } from './homeArrival';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

/** Public-route scene choreography. Native scrolling, private router state and save guards remain outside this scope. */
export function BookMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const expectedLocation = useRef<string | null>(null);
  const cancelTurn = useRef<() => void>(() => {});
  const navigate = useNavigate();
  const location = useLocation();
  const previousLocation = useRef(location);
  // A workspace link, browser Back or another navigation wins over an unfinished turn.
  useEffect(() => {
    const before = previousLocation.current;
    previousLocation.current = location;
    const moved =
      before.key !== location.key ||
      before.pathname !== location.pathname ||
      before.search !== location.search ||
      before.hash !== location.hash;
    if (
      moved &&
      busy.current &&
      expectedLocation.current !== location.pathname + location.search + location.hash
    )
      cancelTurn.current();
  }, [location]);
  useGSAP(
    () => {
      if (busy.current) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const element = root.current!;
        const ink = element.querySelectorAll('[data-book-letter]');
        const photo = element.querySelector('.book-landscape');
        if (ink.length)
          gsap.from(ink, {
            y: location.pathname === '/' ? 28 : 10,
            opacity: 0.55,
            filter: 'blur(4px)',
            duration: 0.85,
            stagger: { amount: 0.24 },
            ease: 'power3.out',
            clearProps: 'transform,opacity,filter',
          });
        if (photo) {
          gsap.from(photo, { scale: 1.025, duration: 1.2, ease: 'power3.out' });
          gsap.to(photo, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: element.querySelector('.book-contents'),
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        }
        if (photo && window.matchMedia('(pointer: fine)').matches) {
          const xTo = gsap.quickTo(photo, 'x', { duration: 0.8, ease: 'power3.out' });
          const move = (event: PointerEvent) => xTo((event.clientX / window.innerWidth - 0.5) * 9);
          const leave = () => xTo(0);
          element.addEventListener('pointermove', move, { passive: true });
          element.addEventListener('pointerleave', leave);
          return () => {
            element.removeEventListener('pointermove', move);
            element.removeEventListener('pointerleave', leave);
          };
        }
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [location.pathname], revertOnUpdate: true },
  );

  useGSAP(
    (_context, contextSafe) => {
      const element = root.current!;
      let sequence: gsap.core.Timeline | undefined;
      let destination = '';
      let navigated = false;
      let generation = 0;
      let disposeScene: (() => void) | undefined;
      let arrivalFrame = 0;
      const finish = () => {
        generation++;
        disposeScene?.();
        disposeScene = undefined;
        cancelAnimationFrame(arrivalFrame);
        busy.current = false;
        delete element.dataset.bookTransitionActive;
        expectedLocation.current = null;
        element.querySelector('.book-contents')?.classList.remove('is-merging');
        stage.current?.replaceChildren();
        gsap.set(stage.current, { autoAlpha: 0 });
        const main = element.querySelector('main');
        if (main) {
          main.inert = false;
          main.removeAttribute('aria-busy');
          gsap.set(main, { clearProps: 'opacity' });
          if (navigated) (main as HTMLElement).focus({ preventScroll: true });
        }
        const ink = element.querySelectorAll('[data-book-letter]');
        if (ink.length)
          gsap.set(ink, {
            clearProps: 'transform,opacity,filter',
          });
        const glyphs = element.querySelectorAll('[data-book-glyph]');
        if (glyphs.length) gsap.set(glyphs, { clearProps: 'transform,opacity,filter,willChange' });
      };
      cancelTurn.current = () => {
        sequence?.kill();
        finish();
      };
      const arrive = () => {
        if (!navigated) {
          navigated = true;
          navigate(destination);
        }
      };
      const turnPaper = contextSafe(() => {
        const turnId = ++generation;
        const main = element.querySelector<HTMLElement>('main')!;
        const valid = () => busy.current && generation === turnId;
        void (async () => {
          const [{ createRollTurn }, { domSnapshot }] = await Promise.all([
            import('./RollTurn'),
            import('./domSnapshot'),
          ]);
          if (!valid()) return;
          // Both routes share viewport coordinates, including all margins, controls and paper edges.
          // The old main's inset and scroll position never define the next page's frame.
          const bounds = new DOMRect(0, 0, innerWidth, innerHeight);
          const capture = async () => {
            let timeout: ReturnType<typeof setTimeout> | undefined;
            try {
              return await Promise.race([
                domSnapshot(element, bounds, valid),
                new Promise<never>((_, reject) => {
                  timeout = setTimeout(
                    () => reject(new Error('Snapshot preparation exceeded budget')),
                    2400,
                  );
                }),
              ]);
            } finally {
              clearTimeout(timeout);
            }
          };
          const surfaceRect = () => {
            const surface =
              main.querySelector<HTMLElement>('.book-catalogue, .book-contents') || main;
            const rect = surface.getBoundingClientRect();
            if (!surface.matches('.book-catalogue')) return rect;
            const photograph = surface.querySelector<HTMLElement>('.book-photo-base');
            if (photograph) return photograph.getBoundingClientRect();
            const edge = getComputedStyle(surface, '::before');
            const left = parseFloat(edge.left) || 0,
              top = parseFloat(edge.top) || 0;
            const right = parseFloat(edge.right) || 0,
              bottom = parseFloat(edge.bottom) || 0;
            return new DOMRect(
              rect.left + left,
              rect.top + top,
              rect.width - left - right,
              rect.height - top - bottom,
            );
          };
          const sourceRect = surfaceRect();
          const source = await capture();
          if (!valid()) return;
          const frame = document.createElement('div');
          frame.className = 'book-turn-frame';
          Object.assign(frame.style, { inset: '0' });
          stage.current!.replaceChildren(frame);
          const reverse = destination === '/' || /\/[^/]+\//.test(window.location.pathname);
          const photograph = main.querySelector<HTMLImageElement>('.book-photo-base img');
          if (photograph && (!photograph.complete || !photograph.naturalWidth)) {
            arrive();
            finish();
            return;
          }
          const renderer = createRollTurn(
            frame,
            source,
            bounds,
            reverse ? -1 : 1,
            photograph
              ? { image: photograph, bounds: photograph.getBoundingClientRect() }
              : undefined,
          );
          if (!renderer) {
            arrive();
            finish();
            return;
          }
          disposeScene = renderer.dispose;
          renderer.draw(0);
          gsap.set(stage.current, { autoAlpha: 1 });
          renderer.canvas.addEventListener(
            'webglcontextlost',
            () => {
              if (valid()) {
                sequence?.kill();
                arrive();
                finish();
              }
            },
            { once: true },
          );
          arrive();
          const started = performance.now();
          const reveal = async () => {
            if (!valid()) return;
            const photo = main.querySelector<HTMLImageElement>('.book-photo-base img');
            const ready =
              main.dataset.bookPath === new URL(destination, window.location.href).pathname &&
              main.querySelector('h1') &&
              !main.querySelector(
                '[data-book-loading], .book-catalogue[data-book-ready="false"], .book-mist[data-book-mist-state="pending"]',
              ) &&
              (!photo || photo.complete);
            if (!ready) {
              if (performance.now() - started > 1800) {
                finish();
                return;
              }
              arrivalFrame = requestAnimationFrame(
                () =>
                  void reveal().catch((error) => {
                    console.warn('[book-roll] Destination capture unavailable', error);
                    if (valid()) finish();
                  }),
              );
              return;
            }
            const target = await capture();
            if (!valid()) return;
            const targetRect = surfaceRect();
            const left = Math.max(0, Math.min(sourceRect.left, targetRect.left));
            const top = Math.max(0, Math.min(sourceRect.top, targetRect.top));
            const right = Math.min(innerWidth, Math.max(sourceRect.right, targetRect.right));
            const bottom = Math.min(innerHeight, Math.max(sourceRect.bottom, targetRect.bottom));
            renderer.setSheet(
              new DOMRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top)),
            );
            renderer.setDestination(target);
            const model = { progress: 0 };
            // Full cross-chapter sweep; abbreviated reader round trips retain native reading pace.
            const duration =
              /\/[^/]+\//.test(destination + '/') &&
              !BOOK_CHAPTERS.some((c) => c.path === destination)
                ? 1.35
                : reverse && destination !== '/'
                  ? 1.35
                  : 2.55;
            sequence = gsap.timeline({ onComplete: finish }).to(model, {
              progress: 1,
              duration,
              ease: 'sine.inOut',
              onUpdate: () => renderer.draw(model.progress),
            });
          };
          arrivalFrame = requestAnimationFrame(
            () =>
              void reveal().catch((error) => {
                console.warn('[book-roll] Destination capture unavailable', error);
                if (valid()) finish();
              }),
          );
        })().catch((error) => {
          console.warn('[book-roll] Snapshot unavailable; native navigation retained', error);
          if (valid()) {
            arrive();
            finish();
          }
        });
      });
      const click = contextSafe((event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest<HTMLAnchorElement>('a[href]');
        if (!link || link.target || link.download || link.hasAttribute('data-no-book-turn')) return;
        const url = new URL(link.href);
        const current = new URL(window.location.href);
        const privatePath = /^\/(reading|editor|feedback)(\/|$)/;
        if (
          url.origin !== current.origin ||
          url.hash ||
          privatePath.test(url.pathname) ||
          privatePath.test(current.pathname) ||
          link.closest('[contenteditable="true"]')
        )
          return;
        if (url.pathname === current.pathname) {
          if (busy.current) {
            event.preventDefault();
            cancelTurn.current();
            navigate(url.pathname + url.search);
          }
          return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        event.preventDefault();
        if (busy.current) {
          // Latest valid public intent wins, before or after the previous route has mounted.
          cancelTurn.current();
          navigate(url.pathname + url.search);
          return;
        }
        busy.current = true;
        element.dataset.bookTransitionActive = 'true';
        const main = element.querySelector<HTMLElement>('main');
        if (main) {
          main.inert = true;
          main.setAttribute('aria-busy', 'true');
        }
        destination = url.pathname + url.search;
        expectedLocation.current = destination;
        navigated = false;
        const chapter = BOOK_CHAPTERS.find((item) => item.path === url.pathname);
        if (chapter) {
          void import('./catalogue')
            .then((module) => module.loadBookCatalogue(chapter.id))
            .catch(() => {});
          void import('./BookCatalogue');
        }
        if (current.pathname !== '/' || !link.matches('.book-chapter-link')) {
          turnPaper();
          return;
        }
        const letters = [...element.querySelectorAll<HTMLElement>('[data-book-letter]')];
        gsap.killTweensOf(letters);
        gsap.set(letters, { clearProps: 'transform,filter,opacity' });
        const home = homeArrival(element, stage.current!, link, arrive, finish);
        disposeScene = home.dispose;
      });
      const escape = contextSafe((event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !busy.current) return;
        sequence?.kill();
        arrive();
        finish();
      });
      element.addEventListener('click', click, true);
      window.addEventListener('keydown', escape);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const reduceTurn = contextSafe(() => {
        if (reduced.matches && busy.current) {
          sequence?.kill();
          arrive();
          finish();
        }
      });
      reduced.addEventListener('change', reduceTurn);
      const resizeTurn = contextSafe(() => {
        if (busy.current) {
          sequence?.kill();
          arrive();
          finish();
        }
      });
      window.addEventListener('resize', resizeTurn);
      return () => {
        sequence?.kill();
        generation++;
        disposeScene?.();
        cancelAnimationFrame(arrivalFrame);
        element.removeEventListener('click', click, true);
        window.removeEventListener('keydown', escape);
        reduced.removeEventListener('change', reduceTurn);
        window.removeEventListener('resize', resizeTurn);
        stage.current?.replaceChildren();
        busy.current = false;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="book-motion-root">
      {children}
      <div ref={stage} className="book-turn-stage" aria-hidden="true" />
    </div>
  );
}
