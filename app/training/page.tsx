"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Brain, Plus, Trash2, Play, Upload, ChevronLeft, ChevronRight, Table } from "lucide-react"
import { useMode } from "@/contexts/mode-context"

interface PlanetData {
  id: string
  orbitalPeriod: string
  transitDuration: string
  transitDepth: string
  planetRadius: string
  insolationFlux: string
  eqTemp: string
  stellarTeff: string
  stellarLogg: string
  stellarRadius: string
}

const PLANETS_PER_PAGE = 10

export default function TrainingPage() {
  const { mode } = useMode()
  const isEducational = mode === "educational"
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [planets, setPlanets] = useState<PlanetData[]>([
    {
      id: "1",
      orbitalPeriod: "",
      transitDuration: "",
      transitDepth: "",
      planetRadius: "",
      insolationFlux: "",
      eqTemp: "",
      stellarTeff: "",
      stellarLogg: "",
      stellarRadius: "",
    },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(planets.length / PLANETS_PER_PAGE)
  const startIndex = (currentPage - 1) * PLANETS_PER_PAGE
  const endIndex = startIndex + PLANETS_PER_PAGE
  const currentPlanets = planets.slice(startIndex, endIndex)

  const [hyperparameters, setHyperparameters] = useState({
    maxDepth: "10",
    learningRate: "0.1",
    nEstimators: "100",
  })

  const [isTraining, setIsTraining] = useState(false)

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        alert("CSV inválido: arquivo vazio ou sem dados")
        return
      }

      const headers = lines[0].split(",").map((h) => h.trim())
      const importedPlanets: PlanetData[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())

        const planet: PlanetData = {
          id: Date.now().toString() + i,
          orbitalPeriod: values[headers.indexOf("ORBITAL_PERIOD_DAYS")] || "",
          transitDuration: values[headers.indexOf("TRANSIT_DURATION_HOURS")] || "",
          transitDepth: values[headers.indexOf("TRANSIT_DEPTH_PPM")] || "",
          planetRadius: values[headers.indexOf("PLANET_RADIUS_REARTH")] || "",
          insolationFlux: values[headers.indexOf("PLANET_INSOLATION_EFLUX")] || "",
          eqTemp: values[headers.indexOf("PLANET_EQ_TEMP_K")] || "",
          stellarTeff: values[headers.indexOf("STELLAR_TEFF_K")] || "",
          stellarLogg: values[headers.indexOf("STELLAR_LOGG_CMS2")] || "",
          stellarRadius: values[headers.indexOf("STELLAR_RADIUS_RSUN")] || "",
        }

        importedPlanets.push(planet)
      }

      setPlanets(importedPlanets)
      setCurrentPage(1)
      alert(`${importedPlanets.length} planetas importados com sucesso!`)
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  const addPlanet = () => {
    setPlanets([
      ...planets,
      {
        id: Date.now().toString(),
        orbitalPeriod: "",
        transitDuration: "",
        transitDepth: "",
        planetRadius: "",
        insolationFlux: "",
        eqTemp: "",
        stellarTeff: "",
        stellarLogg: "",
        stellarRadius: "",
      },
    ])
    // Navigate to last page if needed
    const newTotalPages = Math.ceil((planets.length + 1) / PLANETS_PER_PAGE)
    setCurrentPage(newTotalPages)
  }

  const removePlanet = (id: string) => {
    if (planets.length > 1) {
      const newPlanets = planets.filter((p) => p.id !== id)
      setPlanets(newPlanets)
      // Adjust page if needed
      const newTotalPages = Math.ceil(newPlanets.length / PLANETS_PER_PAGE)
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages))
      }
    }
  }

  const updatePlanet = (id: string, field: keyof PlanetData, value: string) => {
    setPlanets(planets.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleTrain = () => {
    setIsTraining(true)
    // Mock training process
    setTimeout(() => {
      setIsTraining(false)
      alert("Modelo treinado com sucesso!")
    }, 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white">Treinar Modelo de IA</h1>
              <p className="text-white/80 text-lg">
                {isEducational
                  ? "Configure os dados dos planetas e ajuste os parâmetros para treinar o modelo"
                  : "Configure os dados planetários e hiperparâmetros para treinamento do modelo"}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Hyperparameters Card */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-cosmic-cyan/30 lg:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-6 h-6 text-cosmic-cyan" />
                  <h2 className="text-xl font-bold text-white">Hiperparâmetros</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxDepth" className="text-white mb-2 block">
                      {isEducational ? "Altura Máxima da Árvore" : "Max Depth"}
                    </Label>
                    <Input
                      id="maxDepth"
                      type="number"
                      value={hyperparameters.maxDepth}
                      onChange={(e) => setHyperparameters({ ...hyperparameters, maxDepth: e.target.value })}
                      className="bg-deep-space/50 border-cosmic-cyan/30 text-white"
                    />
                    {isEducational && (
                      <p className="text-xs text-white/60 mt-1">
                        Controla a profundidade máxima das árvores de decisão
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="learningRate" className="text-white mb-2 block">
                      {isEducational ? "Taxa de Aprendizagem" : "Learning Rate"}
                    </Label>
                    <Input
                      id="learningRate"
                      type="number"
                      step="0.01"
                      value={hyperparameters.learningRate}
                      onChange={(e) => setHyperparameters({ ...hyperparameters, learningRate: e.target.value })}
                      className="bg-deep-space/50 border-cosmic-cyan/30 text-white"
                    />
                    {isEducational && (
                      <p className="text-xs text-white/60 mt-1">Define a velocidade de aprendizado entre árvores</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nEstimators" className="text-white mb-2 block">
                      {isEducational ? "Número de Árvores" : "N Estimators"}
                    </Label>
                    <Input
                      id="nEstimators"
                      type="number"
                      value={hyperparameters.nEstimators}
                      onChange={(e) => setHyperparameters({ ...hyperparameters, nEstimators: e.target.value })}
                      className="bg-deep-space/50 border-cosmic-cyan/30 text-white"
                    />
                    {isEducational && (
                      <p className="text-xs text-white/60 mt-1">Quantidade total de árvores no modelo</p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleTrain}
                  disabled={isTraining}
                  className="w-full mt-6 bg-gradient-to-r from-cosmic-cyan to-nebula-purple hover:from-cosmic-cyan/80 hover:to-nebula-purple/80 text-white"
                >
                  {isTraining ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-spin" />
                      Treinando...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Treinar Modelo
                    </>
                  )}
                </Button>
              </Card>

              {/* Planets Data Card */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Dados dos Planetas</h2>
                  <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="border-cosmic-cyan/30 hover:border-cosmic-cyan text-white hover:bg-cosmic-cyan/10 bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar CSV
                    </Button>
                    <Button
                      onClick={addPlanet}
                      size="sm"
                      variant="outline"
                      className="border-nebula-purple/30 hover:border-nebula-purple text-white hover:bg-nebula-purple/10 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 hover:border-white text-white hover:bg-white/10 bg-transparent"
                        >
                          <Table className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[80vw] bg-card/95 backdrop-blur-sm border-2 border-cosmic-cyan/30 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-white">Formato CSV Esperado</DialogTitle>
                          <DialogDescription className="text-white/70">
                            O arquivo CSV deve conter as seguintes colunas com os dados dos exoplanetas
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">ORBITAL_PERIOD_DAYS</div>
                              <div className="text-sm text-white/70">Período Orbital em dias</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">TRANSIT_DURATION_HOURS</div>
                              <div className="text-sm text-white/70">Duração do Trânsito em horas</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">TRANSIT_DEPTH_PPM</div>
                              <div className="text-sm text-white/70">Profundidade do Trânsito em partes por milhão</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">PLANET_RADIUS_REARTH</div>
                              <div className="text-sm text-white/70">Raio do Planeta em raios terrestres</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">PLANET_INSOLATION_EFLUX</div>
                              <div className="text-sm text-white/70">Fluxo de Insolação em fluxo terrestre</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">PLANET_EQ_TEMP_K</div>
                              <div className="text-sm text-white/70">Temperatura de Equilíbrio em Kelvin</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">STELLAR_TEFF_K</div>
                              <div className="text-sm text-white/70">Temperatura Efetiva Estelar em Kelvin</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">STELLAR_LOGG_CMS2</div>
                              <div className="text-sm text-white/70">Gravidade Superficial Estelar em log10(cm/s²)</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">STELLAR_RADIUS_RSUN</div>
                              <div className="text-sm text-white/70">Raio Estelar em raios solares</div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {planets.length > PLANETS_PER_PAGE && (
                  <div className="flex items-center justify-between mb-4 text-sm text-white/60">
                    <span>
                      Mostrando {startIndex + 1}-{Math.min(endIndex, planets.length)} de {planets.length} planetas
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-white">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {currentPlanets.map((planet, index) => (
                    <Card key={planet.id} className="p-4 bg-deep-space/50 border border-nebula-purple/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Planeta {startIndex + index + 1}</h3>
                        {planets.length > 1 && (
                          <Button
                            onClick={() => removePlanet(planet.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Período Orbital (dias)" : "Orbital Period [days]"}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 365.25"
                            value={planet.orbitalPeriod}
                            onChange={(e) => updatePlanet(planet.id, "orbitalPeriod", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Duração do Trânsito (hrs)" : "Transit Duration [hrs]"}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 6.5"
                            value={planet.transitDuration}
                            onChange={(e) => updatePlanet(planet.id, "transitDuration", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Profundidade do Trânsito (ppm)" : "Transit Depth [ppm]"}
                          </Label>
                          <Input
                            type="number"
                            step="1"
                            placeholder="Ex: 8400"
                            value={planet.transitDepth}
                            onChange={(e) => updatePlanet(planet.id, "transitDepth", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Raio do Planeta (R⊕)" : "Planet Radius [R⊕]"}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 1.0"
                            value={planet.planetRadius}
                            onChange={(e) => updatePlanet(planet.id, "planetRadius", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Fluxo de Insolação (F⊕)" : "Insolation Flux [F⊕]"}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 1.0"
                            value={planet.insolationFlux}
                            onChange={(e) => updatePlanet(planet.id, "insolationFlux", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Temperatura de Equilíbrio (K)" : "Equilibrium Temp [K]"}
                          </Label>
                          <Input
                            type="number"
                            step="1"
                            placeholder="Ex: 288"
                            value={planet.eqTemp}
                            onChange={(e) => updatePlanet(planet.id, "eqTemp", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Temp. Efetiva Estelar (K)" : "Stellar Teff [K]"}
                          </Label>
                          <Input
                            type="number"
                            step="1"
                            placeholder="Ex: 5778"
                            value={planet.stellarTeff}
                            onChange={(e) => updatePlanet(planet.id, "stellarTeff", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Gravidade Superficial Estelar" : "Stellar log(g) [cm/s²]"}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 4.44"
                            value={planet.stellarLogg}
                            onChange={(e) => updatePlanet(planet.id, "stellarLogg", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Raio Estelar (R☉)" : "Stellar Radius [R☉]"}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 1.0"
                            value={planet.stellarRadius}
                            onChange={(e) => updatePlanet(planet.id, "stellarRadius", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
