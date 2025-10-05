"use client"

import { useState, useMemo, useRef } from "react"
import { useMode } from "@/contexts/mode-context"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exoplanets, RawExo } from "@/lib/exo"
import { Search } from "lucide-react"

import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"

// 🌌 — shaders e utils que você já tem no projeto
import { planetFragment, planetVertex } from "@/shaders/PlanetBase.glsl"
import { computeTeq } from "@/utils/equivalentTempUtils"
import { parseMass } from "@/utils/parseMass"
import { retrieveUniforms } from "@/constants/uniforms"

import { ExoplanetData, massToRadius } from "@/components/galaxy"

/** ---------- Mini preview com material shaderizado ---------- */
function MiniPlanetPreview({ planet }: { planet: ExoplanetData }) {
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
      <Exoplanet planet={planet} />
    </Canvas>
  )
}

export function Exoplanet({
  planet,
}: {
  planet: ExoplanetData | null
}) {
  if (!planet) return null

  const radius = massToRadius(planet.pl_masse)

  const mesh = useRef<THREE.Mesh>(null);
  const Teq = computeTeq(planet);

  const uniforms = useMemo(() => {
    const u = retrieveUniforms(Teq);
    return u;
  }, [Teq]);

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
      ref={mesh}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={mat} attach="material" />
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

  const planets = useMemo<ExoplanetData[]>(
    () =>
      (exoplanets as RawExo[]).slice(0, 50).map((p) => {
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

  const filteredPlanets = useMemo(() => {
    return planets.filter((planet) => {
      if (searchTerm && !planet.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

      if (filters.minMass) {
        const min = Number(filters.minMass)
        if (!Number.isFinite(min) || planet.pl_masse == null || planet.pl_masse < min) return false
      }
      if (filters.maxMass) {
        const max = Number(filters.maxMass)
        if (!Number.isFinite(max) || planet.pl_masse == null || planet.pl_masse > max) return false
      }

      if (filters.minRadius) {
        const min = Number(filters.minRadius)
        if (!Number.isFinite(min) || planet.pl_rade == null || planet.pl_rade < min) return false
      }
      if (filters.maxRadius) {
        const max = Number(filters.maxRadius)
        if (!Number.isFinite(max) || planet.pl_rade == null || planet.pl_rade > max) return false
      }

      if (filters.minTemp) {
        const min = Number(filters.minTemp)
        if (!Number.isFinite(min) || planet.pl_eqt == null || planet.pl_eqt < min) return false
      }
      if (filters.maxTemp) {
        const max = Number(filters.maxTemp)
        if (!Number.isFinite(max) || planet.pl_eqt == null || planet.pl_eqt > max) return false
      }

      return true
    })
  }, [planets, searchTerm, filters])

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
            {planets
                    .filter((exo) => exo.pl_masse != null)
                    .map((exo) => (
              <Card
                key={exo.id}
                className="p-6 hover:border-nebula-purple transition-all hover:scale-105 cursor-pointer bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/20"
              >
                <div className="space-y-4">
                  {/* 🔭 trocamos o gradiente por um mini-canvas 3D */}
                  <div className="w-full aspect-square rounded-full overflow-hidden bg-black/30 mx-auto">
                    <MiniPlanetPreview planet={exo} />
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1 text-white">{exo.name}</h3>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Massa:" : "Mass:"}</span>
                        <span className="font-medium text-white">{exo.pl_masse} Earths</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Tamanho:" : "Radius:"}</span>
                        <span className="font-medium text-white">{exo.pl_rade} x Earth</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Temperatura:" : "Temp:"}</span>
                        <span className="font-medium text-white">{exo.pl_eqt} K</span>
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
