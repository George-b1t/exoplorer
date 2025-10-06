"use client"

import type React from "react"

import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMode } from "@/contexts/mode-context"
import { ChevronLeft, ChevronRight, Plus, Table, Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react"

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
  isPlanet: string // "true" ou "false"
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
      isPlanet: "",
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
        alert("Invalid CSV: empty file or no data")
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
          isPlanet: values[headers.indexOf("IS_PLANET")] || "",
        }

        importedPlanets.push(planet)
      }

      setPlanets(importedPlanets)
      setCurrentPage(1)
      alert(`${importedPlanets.length} planets imported successfully!`)
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
        isPlanet: "",
      }
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
      alert("Model trained successfully!")
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
              <h1 className="text-4xl font-bold mb-4 text-white">Train AI Model</h1>
              <p className="text-white/80 text-lg">
                {isEducational
                  ? "Upload your data to train the AI model and generate predictions based on your input."
                  : "Upload your data to train the AI model and generate predictions based on your input."}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Planets Data Card */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30 lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Planet Data</h2>
                  <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="border-cosmic-cyan/30 hover:border-cosmic-cyan text-white hover:bg-cosmic-cyan/10 bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button
                      onClick={addPlanet}
                      size="sm"
                      variant="outline"
                      className="border-nebula-purple/30 hover:border-nebula-purple text-white hover:bg-nebula-purple/10 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
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
                          <DialogTitle className="text-2xl font-bold text-white">Expected CSV Format</DialogTitle>
                          <DialogDescription className="text-white/70">
                            The CSV file must contain the following columns with exoplanet data
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">ORBITAL_PERIOD_DAYS</div>
                              <div className="text-sm text-white/70">Orbital Period in Days</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">TRANSIT_DURATION_HOURS</div>
                              <div className="text-sm text-white/70">Transit Duration in Hours</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">TRANSIT_DEPTH_PPM</div>
                              <div className="text-sm text-white/70">Transit Depth in Parts Per Million</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">PLANET_RADIUS_REARTH</div>
                              <div className="text-sm text-white/70">Planet Radius in Earth Radii</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">PLANET_INSOLATION_EFLUX</div>
                              <div className="text-sm text-white/70">Insolation Flux in Earth Flux</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">PLANET_EQ_TEMP_K</div>
                              <div className="text-sm text-white/70">Equilibrium Temperature in Kelvin</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">STELLAR_TEFF_K</div>
                              <div className="text-sm text-white/70">Stellar Effective Temperature in Kelvin</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">STELLAR_LOGG_CMS2</div>
                              <div className="text-sm text-white/70">Stellar Surface Gravity in log10(cm/s²)</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">STELLAR_RADIUS_RSUN</div>
                              <div className="text-sm text-white/70">Stellar Radius in Solar Radii</div>
                            </div>
                            <div className="p-3 rounded-lg bg-deep-space/50 border border-cosmic-cyan/20">
                              <div className="font-mono text-sm text-cosmic-cyan mb-1">IS_PLANET</div>
                              <div className="text-sm text-white/70">Boolean flag (true/false)</div>
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
                      Showing {startIndex + 1}-{Math.min(endIndex, planets.length)} of {planets.length} planets
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
                        Page {currentPage} of {totalPages}
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
                        <h3 className="font-bold text-white">Planet {startIndex + index + 1}</h3>
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
                            {isEducational ? "Orbital Period (dias)" : "Orbital Period [days]"}
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
                            {isEducational ? "Transit Duration (hrs)" : "Transit Duration [hrs]"}
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
                            {isEducational ? "Transit Depth (ppm)" : "Transit Depth [ppm]"}
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
                            {isEducational ? "Planet Radius (R⊕)" : "Planet Radius [R⊕]"}
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
                            {isEducational ? "Insolation Flux (F⊕)" : "Insolation Flux [F⊕]"}
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
                            {isEducational ? "Equilibrium Temp (K)" : "Equilibrium Temp [K]"}
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
                            {isEducational ? "Effective Stellar Temperature (K)" : "Stellar Teff [K]"}
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
                            {isEducational ? "Stellar Surface Gravity" : "Stellar log(g) [cm/s²]"}
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
                            {isEducational ? "Stellar Radius (R☉)" : "Stellar Radius [R☉]"}
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

                        <div>
                          <Label className="text-white/80 text-xs mb-1 block">
                            {isEducational ? "Is Planet?" : "Is Planet"}
                          </Label>
                          <select
                            value={planet.isPlanet}
                            onChange={(e) => updatePlanet(planet.id, "isPlanet", e.target.value)}
                            className="bg-space-black/50 border-white/10 text-white text-sm rounded-md w-full py-2 px-3"
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
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
