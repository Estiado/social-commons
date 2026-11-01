/** Vanta CLOUDS value noise / volume lighting, fixed MIT ref
 * f8b351906688b56f0fc744e53bde81fc3c56f150; public/book/licenses/VANTA.txt.
 * Transparent sky and cool, separated mist ribbons keep the paper visible.
 * Six world-space spring masses displace the volume, not a screen-space density mask. */
export const fogFragment = `precision highp float;
uniform vec2 iResolution;
uniform float iAspect;
uniform float iTime;
uniform vec3 cloudCenters[6];
uniform vec3 cloudOffsets[6];
float hash(float p){p=fract(p*.011);p*=p+7.5;p*=p+p;return fract(p);}
float noise(vec3 x){
 vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.-2.*f);
 float n=p.x+p.y*57.+113.*p.z;
 return mix(mix(mix(hash(n),hash(n+1.),f.x),mix(hash(n+57.),hash(n+58.),f.x),f.y),
 mix(mix(hash(n+113.),hash(n+114.),f.x),mix(hash(n+170.),hash(n+171.),f.x),f.y),f.z);
}
float density(vec3 p){
 for(int i=0;i<6;i++) {
   if(dot(cloudOffsets[i],cloudOffsets[i])<.000001)continue;
   vec3 d=p-cloudCenters[i];
   float weight=exp(-dot(d*vec3(.6,.85,.6),d*vec3(.6,.85,.6)));
   p-=cloudOffsets[i]*weight;
 }
 vec3 q=p*vec3(.4,1.6,.65)-vec3(.008,0.,.012)*(iTime+1000.);
 float f=.5*noise(q);q*=2.02;
 f+=.25*noise(q);q*=2.03;f+=.125*noise(q);q*=2.01;
 f+=.0625*noise(q);
 // Finite-height layers, with air between them; density must not become a solid floor.
 float lower=exp(-pow((p.y+.23-.12*noise(q*.48))/.24,2.));
 float upper=.55*exp(-pow((p.y-.28-.1*noise(q*.37+7.))/.15,2.));
 return (lower+upper)*smoothstep(.27,.68,f)*.64;
}
void main(){
 vec2 uv=gl_FragCoord.xy/iResolution;
 vec2 p=(uv*2.-1.)*vec2(iAspect,1.);
 vec3 ro=vec3(0.,1.05,4.);
 vec3 cw=normalize(vec3(0.,-1.,0.)-ro);
 vec3 cu=vec3(1.,0.,0.);vec3 cv=normalize(cross(cu,cw));
 vec3 ray=normalize(mat3(cu,cv,cw)*vec3(p,1.65));
 vec3 sun=normalize(vec3(-1.,.35,-1.));
 vec4 sum=vec4(0.);float t=0.;
 for(int i=0;i<64;i++){
   vec3 pos=ro+t*ray;
   if(pos.y < -2.8 || sum.a>.985)break;
   float den=density(pos);
   if(den>.01){
     float dif=clamp((den-density(pos+.35*sun))/.6,0.,1.);
     vec3 col=mix(vec3(.95,.97,.98),vec3(.83,.88,.91),den*.6);
     col*=.99+dif*.09;
     float alpha=den*.24;
     sum.rgb+=(1.-sum.a)*col*alpha;sum.a+=(1.-sum.a)*alpha;
   }
   t+=max(.085,.035*t);
 }
 float horizon=smoothstep(.02,.28,1.-uv.y);
 gl_FragColor=vec4(sum.rgb/max(sum.a,.001),min(.62,sum.a)*horizon);
}`;
