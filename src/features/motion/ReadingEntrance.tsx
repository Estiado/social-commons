import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** Only these short entrances animate. Reading retains native wheel/touch scrolling. */
export function ReadingEntrance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const surfaces = root.current?.querySelectorAll('[data-reading-enter]');
        if (!surfaces?.length) return;
        // Establish the heading, then bring its reading choices into view.
        // Only the first three surfaces participate, with no offscreen queue.
        const sequence = gsap.timeline({
          defaults: { ease: 'power3.out', clearProps: 'transform,opacity' },
        });
        sequence.from(surfaces[0], { y: 8, opacity: 0.8, duration: 0.35 });
        if (surfaces.length > 1)
          sequence.from(
            [...surfaces].slice(1, 3),
            { y: 4, opacity: 0.85, duration: 0.24, stagger: 0.04 },
            '-=0.14',
          );
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className} data-motion-local>
      {children}
    </div>
  );
}
