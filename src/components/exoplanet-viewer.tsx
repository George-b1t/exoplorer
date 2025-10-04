"use client"

import { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars, Html } from "@react-three/drei"
import { exoplanets } from "@/lib/exo"

type RawExo = {
  name: string
  id: string
  x: number
  y: number
  z: number
  pl_masse?: number | string | null
}

type ExoplanetData = {
  name: string
  id: string
  x: number
  y: number
  z: number
  /** Mass in Earth masses (M⊕) normalized from pl_masse */
  mass: number | null
  /** Texto para exibir (ex.: "2.1", "< 0.8", "—") */
  massLabel: string
}

function parseMass(value: number | string | null | undefined): { mass: number | null; label: string } {
  if (value == null) return { mass: null, label: "—" }
  if (typeof value === "number") {
    return Number.isFinite(value) ? { mass: value, label: value.toString() } : { mass: null, label: "—" }
  }
  // string: pode vir como "< 3.5", "≤1.2", "1.8", etc.
  const trimmed = value.trim().replace(",", ".")
  const m = trimmed.match(/^([<≤]\s*)?(\d+(\.\d+)?)/)
  if (!m) return { mass: null, label: value }
  const upper = Boolean(m[1])
  const num = Number.parseFloat(m[2])
  return {
    mass: Number.isFinite(num) ? num : null, // usamos o valor numérico para o raio
    label: upper ? `< ${num}` : `${num}`,
  }
}

function Sun() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial emissive="#FDB813" emissiveIntensity={2} color="#FDB813" />
      <Html distanceFactor={10} position={[0, 2.5, 0]}>
        <div className="text-white text-sm font-medium whitespace-nowrap bg-black/50 px-2 py-1 rounded">Sol (Sun)</div>
      </Html>
    </mesh>
  )
}

const EARTH_POS: [number, number, number] = [8, 0, 0]

function Earth() {
  const R_EARTH_SCENE = 0.5 // raio visual de referência para 1 M⊕ (aprox.)
  return (
    <mesh position={EARTH_POS}>
      <sphereGeometry args={[R_EARTH_SCENE, 32, 32]} />
      <meshStandardMaterial color="#4A90E2" />
      <Html distanceFactor={10} position={[0, R_EARTH_SCENE + 0.5, 0]}>
        <div className="text-white text-sm font-medium whitespace-nowrap bg-black/50 px-2 py-1 rounded">
          Terra (Earth) — 1 M⊕
        </div>
      </Html>
    </mesh>
  )
}

/** Converte (x,y,z) e projeta para um raio (scale) da cena */
function toScenePos(x: number, y: number, z: number, scale = 24): [number, number, number] {
  // Apenas multiplica as coordenadas pelo fator de escala sem normalizar o vetor
  return [x * scale, y * scale, z * scale]
}

/** Converte massa (M⊕) em raio visual. Aproximação: R ∝ M^(1/3) com clamps para visualização. */
function massToRadius(mass?: number | null): number {
  const R_EARTH_SCENE = 0.5
  if (!mass || mass <= 0) return 0.8 // fallback visual quando não houver massa
  const r = R_EARTH_SCENE * Math.cbrt(mass)
  // Evita pontos grandes demais ou minúsculos
  return Math.min(Math.max(r, 0.35), 1.6) * 0.3
}

/** Cor por faixa de massa (M⊕) para leitura rápida. */
function massToColor(mass?: number | null): string {
  if (mass == null) return "#E8B4F0" // padrão
  if (mass < 1.5) return "#E8B4F0" // sub-terra/super-terra leve
  if (mass < 10) return "#C99AF0" // mini/Netuno
  return "#F06ACF" // >10 M⊕ (mais massivo)
}

