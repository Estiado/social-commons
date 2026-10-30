import { paperIndices, paperMesh } from './paperMesh';

// Original renderer; the unlicensed visual reference's source is not used.
const vertex = `attribute vec3 position; attribute vec3 normal; attribute vec2 uv;
uniform float aspect;
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main(){
 vUv=uv; vNormal=normal; vPosition=position;
 float perspective=1.-position.z/4.5;
 gl_Position=vec4(position.x,position.y*2./aspect,-position.z*.15,perspective);
}`;
const fragment = `precision mediump float;
uniform sampler2D source; uniform sampler2D destination;
uniform float progress; uniform float mode; uniform float direction;
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main(){
 vec2 uv=vUv;
 if(mode<.5){gl_FragColor=texture2D(destination,uv);return;}
 if(mode<1.5){
   float side=direction>0.?1.-step(.5,uv.x):step(.5,uv.x);
   // The old left page stays opaque until the moving sheet physically covers it.
   // Cross-fading two text pages here creates the doubled headings the user rejected.
   gl_FragColor=vec4(texture2D(source,uv).rgb,side);return;
 }
 if(mode>2.5){
   float center=.5+direction*cos(progress*3.14159265)*.18;
   float shadow=exp(-pow((uv.x-center)/(.035+.12*sin(progress*3.14159265)),2.));
   gl_FragColor=vec4(.26,.24,.19,shadow*.20*sin(progress*3.14159265));return;
 }
 bool front=gl_FrontFacing==(direction>0.);
 vec2 faceUv=vec2(.5+direction*.5*uv.x,uv.y);
 vec2 backUv=vec2(.5-direction*.5*uv.x,uv.y);
 vec3 color=front?texture2D(source,faceUv).rgb:texture2D(destination,backUv).rgb;
 vec3 n=normalize(vNormal)*(front?1.:-1.);
 float diffuse=abs(dot(n,normalize(vec3(-.5,.6,1.3))));
 float light=.77+.23*diffuse;
 float crease=exp(-uv.x*22.)*.07*sin(progress*3.14159265);
 float rim=smoothstep(.991,1.,uv.x)*.075;
 gl_FragColor=vec4(color*(light-crease-rim),1.);
}`;

export function createPaperTurn(
  frame: HTMLElement,
  sourceImage: HTMLCanvasElement,
  bounds: DOMRect,
  direction = 1,
) {
  const canvas = document.createElement('canvas');
  canvas.className = 'book-paper-canvas';
  const ratio = Math.min(devicePixelRatio || 1, 1.5, 1800 / bounds.width);
  canvas.width = Math.round(bounds.width * ratio);
  canvas.height = Math.round(bounds.height * ratio);
  frame.append(canvas);
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: true,
    powerPreference: 'low-power',
  });
  if (!gl) {
    canvas.remove();
    return null;
  }
  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const textures: WebGLTexture[] = [];
  const program = gl.createProgram()!;
  const destroy = () => {
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    textures.forEach((texture) => gl.deleteTexture(texture));
    shaders.forEach((shader) => gl.deleteShader(shader));
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
    destroy();
    throw new Error(reason || 'Paper shader could not compile');
  }
  gl.useProgram(program);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const texture = (image: HTMLCanvasElement, unit: number) => {
    const value = gl.createTexture()!;
    textures.push(value);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, value);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return value;
  };
  texture(sourceImage, 0);
  const destination = texture(sourceImage, 1);
  gl.uniform1i(uniform('source'), 0);
  gl.uniform1i(uniform('destination'), 1);
  gl.uniform1f(uniform('direction'), direction);
  const aspect = bounds.height / (bounds.width / 2);
  gl.uniform1f(uniform('aspect'), aspect);
  const dynamic = gl.createBuffer()!;
  buffers.push(dynamic);
  const flat = gl.createBuffer()!;
  buffers.push(flat);
  gl.bindBuffer(gl.ARRAY_BUFFER, flat);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,
      aspect / 2,
      0,
      0,
      0,
      1,
      0,
      0,
      -1,
      -aspect / 2,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      aspect / 2,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      -aspect / 2,
      0,
      0,
      0,
      1,
      1,
      1,
    ]),
    gl.STATIC_DRAW,
  );
  const indices = paperIndices();
  const indexBuffer = gl.createBuffer()!;
  buffers.push(indexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  const attributes = [
    ['position', 3, 0],
    ['normal', 3, 12],
    ['uv', 2, 24],
  ] as const;
  const bind = (buffer: WebGLBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const [name, size, offset] of attributes) {
      const location = gl.getAttribLocation(program, name);
      if (location < 0) continue;
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 32, offset);
    }
  };
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  let disposed = false;
  return {
    canvas,
    setDestination(image: HTMLCanvasElement) {
      if (disposed) return;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, destination);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    },
    draw(progress: number) {
      if (disposed) return;
      canvas.dataset.progress = progress.toFixed(3);
      gl.clearColor(0.953, 0.941, 0.91, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uniform('progress'), progress);
      bind(flat);
      for (const mode of [0, 1, 3]) {
        gl.uniform1f(uniform('mode'), mode);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      bind(dynamic);
      gl.bufferData(gl.ARRAY_BUFFER, paperMesh(progress, aspect, direction), gl.DYNAMIC_DRAW);
      gl.uniform1f(uniform('mode'), 2);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.disable(gl.DEPTH_TEST);
    },
    dispose() {
      if (!disposed) {
        disposed = true;
        destroy();
      }
    },
  };
}
