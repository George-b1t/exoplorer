"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import { exoplanets, RawExo } from "@/lib/exo"
import { planetFragment, planetVertex } from "@/shaders/PlanetBase.glsl"
import { computeTeq } from "@/utils/equivalentTempUtils"
import { retrieveUniforms } from "@/constants/uniforms"
import { X } from "lucide-react"
import { Sun } from "./sun"
import { Earth } from "./earth"
import { parseMass } from "@/utils/parseMass"

export type ExoplanetData = {
  name: string
  id: string
  x: number
  y: number
  z: number
  /** Mass in Earth masses (M⊕) normalized from pl_masse */
  pl_masse: number | null
  pl_rade: number | null;
  st_teff: number | null; 
  st_rad: number | null; 
  st_mass: number | null;
  pl_orbsmax: number | null; 
  pl_orbper: number | null; 
  pl_eqt: number | null;
  isPlanet: number | null;
}

export type Planet = {
  objectid: string
  pl_name: string
  pl_massj: number | null
  pl_radj: number | null;
  st_teff: number | null; 
  st_rad: number | null; 
  st_mass: number | null;
  pl_orbsmax: number | null; 
  pl_orbper: number | null; 
  pl_eqt: number | null;
  isPlanet: number | null;
}

const EARTH_POS: [number, number, number] = [8, 0, 0]

