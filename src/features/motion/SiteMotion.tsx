import type { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './motion.css';

gsap.registerPlugin(useGSAP);

const TARGETS = 'h1, [data-page-enter]';

/** One observer per page, not one scroll listener per card. Text remains visible
 * without the enhancement; only explicit page surfaces move, never reader blocks. */
export default function SiteMotion({
  root,
  route,
  paused,
}: {
  root: RefObject<HTMLElement | null>;
  route: string;
  paused: boolean;
}) {
  useGSAP(
    () => {
      const page = root.current;
      if (!page || paused || typeof IntersectionObserver === 'undefined') return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', (context) => {
        const seen = new WeakSet<Element>();
        const pending = new Set<Element>();
        const reveal = context.add('reveal', (elements: Element[]) => {
          const groups = new Map<string, Element[]>();
          for (const element of elements) {
            const kind =
              element.matches('h1') || element.getAttribute('data-page-enter') === 'heading'
                ? 'heading'
                : 'content';
            const group = groups.get(kind) || [];
            group.push(element);
            groups.set(kind, group);
          }
          for (const [kind, targets] of groups) {
            gsap.from(targets, {
              y: kind === 'heading' ? 12 : 8,
              opacity: 0.78,
              duration: kind === 'heading' ? 0.42 : 0.3,
              stagger: { amount: Math.min(0.12, (targets.length - 1) * 0.035) },
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity',
            });
          }
        });
        const observer = new IntersectionObserver(
          (entries) => {
            const visible: Element[] = [];
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              observer.unobserve(entry.target);
              pending.delete(entry.target);
              // Navigation anchors and a focused form must not move under input.
              if (!location.hash && !entry.target.contains(document.activeElement))
                visible.push(entry.target);
            }
            if (visible.length) reveal(visible);
          },
          { threshold: 0.01, rootMargin: '0px 0px -24px 0px' },
        );
        const collect = (parent: Element, includeSelf = true) => {
          const candidates = [...parent.querySelectorAll(TARGETS)];
          if (includeSelf && parent.matches(TARGETS)) candidates.unshift(parent);
          for (const element of candidates) {
            if (
              seen.has(element) ||
              element.closest('[data-motion-local], [contenteditable="true"]') ||
              element.parentElement?.closest('[data-page-enter]')
            )
              continue;
            seen.add(element);
            pending.add(element);
            observer.observe(element);
          }
        };
        collect(page, false);
        // Lazy routes, filtered lists and newly opened panels arrive after mount.
        // Inspect only added subtrees; do not rescan the whole catalogue on typing.
        const changes = new MutationObserver((records) => {
          for (const record of records) {
            for (const added of record.addedNodes) if (added instanceof Element) collect(added);
          }
          for (const element of pending) {
            if (!page.contains(element)) {
              observer.unobserve(element);
              pending.delete(element);
            }
          }
        });
        changes.observe(page, { childList: true, subtree: true });
        return () => {
          changes.disconnect();
          observer.disconnect();
          pending.clear();
        };
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [route, paused], revertOnUpdate: true },
  );
  return null;
}
