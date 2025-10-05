import * as THREE from 'three';

export const retrieveUniforms = (Teq: number) => {
  const uniforms = {
    uTeq: { value: Teq },
    uLightDir: { value: new THREE.Vector3(0.7, 0.6, 1.0).normalize() },
    uBandFreq: { value: 12.0 },  // experimente 6–14 para “jupiter-look”
    uBandContrast: { value: 0.45 }, // 0.15–0.35 fica natural

    uTime:          { value: 0 },
    uShearStrength: { value: 0.18 }, // teste 0.12–0.25

    uNoiseScale:    { value: 8.0 },   // detalhe médio (6–12)
    uNoiseAmp:      { value: 0.6 },   // granulação visível (0.3–0.8)
    uWarpAmp:       { value: 0.15 },  // deformação das faixas (0.08–0.22)
    uNoiseSpeed:    { value: 0.20 },  // animação sutil

    uVortexAmt:    { value: 0.55 },                 // 0.0 desliga; 0.4–0.7 típico
    uVortexScale:  { value: 3.5 },                  // 2–6
    uVortexSharp:  { value: 3.0 },                  // 2–6
    uVortexTint:   { value: new THREE.Vector3(1.02, 0.98, 0.95) }, // tom sutil

    uGreatSpotAmt:  { value: 0.0 },                 // começa desligado (0); use 0.8 para ver
    uGreatSpotLat:  { value: -0.25 },               // ~-14° (sul)
    uGreatSpotLon:  { value:  1.20 },               // ~+69°
    uGreatSpotSize: { value:  0.22 },               // ~12.6°
    uGreatSpotTint: { value: new THREE.Vector3(1.08, 0.88, 0.78) }, // quente/ocre

    uAtmStrength:   { value: 0.35 },                     // 0.25–0.45 natural
    uAtmHeight:     { value: 1.2 },                      // ↑ = rim mais fino e marcado
    uAtmTint:       { value: new THREE.Vector3(0.72, 0.82, 1.0) }, // azul-esbranquiçado
    uAtmAnisotropy: { value: 0.5 },   
  };
  return uniforms;
};