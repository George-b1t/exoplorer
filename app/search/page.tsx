"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMode } from "@/contexts/mode-context"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Search, ChevronDown, ChevronUp } from "lucide-react"

// Valores padrão da Terra
const EARTH_DEFAULTS = {
  orbitalPeriod: 365,
  transitDuration: 13,
  transitDepth: 84,
  planetRadius: 1.0,
  planetInsolation: 1.0,
  planetEqTemp: 255,
  stellarTeff: 5778,
  stellarLogg: 4.44,
  stellarRadius: 1.0,
}

// Ranges para os sliders
const RANGES = {
  orbitalPeriod: { min: 0, max: 5000, step: 1 },
  transitDuration: { min: 0, max: 24, step: 0.1 },
  transitDepth: { min: 0, max: 50000, step: 1 },
  planetRadius: { min: 0, max: 30, step: 0.1 },
  planetInsolation: { min: 0, max: 100, step: 0.1 },
  planetEqTemp: { min: 0, max: 3000, step: 1 },
  stellarTeff: { min: 2000, max: 50000, step: 10 },
  stellarLogg: { min: 0, max: 6, step: 0.01 },
  stellarRadius: { min: 0, max: 20, step: 0.1 },
}

export default function SearchPage() {
  const { mode } = useMode()
  const router = useRouter()

  const [dataSource, setDataSource] = useState<"platform" | "user" | "both">("platform")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    params.append("dataSource", dataSource)
    params.append("maxDepth", hyperparameters.maxDepth)
    params.append("learningRate", hyperparameters.learningRate)
    params.append("nEstimators", hyperparameters.nEstimators)

    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    router.push(`/results?${params.toString()}`)
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
              <h1 className="text-4xl font-bold mb-4 text-white">Buscar por Parâmetros</h1>
              <p className="text-white/80 text-lg">
                {isEducational
                  ? "Insira as características do planeta que você imagina"
                  : "Insira os parâmetros físicos para análise"}
              </p>
            </div>

            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/30">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Fonte de Dados para Predição
                  </h2>
                  <div className="space-y-3">
                    <Label className="text-white text-base">
                      {isEducational
                        ? "Escolha quais dados usar para fazer a predição:"
                        : "Selecione a fonte de dados:"}
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
                        <div className="font-semibold mb-1">Dados da Plataforma</div>
                        {isEducational && (
                          <div className="text-xs text-white/60">Usar dados já existentes no sistema</div>
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
                        <div className="font-semibold mb-1">Meus Dados</div>
                        {isEducational && <div className="text-xs text-white/60">Usar dados que você cadastrou</div>}
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
                        <div className="font-semibold mb-1">Ambos</div>
                        {isEducational && (
                          <div className="text-xs text-white/60">Combinar todos os dados disponíveis</div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parâmetros Planetários */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Parâmetros Planetários
                  </h2>

                  {renderField(
                    "orbitalPeriod",
                    "Período Orbital",
                    "dias",
                    isEducational ? "A Terra leva 365 dias para completar uma órbita ao redor do Sol." : undefined,
                  )}

                  {renderField(
                    "transitDuration",
                    "Duração do Trânsito",
                    "horas",
                    isEducational ? "Tempo que o planeta leva para passar na frente de sua estrela." : undefined,
                  )}

                  {renderField(
                    "transitDepth",
                    "Profundidade do Trânsito",
                    "ppm",
                    isEducational
                      ? "Quanto a luz da estrela diminui quando o planeta passa na frente (em partes por milhão)."
                      : undefined,
                  )}

                  {renderField(
                    "planetRadius",
                    "Raio do Planeta",
                    "R⊕",
                    isEducational ? "O raio da Terra é 1.0. Júpiter tem um raio cerca de 11 vezes maior." : undefined,
                  )}

                  {renderField(
                    "planetInsolation",
                    "Fluxo de Insolação",
                    "S⊕",
                    isEducational
                      ? "Quantidade de energia que o planeta recebe de sua estrela, relativa à Terra."
                      : undefined,
                  )}

                  {renderField(
                    "planetEqTemp",
                    "Temperatura de Equilíbrio",
                    "K",
                    isEducational
                      ? "A Terra tem temperatura de equilíbrio de 255K. A temperatura da superfície é maior devido ao efeito estufa."
                      : undefined,
                  )}
                </div>

                {/* Parâmetros Estelares */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Parâmetros Estelares
                  </h2>

                  {renderField(
                    "stellarTeff",
                    "Temperatura Efetiva Estelar",
                    "K",
                    isEducational
                      ? "O Sol tem temperatura de 5778K. Estrelas mais quentes são azuis, mais frias são vermelhas."
                      : undefined,
                  )}

                  {renderField(
                    "stellarLogg",
                    "Gravidade Superficial Estelar",
                    "log₁₀(cm/s²)",
                    isEducational
                      ? "O Sol tem log g = 4.44. Valores maiores indicam estrelas menores e mais densas."
                      : undefined,
                  )}

                  {renderField(
                    "stellarRadius",
                    "Raio Estelar",
                    "R☉",
                    isEducational ? "O raio do Sol é 1.0. Gigantes vermelhas podem ter raios 100x maiores." : undefined,
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
                          <h2 className="text-lg font-semibold text-white">Configurações Avançadas</h2>
                          <p className="text-sm text-white/60">Ajuste os hiperparâmetros do modelo de predição</p>
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
                              Profundidade Máxima (max_depth)
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
                              Define a profundidade máxima de cada árvore. Valores maiores capturam mais detalhes, mas
                              podem causar overfitting.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="learningRate" className="text-white text-base">
                              Taxa de Aprendizado (learning_rate)
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
                              Controla quanto cada árvore contribui para a predição final. Valores menores (0.01-0.1)
                              melhoram a generalização.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nEstimators" className="text-white text-base">
                              Número de Árvores (n_estimators)
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
                              Número de árvores no modelo. Mais árvores podem melhorar a precisão, mas aumentam o risco
                              de overfitting.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                        Hiperparâmetros do Modelo
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maxDepth" className="text-white text-sm">
                            Profundidade Máxima (max_depth)
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
                            Taxa de Aprendizado (learning_rate)
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
                            Número de Árvores (n_estimators)
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
