"use client"

import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useMode } from "@/contexts/mode-context"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

// Valores padrão da Terra
const EARTH_DEFAULTS = {
  orbitalPeriod: 365,
  transitDuration: 13,
  transitDepth: 84,
  planetRadius: 1.0,
  planetInsolation: 1.0,
  planetEqTemp: 255,
  stellarTeff: 5770,
  stellarLogg: 4.44,
  stellarRadius: 1.0,
}

// Ranges para os sliders
const RANGES = {
  orbitalPeriod: { min: 0.20, max: 1837, step: 0.1 },
  transitDuration: { min: 0.1, max: 30, step: 0.1 },
  transitDepth: { min: 12.2, max: 145640, step: 0.1 },
  planetRadius: { min: 0.27, max: 140.1, step: 0.1 },
  planetInsolation: { min: 0.0, max: 238125, step: 0.1 },
  planetEqTemp: { min: 37, max: 5634, step: 0.1 },
  stellarTeff: { min: 2703, max: 50000, step: 0.1 },
  stellarLogg: { min: 0.2, max: 5.8, step: 0.1 },
  stellarRadius: { min: 0.1, max: 19.5, step: 0.1 },
}

export default function SearchPage() {
  const { mode } = useMode()
  const router = useRouter()
  const { toast } = useToast()

  const [dataSource, setDataSource] = useState<"platform" | "user" | "both">("platform")
  const [isLoading, setIsLoading] = useState(false)

  const [hyperparameters, setHyperparameters] = useState({
    maxDepth: "3",
    learningRate: "0.1",
    nEstimators: "100",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const [formData, setFormData] = useState({
    orbitalPeriod: "",
    transitDuration: "",
    transitDepth: "",
    planetRadius: "",
    planetInsolation: "",
    planetEqTemp: "",
    stellarTeff: "",
    stellarLogg: "",
    stellarRadius: "",
  })

  useEffect(() => {
    if (mode === "educational") {
      setFormData({
        orbitalPeriod: String(EARTH_DEFAULTS.orbitalPeriod),
        transitDuration: String(EARTH_DEFAULTS.transitDuration),
        transitDepth: String(EARTH_DEFAULTS.transitDepth),
        planetRadius: String(EARTH_DEFAULTS.planetRadius),
        planetInsolation: String(EARTH_DEFAULTS.planetInsolation),
        planetEqTemp: String(EARTH_DEFAULTS.planetEqTemp),
        stellarTeff: String(EARTH_DEFAULTS.stellarTeff),
        stellarLogg: String(EARTH_DEFAULTS.stellarLogg),
        stellarRadius: String(EARTH_DEFAULTS.stellarRadius),
      })
    }
  }, [mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Map dataSource to sessionMode
      const sessionModeMap = {
        platform: "baseline",
        user: "session_only",
        both: "sum",
      }

      // Build query parameters for the API
      const params = new URLSearchParams()

      // Add sessionMode
      params.append("sessionMode", sessionModeMap[dataSource])

      // Add hyperparameters if they have values
      if (hyperparameters.maxDepth) {
        params.append("max_depth", hyperparameters.maxDepth)
      }
      if (hyperparameters.learningRate) {
        params.append("learning_rate", hyperparameters.learningRate)
      }
      if (hyperparameters.nEstimators) {
        params.append("n_estimators", hyperparameters.nEstimators)
      }

      // Add planetary and stellar parameters with correct API field names
      const fieldMapping = {
        orbitalPeriod: "ORBITAL_PERIOD_DAYS",
        transitDuration: "TRANSIT_DURATION_HOURS",
        transitDepth: "TRANSIT_DEPTH_PPM",
        planetRadius: "PLANET_RADIUS_REARTH",
        planetInsolation: "PLANET_INSOLATION_EFLUX",
        planetEqTemp: "PLANET_EQ_TEMP_K",
        stellarTeff: "STELLAR_TEFF_K",
        stellarLogg: "STELLAR_LOGG_CMS2",
        stellarRadius: "STELLAR_RADIUS_RSUN",
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          const apiFieldName = fieldMapping[key as keyof typeof fieldMapping]
          params.append(apiFieldName, value)
        }
      })

      // Call the backend API
      const response = await fetch(`http://82.25.69.243:8000/api/v1/predict?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Save the result to localStorage
      localStorage.setItem("predictionResult", JSON.stringify(result))
      localStorage.setItem(
        "predictionParams",
        JSON.stringify({
          dataSource,
          hyperparameters,
          formData,
          timestamp: new Date().toISOString(),
        }),
      )

      toast({
        title: "Analysis completed!",
        description: "The results have been successfully saved.",
      })

      // Redirect to results page
      router.push("/results")
    } catch (error) {
      console.error("[v0] Error calling prediction API:", error)
      toast({
        title: "Analysis error",
        description: error instanceof Error ? error.message : "An error occurred while processing your request.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isEducational = mode === "educational"

  const renderField = (id: keyof typeof formData, label: string, unit: string, description?: string) => {
    const range = RANGES[id]
    const value = formData[id]
      ? Number.parseFloat(formData[id])
      : isEducational
        ? EARTH_DEFAULTS[id as keyof typeof EARTH_DEFAULTS]
        : range.min

    return (
      <div className="space-y-3">
        <Label htmlFor={id} className="text-white text-base">
          {label}
        </Label>

        {isEducational ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-nebula-purple">
                <Slider
                  value={[value]}
                  onValueChange={(values) => setFormData({ ...formData, [id]: String(values[0]) })}
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2 w-40">
                <Input
                  id={id}
                  type="number"
                  step={range.step}
                  min={range.min}
                  max={range.max}
                  value={formData[id]}
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                  className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                />
                <span className="text-white/60 text-sm whitespace-nowrap">{unit}</span>
              </div>
            </div>
            {description && <p className="text-xs text-white/60 leading-relaxed">{description}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              id={id}
              type="number"
              step={range.step}
              placeholder={`Ex: ${EARTH_DEFAULTS[id as keyof typeof EARTH_DEFAULTS]}`}
              value={formData[id]}
              onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
              className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
            />
            <span className="text-white/60 text-sm whitespace-nowrap">{unit}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white">Search by Parameters</h1>
              <p className="text-white/80 text-lg">
                {isEducational
                  ? "Enter the characteristics of the planet you envision"
                  : "Enter the physical parameters for analysis"}
              </p>
            </div>

            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Data Source for Prediction
                  </h2>
                  <div className="space-y-3">
                    <Label className="text-white text-base">
                      {isEducational
                        ? "Choose which data to use for prediction:"
                        : "Select the data source:"}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setDataSource("platform")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          dataSource === "platform"
                            ? "border-nebula-purple bg-nebula-purple/20 text-white"
                            : "border-white/20 bg-deep-space/30 text-white/70 hover:border-white/40"
                        }`}
                      >
                        <div className="font-semibold mb-1">Platform Data</div>
                        {isEducational && (
                          <div className="text-xs text-white/60">Use existing data in the system</div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDataSource("user")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          dataSource === "user"
                            ? "border-cosmic-cyan bg-cosmic-cyan/20 text-white"
                            : "border-white/20 bg-deep-space/30 text-white/70 hover:border-white/40"
                        }`}
                      >
                        <div className="font-semibold mb-1">My Data</div>
                        {isEducational && <div className="text-xs text-white/60">Use the data you registered</div>}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDataSource("both")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          dataSource === "both"
                            ? "border-star-yellow bg-star-yellow/20 text-white"
                            : "border-white/20 bg-deep-space/30 text-white/70 hover:border-white/40"
                        }`}
                      >
                        <div className="font-semibold mb-1">Both</div>
                        {isEducational && (
                          <div className="text-xs text-white/60">Combine all available data</div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parâmetros Planetários */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Planet Parameters
                  </h2>

                  {renderField(
                    "orbitalPeriod",
                    "Orbital Period",
                    "days",
                    isEducational ? "Earth takes 365 days to complete an orbit around the Sun." : undefined,
                  )}

                  {renderField(
                    "transitDuration",
                    "Transit Duration",
                    "hours",
                    isEducational ? "Time it takes for the planet to pass in front of its star." : undefined,
                  )}

                  {renderField(
                    "transitDepth",
                    "Transit Depth",
                    "ppm",
                    isEducational
                      ? "When the light from the star decreases as the planet passes in front (in parts per million)."
                      : undefined,
                  )}

                  {renderField(
                    "planetRadius",
                    "Planet Radius",
                    "R⊕",
                    isEducational ? "Earth's radius is 1.0. JJupiter has a radius about 11 times larger." : undefined,
                  )}

                  {renderField(
                    "planetInsolation",
                    "Insolation Flux",
                    "S⊕",
                    isEducational
                      ? "Amount of energy received by the planet from its star, relative to Earth."
                      : undefined,
                  )}

                  {renderField(
                    "planetEqTemp",
                    "Equilibrium Temperature",
                    "K",
                    isEducational
                      ? "Earth has an equilibrium temperature of 255K. Surface temperature is higher due to the greenhouse effect."
                      : undefined,
                  )}
                </div>

                {/* Parâmetros Estelares */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Stellar Parameters
                  </h2>

                  {renderField(
                    "stellarTeff",
                    "Stellar Effective Temperature",
                    "K",
                    isEducational
                      ? "The Sun has a temperature of 5778K. Hotter stars are blue, cooler ones are red."
                      : undefined,
                  )}

                  {renderField(
                    "stellarLogg",
                    "Stellar Surface Gravity",
                    "log₁₀(cm/s²)",
                    isEducational
                      ? "The Sun has log g = 4.44. Higher values indicate smaller, denser stars."
                      : undefined,
                  )}

                  {renderField(
                    "stellarRadius",
                    "Stellar Radius",
                    "R☉",
                    isEducational ? "The Sun has a radius of 1.0. Red giants can have radii 100x larger." : undefined,
                  )}
                </div>

                <div className="space-y-4">
                  {isEducational ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full text-left p-4 rounded-lg border-2 border-white/20 bg-deep-space/30 hover:border-white/40 transition-all"
                      >
                        <div>
                          <h2 className="text-lg font-semibold text-white">Advanced Settings</h2>
                          <p className="text-sm text-white/60">Adjust the hyperparameters of the prediction model</p>
                        </div>
                        {showAdvanced ? (
                          <ChevronUp className="w-5 h-5 text-white" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white" />
                        )}
                      </button>

                      {showAdvanced && (
                        <div className="space-y-6 p-6 rounded-lg border-2 border-white/10 bg-deep-space/20">
                          <div className="space-y-2">
                            <Label htmlFor="maxDepth" className="text-white text-base">
                              Maximum Depth (max_depth)
                            </Label>
                            <Input
                              id="maxDepth"
                              type="number"
                              min="1"
                              max="20"
                              step="1"
                              value={hyperparameters.maxDepth}
                              onChange={(e) => setHyperparameters({ ...hyperparameters, maxDepth: e.target.value })}
                              className="bg-deep-space/50 border-nebula-purple/30 text-white"
                            />
                            <p className="text-xs text-white/60 leading-relaxed">
                              Controls the maximum depth of each tree. Higher values capture more detail but can lead to overfitting.
                              
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="learningRate" className="text-white text-base">
                              Learning Rate (learning_rate)
                            </Label>
                            <Input
                              id="learningRate"
                              type="number"
                              min="0.001"
                              max="1"
                              step="0.001"
                              value={hyperparameters.learningRate}
                              onChange={(e) => setHyperparameters({ ...hyperparameters, learningRate: e.target.value })}
                              className="bg-deep-space/50 border-nebula-purple/30 text-white"
                            />
                            <p className="text-xs text-white/60 leading-relaxed">
                              Controls how much each tree contributes to the final prediction. Lower values (0.01-0.1)
                              improve generalization.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nEstimators" className="text-white text-base">
                              Number of Trees (n_estimators)
                            </Label>
                            <Input
                              id="nEstimators"
                              type="number"
                              min="10"
                              max="1000"
                              step="10"
                              value={hyperparameters.nEstimators}
                              onChange={(e) => setHyperparameters({ ...hyperparameters, nEstimators: e.target.value })}
                              className="bg-deep-space/50 border-nebula-purple/30 text-white"
                            />
                            <p className="text-xs text-white/60 leading-relaxed">
                              Number of trees in the model. More trees can improve accuracy but increase the risk
                              of overfitting.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                        Model Hyperparameters
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maxDepth" className="text-white text-sm">
                            Maximum Depth (max_depth)
                          </Label>
                          <Input
                            id="maxDepth"
                            type="number"
                            min="1"
                            max="20"
                            step="1"
                            value={hyperparameters.maxDepth}
                            onChange={(e) => setHyperparameters({ ...hyperparameters, maxDepth: e.target.value })}
                            className="bg-deep-space/50 border-nebula-purple/30 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="learningRate" className="text-white text-sm">
                            Learning Rate (learning_rate)
                          </Label>
                          <Input
                            id="learningRate"
                            type="number"
                            min="0.001"
                            max="1"
                            step="0.001"
                            value={hyperparameters.learningRate}
                            onChange={(e) => setHyperparameters({ ...hyperparameters, learningRate: e.target.value })}
                            className="bg-deep-space/50 border-nebula-purple/30 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nEstimators" className="text-white text-sm">
                            NNumber of Trees (n_estimators)
                          </Label>
                          <Input
                            id="nEstimators"
                            type="number"
                            min="10"
                            max="1000"
                            step="10"
                            value={hyperparameters.nEstimators}
                            onChange={(e) => setHyperparameters({ ...hyperparameters, nEstimators: e.target.value })}
                            className="bg-deep-space/50 border-nebula-purple/30 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-nebula-purple to-cosmic-cyan hover:from-nebula-purple/80 hover:to-cosmic-cyan/80 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Analyze Parameters
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
