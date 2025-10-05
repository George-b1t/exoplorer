"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Sparkles, Telescope, Database, Users, ChevronDown } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <section className="relative min-h-[60vh] flex items-center justify-center">
          <div
            className={`text-center space-y-6 px-4 transition-all duration-1000 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance">
              <span className="text-white">Explore o universo dos</span>
              <br />
              <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent animate-pulse-glow">
                Exoplanetas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed text-pretty max-w-3xl mx-auto">
              Descubra mundos além do nosso sistema solar e encontre planetas similares aos seus parâmetros
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-nebula-purple to-cosmic-cyan hover:from-nebula-purple/80 hover:to-cosmic-cyan/80 text-white border-0 shadow-lg shadow-nebula-purple/50"
                onClick={() => router.push("/search")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Buscar por Parâmetros
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-white/30 hover:border-white text-white hover:bg-white/10 bg-transparent"
                onClick={() => router.push("/catalog")}
              >
                <Telescope className="w-5 h-5 mr-2" />
                Ver Catálogo
              </Button>
            </div>
            <div className="pt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/50 mx-auto" />
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="text-center p-6 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30 backdrop-blur-sm">
              <Telescope className="w-12 h-12 mx-auto mb-3 text-nebula-purple" />
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-sm text-white/80">Exoplanetas Descobertos</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30 backdrop-blur-sm">
              <Database className="w-12 h-12 mx-auto mb-3 text-cosmic-cyan" />
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <div className="text-sm text-white/80">Modos de Visualização</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-nebula-pink/10 border border-nebula-pink/30 backdrop-blur-sm">
              <Users className="w-12 h-12 mx-auto mb-3 text-nebula-pink" />
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-sm text-white/80">Possibilidades</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-nebula-purple/20 to-cosmic-cyan/20 border-2 border-nebula-purple/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">Busca Inteligente</h3>
              <p className="text-white/80 leading-relaxed">
                Insira parâmetros como massa, raio, temperatura e período orbital para descobrir se correspondem a um
                exoplaneta real e encontrar mundos similares.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cosmic-cyan/20 to-nebula-pink/20 border-2 border-cosmic-cyan/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">Visualização 3D</h3>
              <p className="text-white/80 leading-relaxed">
                Explore nossa galáxia interativa em 3D com milhares de exoplanetas posicionados no espaço. Navegue,
                aproxime e descubra detalhes de cada mundo.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
