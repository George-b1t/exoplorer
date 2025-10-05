"use client"

import { useState, useMemo } from "react"
import { useMode } from "@/contexts/mode-context"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exoplanets } from "@/lib/exoplanet-data"
import { Search } from "lucide-react"

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
    return exoplanets.filter((planet) => {
      // Search by name
      if (searchTerm && !planet.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filter by mass
      if (filters.minMass && planet.mass < Number(filters.minMass)) return false
      if (filters.maxMass && planet.mass > Number(filters.maxMass)) return false

      // Filter by radius
      if (filters.minRadius && planet.radius < Number(filters.minRadius)) return false
      if (filters.maxRadius && planet.radius > Number(filters.maxRadius)) return false

      // Filter by temperature
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
                  <Label className="text-white mb-2 block">
                    {isEducational ? "Temperatura (K)" : "Temperatura (K)"}
                  </Label>
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
                  <div className="w-full aspect-square rounded-full bg-gradient-to-br from-nebula-purple/40 to-cosmic-cyan/40 mx-auto planet-float" />

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
