import { useEffect, useRef, useState } from 'react';
import { fogFragment } from './fogShader';
import { createCloudFlow } from './cloudFlow';

/** A low sea of mist above the book, with a bounded GPU flow field and a static fallback. */
export function BookMist() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const pausedRef = useRef(paused);
  const controls = useRef<{ resume: () => void } | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, dx: 0, dy: 0, inside: false });
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setPaused(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    pausedRef.current = paused;
    controls.current?.resume();
  }, [paused]);
  useEffect(() => {
    const element = canvas.current!;
    const scene = element.closest<HTMLElement>('.book-contents')!;
    const gl = element.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, code: string) => {
      const shader = gl.createShader(type)!;
      shaders.push(shader);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      'attribute vec2 position; varying mediump vec2 uv; void main(){uv=(position+1.)*.5;gl_Position=vec4(position,0.,1.);}',
    );
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fogFragment));
    gl.bindAttribLocation(program, 0, 'position');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const flow = createCloudFlow(gl, vertex);
    if (!flow) {
      gl.deleteBuffer(buffer);
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    element.classList.add('has-webgl');
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const time = uniform('iTime'),
      resolution = uniform('iResolution'),
      aspect = uniform('iAspect');
    gl.useProgram(program);
    gl.uniform1i(uniform('iFlow'), 1);
    let frame = 0,
      visible = true,
      previous = -Infinity,
      elapsed = 12;
    let rect = element.getBoundingClientRect();
    const draw = (now: number) => {
      frame = 0;
      if (now - previous >= 1000 / 24) {
        const dt = Number.isFinite(previous) ? Math.min(2, (now - previous) / (1000 / 24)) : 1;
        previous = now;
        const input = pointer.current;
        if (!pausedRef.current) {
          elapsed += dt * 0.041;
          const dx = Math.max(-0.025, Math.min(0.025, input.dx * 0.65));
          const dy = Math.max(-0.025, Math.min(0.025, input.dy * 0.65));
          flow.step(input.x, input.y, dx, dy, rect.width / rect.height, dt);
          input.dx *= 0.12;
          input.dy *= 0.12;
        }
        gl.useProgram(program);
        gl.viewport(0, 0, element.width, element.height);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, flow.texture);
        gl.uniform1f(time, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (!pausedRef.current && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden) draw(performance.now());
    };
    controls.current = { resume };
    const updateRect = () => {
      rect = element.getBoundingClientRect();
    };
    const move = (event: PointerEvent) => {
      if (pausedRef.current) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const input = pointer.current;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        input.inside = false;
        return;
      }
      if (input.inside) {
        input.dx += x - input.x;
        input.dy += y - input.y;
      }
      input.x = x;
      input.y = y;
      input.inside = true;
    };
    const leave = () => {
      pointer.current.inside = false;
    };
    scene.addEventListener('pointermove', move, { passive: true });
    scene.addEventListener('pointerleave', leave, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });
    const resize = new ResizeObserver(() => {
      updateRect();
      element.width = Math.max(1, Math.min(640, Math.round(rect.width * 0.6)));
      element.height = Math.max(1, Math.min(256, Math.round(rect.height * 0.6)));
      gl.useProgram(program);
      gl.uniform2f(resolution, element.width, element.height);
      gl.uniform1f(aspect, rect.width / rect.height);
      previous = -Infinity;
      resume();
    });
    resize.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    intersection.observe(element);
    document.addEventListener('visibilitychange', resume);
    const lost = () => {
      visible = false;
      cancelAnimationFrame(frame);
      element.classList.remove('has-webgl');
    };
    element.addEventListener('webglcontextlost', lost);
    return () => {
      controls.current = null;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', updateRect);
      document.removeEventListener('visibilitychange', resume);
      element.removeEventListener('webglcontextlost', lost);
      element.classList.remove('has-webgl');
      flow.dispose();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, []);
  return (
    <>
      <canvas ref={canvas} className="book-mist" aria-hidden="true" />
      <button
        className="book-mist-control"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? '启动云雾' : '暂停云雾'}
      </button>
    </>
  );
}
