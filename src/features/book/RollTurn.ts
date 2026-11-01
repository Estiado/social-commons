import { rollIndices, rollMesh } from './rollGeometry';

const vertex = `attribute vec3 position; attribute vec3 normal; attribute vec2 uv;
uniform float aspect; uniform float sheetAspect; uniform mediump float mode; uniform vec4 sheetFrame;
varying vec2 vUv; varying vec3 vNormal;
void main(){vUv=uv;vNormal=normal;
 if(mode<.5){gl_Position=vec4(position.x,position.y/aspect,0.,1.);}
 else {gl_Position=vec4(position.x*sheetFrame.z+sheetFrame.x,
 position.y/sheetAspect*sheetFrame.w+sheetFrame.y,-position.z*.5,1.);}}`;
const fragment = `precision mediump float;
uniform sampler2D source; uniform sampler2D destination; uniform float mode;
uniform vec4 sheetUv;
uniform sampler2D silhouette; uniform float masked; uniform vec4 maskBounds;
uniform float direction; varying vec2 vUv; varying vec3 vNormal;
void main(){
 if(mode<.5){gl_FragColor=texture2D(destination,vUv);return;}
 vec3 n=normalize(vNormal);float turn=1.-abs(n.z);
 vec2 sourceUv=sheetUv.xy+vUv*sheetUv.zw;
 float alpha=1.;
 if(masked>.5){
   vec2 mu=(sourceUv-maskBounds.xy)/maskBounds.zw;
   if(min(mu.x,mu.y)<0.||max(mu.x,mu.y)>1.)discard;
   alpha=texture2D(silhouette,mu).a;if(alpha<.03)discard;
 }
 vec3 ink=texture2D(source,sourceUv).rgb;
 if(gl_FrontFacing!=(direction>0.))ink=mix(ink,vec3(.975,.962,.927),.9);
 float shade=1.-turn*.19+n.x*.025;
 gl_FragColor=vec4(ink*shade,alpha);
}`;

/** One complete route surface, with a rolling edge; no half-page UV maps or clipped main boxes. */
export function createRollTurn(
  frame: HTMLElement,
  image: HTMLCanvasElement,
  bounds: DOMRect,
  direction: number,
  mask?: { image: HTMLImageElement; bounds: DOMRect },
) {
  const canvas = document.createElement('canvas');
  canvas.className = 'book-paper-canvas';
  canvas.width = image.width;
  canvas.height = image.height;
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [],
    buffers: WebGLBuffer[] = [],
    textures: WebGLTexture[] = [];
  const program = gl.createProgram()!;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    buffers.forEach((b) => gl.deleteBuffer(b));
    textures.forEach((t) => gl.deleteTexture(t));
    shaders.forEach((s) => gl.deleteShader(s));
    gl.deleteProgram(program);
    canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  for (const [type, code] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!;
    shaders.push(shader);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const reason = gl.getProgramInfoLog(program);
    dispose();
    throw new Error(reason || 'Roll shader failed');
  }
  gl.useProgram(program);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const texture = (unit: number, pixels: HTMLCanvasElement | HTMLImageElement = image) => {
    const value = gl.createTexture()!;
    textures.push(value);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, value);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return value;
  };
  texture(0);
  const destination = texture(1);
  const silhouette = document.createElement('canvas');
  silhouette.width = mask ? 1024 : 1;
  silhouette.height = mask
    ? Math.round((1024 * mask.image.naturalHeight) / mask.image.naturalWidth)
    : 1;
  const paint = silhouette.getContext('2d')!;
  if (mask) paint.drawImage(mask.image, 0, 0, silhouette.width, silhouette.height);
  else paint.fillRect(0, 0, 1, 1);
  texture(2, silhouette);
  gl.uniform1i(uniform('source'), 0);
  gl.uniform1i(uniform('destination'), 1);
  gl.uniform1i(uniform('silhouette'), 2);
  gl.uniform1f(uniform('masked'), mask ? 1 : 0);
  if (mask)
    gl.uniform4f(
      uniform('maskBounds'),
      mask.bounds.left / bounds.width,
      mask.bounds.top / bounds.height,
      mask.bounds.width / bounds.width,
      mask.bounds.height / bounds.height,
    );
  gl.uniform1f(uniform('direction'), direction);
  const aspect = bounds.height / bounds.width;
  gl.uniform1f(uniform('aspect'), aspect);
  let sheetAspect = aspect;
  const setSheet = (rect: DOMRect) => {
    sheetAspect = rect.height / rect.width;
    gl.uniform1f(uniform('sheetAspect'), sheetAspect);
    gl.uniform4f(
      uniform('sheetFrame'),
      ((rect.left + rect.width / 2) / bounds.width) * 2 - 1,
      1 - ((rect.top + rect.height / 2) / bounds.height) * 2,
      rect.width / bounds.width,
      rect.height / bounds.height,
    );
    gl.uniform4f(
      uniform('sheetUv'),
      rect.left / bounds.width,
      rect.top / bounds.height,
      rect.width / bounds.width,
      rect.height / bounds.height,
    );
  };
  setSheet(bounds);
  const flat = gl.createBuffer()!,
    moving = gl.createBuffer()!,
    index = gl.createBuffer()!;
  buffers.push(flat, moving, index);
  gl.bindBuffer(gl.ARRAY_BUFFER, flat);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,
      aspect,
      0,
      0,
      0,
      1,
      0,
      0,
      -1,
      -aspect,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      aspect,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      -aspect,
      0,
      0,
      0,
      1,
      1,
      1,
    ]),
    gl.STATIC_DRAW,
  );
  const indices = rollIndices();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  const bind = (buffer: WebGLBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const [name, size, offset] of [
      ['position', 3, 0],
      ['normal', 3, 12],
      ['uv', 2, 24],
    ] as const) {
      const at = gl.getAttribLocation(program, name);
      if (at < 0) continue;
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, size, gl.FLOAT, false, 32, offset);
    }
  };
  frame.append(canvas);
  return {
    canvas,
    dispose,
    setSheet,
    setDestination(next: HTMLCanvasElement) {
      if (disposed) return;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, destination);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, next);
    },
    draw(progress: number) {
      if (disposed) return;
      canvas.dataset.progress = progress.toFixed(3);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.953, 0.941, 0.91, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      bind(flat);
      gl.uniform1f(uniform('mode'), 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      bind(moving);
      gl.bufferData(gl.ARRAY_BUFFER, rollMesh(progress, sheetAspect, direction), gl.DYNAMIC_DRAW);
      gl.uniform1f(uniform('mode'), 1);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
    },
  };
}
