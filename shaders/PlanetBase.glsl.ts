export const planetVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vPos;     
  varying vec3 vViewDir;                 

  void main(){
    vN   = normalize(normalMatrix * normal);
    vPos = normalize(position);

    vec3 viewPos  = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vViewDir = normalize(-viewPos);

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`;


export const planetFragment = /* glsl */ `
precision highp float;
varying vec3 vN;
varying vec3 vPos;               
varying vec3 vViewDir;

uniform float uTeq;
uniform vec3  uLightDir;
uniform float uBandFreq;
uniform float uBandContrast;

uniform float uTime;
uniform float uShearStrength;

uniform float uNoiseScale;   
uniform float uNoiseAmp;     
uniform float uWarpAmp;      
uniform float uNoiseSpeed;   

uniform float uVortexAmt;        
uniform float uVortexScale;      
uniform float uVortexSharp;      
uniform vec3  uVortexTint;       

uniform float uGreatSpotAmt;     
uniform float uGreatSpotLat;     
uniform float uGreatSpotLon;     
uniform float uGreatSpotSize;    
uniform vec3  uGreatSpotTint;    

uniform float uAtmStrength;   
uniform float uAtmHeight;     
uniform vec3  uAtmTint;       
uniform float uAtmAnisotropy; 

vec3 hsl2rgb(vec3 hsl){
  float H=hsl.x,S=hsl.y,L=hsl.z;
  float C=(1.0-abs(2.0*L-1.0))*S;
  float X=C*(1.0-abs(mod(H*6.0,2.0)-1.0));
  float m=L-0.5*C;
  vec3 rgb=(H<1.0/6.0)?vec3(C,X,0.0):(H<2.0/6.0)?vec3(X,C,0.0):
           (H<3.0/6.0)?vec3(0.0,C,X):(H<4.0/6.0)?vec3(0.0,X,C):
           (H<5.0/6.0)?vec3(X,0.0,C):vec3(C,0.0,X);
  return rgb+vec3(m);
}

float hueLerp(float h1,float h2,float t){
  float d=h2-h1;
  d=d-floor(d+0.5);
  return fract(h1+d*t);
}

vec3 paletteTeq(float Teq){
  float t=clamp((Teq-100.0)/(2000.0-100.0),0.0,1.0);
  float hCold=210.0/360.0;
  float hWarm=330.0/360.0;
  float hHot = 25.0/360.0;
  float h=(Teq<600.0)?hueLerp(hCold,hWarm,smoothstep(100.0,600.0,Teq))
                     :hueLerp(hWarm,hHot ,smoothstep(600.0,1500.0,Teq));
  float s=mix(0.5,0.7,t);
  float l=mix(0.65,0.45,t);
  return hsl2rgb(vec3(h,s,l));
}

float hash(vec3 p){ return fract(sin(dot(p, vec3(17.1,113.0,41.2))) * 43758.5453); }

float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float n = mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                    mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                    mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
  return n;
}

float fbm(vec3 p){
  float a = 0.5, s = 0.0;
  for(int i=0;i<5;i++){ s += a * vnoise(p); p *= 2.02; a *= 0.5; }
  return s; // ~[0..1]
}

float worley(vec3 p){
  vec3 i = floor(p);
  vec3 f = fract(p);
  float dMin = 1.0;
  // 27 vizinhos (3x3x3) — suficiente p/ evitar artefatos
  for(int xo=-1; xo<=1; xo++){
    for(int yo=-1; yo<=1; yo++){
      for(int zo=-1; zo<=1; zo++){
        vec3 g = vec3(float(xo), float(yo), float(zo));
        vec3 h = hash(i + g + vec3(0.1, 0.2, 0.3)) * vec3(0.73, 0.41, 0.93); // jitter
        vec3 r = (g + h) - f;
        float d = dot(r, r);
        dMin = min(dMin, d);
      }
    }
  }
  // mapeia para [0..1] e faz uma raiz p/ “pontas” mais redondas
  return clamp(pow(1.0 - dMin, 0.75), 0.0, 1.0);
}

