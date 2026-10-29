import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** New pages start at their heading; Back restores the previous reading position.
 * Lazy routes may arrive after the layout, so restoration observes boundedly.
 * Hash navigation and the guided tour retain control of their own positioning. */
export function RouteArrival({ paused }: { paused: boolean }) {
  const location = useLocation();
  const navigation = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const previousPath = useRef('');
  useLayoutEffect(() => {
    if (paused) return;
    const newPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const restore = positions.current.get(location.key);
    let pending = navigation === 'POP' && restore !== undefined;
    let focusPending = newPage && navigation !== 'POP' && !location.hash;
    const apply = () => {
      const heading = document.querySelector<HTMLElement>('main h1');
      if (heading) {
        document.title = `${heading.textContent?.trim()} · 社科通识`;
        if (focusPending && !document.querySelector('[aria-modal="true"]')) {
          document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
          focusPending = false;
        }
      }
      if (!location.hash && pending) {
        window.scrollTo({ top: restore!, behavior: 'instant' });
        if (Math.abs(window.scrollY - restore!) < 2) pending = false;
      }
    };
    if (newPage && !location.hash && navigation !== 'POP')
      window.scrollTo({ top: 0, behavior: 'instant' });
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.querySelector('main') || document.body, {
      childList: true,
      subtree: true,
    });
    const timer = window.setTimeout(() => observer.disconnect(), 5000);
    const cancel = () => {
      pending = false;
      observer.disconnect();
    };
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });
    const savedPositions = positions.current;
    return () => {
      savedPositions.set(location.key, window.scrollY);
      // Keep the session bounded even during long browsing sessions.
      if (savedPositions.size > 100) savedPositions.delete(savedPositions.keys().next().value!);
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      history.scrollRestoration = previous;
    };
  }, [location.key, location.hash, location.pathname, navigation, paused]);
  return null;
}
