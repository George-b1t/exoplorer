import { Html } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useLoader(THREE.TextureLoader, "/images/sun.jpg")

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001 * 1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial emissive="#FFF88F" emissiveMap={texture} emissiveIntensity={1.9} />
      <Html distanceFactor={10} position={[0, 2.5, 0]}>
        <div className="text-white text-sm font-medium whitespace-nowrap bg-black/70 px-3 py-1.5 rounded-lg border border-yellow-500/30">
          Sol (Sun)
        </div>
      </Html>
    </mesh>
  )
}