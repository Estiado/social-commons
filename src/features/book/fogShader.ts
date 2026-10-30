/** Adapted from tengbao/vanta CLOUDS noise and volumetric integration, fixed ref
 * f8b351906688b56f0fc744e53bde81fc3c56f150. MIT; public/book/licenses/VANTA.txt.
 * Changes: orthographic low cloud bank, 32 bounded steps, three noise octaves,
 * transparent sky, ivory lighting and slow drift. No Three runtime or sky backdrop.
 */
export const fogFragment = `precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
float hash(float p){p=fract(p*.011);p*=p+7.5;p*=p+p;return fract(p);}
float noise(vec3 x){
 vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.-2.*f);
 float n=p.x+p.y*57.+113.*p.z;
 return mix(mix(mix(hash(n),hash(n+1.),f.x),mix(hash(n+57.),hash(n+58.),f.x),f.y),
 mix(mix(hash(n+113.),hash(n+114.),f.x),mix(hash(n+170.),hash(n+171.),f.x),f.y),f.z);
}
float density(vec3 p){
 vec3 q=p*1.6+vec3(iTime*.16,0.,iTime*.06);
 float f=.5*noise(q)+.25*noise(q*2.02)+.125*noise(q*4.1);
 return clamp(1.5-p.y-1.1*f,0.,1.);
}
void main(){
 vec2 uv=gl_FragCoord.xy/iResolution;
 // Keep cloud size stable across wide desktops and portrait phones.
 float width=max(3.4,iResolution.x/iResolution.y*2.1);
 vec3 ro=vec3((uv.x-.5)*width,(uv.y-.28)*2.8,3.7);
 vec4 sum=vec4(0.);
 vec3 sun=normalize(vec3(-.7,1.,.5));
 for(int i=0;i<32;i++){
   vec3 p=ro+vec3(0.,0.,-float(i)*.16);
   float den=density(p);
   if(den>.015){
     float dif=clamp((den-density(p+sun*.28))/.32,0.,1.);
     vec3 col=mix(vec3(.64,.69,.67),vec3(1.,.985,.95),.38+.62*dif);
     float alpha=den*.22;
     sum.rgb+=(1.-sum.a)*col*alpha;
     sum.a+=(1.-sum.a)*alpha;
   }
   if(sum.a>.985)break;
 }
 // Straight alpha matches the canvas context and lets real book ink show through.
 gl_FragColor=vec4(sum.rgb/max(sum.a,.001),sum.a);
}`;
