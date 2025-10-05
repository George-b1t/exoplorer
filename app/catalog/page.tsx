"use client"

import { useState, useMemo, useRef } from "react"
import { useMode } from "@/contexts/mode-context"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exoplanets } from "@/lib/exoplanet-data"
import { Search } from "lucide-react"

import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"

// 🌌 — shaders e utils que você já tem no projeto
import { planetFragment, planetVertex } from "@/shaders/PlanetBase.glsl"
import { computeTeq } from "@/utils/equivalentTempUtils"
import { retrieveUniforms } from "@/constants/uniforms"

// se já tiver essas duas funções em outro lugar, troque os imports e remova as versões abaixo
import { massToRadius, toScenePosDeterministic } from "@/components/galaxy"

type CatalogPlanet = {
  id: string
  name: string
  type?: string
  mass: number            // M⊕
  radius: number          // R⊕
  temperature: number     // K
  distance: number        // anos-luz
  discoveryYear?: number
  // se você tiver posições/seed:
  x?: number; y?: number; z?: number;
  // quaisquer campos extras usados por computeTeq(...)
}

/** ---------- Mini preview com material shaderizado ---------- */
function MiniPlanetPreview({ planet }: { planet: CatalogPlanet }) {
  // posição só para derivar uma direção de luz estável por planeta
  const [px, py, pz] = useMemo<[number, number, number]>(() => {
    // se tiver x/y/z use; senão derive por id
    const x = planet.x ?? 0, y = planet.y ?? 0, z = planet.z ?? 0
    return toScenePosDeterministic(x, y, z, planet.id)
  }, [planet])

  const lightDir = useMemo(() => new THREE.Vector3(-px, -py, -pz).normalize(), [px, py, pz])

  // Teq e uniforms iguais ao componente Exoplanet
  const TeqRaw = computeTeq(planet as any)
  const Teq = Number.isFinite(TeqRaw) ? TeqRaw : planet.temperature ?? 288

  const uniforms = useMemo(() => {
    const u = retrieveUniforms(Teq)
    ;(u.uLightDir.value as THREE.Vector3).copy(lightDir)
    return u
  }, [Teq, lightDir])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: planetVertex,
        fragmentShader: planetFragment,
      }),
    [uniforms]
  )

  // raio “de cena”: pequeno para caber no card; usa o físico como base
  const sceneRadius = useMemo(() => {
    // se você quiser usar o raio físico direto: planet.radius
    // se preferir converter por massa (fica legal p/ quando não houver radius):
    const base = Number.isFinite(planet.radius) ? planet.radius : massToRadius(planet.mass)
    // normaliza p/ o mini-canvas (clamp para não exagerar)
    return THREE.MathUtils.clamp(base * 0.18, 0.16, 0.36)
  }, [planet.mass, planet.radius])

  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 1.75]}               // limita custo
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 2.2], fov: 35 }}
    >
      <ambientLight intensity={0.15} />
      {/* luz direcional alinhada com o shader (opcional, ajuda no contorno do globo) */}
      <directionalLight position={[1.5, 1.2, 1.8]} intensity={0.5} />

      <RotatingPlanet material={material} radius={sceneRadius} />
    </Canvas>
  )
}

function RotatingPlanet({ material, radius }: { material: THREE.ShaderMaterial; radius: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    // anima o tempo do shader e a rotação do globo
    ;(material.uniforms.uTime.value as number) += dt
    if (mesh.current) mesh.current.rotation.y += dt * 0.4
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[radius, 48, 48]} />
      {/* attach material via primitive para manter a mesma instância memoizada */}
      <primitive object={material} attach="material" />
    </mesh>
  )
}

/** -------------------- Página -------------------- */
export default function CatalogPage() {
  const { mode } = useMode()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    minMass: "",
    maxMass: "",
    minRadius: "",
    maxRadius: "",
    minTemp: "",
    maxTemp: "",
  })

  const filteredPlanets = useMemo(() => {
    return (exoplanets as CatalogPlanet[]).filter((planet) => {
      if (searchTerm && !planet.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (filters.minMass && planet.mass < Number(filters.minMass)) return false
      if (filters.maxMass && planet.mass > Number(filters.maxMass)) return false
      if (filters.minRadius && planet.radius < Number(filters.minRadius)) return false
      if (filters.maxRadius && planet.radius > Number(filters.maxRadius)) return false
      if (filters.minTemp && planet.temperature < Number(filters.minTemp)) return false
      if (filters.maxTemp && planet.temperature > Number(filters.maxTemp)) return false
      return true
    })
  }, [searchTerm, filters])

  const isEducational = mode === "educational"

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">Catálogo de Exoplanetas</h1>
            <p className="text-white/80 text-lg">
              {isEducational
                ? "Explore nossa coleção de planetas descobertos fora do sistema solar"
                : "Catálogo completo de exoplanetas com dados científicos"}
            </p>
          </div>

          <Card className="p-6 mb-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
            <div className="space-y-6">
              <div>
                <Label htmlFor="search" className="text-white mb-2 block">
                  Buscar por nome
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="search"
                    placeholder="Ex: Kepler, TRAPPIST, Proxima..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white mb-2 block">{isEducational ? "Massa (Terra = 1)" : "Massa (M⊕)"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minMass}
                      onChange={(e) => setFilters({ ...filters, minMass: e.target.value })}
                      className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxMass}
                      onChange={(e) => setFilters({ ...filters, maxMass: e.target.value })}
                      className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">{isEducational ? "Tamanho (Terra = 1)" : "Raio (R⊕)"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minRadius}
                      onChange={(e) => setFilters({ ...filters, minRadius: e.target.value })}
                      className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxRadius}
                      onChange={(e) => setFilters({ ...filters, maxRadius: e.target.value })}
                      className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Temperatura (K)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minTemp}
                      onChange={(e) => setFilters({ ...filters, minTemp: e.target.value })}
                      className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxTemp}
                      onChange={(e) => setFilters({ ...filters, maxTemp: e.target.value })}
                      className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm text-white/60">
                {filteredPlanets.length} {filteredPlanets.length === 1 ? "planeta encontrado" : "planetas encontrados"}
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlanets.map((planet) => (
              <Card
                key={planet.id}
                className="p-6 hover:border-nebula-purple transition-all hover:scale-105 cursor-pointer bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/20"
              >
                <div className="space-y-4">
                  {/* 🔭 trocamos o gradiente por um mini-canvas 3D */}
                  <div className="w-full aspect-square rounded-full overflow-hidden bg-black/30 mx-auto">
                    <MiniPlanetPreview planet={planet as CatalogPlanet} />
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1 text-white">{planet.name}</h3>
                    <p className="text-sm text-white/70 mb-3">{planet.type}</p>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Massa:" : "Mass:"}</span>
                        <span className="font-medium text-white">{planet.mass} M⊕</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Tamanho:" : "Radius:"}</span>
                        <span className="font-medium text-white">{planet.radius} R⊕</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Temperatura:" : "Temp:"}</span>
                        <span className="font-medium text-white">{planet.temperature} K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Distância:" : "Distance:"}</span>
                        <span className="font-medium text-white">{planet.distance} a.l.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Descoberto:" : "Discovered:"}</span>
                        <span className="font-medium text-white">{planet.discoveryYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredPlanets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Nenhum planeta encontrado com esses critérios.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
