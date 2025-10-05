import { Html } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

interface EarthProps {
  onFocus?: (pos: [number, number, number]) => void
  earthPosition: [number, number, number]
}

export function Earth({ onFocus, earthPosition }: EarthProps) {
  const R_EARTH_SCENE = 0.5 // raio visual de referência para 1 M⊕
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  const [dayMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    "/images/earth_daymap.jpg",
    "/images/earth_atmosphere.jpg",
  ])

  // Rotação automática da Terra
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05 // Rotação lenta
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06 // Nuvens giram um pouco mais rápido
    }
  })

  return (
    <group position={earthPosition} onClick={() => onFocus?.(earthPosition)}>
      {/* Esfera principal da Terra */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[R_EARTH_SCENE, 64, 64]} />
        <meshStandardMaterial map={dayMap} />
      </mesh>

      {/* Camada de nuvens/atmosfera */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[R_EARTH_SCENE + 0.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label HTML */}
      <Html distanceFactor={10} position={[0, R_EARTH_SCENE + 0.5, 0]}>
        <div className="text-white text-sm font-medium whitespace-nowrap bg-black/70 px-3 py-1.5 rounded-lg border border-blue-500/30">
          Terra (Earth) — 1 M⊕
        </div>
      </Html>
    </group>
  )
}