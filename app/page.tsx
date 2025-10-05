"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Telescope, BookOpen, Brain, Rocket, ChevronDown } from "lucide-react"

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

        <section className="relative min-h-[70vh] flex items-center justify-center">
          <div
            className={`text-center space-y-8 px-4 transition-all duration-1000 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-nebula-purple/20 border border-nebula-purple/40 backdrop-blur-sm mb-4">
              <span className="text-nebula-purple text-sm font-medium">Plataforma Educacional de Exoplanetas</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              <span className="text-white">Descubra e Aprenda sobre</span>
              <br />
              <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                Mundos Além do Sistema Solar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed text-pretty max-w-2xl mx-auto">
              Uma jornada interativa pelo universo dos exoplanetas. Explore, aprenda e use inteligência artificial para
              prever características de planetas distantes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-nebula-purple to-cosmic-cyan hover:from-nebula-purple/80 hover:to-cosmic-cyan/80 text-white border-0 shadow-lg shadow-nebula-purple/50"
                onClick={() => router.push("/search")}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Começar Exploração
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

            <div className="pt-8 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/50 mx-auto" />
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">O que você pode fazer?</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Ferramentas interativas para explorar e entender o fascinante mundo dos exoplanetas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div
              className="p-8 rounded-2xl bg-gradient-to-br from-nebula-purple/20 to-nebula-purple/5 border-2 border-nebula-purple/30 backdrop-blur-sm hover:border-nebula-purple/50 transition-all cursor-pointer"
              onClick={() => router.push("/search")}
            >
              <div className="w-14 h-14 rounded-full bg-nebula-purple/20 flex items-center justify-center mb-4">
                <Rocket className="w-7 h-7 text-nebula-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predição de Exoplanetas</h3>
              <p className="text-white/70 leading-relaxed">
                Use IA para prever se um conjunto de parâmetros corresponde a um exoplaneta real. Descubra planetas
                similares no universo.
              </p>
            </div>

            <div
              className="p-8 rounded-2xl bg-gradient-to-br from-cosmic-cyan/20 to-cosmic-cyan/5 border-2 border-cosmic-cyan/30 backdrop-blur-sm hover:border-cosmic-cyan/50 transition-all cursor-pointer"
              onClick={() => router.push("/training")}
            >
              <div className="w-14 h-14 rounded-full bg-cosmic-cyan/20 flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-cosmic-cyan" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Treinar Modelo de IA</h3>
              <p className="text-white/70 leading-relaxed">
                Configure e treine seu próprio modelo de machine learning com dados de exoplanetas. Aprenda como
                funciona a inteligência artificial.
              </p>
            </div>

            <div
              className="p-8 rounded-2xl bg-gradient-to-br from-nebula-pink/20 to-nebula-pink/5 border-2 border-nebula-pink/30 backdrop-blur-sm hover:border-nebula-pink/50 transition-all cursor-pointer"
              onClick={() => router.push("/galaxy")}
            >
              <div className="w-14 h-14 rounded-full bg-nebula-pink/20 flex items-center justify-center mb-4">
                <Telescope className="w-7 h-7 text-nebula-pink" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Exploração 3D</h3>
              <p className="text-white/70 leading-relaxed">
                Navegue por uma galáxia interativa em 3D com milhares de exoplanetas. Visualize e explore cada
                descoberta espacial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-nebula-purple" />
              <div className="text-3xl font-bold text-white mb-1">2</div>
              <div className="text-sm text-white/70">Modos de Aprendizado</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Telescope className="w-8 h-8 mx-auto mb-2 text-cosmic-cyan" />
              <div className="text-3xl font-bold text-white mb-1">5000+</div>
              <div className="text-sm text-white/70">Exoplanetas</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Brain className="w-8 h-8 mx-auto mb-2 text-nebula-pink" />
              <div className="text-3xl font-bold text-white mb-1">IA</div>
              <div className="text-sm text-white/70">Machine Learning</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Rocket className="w-8 h-8 mx-auto mb-2 text-nebula-purple" />
              <div className="text-3xl font-bold text-white mb-1">3D</div>
              <div className="text-sm text-white/70">Visualização</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
