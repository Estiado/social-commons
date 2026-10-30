import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import { BOOK_CHAPTERS } from './chapters';
import { cloudPath } from './cloudPath';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

/** Fold geometry adapted from Codrops BookBlock (2013), MIT. See public/book/licenses/BOOKBLOCK.txt.
 * Native scrolling, editable content, private router state and save guards remain outside this scope.
 */
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
      const finish = () => {
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
      const turnPaper = contextSafe((home: boolean) => {
        const main = element.querySelector<HTMLElement>('main')!;
        const bounds = main.getBoundingClientRect();
        const width = bounds.width;
        const height = Math.min(bounds.height, window.innerHeight - Math.max(0, bounds.top));
        const frame = document.createElement('div');
        frame.className = 'book-turn-frame';
        Object.assign(frame.style, {
          left: bounds.left + 'px',
          top: Math.max(0, bounds.top) + 'px',
          width: width + 'px',
          height: height + 'px',
        });
        const copy = (offset: number) => {
          const node = main.cloneNode(true) as HTMLElement;
          node.removeAttribute('id');
          node.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'));
          node.querySelectorAll('canvas, .book-mist-control').forEach((child) => child.remove());
          node.inert = true;
          node.classList.add('book-turn-copy');
          Object.assign(node.style, {
            width: width + 'px',
            left: -offset + 'px',
            top: Math.min(0, bounds.top) + 'px',
          });
          return node;
        };
        const stationary = document.createElement('div');
        stationary.className = 'book-turn-stationary';
        stationary.append(copy(0));
        frame.append(stationary);
        const panels: HTMLDivElement[] = [];
        let parent: HTMLElement = frame;
        for (let index = 0; index < 3; index++) {
          const panel = document.createElement('div');
          panel.className = 'book-turn-panel' + (index === 0 ? ' book-turn-hinge' : '');
          const front = document.createElement('div');
          front.className = 'book-turn-front';
          front.append(copy(width / 2 + (index * width) / 6));
          const back = document.createElement('div');
          back.className = 'book-turn-back';
          panel.append(front, back);
          parent.append(panel);
          panels.push(panel);
          parent = panel;
        }
        stage.current!.replaceChildren(frame);
        gsap.set(stage.current, { autoAlpha: 1 });
        const duration = home ? 1.05 : 0.85;
        sequence = gsap
          .timeline({ onComplete: finish })
          .to(panels[0], { rotationY: -172, duration, ease: 'sine.inOut' }, 0)
          .to(
            panels.slice(1),
            { rotationY: -24, duration: duration * 0.45, stagger: 0.07, ease: 'sine.out' },
            0,
          )
          .to(
            panels.slice(1),
            { rotationY: 0, duration: duration * 0.45, stagger: 0.04, ease: 'sine.inOut' },
            duration * 0.5,
          )
          .call(arrive, [], duration * 0.43)
          .to(stationary, { opacity: 0, duration: 0.28 }, duration * 0.45)
          .to(frame, { opacity: 0, duration: 0.2 }, duration * 0.85);
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
        if (current.pathname !== '/') {
          turnPaper(false);
          return;
        }
        const letters = [...element.querySelectorAll<HTMLElement>('[data-book-letter]')];
        gsap.killTweensOf(letters);
        const rest = [...element.querySelectorAll<HTMLElement>('[data-book-glyph]')].filter(
          (node) => !link.contains(node),
        );
        const scene = element.querySelector('.book-contents')!;
        const band = element.querySelector('.book-mist')!.getBoundingClientRect();
        // Read every glyph before writing transforms; endpoints use the cloud, not a percentage of the page.
        const sink = rest.map((node, index) => {
          const bounds = node.getBoundingClientRect();
          return {
            node,
            path: cloudPath(
              { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 },
              band,
              index,
            ),
          };
        });
        scene.classList.add('is-merging');
        gsap.set(rest, { willChange: 'transform,opacity,filter' });
        sequence = gsap
          .timeline({ onComplete: () => turnPaper(true) })
          .to(link, { y: -85, z: 65, opacity: 0, duration: 1.3, ease: 'sine.inOut' }, 0);
        sink.forEach(({ node, path }, index) => {
          const start = 0.08 + index * 0.018;
          const duration = 2.8 + (index % 3) * 0.08;
          sequence!
            .to(node, { motionPath: { path, curviness: 1.3 }, duration, ease: 'sine.inOut' }, start)
            .to(
              node,
              {
                opacity: 0,
                filter: 'blur(14px)',
                scale: 0.78,
                rotationX: 8,
                duration: duration * 0.7,
                ease: 'sine.inOut',
              },
              start + duration * 0.3,
            );
        });
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
      return () => {
        sequence?.kill();
        element.removeEventListener('click', click, true);
        window.removeEventListener('keydown', escape);
        reduced.removeEventListener('change', reduceTurn);
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
