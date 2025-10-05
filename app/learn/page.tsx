"use client"

import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Orbit, Ruler, Satellite, Sun, Telescope, Thermometer, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function LearnPage() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Clock,
      name: "Período Orbital",
      description: "Tempo que o planeta leva para completar uma órbita ao redor de sua estrela",
      color: "nebula-purple",
      details:
        "Medido em dias terrestres. Períodos mais curtos geralmente indicam planetas mais próximos de suas estrelas.",
    },
    {
      icon: Ruler,
      name: "Raio do Planeta",
      description: "Tamanho do planeta em relação ao raio da Terra",
      color: "cosmic-cyan",
      details:
        "Planetas com raios entre 1-2 raios terrestres são considerados super-Terras, enquanto maiores podem ser gigantes gasosos.",
    },
    {
      icon: Thermometer,
      name: "Temperatura de Equilíbrio",
      description: "Temperatura estimada da superfície do planeta",
      color: "nebula-pink",
      details:
        "Calculada com base na distância da estrela e radiação recebida. Crucial para determinar habitabilidade.",
    },
    {
      icon: Sun,
      name: "Temperatura Estelar",
      description: "Temperatura da estrela hospedeira",
      color: "nebula-purple",
      details: "Estrelas mais quentes (tipo O, B, A) emitem mais radiação UV, afetando a atmosfera planetária.",
    },
    {
      icon: Orbit,
      name: "Raio Orbital",
      description: "Distância média entre o planeta e sua estrela",
      color: "cosmic-cyan",
      details: "Medido em Unidades Astronômicas (UA). 1 UA = distância Terra-Sol. Define a zona habitável.",
    },
    {
      icon: Zap,
      name: "Fluxo de Insolação",
      description: "Quantidade de energia estelar recebida pelo planeta",
      color: "nebula-pink",
      details:
        "Comparado ao fluxo que a Terra recebe do Sol. Valores próximos a 1 indicam condições similares à Terra.",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
          <div
            className={`text-center space-y-6 px-4 transition-all duration-1000 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-nebula-purple/20 border border-nebula-purple/40 backdrop-blur-sm mb-4">
              <span className="text-nebula-purple text-sm font-medium">Centro de Aprendizado</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
              <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                Aprenda sobre Exoplanetas
              </span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed text-pretty max-w-3xl mx-auto">
              Descubra como identificamos mundos distantes, as características que analisamos e as missões espaciais que
              tornaram tudo isso possível.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12 pb-20">
          {/* What are Exoplanets */}
          <section className="mb-16">
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-nebula-purple/20 flex items-center justify-center flex-shrink-0">
                  <Telescope className="w-6 h-6 text-nebula-purple" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">O que são Exoplanetas?</h2>
                  <div className="space-y-4 text-white/80 leading-relaxed">
                    <p>
                      Exoplanetas, ou planetas extrassolares, são planetas que orbitam estrelas fora do nosso Sistema
                      Solar. Desde a primeira confirmação em 1995, já descobrimos mais de 5.000 exoplanetas, cada um com
                      características únicas.
                    </p>
                    <p>
                      Esses mundos distantes variam drasticamente em tamanho, composição e condições ambientais. Alguns
                      são gigantes gasosos maiores que Júpiter, outros são rochosos como a Terra, e há até
                      "super-Terras" - planetas rochosos maiores que o nosso.
                    </p>
                    <p>
                      A busca por exoplanetas não é apenas sobre encontrar novos mundos, mas sobre responder uma das
                      questões mais fundamentais da humanidade:{" "}
                      <span className="text-cosmic-cyan font-semibold">estamos sozinhos no universo?</span>
                    </p>
                    <p>
                        Cada novo planeta descoberto nos ajuda a entender melhor como os sistemas planetários se formam,
                        quais condições tornam um mundo habitável, e quais são as chances de existir vida fora da Terra.
                        A exploração desses mundos distantes é, portanto, uma janela para compreendermos não apenas o cosmos
                        mas também o nosso próprio lugar nele.{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                  <div className="text-2xl font-bold text-nebula-purple mb-1">5,000+</div>
                  <div className="text-sm text-white/70">Exoplanetas Confirmados</div>
                </div>
                <div className="p-4 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                  <div className="text-2xl font-bold text-cosmic-cyan mb-1">9,000+</div>
                  <div className="text-sm text-white/70">Candidatos em Análise</div>
                </div>
                <div className="p-4 rounded-lg bg-nebula-pink/10 border border-nebula-pink/30">
                  <div className="text-2xl font-bold text-nebula-pink mb-1">4,000+</div>
                  <div className="text-sm text-white/70">Sistemas Planetários</div>
                </div>
              </div>
            </Card>
          </section>

          {/* Prediction Features */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Características</h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                É possível identificar exoplanetas a partir de múltiplos parâmetros orbitais e estelares. Cada característica fornece pistas cruciais sobre a natureza do objeto celeste.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className={`p-6 bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 border-2 border-${feature.color}/30 backdrop-blur-sm hover:border-${feature.color}/50 transition-all`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-${feature.color}/20 flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 text-${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-white">{feature.name}</h3>
                        
                        </div>
                        <p className="text-sm text-white/70 mb-3">{feature.description}</p>
                        <p className="text-xs text-white/60 leading-relaxed">{feature.details}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

        
          </section>

          {/* Space Missions */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Missões Espaciais</h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                As descobertas de exoplanetas são possíveis graças a telescópios espaciais dedicados que monitoram
                milhões de estrelas.
              </p>
            </div>

            <Tabs defaultValue="kepler" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white/5 border border-white/10">
                <TabsTrigger value="kepler" className="data-[state=active]:bg-nebula-purple/30 text-white">
                  Kepler
                </TabsTrigger>
                <TabsTrigger value="tess" className="data-[state=active]:bg-cosmic-cyan/30 text-white">
                  TESS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kepler">
                <Card className="p-8 bg-gradient-to-br from-nebula-purple/20 to-nebula-purple/5 border-2 border-nebula-purple/30 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="w-24 h-24 rounded-full bg-nebula-purple/20 flex items-center justify-center mb-6 mx-auto md:mx-0">
                        <Satellite className="w-12 h-12 text-nebula-purple" />
                      </div>
                      <div className="text-center md:text-left space-y-2">
                        <Badge className="bg-nebula-purple/30 text-nebula-purple border-nebula-purple/50">
                          2009 - 2018
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">Telescópio Espacial Kepler</h3>
                        <p className="text-nebula-purple font-semibold">NASA</p>
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Missão</h4>
                        <p className="text-white/80 leading-relaxed">
                          Lançado em 2009, o Kepler foi o primeiro telescópio espacial projetado especificamente para
                          procurar exoplanetas semelhantes à Terra em nossa galáxia. Durante sua missão principal,
                          monitorou continuamente mais de 150.000 estrelas na constelação de Cygnus.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Método de Detecção</h4>
                        <p className="text-white/80 leading-relaxed">
                          Utilizou o <span className="text-nebula-purple font-semibold">método de trânsito</span>,
                          detectando pequenas diminuições no brilho de uma estrela quando um planeta passa na frente
                          dela. Essas variações de luz, embora minúsculas (menos de 1%), revelam a presença, tamanho e
                          período orbital do planeta.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="achievements" className="border-white/10">
                          <AccordionTrigger className="text-white hover:text-nebula-purple">
                            Principais Conquistas
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 space-y-2">
                            <p>• Descobriu mais de 2.600 exoplanetas confirmados</p>
                            <p>• Identificou milhares de candidatos adicionais</p>
                            <p>• Encontrou o primeiro planeta do tamanho da Terra na zona habitável (Kepler-452b)</p>
                            <p>• Revelou que planetas são mais comuns que estrelas na Via Láctea</p>
                            <p>• Descobriu sistemas com múltiplos planetas em órbitas compactas</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                          <div className="text-xl font-bold text-nebula-purple">2,600+</div>
                          <div className="text-xs text-white/70">Planetas</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                          <div className="text-xl font-bold text-nebula-purple">150,000</div>
                          <div className="text-xs text-white/70">Estrelas</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                          <div className="text-xl font-bold text-nebula-purple">9 anos</div>
                          <div className="text-xs text-white/70">Missão</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="tess">
                <Card className="p-8 bg-gradient-to-br from-cosmic-cyan/20 to-cosmic-cyan/5 border-2 border-cosmic-cyan/30 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="w-24 h-24 rounded-full bg-cosmic-cyan/20 flex items-center justify-center mb-6 mx-auto md:mx-0">
                        <Satellite className="w-12 h-12 text-cosmic-cyan" />
                      </div>
                      <div className="text-center md:text-left space-y-2">
                        <Badge className="bg-cosmic-cyan/30 text-cosmic-cyan border-cosmic-cyan/50">
                          2018 - Presente
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">TESS</h3>
                        <p className="text-cosmic-cyan font-semibold">Transiting Exoplanet Survey Satellite</p>
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Missão</h4>
                        <p className="text-white/80 leading-relaxed">
                          Lançado em 2018, o TESS é o sucessor do Kepler e representa a próxima geração de caçadores de
                          exoplanetas. Ao contrário do Kepler, que focou em uma região específica, o TESS realiza um
                          levantamento de quase todo o céu, monitorando as estrelas mais brilhantes e próximas da Terra.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Estratégia de Observação</h4>
                        <p className="text-white/80 leading-relaxed">
                          O TESS divide o céu em 26 setores, observando cada um por 27 dias. Suas quatro câmeras de
                          grande angular cobrem uma área 400 vezes maior que o Kepler. Foca em estrelas 30-100 vezes
                          mais brilhantes, facilitando estudos de acompanhamento com{" "}
                          <span className="text-cosmic-cyan font-semibold">telescópios terrestres e o James Webb</span>.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="achievements" className="border-white/10">
                          <AccordionTrigger className="text-white hover:text-cosmic-cyan">
                            Principais Conquistas
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 space-y-2">
                            <p>• Descobriu mais de 400 exoplanetas confirmados até agora</p>
                            <p>• Identificou mais de 6.000 candidatos a exoplanetas</p>
                            <p>
                              • Encontrou o primeiro planeta do tamanho da Terra na zona habitável de sua estrela (TOI
                              700 d)
                            </p>
                            <p>
                              • Descobriu sistemas planetários ao redor de estrelas próximas ideais para estudos
                              atmosféricos
                            </p>
                            <p>• Fornece alvos prioritários para o Telescópio Espacial James Webb</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-3 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                          <div className="text-xl font-bold text-cosmic-cyan">400+</div>
                          <div className="text-xs text-white/70">Planetas</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                          <div className="text-xl font-bold text-cosmic-cyan">200,000+</div>
                          <div className="text-xs text-white/70">Estrelas</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                          <div className="text-xl font-bold text-cosmic-cyan">Ativa</div>
                          <div className="text-xs text-white/70">Status</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-8 p-6 bg-gradient-to-r from-nebula-purple/10 via-cosmic-cyan/10 to-nebula-pink/10 border border-white/20 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-nebula-pink flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">O Futuro da Exploração</h3>
                  <p className="text-white/70 leading-relaxed">
                    Com o <span className="text-cosmic-cyan font-semibold">Telescópio Espacial James Webb</span> agora
                    operacional, podemos analisar as atmosferas de exoplanetas em detalhes sem precedentes, procurando
                    por bioassinaturas - sinais químicos que podem indicar vida. Missões futuras como o{" "}
                    <span className="text-nebula-pink font-semibold">Nancy Grace Roman Space Telescope</span> e o{" "}
                    <span className="text-nebula-purple font-semibold">PLATO</span> da ESA continuarão expandindo nosso
                    conhecimento sobre mundos distantes.
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
