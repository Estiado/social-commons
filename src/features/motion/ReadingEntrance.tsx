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
        gsap.from('[data-reading-enter]', {
          y: 12,
          opacity: 0.65,
          duration: 0.45,
          stagger: 0.065,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
