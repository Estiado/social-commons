// Bounded semi-Lagrangian velocity advection with a pointer impulse and local vorticity.
// RG stores signed velocity; B stores the displaced mist. No per-pointer React updates.
const flowFragment = `precision mediump float;
uniform sampler2D field;
uniform vec2 texel;
uniform vec2 pointer;
uniform vec2 impulse;
uniform float aspect;
uniform float stepTime;
varying mediump vec2 uv;
vec2 velocity(vec2 value){return (value-vec2(128./255.))*.08;}
void main(){
 vec2 current=velocity(texture2D(field,uv).rg);
 vec2 back=clamp(uv-current*stepTime,texel,1.-texel);
 vec4 sampleValue=texture2D(field,back);
 vec2 speed=velocity(sampleValue.rg);
 vec2 neighbors=velocity(texture2D(field,back+vec2(texel.x,0.)).rg)
  +velocity(texture2D(field,back-vec2(texel.x,0.)).rg)
  +velocity(texture2D(field,back+vec2(0.,texel.y)).rg)
  +velocity(texture2D(field,back-vec2(0.,texel.y)).rg);
 speed=mix(speed,neighbors*.25,.1)*pow(.95,stepTime);
 // Constant sub-texel friction avoids an RGBA8 velocity getting stuck at its last quantized bit.
 speed=sign(speed)*max(abs(speed)-vec2(.00017*stepTime),vec2(0.));
 vec2 delta=uv-pointer;delta.x*=aspect;
 float brush=exp(-dot(delta,delta)/.025);
 float energy=length(impulse);
 vec2 curl=vec2(-delta.y,delta.x/aspect)*energy*3.5;
 speed+=(impulse*1.4+curl)*brush;
 speed=clamp(speed,vec2(-.028),vec2(.028));
 float displaced=clamp(sampleValue.b*pow(.962,stepTime)-.0022*stepTime+brush*energy*24.,0.,1.);
 gl_FragColor=vec4(speed/.08+vec2(128./255.),displaced,1.);
}`;

export function createCloudFlow(gl: WebGLRenderingContext, vertex: WebGLShader) {
  const width = 160,
    height = 96;
  const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(shader, flowFragment);
  gl.compileShader(shader);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, shader);
  gl.bindAttribLocation(program, 0, 'position');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(shader);
    return null;
  }
  const textures: WebGLTexture[] = [];
  const frames: WebGLFramebuffer[] = [];
  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 128;
    pixels[i + 1] = 128;
    pixels[i + 3] = 255;
  }
  for (let i = 0; i < 2; i++) {
    const texture = gl.createTexture()!;
    textures.push(texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const frame = gl.createFramebuffer()!;
    frames.push(frame);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  let current = 0;
  return {
    get texture() {
      return textures[current];
    },
    step(x: number, y: number, dx: number, dy: number, aspect: number, dt: number) {
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[current]);
      gl.bindFramebuffer(gl.FRAMEBUFFER, frames[1 - current]);
      gl.viewport(0, 0, width, height);
      gl.uniform1i(uniform('field'), 0);
      gl.uniform2f(uniform('texel'), 1 / width, 1 / height);
      gl.uniform2f(uniform('pointer'), x, y);
      gl.uniform2f(uniform('impulse'), dx, dy);
      gl.uniform1f(uniform('aspect'), aspect);
      gl.uniform1f(uniform('stepTime'), dt);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      current = 1 - current;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    dispose() {
      textures.forEach((value) => gl.deleteTexture(value));
      frames.forEach((value) => gl.deleteFramebuffer(value));
      gl.deleteProgram(program);
      gl.deleteShader(shader);
    },
  };
}
