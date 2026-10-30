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
      let captureFrame = 0;
      const finish = () => {
        generation++;
        disposeScene?.();
        disposeScene = undefined;
        cancelAnimationFrame(captureFrame);
        busy.current = false;
        expectedLocation.current = null;
        element.querySelector('.book-contents')?.classList.remove('is-merging');
        stage.current?.replaceChildren();
        gsap.set(stage.current, { autoAlpha: 0 });
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
        // The renderer is loaded only for a later public-page turn, never for the home arrival.
        void Promise.all([import('./PaperTurn'), import('./paperSnapshot')])
          .then(([{ createPaperTurn }, { paperSnapshot }]) => {
            if (!busy.current || generation !== turnId) return;
            const main = element.querySelector<HTMLElement>('main')!;
            const r = main.getBoundingClientRect();
            const bounds = new DOMRect(
              r.left,
              Math.max(0, r.top),
              r.width,
              Math.max(80, innerHeight - Math.max(0, r.top)),
            );
            const frame = document.createElement('div');
            frame.className = 'book-turn-frame';
            Object.assign(frame.style, {
              left: bounds.left + 'px',
              top: bounds.top + 'px',
              width: bounds.width + 'px',
              height: bounds.height + 'px',
            });
            stage.current!.replaceChildren(frame);
            const direction = destination === '/' ? -1 : 1;
            const renderer = createPaperTurn(frame, paperSnapshot(main, bounds), bounds, direction);
            if (!renderer) {
              arrive();
              finish();
              return;
            }
            disposeScene = renderer.dispose;
            renderer.canvas.addEventListener(
              'webglcontextlost',
              () => {
                if (busy.current && generation === turnId) {
                  sequence?.kill();
                  arrive();
                  finish();
                }
              },
              { once: true },
            );
            gsap.set(stage.current, { autoAlpha: 1 });
            const model = { progress: 0 };
            let captureAttempts = 0;
            const captureDestination = () => {
              if (!busy.current || generation !== turnId) return;
              const currentMain = element.querySelector<HTMLElement>('main')!;
              if (
                currentMain.dataset.bookPath ===
                  new URL(destination, window.location.href).pathname &&
                currentMain.querySelector('h1') &&
                !currentMain.querySelector(
                  '[data-book-loading], .book-catalogue[data-book-ready="false"]',
                )
              ) {
                renderer.setDestination(paperSnapshot(currentMain, bounds));
              } else if (captureAttempts++ < 55)
                captureFrame = requestAnimationFrame(captureDestination);
            };
            sequence = gsap
              .timeline({ onComplete: finish })
              .to(
                model,
                {
                  progress: 1,
                  duration: 3.15,
                  ease: 'sine.inOut',
                  onUpdate: () => {
                    renderer.draw(model.progress);
                    if (model.progress >= 0.3 && !navigated) {
                      arrive();
                      captureFrame = requestAnimationFrame(captureDestination);
                    }
                  },
                },
                0,
              )
              .to(frame, { opacity: 0, duration: 0.12, ease: 'sine.inOut' }, 3.06);
          })
          .catch((error) => {
            console.warn('[book-turn] Render unavailable', error);
            if (busy.current && generation === turnId) {
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
          url.pathname === current.pathname ||
          url.hash ||
          privatePath.test(url.pathname) ||
          privatePath.test(current.pathname) ||
          link.closest('[contenteditable="true"]')
        )
          return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        event.preventDefault();
        if (busy.current) return;
        busy.current = true;
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
        cancelAnimationFrame(captureFrame);
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