void main(){
  vec3 base = paletteTeq(uTeq);
  
  float lat = asin(clamp(vPos.y, -1.0, 1.0));   
  float lon = atan(vPos.z, vPos.x);             
  float f   = uBandFreq;
  
  float jet   = sin(lat * (0.5 * f));
  float shear = uShearStrength * jet * cos(lat);
  float phase = shear * uTime * 0.20;
  
  float t = uNoiseSpeed * uTime;
  vec3  q = vPos * uNoiseScale + vec3(0.0, t, 0.0);
  float warpLat  = fbm(q);                       
  float warpLon  = fbm(q * 1.7 + 3.1);           
  lat += (uWarpAmp) * (warpLat - 0.5);           
  lon += (uWarpAmp*0.6) * (warpLon - 0.5);       
  
  float meander = 0.06 * sin(lon * 3.0 + uTime * 0.10) * cos(lat);
  lat += meander;
  
  float p1 = sin(lat * f        + phase);
  float p2 = sin(lat * (2.0*f)  + 0.7 + 1.2*phase);
  float p3 = sin(lat * (3.0*f)  - 1.1 + 1.6*phase);

  float w1 = 1.0, w2 = 0.55, w3 = 0.30;
  float pattern = (w1*p1 + w2*p2 + w3*p3) / (w1 + w2 + w3);
  
  float envelope = pow(cos(lat), 0.6);
  pattern *= envelope;
  
  pattern = sign(pattern) * pow(abs(pattern), 0.85);
  
  float bandStrength = mix(0.75, 1.25, 0.5 + 0.5*pattern);
  bandStrength = mix(1.0, bandStrength, clamp(uBandContrast, 0.0, 1.0));
  vec3 albedo = base * bandStrength;
  
  float cloud = fbm(vPos * (uNoiseScale*2.3) + vec3(t*0.6, 0.0, -t*0.4)); 
  
  float zonalMask = smoothstep(0.2, 0.9, envelope); 
  float cloudMix  = uNoiseAmp * (cloud - 0.5) * zonalMask;
  
  albedo *= (1.0 + 0.25 * cloudMix);

  float polar = smoothstep(0.65, 0.92, abs(vPos.y));
  albedo = mix(albedo, albedo * 1.05, polar * 0.5);
  
  float x = lon * cos(lat);
  float y = lat;
  float z = 0.0; 
  float t2 = uTime * uNoiseSpeed;
  
  vec3 pv = vec3(x * 1.5, y, z) * uVortexScale + vec3(0.0, t2 * 0.35, 0.0);
  
  float cells = worley(pv);               
  float islands = pow(cells, uVortexSharp);
  
  float latMask = smoothstep(0.15, 0.95, pow(cos(lat), 0.9));

  float vortexField = uVortexAmt * latMask * (islands - 0.5);

  albedo = mix(albedo, albedo * uVortexTint, clamp(vortexField * 0.6 + 0.5, 0.0, 1.0));
  albedo *= (1.0 + 0.20 * vortexField); 
  
  float dLat = lat - uGreatSpotLat;
  float dLon = lon - uGreatSpotLon;
  dLon = atan(sin(dLon), cos(dLon)); 
  float angDist = acos( clamp( sin(lat)*sin(uGreatSpotLat) + cos(lat)*cos(uGreatSpotLat)*cos(dLon), -1.0, 1.0 ) );
  
  float spot = exp( - (angDist*angDist) / (2.0 * uGreatSpotSize * uGreatSpotSize) );
  
  float spotAmt = uGreatSpotAmt * spot;
  albedo = mix(albedo, albedo * uGreatSpotTint, clamp(spotAmt, 0.0, 1.0));
  
  albedo *= (1.0 - 0.10 * spotAmt);

  vec3 Nv = normalize(vN);
  vec3 V  = normalize(vViewDir);
  vec3 L  = normalize(uLightDir);

  float rimV = pow(1.0 - clamp(dot(Nv, V), 0.0, 1.0), max(1.0, uAtmHeight));

  float rimL = pow(1.0 - clamp(dot(Nv, L), 0.0, 1.0), 1.5);

  float g = clamp(uAtmAnisotropy, 0.0, 0.95);
  float cosTheta = clamp(dot(V, L), -1.0, 1.0);
  float phaseHG = (1.0 - g*g) / pow(1.0 + g*g - 2.0*g*cosTheta, 1.5);
  phaseHG = clamp(phaseHG, 0.0, 3.0);

  float haze = uAtmStrength * (0.65 * rimV + 0.35 * rimL) * (0.6 + 0.4 * phaseHG);
  vec3 atmColor = uAtmTint * haze;

  float hotGlow = smoothstep(1200.0, 2000.0, uTeq) * 0.15;
  atmColor += albedo * hotGlow * rimL;
  
  albedo = mix(albedo, clamp(albedo + atmColor, 0.0, 1.0), 0.75);

  vec3 N = normalize(vN);
  float diff = max(dot(N, normalize(uLightDir)), 0.0);
  float ambient = 0.25;
  vec3 color = albedo * (ambient + (1.0 - ambient) * diff);

  gl_FragColor = vec4(color, 1.0);
}
`;

