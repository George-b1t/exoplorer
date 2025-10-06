"use client"

import { Galaxy } from "@/components/galaxy"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Brain,
  ChevronDown,
  Globe,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
  Telescope,
  Users,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

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

        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center">
          <div
            className={`text-center space-y-8 px-4 transition-all duration-1000 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-nebula-purple/20 border border-nebula-purple/40 backdrop-blur-sm mb-4">
              <span className="text-nebula-purple text-sm font-medium">Educational Exoplanet Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
              <span className="text-white">Explore the Universe of</span>
              <br />
              <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                Exoplanets
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed text-pretty max-w-3xl mx-auto">
              An interactive platform powered by real NASA data and AI insights. Connect science, education, and
              technology to discover worlds beyond our solar system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-nebula-purple to-cosmic-cyan hover:from-nebula-purple/80 hover:to-cosmic-cyan/80 text-white border-0 shadow-lg shadow-nebula-purple/50"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Rocket className="w-5 h-5 mr-2" />
                <Link
                  href="/universe"
                  className="text-sm font-medium text-white/80 hover:text-cosmic-cyan transition-colors"
                >
                  Start Exploring Now
              </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-white/30 hover:border-white text-white hover:bg-white/10 bg-transparent"
                onClick={() => router.push("/prediction")}
              >
                <Brain className="w-5 h-5 mr-2" />
                Try AI Prediction Tool
              </Button>
            </div>

            <div className="pt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/50 mx-auto" />
            </div>
          </div>
        </section>

        {/* About Exoplorer Section */}
        <section className="relative py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About Exoplorer</h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
                Exoplorer connects scientists, students, and enthusiasts to the exoplanet universe in an accessible and
                intelligent way. It integrates NASA and TESS data with AI to visualize, compare, and predict potential
                exoplanets.
              </p>
            </div>

            
              
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-nebula-purple/20 to-nebula-purple/5 border border-nebula-purple/30 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-nebula-purple" />
                        Interactive Learning
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        Explore colorful visualizations, fun facts, and simplified explanations that make exoplanet
                        science accessible to everyone.
                      </p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-cosmic-cyan/20 to-cosmic-cyan/5 border border-cosmic-cyan/30 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-cosmic-cyan" />
                        Visual Discovery
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        See planets come to life with 3D models, atmospheric layers, and comparative size charts that
                        help you understand their unique characteristics.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden border-2 border-nebula-purple/30 bg-gradient-to-br from-nebula-purple/10 to-cosmic-cyan/10 backdrop-blur-sm flex items-center justify-center">
                    <Suspense fallback={<div className="text-white">Loading 3D Universe...</div>}>
                      <Galaxy />
                    </Suspense>
                  </div>
                </div>
              </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Platform Features</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Interactive tools to explore and understand the fascinating world of exoplanets
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              <div
                className="p-8 rounded-2xl bg-gradient-to-br from-nebula-purple/20 to-nebula-purple/5 border-2 border-nebula-purple/30 backdrop-blur-sm hover:border-nebula-purple/50 hover:scale-105 transition-all cursor-pointer group"
                onClick={() => router.push("/universe")}
              >
                <div className="w-16 h-16 rounded-full bg-nebula-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Telescope className="w-8 h-8 text-nebula-purple" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Galactic View</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Visualize real exoplanets in an interactive 3D environment. Explore mass, temperature, and distance
                  from their host stars in an immersive galactic experience.
                </p>
                <div className="flex items-center text-nebula-purple text-sm font-medium">
                  Explore 3D Universe <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                </div>
              </div>

              <div
                className="p-8 rounded-2xl bg-gradient-to-br from-cosmic-cyan/20 to-cosmic-cyan/5 border-2 border-cosmic-cyan/30 backdrop-blur-sm hover:border-cosmic-cyan/50 hover:scale-105 transition-all cursor-pointer group"
                onClick={() => router.push("/prediction")}
              >
                <div className="w-16 h-16 rounded-full bg-cosmic-cyan/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-cosmic-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Prediction Tool</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Input parameters manually to discover if a celestial body is an exoplanet. Get
                  instant comparisons with similar cataloged planets.
                </p>
                <div className="flex items-center text-cosmic-cyan text-sm font-medium">
                  Try AI Prediction <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                </div>
              </div>

              <div
                className="p-8 rounded-2xl bg-gradient-to-br from-nebula-pink/20 to-nebula-pink/5 border-2 border-nebula-pink/30 backdrop-blur-sm hover:border-nebula-pink/50 hover:scale-105 transition-all cursor-pointer group"
                onClick={() => router.push("/catalog")}
              >
                <div className="w-16 h-16 rounded-full bg-nebula-pink/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-nebula-pink" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Explanatory Modal</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Learn about each parameter with accessible explanations. Understand radius, insolation, temperature,
                  and more through simplified language and visual aids.
                </p>
                <div className="flex items-center text-nebula-pink text-sm font-medium">
                  Browse Catalog <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Machine Learning Model Section */}
        <section className="relative py-24 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                
                <h2 className="text-4xl md:text-5xl font-bold text-white">Machine Learning Model</h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Our AI model classifies celestial bodies based on real orbital and stellar parameters, enabling
                  data-driven exoplanet discovery.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Model</span>
                      <span className="text-white font-bold">XGBoost</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Data Sources</span>
                      <span className="text-white font-bold">NASA KOI & TOI</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Accuracy</span>
                      <span className="text-cosmic-cyan font-bold text-xl">85.45%</span>
                    </div>
                  </div>
                  
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">Feature Importance</h3>
                <div className="space-y-4">
                  {[
                    { name: "Orbital Period", value: 92 },
                    { name: "Planet Radius", value: 85 },
                    { name: "Stellar Temperature", value: 78 },
                    { name: "Insolation Flux", value: 71 },
                    { name: "Equilibrium Temp", value: 65 },
                    { name: "Stellar Radius", value: 58 },
                  ].map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">{feature.name}</span>
                        <span className="text-white/60 text-sm">{feature.value}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cosmic-cyan to-nebula-purple transition-all duration-1000"
                          style={{ width: `${feature.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Educational & Scientific Impact */}
        <section className="relative py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Educational & Scientific Impact</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Contributing to global sustainable development goals through science and innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-10 rounded-2xl bg-gradient-to-br from-nebula-purple/20 to-nebula-purple/5 border-2 border-nebula-purple/30 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-full bg-nebula-purple/30 flex items-center justify-center mb-6">
                  <BookOpen className="w-10 h-10 text-nebula-purple" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-nebula-purple/20 border border-nebula-purple/40 mb-4">
                  <span className="text-nebula-purple text-xs font-bold">SDG 4</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Quality Education</h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  Promotes scientific literacy and STEM learning through interactive astronomy tools. Making space
                  science accessible to students, educators, and enthusiasts worldwide.
                </p>
              </div>

              <div className="p-10 rounded-2xl bg-gradient-to-br from-cosmic-cyan/20 to-cosmic-cyan/5 border-2 border-cosmic-cyan/30 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-full bg-cosmic-cyan/30 flex items-center justify-center mb-6">
                  <Lightbulb className="w-10 h-10 text-cosmic-cyan" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-cosmic-cyan/20 border border-cosmic-cyan/40 mb-4">
                  <span className="text-cosmic-cyan text-xs font-bold">SDG 9</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Innovation & Infrastructure</h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  Integrates AI and data visualization to strengthen digital and research infrastructure. Advancing
                  technological capabilities in astronomical research and education.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative py-24 px-4 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Platform Benefits</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Exoplorer democratizes access to space science, transforming data into discovery
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { icon: BookOpen, label: "Educational", color: "nebula-purple" },
                { icon: Telescope, label: "Scientific", color: "cosmic-cyan" },
                { icon: Users, label: "Accessible", color: "nebula-pink" },
                { icon: Zap, label: "Interactive", color: "nebula-purple" },
                { icon: Target, label: "Collaborative", color: "cosmic-cyan" },
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all text-center group hover:scale-105"
                  >
                    <div
                      className={`w-14 h-14 mx-auto rounded-full bg-${benefit.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-7 h-7 text-${benefit.color}`} />
                    </div>
                    <h3 className="text-white font-bold text-lg">{benefit.label}</h3>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-32 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight text-balance">
                Join the mission to
                <br />
                <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                  discover new worlds
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Start your journey through the cosmos today. Explore thousands of exoplanets and contribute to the
                future of space discovery.
              </p>
              <div className="pt-6">
                <Button
                  size="lg"
                  className="text-xl px-12 py-8 bg-gradient-to-r from-nebula-purple to-cosmic-cyan hover:from-nebula-purple/80 hover:to-cosmic-cyan/80 text-white border-0 shadow-2xl shadow-nebula-purple/50"
                  onClick={() => router.push("/prediction")}
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Exploring Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/10 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                  <Telescope className="w-6 h-6 text-nebula-purple" />
                  <span>Exoplorer</span>
                </div>
                <p className="text-white/60 text-sm">Discover worlds beyond our solar system through science and AI.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Explore</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li>
                    <a href="/prediction" className="hover:text-white transition-colors">
                      AI Prediction
                    </a>
                  </li>
                  <li>
                    <a href="/catalog" className="hover:text-white transition-colors">
                      Catalog
                    </a>
                  </li>
                  <li>
                    <a href="/universe" className="hover:text-white transition-colors">
                      3D Universe
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Learn</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li>
                    <a href="/training" className="hover:text-white transition-colors">
                      Training
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Data Sources</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li>NASA Exoplanet Archive</li>
                  <li>TESS Mission</li>
                  <li>Kepler Mission</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
              <p>© 2025 Exoplorer. Powered by NASA data and AI technology.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
