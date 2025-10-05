"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { analyzeExoplanetPotential, findSimilarExoplanets } from "@/lib/exoplanet-data"
import { CheckCircle2, XCircle, ArrowLeft, Globe } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const params = {
    mass: searchParams.get("mass") ? Number.parseFloat(searchParams.get("mass")!) : undefined,
    radius: searchParams.get("radius") ? Number.parseFloat(searchParams.get("radius")!) : undefined,
    temperature: searchParams.get("temperature") ? Number.parseFloat(searchParams.get("temperature")!) : undefined,
    orbitalPeriod: searchParams.get("orbitalPeriod")
      ? Number.parseFloat(searchParams.get("orbitalPeriod")!)
      : undefined,
  }

  const analysis = analyzeExoplanetPotential(params)
  const similarPlanets = findSimilarExoplanets(params)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <Link href="/search">
            <Button variant="ghost" className="mb-6 text-white hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Analysis Result */}
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
              <div className="text-center space-y-6">
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    analysis.isExoplanet ? "bg-nebula-purple/20 glow-purple" : "bg-destructive/20"
                  }`}
                >
                  {analysis.isExoplanet ? (
                    <CheckCircle2 className="w-12 h-12 text-nebula-purple" />
                  ) : (
                    <XCircle className="w-12 h-12 text-destructive" />
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {analysis.isExoplanet ? "Could be an Exoplanet!" : "Atypical Parameters"}
                  </h1>
                  <p className="text-xl text-white/80">Confidence: {analysis.confidence}%</p>
                </div>

                <p className="text-lg leading-relaxed max-w-2xl mx-auto text-white/90">{analysis.reasoning}</p>

                {params.mass && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                    {params.mass && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nebula-purple">{params.mass}</div>
                        <div className="text-sm text-white/70">Mass (M⊕)</div>
                      </div>
                    )}
                    {params.radius && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nebula-purple">{params.radius}</div>
                        <div className="text-sm text-white/70">Radius (R⊕)</div>
                      </div>
                    )}
                    {params.temperature && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nebula-purple">{params.temperature}</div>
                        <div className="text-sm text-white/70">Temp. (K)</div>
                      </div>
                    )}
                    {params.orbitalPeriod && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nebula-purple">{params.orbitalPeriod}</div>
                        <div className="text-sm text-white/70">Period (days)</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Similar Planets */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Similar Exoplanets</h2>
              <p className="text-white/80 mb-6">These are the possible exoplanets based on the provided parameters</p>

              <div className="grid md:grid-cols-2 gap-6">
                {similarPlanets.map((planet) => (
                  <Card
                    key={planet.id}
                    className="p-6 hover:border-nebula-purple transition-colors bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-nebula-purple/40 to-cosmic-cyan/40 flex-shrink-0 planet-float" />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 text-white">{planet.name}</h3>
                        <p className="text-sm text-white/70 mb-3">{planet.type}</p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-white/60">Mass:</span>{" "}
                            <span className="font-medium text-white">{planet.mass} M⊕</span>
                          </div>
                          <div>
                            <span className="text-white/60">Radius:</span>{" "}
                            <span className="font-medium text-white">{planet.radius} R⊕</span>
                          </div>
                          <div>
                            <span className="text-white/60">Temp:</span>{" "}
                            <span className="font-medium text-white">{planet.temperature} K</span>
                          </div>
                          <div>
                            <span className="text-white/60">Period:</span>{" "}
                            <span className="font-medium text-white">{planet.orbitalPeriod} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
