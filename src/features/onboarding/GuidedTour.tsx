import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, MousePointer2, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { markTourSeen } from './preferences';
import { TOUR_STEPS } from './steps';
import './tour.css';

gsap.registerPlugin(ScrollToPlugin, useGSAP);
// Keep this aligned with Layout's xl navigation breakpoint.
const DESKTOP_NAVIGATION_WIDTH = 1280;
interface FocusRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function GuidedTour({
  onClose,
  onMenuChange,
}: {
  onClose(): void;
  onMenuChange(open: boolean): void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [index, setIndex] = useState(-1);
  const [focus, setFocus] = useState<{
    key: string;
    rect: FocusRect | null;
    waiting: boolean;
  } | null>(null);
  const [retry, setRetry] = useState(0);
  const maskId = 'tour-' + useId().replace(/:/g, '');
  const step = TOUR_STEPS[index];
  const focusKey = `${index}:${retry}:${location.pathname}`;
  const rect = focus?.key === focusKey ? focus.rect : null;
  const waiting = focus?.key === focusKey && focus.waiting;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const close = () => {
    try {
      markTourSeen(localStorage);
    } catch {
      /* Storage may be disabled. */
    }
    onMenuChange(false);
    onClose();
  };

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const shells = [...document.querySelectorAll<HTMLElement>('[data-tour-shell]')];
    const states = shells.map((element) => element.inert);
    shells.forEach((element) => {
      element.inert = true;
    });
    return () => {
      shells.forEach((element, position) => {
        element.inert = states[position];
      });
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!step) return;
    onMenuChange(step.target.startsWith('nav-') && window.innerWidth < DESKTOP_NAVIGATION_WIDTH);
    if (location.pathname !== step.path) navigate(step.path, { replace: true });
  }, [step, location.pathname, navigate, onMenuChange]);

  useEffect(() => {
    if (!step || location.pathname !== step.path) return;
    let target: HTMLElement | undefined;
    let tween: gsap.core.Tween | undefined;
    let frame = 0;
    const measure = () => {
      if (!target?.isConnected) return;
      const bounds = target.getBoundingClientRect();
      const top = Math.max(8, bounds.top - 8);
      setFocus({
        key: focusKey,
        waiting: false,
        rect: {
          left: Math.max(8, bounds.left - 8),
          top,
          width: Math.min(bounds.width + 16, window.innerWidth - 16),
          height: Math.max(24, Math.min(bounds.height + 16, window.innerHeight - top - 275)),
        },
      });
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const find = () => {
      // Open the disclosure before measuring its otherwise hidden contents.
      if (step.expandBackup)
        document.querySelector<HTMLDetailsElement>('#reading-backup')?.setAttribute('open', '');
      const visible = [
        ...document.querySelectorAll<HTMLElement>(`[data-tour="${step.target}"]`),
      ].find((element) => element.getClientRects().length > 0);
      if (!visible || visible === target) return;
      target = visible;
      tween?.kill();
      tween = gsap.to(window, {
        scrollTo: {
          y: step.target.startsWith('nav-') ? 0 : visible,
          offsetY: step.target.startsWith('nav-') ? 0 : 108,
          autoKill: true,
        },
        duration: reduced ? 0 : 0.65,
        ease: 'power2.inOut',
        onUpdate: refresh,
        onComplete: measure,
      });
      refresh();
    };
    const observer = new MutationObserver(find);
    observer.observe(document.body, { childList: true, subtree: true });
    find();
    const timeout = window.setTimeout(() => {
      if (!target) setFocus({ key: focusKey, rect: null, waiting: true });
    }, 7000);
    const resize = () => {
      onMenuChange(step.target.startsWith('nav-') && window.innerWidth < DESKTOP_NAVIGATION_WIDTH);
      target = undefined;
      find();
    };
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      // Preserve the current viewport when a step ends; reverting the scroll
      // would jump back before the next step can move to its target.
      tween?.kill();
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', resize);
    };
  }, [step, location.pathname, focusKey, onMenuChange, reduced]);

  useGSAP(
    () => {
      if (!panel.current) return;
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: reduced ? 0 : 12 },
        { opacity: 1, y: 0, duration: reduced ? 0 : 0.3, ease: 'power2.out' },
      );
      heading.current?.focus({ preventScroll: true });
    },
    { dependencies: [index], scope: panel, revertOnUpdate: true },
  );

  return createPortal(
    <div
      className="guided-tour fixed inset-0 z-[100]"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
        }
        if (event.key !== 'Tab') return;
        const controls = [
          ...panel.current!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
        ];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === heading.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <svg aria-hidden="true" className="pointer-events-auto absolute inset-0 h-full w-full">
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            {rect && <rect {...rect} x={rect.left} y={rect.top} rx="10" fill="black" />}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(22,25,28,.60)" mask={`url(#${maskId})`} />
      </svg>
      {rect && (
        <div
          aria-hidden="true"
          className="tour-focus pointer-events-none absolute rounded-lg border-2 border-amber-200"
          style={rect}
        />
      )}
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
        className={`tour-panel absolute max-h-[calc(100dvh-32px)] overflow-auto rounded-xl border bg-background p-5 shadow-2xl sm:p-6 ${index < 0 ? 'tour-welcome' : 'tour-tip'}`}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-xs font-medium tracking-wide text-accent">
            {step ? `${step.chapter} · ${index + 1} / ${TOUR_STEPS.length}` : '欢迎来到社科通识'}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="关闭使用指引"
            className="rounded-sm p-1 text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        {index < 0 && (
          <div
            aria-hidden="true"
            className="tour-illustration mb-5 flex items-center justify-center gap-5 rounded-lg bg-muted/50 py-7 text-accent"
          >
            <BookOpen size={29} />
            <ArrowRight size={18} />
            <MousePointer2 size={29} />
            <ArrowRight size={18} />
            <Check size={29} />
          </div>
        )}
        <h2
          ref={heading}
          tabIndex={-1}
          id="tour-title"
          className="mb-3 font-serif text-xl font-semibold leading-snug outline-none"
        >
          {step?.title || '跟着页面走一遍，就知道怎么用'}
        </h2>
        <p id="tour-description" className="text-sm leading-relaxed text-muted-foreground">
          {step?.description ||
            '我们会从首页向下浏览，进入群鉴、阅读空间和议论文素材，再认识顶部导航与内测反馈。大约两三分钟，可以随时跳过，也能在页脚重新打开。'}
        </p>
        {waiting && (
          <p role="status" className="mt-3 text-xs text-accent">
            页面还未准备好。
            <button className="ml-1 underline" onClick={() => setRetry((value) => value + 1)}>
              重试定位
            </button>
            ，或继续下一步。
          </p>
        )}
        {step && (
          <div aria-hidden="true" className="mt-5 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${((index + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {index < 0 ? (
            <Button variant="ghost" onClick={close}>
              先自己看看
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIndex((value) => Math.max(-1, value - 1))}
            >
              <ArrowLeft size={15} />
              上一步
            </Button>
          )}
          <Button
            onClick={() =>
              index === TOUR_STEPS.length - 1 ? close() : setIndex((value) => value + 1)
            }
          >
            {index < 0 ? '开始浏览' : step.nextLabel || '下一步'}
            {index < 0 ? <ArrowDown size={16} /> : <ArrowRight size={16} />}
          </Button>
        </div>
        {step && (
          <button
            onClick={close}
            className="mt-3 w-full py-1 text-center text-xs text-muted-foreground underline underline-offset-4"
          >
            跳过剩余指引
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
