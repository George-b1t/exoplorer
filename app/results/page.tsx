"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Exoplanet } from "@/components/exoplanet"
import { ExoplanetData } from "@/components/galaxy"
import { Canvas } from "@react-three/fiber"

interface SimilarPlanet {
  name: string
  pl_orbper: number | null
  pl_trandep: number | null
  pl_rade: number | null
  pl_insol: number | null
  pl_eqt: number | null
  st_teff: number | null
  st_logg: number | null
  st_rad: number | null
  pl_status: string
  pl_trandurh: number | null
  similarity: number
}

interface PredictionResult {
  result: boolean
  similar: SimilarPlanet[]
}

interface PredictionParams {
  dataSource: string
  hyperparameters: {
    maxDepth: string
    learningRate: string
    nEstimators: string
  }
  formData: {
    orbitalPeriod: string
    transitDuration: string
    transitDepth: string
    planetRadius: string
    planetInsolation: string
    planetEqTemp: string
    stellarTeff: string
    stellarLogg: string
    stellarRadius: string
  }
  timestamp: string
}

export function MiniPlanetPreview({ planet }: { planet: ExoplanetData }) {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 1.75]}  
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 2.2], fov: 35 }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[1.5, 1.2, 1.8]} intensity={0.5} />
      <Exoplanet planet={planet} />
    </Canvas>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [predictionParams, setPredictionParams] = useState<PredictionParams | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const resultData = localStorage.getItem("predictionResult")
      const paramsData = localStorage.getItem("predictionParams")

      if (!resultData || !paramsData) {
        console.error("[v0] No prediction data found in localStorage")
        router.push("/search")
        return
      }

      const result = JSON.parse(resultData) as PredictionResult
      const params = JSON.parse(paramsData) as PredictionParams

      console.log("[v0] Loaded prediction result:", result)
      console.log("[v0] Loaded prediction params:", params)

      setPredictionResult(result)
      setPredictionParams(params)
    } catch (error) {
      console.error("[v0] Error loading prediction data:", error)
      router.push("/search")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <SpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Carregando resultados...</div>
        </div>
      </div>
    )
  }

  if (!predictionResult || !predictionParams) {
    return null
  }

  const { result, similar } = predictionResult
  const { formData } = predictionParams

  const mapSimilarToExoplanetData = (planet: SimilarPlanet): ExoplanetData => ({
    name: planet.name,
    pl_orbper: planet.pl_orbper,
    pl_rade: planet.pl_rade,
    pl_eqt: planet.pl_eqt,
    st_teff: planet.st_teff,
    st_rad: planet.st_rad,
    pl_masse: 50, // estimativa grosseira
    isPlanet: planet.pl_status === "Confirmed" ? 1 : 0,
    pl_orbsmax: null,
    id: "",
    st_mass: null,
    x: 0,
    y: 0,
    z: 0,
  })

  const avgSimilarity = similar.length > 0 ? similar.reduce((acc, p) => acc + (1 - p.similarity), 0) / similar.length : 0
  const confidence = Math.round(avgSimilarity * 100)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <Link href="/search">
            <Button variant="ghost" className="mb-6 text-white hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Analysis Result */}
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
              <div className="text-center space-y-6">
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    result ? "bg-nebula-purple/20 glow-purple" : "bg-destructive/20"
                  }`}
                >
                  {result ? (
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500" />
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {result ? "Pode ser um Exoplaneta!" : "Parâmetros Atípicos"}
                  </h1>
                  <p className="text-xl text-white/80">Confiança: {confidence}%</p>
                </div>

                <p className="text-lg leading-relaxed max-w-2xl mx-auto text-white/90">
                  {result
                    ? "Com base nos parâmetros fornecidos, o modelo identificou que este objeto tem características compatíveis com exoplanetas conhecidos."
                    : "Os parâmetros fornecidos não correspondem aos padrões típicos de exoplanetas conhecidos. Isso pode indicar um objeto incomum ou parâmetros fora do esperado."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                  {formData.orbitalPeriod && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nebula-purple">{formData.orbitalPeriod}</div>
                      <div className="text-sm text-white/70">Período Orbital (dias)</div>
                    </div>
                  )}
                  {formData.planetRadius && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nebula-purple">{formData.planetRadius}</div>
                      <div className="text-sm text-white/70">Raio (R⊕)</div>
                    </div>
                  )}
                  {formData.planetEqTemp && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nebula-purple">{formData.planetEqTemp}</div>
                      <div className="text-sm text-white/70">Temp. (K)</div>
                    </div>
                  )}
                  {formData.transitDuration && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nebula-purple">{formData.transitDuration}</div>
                      <div className="text-sm text-white/70">Duração Trânsito (h)</div>
                    </div>
                  )}
                  {formData.stellarTeff && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nebula-purple">{formData.stellarTeff}</div>
                      <div className="text-sm text-white/70">Temp. Estelar (K)</div>
                    </div>
                  )}
                  {formData.stellarRadius && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nebula-purple">{formData.stellarRadius}</div>
                      <div className="text-sm text-white/70">Raio Estelar (R☉)</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Similar Planets */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Exoplanetas Similares</h2>
              <p className="text-white/80 mb-6">
                Estes são os exoplanetas mais similares com base nos parâmetros fornecidos
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {similar.map((planet, index) => (
                  <Card
                    key={`${planet.name}-${index}`}
                    className="p-6 hover:border-nebula-purple transition-colors bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/20"
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className="w-full">
                        <MiniPlanetPreview planet={mapSimilarToExoplanetData(planet)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 text-white">{planet.name}</h3>
                        <p className="text-sm text-white/70 mb-3">
                          {planet.pl_status} • Similaridade: {100 - Math.round(planet.similarity * 100)}%
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {planet.pl_orbper !== null && (
                            <div>
                              <span className="text-white/60">Período:</span>{" "}
                              <span className="font-medium text-white">{planet.pl_orbper.toFixed(2)} dias</span>
                            </div>
                          )}
                          {planet.pl_rade !== null && (
                            <div>
                              <span className="text-white/60">Raio:</span>{" "}
                              <span className="font-medium text-white">{planet.pl_rade.toFixed(2)} R⊕</span>
                            </div>
                          )}
                          {planet.pl_eqt !== null && (
                            <div>
                              <span className="text-white/60">Temp:</span>{" "}
                              <span className="font-medium text-white">{planet.pl_eqt.toFixed(0)} K</span>
                            </div>
                          )}
                          {planet.pl_insol !== null && (
                            <div>
                              <span className="text-white/60">Insolação:</span>{" "}
                              <span className="font-medium text-white">{planet.pl_insol.toFixed(2)} S⊕</span>
                            </div>
                          )}
                          {planet.st_teff !== null && (
                            <div>
                              <span className="text-white/60">Temp. Estelar:</span>{" "}
                              <span className="font-medium text-white">{planet.st_teff.toFixed(0)} K</span>
                            </div>
                          )}
                          {planet.st_rad !== null && (
                            <div>
                              <span className="text-white/60">Raio Estelar:</span>{" "}
                              <span className="font-medium text-white">{planet.st_rad.toFixed(2)} R☉</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {similar.length === 0 && (
                <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/20 text-center">
                  <p className="text-white/70">Nenhum exoplaneta similar encontrado com os parâmetros fornecidos.</p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
