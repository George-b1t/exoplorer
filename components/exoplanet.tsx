import { useMemo, useRef } from "react"
import { ExoplanetData, massToRadius } from "./galaxy"
import * as THREE from "three"
import { computeTeq } from "@/utils/equivalentTempUtils"
import { retrieveUniforms } from "@/constants/uniforms"
import { planetFragment, planetVertex } from "@/shaders/PlanetBase.glsl"
import { useFrame } from "@react-three/fiber"

export function Exoplanet({
  planet,
  onFocus,
  position,
}: {
  planet: ExoplanetData | null
  onFocus?: (pos: [number, number, number]) => void
  position?: [number, number, number] // posição fixa (ignora x,y,z)
}) {
  if (!planet) return null

  let [px, py, pz]: [number, number, number] = [0, 0, 0]
  let lightDir: THREE.Vector3 | null = null

  if (position) {
    [px, py, pz] = position
    lightDir = useMemo(() => new THREE.Vector3(-px, -py, -pz).normalize(), [px, py, pz]);
  }

  const radius = massToRadius(planet.pl_masse)

  const mesh = useRef<THREE.Mesh>(null);
  const Teq = computeTeq(planet);
  // depois de calcular [px, py, pz]

  const uniforms = useMemo(() => {
    const u = retrieveUniforms(Teq);
    if (lightDir) {
      (u.uLightDir.value as THREE.Vector3).copy(lightDir);
    }
    return u;
  }, [Teq, lightDir]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    vertexShader: planetVertex,
    fragmentShader: planetFragment,
  }), [uniforms]);

  useFrame((_, dt) => {
    (mat.uniforms.uTime.value as number) += dt;
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.5; // velocidade de rotação ajustável
    }
  });

  return (
    <mesh
      position={position}
      ref={mesh}
      onClick={() => onFocus?.([px, py, pz])}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}