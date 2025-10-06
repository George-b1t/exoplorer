"use client"

import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { useMode } from "@/contexts/mode-context"
import { exoplanets, RawExo } from "@/lib/exo"
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Canvas } from "@react-three/fiber"

// 🌌 — shaders e utils que você já tem no projeto
import { parseMass } from "@/utils/parseMass"

import { Exoplanet } from "@/components/exoplanet"
import { ExoplanetData } from "@/components/galaxy"
import { Button } from "@/components/ui/button"

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

  const displayPlanets = useMemo(() => {
    return filteredPlanets.filter(p => p.pl_masse != null)
  }, [filteredPlanets])

  // Como voce acha que eu posso paginar isso aqui? De forma simples o numero de intens por pagina vai ser fixo a 8 por pagina.
  // Eu posso fazer isso no front ou no back? O que voce sugere? no front pois esses planetas estao mockados no exoplanets
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(displayPlanets.length / itemsPerPage))
  }, [displayPlanets.length])

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  // Paginação
  const paginatedPlanets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return displayPlanets.slice(startIndex, startIndex + itemsPerPage)
  }, [displayPlanets, currentPage, itemsPerPage])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  const isEducational = mode === "educational"

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">Exoplanet Catalog</h1>
            <p className="text-white/80 text-lg">
              {isEducational
                ? "Explore our collection of planets discovered outside the solar system"
                : "Complete catalog of exoplanets with scientific data"}
            </p>
          </div>

          <Card className="p-6 mb-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
            <div className="space-y-6">
              <div>
                <Label htmlFor="search" className="text-white mb-2 block">
                  Search by Name
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
                  <Label className="text-white mb-2 block">{isEducational ? "Mass (Earth = 1)" : "Mass (M⊕)"}</Label>
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
                  <Label className="text-white mb-2 block">{isEducational ? "Radius (Earth = 1)" : "Radius (R⊕)"}</Label>
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
                  <Label className="text-white mb-2 block">Temperature (K)</Label>
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
                {displayPlanets.length} {displayPlanets.length === 1 ? "planet found" : "planets found"}
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedPlanets
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
                        <span className="text-white/60">{isEducational ? "Mass:" : "Mass:"}</span>
                        <span className="font-medium text-white">
                          {exo.pl_masse != null ? (() => {
                            const n = typeof exo.pl_masse === "number" ? exo.pl_masse : parseFloat(String(exo.pl_masse));
                            return Number.isFinite(n) ? `${n.toFixed(1)} Earths` : "—";
                          })() : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Size:" : "Radius:"}</span>
                        <span className="font-medium text-white">
                          {exo.pl_rade != null ? (() => {
                            const n = typeof exo.pl_rade === "number" ? exo.pl_rade : parseFloat(String(exo.pl_rade));
                            return Number.isFinite(n) ? `${n.toFixed(1)} x Earths` : "—";
                          })() : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">{isEducational ? "Temperature:" : "Temp:"}</span>
                        <span className="font-medium text-white">{exo.pl_eqt} K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {paginatedPlanets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No planets found with these criteria.</p>
            </div>
          )}

          {paginatedPlanets.length > 0 && (
            <Pagination className="text-white mt-4">
              <PaginationContent className="w-full justify-between gap-3">
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer hover:bg-white/10 rounded-[5px]"
                    aria-disabled={currentPage === 1 ? true : undefined}
                    role={currentPage === 1 ? "link" : undefined}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeftIcon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer hover:bg-white/10 rounded-[5px]"
                    aria-disabled={currentPage === totalPages ? true : undefined}
                    role={currentPage === totalPages ? "link" : undefined}
                    onClick={() => handlePageChange(currentPage + 1)}
                    
                  >
                    Next
                    <ChevronRightIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </div>
  )
}
