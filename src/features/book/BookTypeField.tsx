import { useEffect, useRef, useState } from 'react';
import type { TypeFieldScene } from './typeFieldScene';

const reducedMotion = '(prefers-reduced-motion: reduce)';

export function BookTypeField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const owner = useRef<TypeFieldScene | null>(null);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState<'pending' | 'ready' | 'fallback'>('pending');
  const [reduced, setReduced] = useState(() => matchMedia(reducedMotion).matches);
  const pausedRef = useRef(false);

  useEffect(() => {
    const preference = matchMedia(reducedMotion);
    const update = () => {
      if (preference.matches) setStatus('pending');
      setReduced(preference.matches);
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) owner.current?.pause();
    else owner.current?.resume();
  }, [paused]);
  useEffect(() => {
    if (reduced) return;
    const element = canvas.current!,
      root = element.closest<HTMLElement>('.book-contents')!;
    let cancelled = false,
      touch: { x: number; y: number } | undefined,
      timer: ReturnType<typeof setTimeout> | undefined;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || (event.target as HTMLElement).closest('a,button'))
        return;
      const r = element.getBoundingClientRect();
      if (event.clientY < r.top) return owner.current?.leave();
      owner.current?.point((event.clientX - r.left) / r.width, (event.clientY - r.top) / r.height);
    };
    const leave = () => owner.current?.leave();
    const pointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') leave();
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'touch') touch = { x: event.clientX, y: event.clientY };
    };
    const up = (event: PointerEvent) => {
      if (
        !touch ||
        Math.hypot(event.clientX - touch.x, event.clientY - touch.y) > 10 ||
        (event.target as HTMLElement).closest('a,button')
      ) {
        touch = undefined;
        return;
      }
      const r = element.getBoundingClientRect();
      owner.current?.point((event.clientX - r.left) / r.width, (event.clientY - r.top) / r.height);
      clearTimeout(timer);
      timer = setTimeout(leave, 700);
      touch = undefined;
    };
    const cancel = () => {
      touch = undefined;
      leave();
    };
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', pointerLeave);
    root.addEventListener('pointerdown', down, { passive: true });
    root.addEventListener('pointerup', up, { passive: true });
    root.addEventListener('pointercancel', cancel);
    const posterReady = poster.current?.decode().catch(() => {}) ?? Promise.resolve();
    void posterReady
      .then(() => (cancelled ? undefined : import('./typeFieldScene')))
      .then((m) => {
        if (m && !cancelled) return m.createTypeFieldScene(element, () => !cancelled);
      })
      .then((scene) => {
        if (!scene) return;
        if (cancelled) {
          scene.dispose();
          return;
        }
        owner.current = scene;
        if (pausedRef.current) scene.pause();
        (element as HTMLCanvasElement & { typeScene?: TypeFieldScene }).typeScene = scene;
        element.classList.add('has-type-scene');
        element.parentElement?.classList.add('has-live-type-scene');
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('fallback');
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      element.classList.remove('has-type-scene');
      element.parentElement?.classList.remove('has-live-type-scene');
      owner.current?.dispose();
      owner.current = null;
      delete (element as HTMLCanvasElement & { typeScene?: TypeFieldScene }).typeScene;
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', pointerLeave);
      root.removeEventListener('pointerdown', down);
      root.removeEventListener('pointerup', up);
      root.removeEventListener('pointercancel', cancel);
    };
  }, [reduced]);
  return (
    <>
      <div className="book-type-landscape" aria-hidden="true">
        <picture className="book-type-picture">
          <source
            media="(max-width: 700px) and (orientation: portrait)"
            srcSet="/type-study/materials/type-home-static-mobile.webp"
          />
          <img
            className="book-type-poster"
            ref={poster}
            fetchPriority="high"
            src="/type-study/materials/type-home-static.webp"
            alt=""
          />
        </picture>
        <canvas
          className="book-type-canvas"
          ref={canvas}
          data-book-mist-state={reduced ? 'static' : status}
        />
      </div>
      {!reduced && status === 'ready' && (
        <button
          className="type-motion-control"
          type="button"
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? '继续动效' : '暂停动效'}
        </button>
      )}
    </>
  );
}
