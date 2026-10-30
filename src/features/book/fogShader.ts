/** Vanta CLOUDS noise/volume lighting adapted from fixed ref
 * f8b351906688b56f0fc744e53bde81fc3c56f150. MIT; public/book/licenses/VANTA.txt.
 * New camera looks down a shallow cloud sea above the book, rather than at a cloud wall.
 * Pointer flow is independently advected in cloudFlow.ts. Ink retains at least 48% visibility.
 */
export const fogFragment = `precision highp float;
uniform vec2 iResolution;
uniform float iAspect;
uniform float iTime;
uniform sampler2D iFlow;
float hash(float p){p=fract(p*.011);p*=p+7.5;p*=p+p;return fract(p);}
float noise(vec3 x){
 vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.-2.*f);
 float n=p.x+p.y*57.+113.*p.z;
 return mix(mix(mix(hash(n),hash(n+1.),f.x),mix(hash(n+57.),hash(n+58.),f.x),f.y),
 mix(mix(hash(n+113.),hash(n+114.),f.x),mix(hash(n+170.),hash(n+171.),f.x),f.y),f.z);
}
float density(vec3 p){
 vec3 q=p*vec3(1.25,1.7,.9)+vec3(iTime*.055,0.,-iTime*.08);
 float f=.5*noise(q)+.25*noise(q*2.02)+.125*noise(q*4.1);
 float cloudTop=.2+.9*smoothstep(.16,.67,f);
 float lanes=.3+.7*smoothstep(.16,.7,noise(vec3(p.x*.45,2.7,p.z*.42)));
 return clamp((cloudTop-p.y)*1.65,0.,1.)*lanes;
}
void main(){
 vec2 uv=gl_FragCoord.xy/iResolution;
 vec4 field=texture2D(iFlow,uv);
 vec2 flow=(field.rg-vec2(128./255.))*.08;
 vec3 ro=vec3(0.,2.2,4.8);
 vec3 ray=normalize(vec3((uv.x-.5)*iAspect*.92,-.28-(1.-uv.y)*.9,-1.45));
 float entry=(ro.y-1.08)/(-ray.y);
 float stepLength=1.04/(-ray.y)/24.;
 vec4 sum=vec4(0.);
 vec3 sun=normalize(vec3(-.9,.45,.5));
 for(int i=0;i<24;i++){
   vec3 p=ro+ray*(entry+(float(i)+.5)*stepLength);
   p.xz+=vec2(flow.x,-flow.y)*20.;
   float den=density(p)*(1.-field.b*.82);
   if(den>.01){
     float dif=clamp((den-density(p+sun*.24))/.6,0.,1.);
     vec3 col=mix(vec3(1.,.992,.968),vec3(.56,.63,.61),den*.78);
     col*=.9+.18*dif;
     float alpha=den*.16;
     sum.rgb+=(1.-sum.a)*col*alpha;sum.a+=(1.-sum.a)*alpha;
   }
 }
 float horizon=smoothstep(0.,.15,1.-uv.y);
 float alpha=min(sum.a,.69)*horizon;
 gl_FragColor=vec4(sum.rgb/max(sum.a,.001),alpha);
}`;
