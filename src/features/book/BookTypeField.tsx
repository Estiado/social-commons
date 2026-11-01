import { useEffect, useRef, useState } from 'react';
import { registerMistSnapshot } from './mistSnapshot';
import type { TypeFieldScene } from './typeFieldScene';

export function BookTypeField() {
  const canvas = useRef<HTMLCanvasElement>(null),
    owner = useRef<TypeFieldScene | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) owner.current?.pause();
    else owner.current?.resume();
  }, [paused]);
  useEffect(() => {
    const element = canvas.current!,
      root = element.closest<HTMLElement>('.book-contents')!;
    let cancelled = false,
      unregister = () => {},
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
    void import('./typeFieldScene')
      .then((m) => {
        if (cancelled) throw new Error('Cancelled scene');
        return m.createTypeFieldScene(element, () => !cancelled);
      })
      .then((scene) => {
        if (cancelled) {
          scene.dispose();
          return;
        }
        owner.current = scene;
        if (pausedRef.current) scene.pause();
        (element as HTMLCanvasElement & { typeScene?: TypeFieldScene }).typeScene = scene;
        element.dataset.bookMistState = 'ready';
        element.classList.add('has-type-scene');
        unregister = registerMistSnapshot(element, () => scene.capture());
      })
      .catch(() => {
        if (!cancelled) element.dataset.bookMistState = 'fallback';
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      unregister();
      owner.current?.dispose();
      owner.current = null;
      delete (element as HTMLCanvasElement & { typeScene?: TypeFieldScene }).typeScene;
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', pointerLeave);
      root.removeEventListener('pointerdown', down);
      root.removeEventListener('pointerup', up);
      root.removeEventListener('pointercancel', cancel);
    };
  }, []);
  return (
    <>
      <div className="book-landscape book-type-landscape" aria-hidden="true">
        <img
          className="book-type-poster"
          src="/type-study/materials/type-home-static.webp"
          alt=""
        />
        <canvas
          className="book-mist book-type-canvas"
          ref={canvas}
          data-book-mist-state="pending"
        />
      </div>
      <button
        className="book-mist-control type-motion-control"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((v) => !v)}
      >
        {paused ? '继续动效' : '暂停动效'}
      </button>
    </>
  );
}
