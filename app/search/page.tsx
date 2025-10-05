"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMode } from "@/contexts/mode-context"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export default function SearchPage() {
  const { mode } = useMode()
  const router = useRouter()
  const [formData, setFormData] = useState({
    mass: "",
    radius: "",
    temperature: "",
    orbitalPeriod: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    router.push(`/results?${params.toString()}`)
  }

  const isEducational = mode === "educational"

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white">Buscar por Parâmetros</h1>
              <p className="text-white/80 text-lg">
                {isEducational
                  ? "Insira as características do planeta que você imagina"
                  : "Insira os parâmetros físicos para análise"}
              </p>
            </div>

            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mass" className="text-white">
                    {isEducational ? "Massa (relativa à Terra)" : "Massa (M⊕)"}
                  </Label>
                  <Input
                    id="mass"
                    type="number"
                    step="0.1"
                    placeholder={isEducational ? "Ex: 1.0 (igual à Terra)" : "Ex: 1.0"}
                    value={formData.mass}
                    onChange={(e) => setFormData({ ...formData, mass: e.target.value })}
                    className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                  />
                  {isEducational && (
                    <p className="text-xs text-white/60">
                      A Terra tem massa 1.0. Júpiter tem cerca de 318 vezes a massa da Terra.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius" className="text-white">
                    {isEducational ? "Tamanho (relativo à Terra)" : "Raio (R⊕)"}
                  </Label>
                  <Input
                    id="radius"
                    type="number"
                    step="0.1"
                    placeholder={isEducational ? "Ex: 1.0 (igual à Terra)" : "Ex: 1.0"}
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                    className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                  />
                  {isEducational && (
                    <p className="text-xs text-white/60">
                      O raio da Terra é 1.0. Júpiter tem um raio cerca de 11 vezes maior.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-white">
                    {isEducational ? "Temperatura (em Kelvin)" : "Temperatura (K)"}
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="1"
                    placeholder={isEducational ? "Ex: 288 (15°C)" : "Ex: 288"}
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                  />
                  {isEducational && (
                    <p className="text-xs text-white/60">A Terra tem temperatura média de 288K (15°C). 273K = 0°C.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orbitalPeriod" className="text-white">
                    {isEducational ? "Tempo orbital (em dias)" : "Período Orbital (dias)"}
                  </Label>
                  <Input
                    id="orbitalPeriod"
                    type="number"
                    step="0.1"
                    placeholder={isEducational ? "Ex: 365 (um ano terrestre)" : "Ex: 365"}
                    value={formData.orbitalPeriod}
                    onChange={(e) => setFormData({ ...formData, orbitalPeriod: e.target.value })}
                    className="bg-deep-space/50 border-nebula-purple/30 text-white placeholder:text-white/40"
                  />
                  {isEducational && (
                    <p className="text-xs text-white/60">
                      A Terra leva 365 dias para completar uma órbita ao redor do Sol.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-nebula-purple to-cosmic-cyan hover:from-nebula-purple/80 hover:to-cosmic-cyan/80 text-white border-0"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Analisar Parâmetros
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
