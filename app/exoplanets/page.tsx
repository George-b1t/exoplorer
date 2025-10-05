import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"
import { exoplanets } from "@/lib/exoplanet-data"

export default function ExoplanetsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">Catálogo de Exoplanetas</h1>
            <p className="text-white/80 text-lg">Explore nossa coleção de exoplanetas descobertos</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exoplanets.map((planet) => (
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
                        <span className="text-white/60">Massa:</span>
                        <span className="font-medium text-white">{planet.mass} M⊕</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Raio:</span>
                        <span className="font-medium text-white">{planet.radius} R⊕</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Distância:</span>
                        <span className="font-medium text-white">{planet.distance} anos-luz</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Descoberto:</span>
                        <span className="font-medium text-white">{planet.discoveryYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
