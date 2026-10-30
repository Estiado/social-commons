import { useEffect, useRef, useState } from 'react';
import { fogFragment } from './fogShader';

/** Vanta CLOUDS volume, bounded to a small canvas. Background image is the static WebGL fallback. */
export function BookMist() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setPaused(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const element = canvas.current!;
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
    const program = gl.createProgram()!;
    gl.attachShader(
      program,
      compile(
        gl.VERTEX_SHADER,
        'attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}',
      ),
    );
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fogFragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    element.classList.add('has-webgl');
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const time = uniform('iTime');
    const resolution = uniform('iResolution');
    let frame = 0;
    let visible = true;
    let previous = -Infinity;
    const draw = (now: number) => {
      frame = 0;
      if (now - previous >= 1000 / 24) {
        previous = now;
        gl.uniform1f(time, now * 0.00012);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (!paused && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden) draw(performance.now());
    };
    const resize = new ResizeObserver(([entry]) => {
      element.width = Math.max(1, Math.min(640, Math.round(entry.contentRect.width * 0.6)));
      element.height = Math.max(1, Math.min(190, Math.round(entry.contentRect.height * 0.6)));
      gl.viewport(0, 0, element.width, element.height);
      gl.uniform2f(resolution, element.width, element.height);
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
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', resume);
      element.classList.remove('has-webgl');
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, [paused]);
  return (
    <>
      <canvas ref={canvas} className="book-mist" aria-hidden="true" />
      <button
        className="book-mist-control"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? '启动云雾' : '暂停云雾'}
      </button>
    </>
  );
}