// --- Posicionamento determinístico para eliminar o efeito de "casca" ---
// Hash simples para gerar seed a partir de string
function hashStringToSeed(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// PRNG determinístico (mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Distribui raio uniformemente em volume no intervalo [rMin, rMax]
function computeRadiusFromSeed(seedKey: string, rMin = 24, rMax = 96): number {
  const seed = hashStringToSeed(seedKey)
  const rand = mulberry32(seed)
  const u = rand() // uniforme [0,1)
  const r3 = (Math.pow(rMax, 3) - Math.pow(rMin, 3)) * u + Math.pow(rMin, 3)
  return Math.cbrt(r3)
}

// Base ortonormal (u,v) ortogonal à direção n
function getOrthonormalBasis(n: [number, number, number]) {
  const [nx, ny, nz] = n
  const a: [number, number, number] = Math.abs(nx) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const ux = ny * a[2] - nz * a[1]
  const uy = nz * a[0] - nx * a[2]
  const uz = nx * a[1] - ny * a[0]
  const ul = Math.hypot(ux, uy, uz) || 1
  const u: [number, number, number] = [ux / ul, uy / ul, uz / ul]
  const vx = ny * u[2] - nz * u[1]
  const vy = nz * u[0] - nx * u[2]
  const vz = nx * u[1] - ny * u[0]
  const v: [number, number, number] = [vx, vy, vz]
  return { u, v }
}

// Nova função de posição: normaliza direção, aplica raio determinístico e jitter leve
function toScenePosDeterministic(
  x: number,
  y: number,
  z: number,
  seedKey: string,
  opts?: { rMin?: number; rMax?: number; jitter?: number },
): [number, number, number] {
  const len = Math.hypot(x, y, z) || 1
  const nx = x / len
  const ny = y / len
  const nz = z / len

  const r = computeRadiusFromSeed(seedKey, opts?.rMin, opts?.rMax)

  // jitter ortogonal determinístico, bem pequeno para evitar sobreposição exata
  const seed = hashStringToSeed(seedKey)
  const rand = mulberry32(seed ^ 0x9E3779B9)
  const jitterAmp = opts?.jitter ?? 0.4
  const j1 = (rand() - 0.5) * 2
  const j2 = (rand() - 0.5) * 2

  const { u, v } = getOrthonormalBasis([nx, ny, nz])
  const jx = jitterAmp * (u[0] * j1 + v[0] * j2)
  const jy = jitterAmp * (u[1] * j1 + v[1] * j2)
  const jz = jitterAmp * (u[2] * j1 + v[2] * j2)

  return [nx * r + jx, ny * r + jy, nz * r + jz]
}

function Exoplanet({ planet }: { planet: ExoplanetData | null }) {
  if (!planet) return null

  const [px, py, pz] = toScenePosDeterministic(planet.x, planet.y, planet.z, planet.id)
  const radius = massToRadius(planet.mass)
  const color = massToColor(planet.mass)

  return (
    <mesh position={[px, py, pz]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Scene() {
  const planets = useMemo<ExoplanetData[]>(
  () =>
    (exoplanets as RawExo[]).map((p) => {
      const { mass, label } = parseMass(p.pl_masse ?? null)
      return {
        name: p.name,
        id: (p as any).id ?? p.name,
        x: p.x,
        y: p.y,
        z: p.z,
        mass,
        massLabel: label,
      }
    }),
  [],
)

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sun />
      <Earth />
      {planets.filter((exo) => exo.mass != null).map((exo) => (
        <Exoplanet key={exo.id} planet={exo} />
      ))}
      <OrbitControls enablePan enableZoom enableRotate target={EARTH_POS} />
    </>
  )
}

export default function ExoplanetViewer() {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        <Scene />
      </Canvas>

      {/* Legenda simples */}
      <div className="absolute top-4 left-4 text-white/90 text-xs bg-black/50 rounded-lg p-3 space-y-1">
        <div className="font-semibold mb-1">Legenda (massa em M⊕)</div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#E8B4F0" }} /> &lt; 1.5
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#C99AF0" }} /> 1.5 – 10
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#F06ACF" }} /> &gt; 10
        </div>
        <div className="opacity-75 mt-1">“&lt; x” indica limite superior</div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  )
}