/** Converte massa (M⊕) em raio visual. Aproximação: R ∝ M^(1/3) com clamps para visualização. */
export function massToRadius(mass?: number | null): number {
  const R_EARTH_SCENE = 0.5
  if (!mass || mass <= 0) return 0.8 // fallback visual quando não houver massa
  const r = R_EARTH_SCENE * Math.cbrt(mass)
  // Evita pontos grandes demais ou minúsculos
  return Math.min(Math.max(r, 0.35), 1.6) * 0.3
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
  return () => {
    let t = (a += 0x6d2b79f5)
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
export function toScenePosDeterministic(
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

  const r = computeRadiusFromSeed(seedKey, opts?.rMin, opts?.rMax) * 1.8

  // jitter ortogonal determinístico, bem pequeno para evitar sobreposição exata
  const seed = hashStringToSeed(seedKey)
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const jitterAmp = opts?.jitter ?? 0.4
  const j1 = (rand() - 0.5) * 2
  const j2 = (rand() - 0.5) * 2

  const { u, v } = getOrthonormalBasis([nx, ny, nz])
  const jx = jitterAmp * (u[0] * j1 + v[0] * j2)
  const jy = jitterAmp * (u[1] * j1 + v[1] * j2)
  const jz = jitterAmp * (u[2] * j1 + v[2] * j2)

  return [nx * r + jx, ny * r + jy, nz * r + jz]
}

function Exoplanet({
  planet,
  onFocus,
}: {
  planet: ExoplanetData | null
  onFocus?: (pos: [number, number, number]) => void
}) {
  if (!planet) return null

  const [px, py, pz] = toScenePosDeterministic(planet.x, planet.y, planet.z, planet.id)
  const radius = massToRadius(planet.pl_masse)

  const mesh = useRef<THREE.Mesh>(null);
  const Teq = computeTeq(planet);
  // depois de calcular [px, py, pz]
  const lightDir = useMemo(() => new THREE.Vector3(-px, -py, -pz).normalize(), [px, py, pz]);

  const uniforms = useMemo(() => {
    const u = retrieveUniforms(Teq);
    (u.uLightDir.value as THREE.Vector3).copy(lightDir); // atualiza direção
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
      position={[px, py, pz]}
      ref={mesh}
      onClick={() => onFocus?.([px, py, pz])}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

function Scene({
  onSelectPlanet,
  onUserInteraction, // << NOVO
  autoRotate,
}: {
  onSelectPlanet?: (p: Planet) => void
  onHoverPlanet?: (info: { name?: string; x?: number; y?: number; visible: boolean }) => void
  onUserInteraction?: () => void // << NOVO
  autoRotate: boolean
}) {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
  }, [gl]);

  const planets = useMemo<ExoplanetData[]>(
    () =>
      (exoplanets as RawExo[]).map((p) => {
        const { mass } = parseMass(p.pl_masse ?? null)
        return {
          name: p.name,
          id: (p as any).id ?? p.name,
          x: p.x,
          y: p.y,
          z: p.z,
          pl_masse: mass,
          pl_rade: p.pl_rade,
          st_teff: p.st_teff,
          st_rad: p.st_rad,
          st_mass: p.st_mass,
          pl_orbsmax: p.pl_orbsmax,
          pl_orbper: p.pl_orbper,
          pl_eqt: p.pl_eqt,
          isPlanet: p.isPlanet ?? null,
        }
      }),
    [],
  )

  const animateTo = (pos: [number, number, number], approxRadius: number) => {
    const controls = controlsRef.current
    if (!controls) return

    const cam = controls.object
    const V = (cam as any).up.constructor
    const forward = cam.getWorldDirection(new V())
    const desiredDist = Math.max(2.0, Math.min(3.5, approxRadius * 6))
    const dir = forward.clone().multiplyScalar(-desiredDist)

    const toTarget = new V(pos[0], pos[1], pos[2])
    const toCam = new V(pos[0] + dir.x, pos[1] + dir.y, pos[2] + dir.z)

    animRef.current = {
      active: true,
      start: typeof performance !== "undefined" ? performance.now() : Date.now(),
      duration: 800,
      fromCam: cam.position.clone(),
      toCam,
      fromTarget: controls.target.clone(),
      toTarget,
    }
  }

  const controlsRef = useRef<any>(null)

  function normalizePlanetPayload(payload: any): Planet {
    // Algumas APIs retornam {"0": {...}}, outras já retornam direto {...}
    const rec = payload?.[0] ?? payload?.["0"] ?? payload ?? {}

    // Garanta null para campos ausentes e coerção leve de tipos
    return {
      objectid: String(rec.objectid ?? ""),
      pl_name: rec.pl_name ?? rec.pl_name ?? "",
      pl_massj: rec.pl_massj ?? null,     // M_J (Júpiter), ver nota abaixo
      pl_radj: rec.pl_radj ?? null,       // R_⊕
      st_teff: rec.st_teff ?? null,
      st_rad: rec.st_rad ?? null,
      st_mass: rec.st_mass ?? null,
      pl_orbsmax: rec.pl_orbsmax ?? null, // AU
      pl_orbper: rec.pl_orbper ?? null,   // dias
      pl_eqt: rec.pl_eqt ?? null,         // K
      isPlanet: rec.isPlanet ?? null,     // pode vir da lista local
    }
  }

  const handleSelectPlanet = async (planetName: string) => {
    const response = await fetch(`http://82.25.69.243:8000/api/v1/exoplanets/${planetName}`)
    const json = await response.json()
    // nessa rota eu tenho certeza q n vem isPlanet como posso pegar do objeto exoplanet?
    const isPlanet = exoplanets.find((p) => p.name === planetName)?.isPlanet ?? null;
    const normalized = normalizePlanetPayload(json)
    normalized.isPlanet = isPlanet
    onSelectPlanet?.(normalized)
  }

  // Escuta eventos do OrbitControls para detectar interação do usuário
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleStart = () => onUserInteraction?.()
    const handleChange = () => onUserInteraction?.() // enquanto o usuário arrasta/roda
    const handleEnd = () => onUserInteraction?.()

    controls.addEventListener?.('start', handleStart)
    controls.addEventListener?.('change', handleChange)
    controls.addEventListener?.('end', handleEnd)

    return () => {
      controls.removeEventListener?.('start', handleStart)
      controls.removeEventListener?.('change', handleChange)
      controls.removeEventListener?.('end', handleEnd)
    }
  }, [onUserInteraction])

  // Ref de animação para transição suave de câmera e target
  const animRef = useRef<{
    active: boolean
    start: number
    duration: number
    fromCam: any
    toCam: any
    fromTarget: any
    toTarget: any
  } | null>(null)

  const handleFocus = (pos: [number, number, number]) => {
    controlsRef.current?.target.set(pos[0], pos[1], pos[2])
    controlsRef.current?.update?.()
  }

  useFrame(() => {
    const controls = controlsRef.current
    const anim = animRef.current
    if (!controls || !anim || !anim.active) return

    const now = typeof performance !== "undefined" ? performance.now() : Date.now()
    const t = Math.min(1, (now - anim.start) / anim.duration)
    const ease = 1 - Math.pow(1 - t, 3) // easeOutCubic

    const cam = controls.object
    cam.position.set(
      anim.fromCam.x + (anim.toCam.x - anim.fromCam.x) * ease,
      anim.fromCam.y + (anim.toCam.y - anim.fromCam.y) * ease,
      anim.fromCam.z + (anim.toCam.z - anim.fromCam.z) * ease,
    )

    controls.target.set(
      anim.fromTarget.x + (anim.toTarget.x - anim.fromTarget.x) * ease,
      anim.fromTarget.y + (anim.toTarget.y - anim.fromTarget.y) * ease,
      anim.fromTarget.z + (anim.toTarget.z - anim.fromTarget.z) * ease,
    )

    controls.update?.()

    if (t >= 1) {
      anim.active = false
    }
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "h" || e.key === "H") {
        handleFocus(EARTH_POS)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FDB813" />
      {/* <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}

      {/* Sol + halo */}
      <Sun />

      <Earth onFocus={(pos) => animateTo(pos, 0.5)} earthPosition={EARTH_POS} />
      {planets
        .filter((exo) => exo.pl_masse != null)
        .map((exo) => (
          <Exoplanet
            key={exo.id}
            planet={exo}
            onFocus={(pos) => {
              const controls = controlsRef.current
              if (controls) {
                const cam = controls.object
                const V = (cam as any).up.constructor
                const forward = cam.getWorldDirection(new V())
                const r = massToRadius(exo.pl_masse)
                const desiredDist = Math.max(2.0, Math.min(3.5, r * 6))
                const dir = forward.clone().multiplyScalar(-desiredDist)

                const toTarget = new V(pos[0], pos[1], pos[2])
                const toCam = new V(pos[0] + dir.x, pos[1] + dir.y, pos[2] + dir.z)

                animRef.current = {
                  active: true,
                  start: typeof performance !== "undefined" ? performance.now() : Date.now(),
                  duration: 800,
                  fromCam: cam.position.clone(),
                  toCam,
                  fromTarget: controls.target.clone(),
                  toTarget,
                }
              }
              handleSelectPlanet(exo.name)
            }}
          />
        ))}
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.1}
        minDistance={2}
        maxDistance={800}
        target={EARTH_POS}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
      />
    </>
  )
}

export function Galaxy() {
  const [selected, setSelected] = useState<Planet | null>(null)
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true) // ligado por padrão
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleUserInteraction = () => {
    // pausa a autorotação por 5s e reinicia o timer se o usuário continuar mexendo
    setAutoRotate(false)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setAutoRotate(true), 5000)
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null)
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [])

  return (
    <div className="w-full h-full bg-transparent relative">
      <Canvas camera={{ position: [0, 10, 20], fov: 60, far: 2000 }}
              onPointerDown={handleUserInteraction} /* segurança extra para clique/touch no canvas */>
        <Scene
          onSelectPlanet={setSelected}
          onHoverPlanet={(info) => {
            if (info.visible) setTooltip({ visible: true, text: info.name ?? "", x: info.x ?? 0, y: info.y ?? 0 })
            else setTooltip((t) => ({ ...t, visible: false }))
          }}
          onUserInteraction={handleUserInteraction}
          autoRotate={autoRotate}
        />
      </Canvas>

      {tooltip.visible && (
        <div className="fixed pointer-events-none z-50" style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}>
          <div className="bg-black/90 text-white text-sm px-3 py-2 rounded-lg border border-nebula-purple/30 shadow-lg">
            {tooltip.text}
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-black/90 text-white rounded-xl p-5 w-[min(90vw,420px)] shadow-2xl border-2 border-nebula-purple/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold bg-gradient-to-r from-nebula-purple to-cosmic-cyan bg-clip-text text-transparent">
                {selected.pl_name}
              </div>
              <button
                className="text-white/70 hover:text-white text-sm px-1 py-1 rounded hover:bg-white/10 transition-colors"
                onClick={() => setSelected(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">ID:</span>
                <span className="font-mono text-white/90">{selected.objectid}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Planet Mass Comparison:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.pl_massj != null ? `${selected.pl_massj} Jupiters` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Planet Radius Comparison:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.pl_radj != null ? `${selected.pl_radj} x Jupiter` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Equilibrium Temperature:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.pl_eqt != null ? `${selected.pl_eqt} K` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Star Mass Comparison:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.st_mass != null ? `${selected.st_mass} x Our Sun` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Star Radius Comparison:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.st_rad != null ? `${selected.st_rad} x Our Sun` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Orbital Radius:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.pl_orbsmax != null ? `${selected.pl_orbsmax} AU` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Orbital Period:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.pl_orbper != null ? (() => {
                    const n = typeof selected.pl_orbper === "number" ? selected.pl_orbper : parseFloat(String(selected.pl_orbper));
                    return Number.isFinite(n) ? `${n.toFixed(1)} days` : "—";
                  })() : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Type:</span>
                <span className="font-semibold text-nebula-pink">
                  {selected.isPlanet === 1 ? "Planet" : selected.isPlanet === 0 ? "Candidate" : "—"}
                </span>
              </div>
            </div>
            <div className="mt-6 text-xs text-white/50 italic">
              Exoplanet data provided by NASA Exoplanet Archive.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
