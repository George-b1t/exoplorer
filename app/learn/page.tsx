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
      name: "Orbital Period",
      description: "Time it takes for a planet to complete one orbit around its star",
      color: "nebula-purple",
      details:
        "Measured in Earth days. Shorter periods usually indicate planets closer to their stars.",
    },
    {
      icon: Ruler,
      name: "Planet Radius",
      description: "Size of the planet relative to Earth's radius",
      color: "cosmic-cyan",
      details:
        "Planets with radii between 1-2 Earth radii are considered super-Earths, while larger ones may be gas giants.",
    },
    {
      icon: Thermometer,
      name: "Equilibrium Temperature",
      description: "Estimated temperature of the planet's surface",
      color: "nebula-pink",
      details:
        "Calculated based on the distance from the star and the radiation received. Crucial for determining habitability.",
    },
    {
      icon: Sun,
      name: "Stellar Temperature",
      description: "Temperature of the host star's surface",
      color: "nebula-purple",
      details: "Hotter stars (types O, B, A) emit more UV radiation, affecting the planetary atmosphere.",
    },
    {
      icon: Orbit,
      name: "Orbital Radius",
      description: "Average distance between the planet and its star",
      color: "cosmic-cyan",
      details: "Measured in Astronomical Units (AU). 1 AU = distance from Earth to Sun. Defines the habitable zone.",
    },
    {
      icon: Zap,
      name: "Insolation Flux",
      description: "Amount of stellar energy received by the planet",
      color: "nebula-pink",
      details:
        "Compared to the flux that Earth receives from the Sun. Values close to 1 indicate conditions similar to Earth.",
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
              <span className="text-nebula-purple text-sm font-medium">Learning Center</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
              <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                Learn About Exoplanets
              </span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed text-pretty max-w-3xl mx-auto">
              Discover how we identify distant worlds, the features we analyze, and the space missions that made it all possible.
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
                  <h2 className="text-3xl font-bold text-white mb-4">What are Exoplanets?</h2>
                  <div className="space-y-4 text-white/80 leading-relaxed">
                    <p>
                      Exoplanets, or extrasolar planets, are planets that orbit stars outside our Solar System. Since the first confirmation in 1995, we have discovered over 5,000 exoplanets, each with unique characteristics.
                    </p>
                    <p>
                      These distant worlds vary dramatically in size, composition, and environmental conditions. Some are gas giants larger than Jupiter, others are rocky like Earth, and there are even "super-Earths" - rocky planets larger than our own.
                    </p>
                    <p>
                      The search for exoplanets is not just about finding new worlds, but about answering one of humanity's most fundamental questions:{" "}
                      <span className="text-cosmic-cyan font-semibold">are we alone in the universe?</span>
                    </p>
                    <p>
                        Each new planet discovered helps us better understand how planetary systems form,
                        what conditions make a world habitable, and what the chances are of life existing beyond Earth.
                        The exploration of these distant worlds is, therefore, a window into understanding not only the cosmos
                        but also our own place in it.{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                  <div className="text-2xl font-bold text-nebula-purple mb-1">5,000+</div>
                  <div className="text-sm text-white/70">Confirmed Exoplanets</div>
                </div>
                <div className="p-4 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                  <div className="text-2xl font-bold text-cosmic-cyan mb-1">9,000+</div>
                  <div className="text-sm text-white/70">Candidates Under Analysis</div>
                </div>
                <div className="p-4 rounded-lg bg-nebula-pink/10 border border-nebula-pink/30">
                  <div className="text-2xl font-bold text-nebula-pink mb-1">4,000+</div>
                  <div className="text-sm text-white/70">Planetary Systems</div>
                </div>
              </div>
            </Card>
          </section>

          {/* Prediction Features */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Characteristics</h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                It is possible to identify exoplanets from multiple orbital and stellar parameters. Each characteristic provides crucial clues about the nature of the celestial object.
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
              <h2 className="text-3xl font-bold text-white mb-4">Space Missions</h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                The discoveries of exoplanets are made possible by dedicated space telescopes that monitor
                millions of stars.
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
                        <h3 className="text-2xl font-bold text-white">Kepler Space Telescope</h3>
                        <p className="text-nebula-purple font-semibold">NASA</p>
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Mission</h4>
                        <p className="text-white/80 leading-relaxed">
                          Launched in 2009, Kepler was the first space telescope designed specifically to
                          search for Earth-like exoplanets in our galaxy. During its primary mission,
                          it continuously monitored over 150,000 stars in the constellation Cygnus.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Detection Method</h4>
                        <p className="text-white/80 leading-relaxed">
                          It used the <span className="text-nebula-purple font-semibold">transit method</span>,
                          detecting small dips in a star's brightness when a planet passes in front of it. These
                          light variations, though tiny (less than 1%), reveal the presence, size, and orbital
                          period of the planet.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="achievements" className="border-white/10">
                          <AccordionTrigger className="text-white hover:text-nebula-purple">
                            Key Achievements
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 space-y-2">
                            <p>• Discovered over 2,600 confirmed exoplanets</p>
                            <p>• Identified thousands of additional candidates</p>
                            <p>• Found the first Earth-sized planet in the habitable zone (Kepler-452b)</p>
                            <p>• Revealed that planets are more common than stars in the Milky Way</p>
                            <p>• Discovered systems with multiple planets in compact orbits</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                          <div className="text-xl font-bold text-nebula-purple">2,600+</div>
                          <div className="text-xs text-white/70">Planets</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                          <div className="text-xl font-bold text-nebula-purple">150,000</div>
                          <div className="text-xs text-white/70">Stars</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30">
                          <div className="text-xl font-bold text-nebula-purple">9 years</div>
                          <div className="text-xs text-white/70">Mission</div>
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
                          2018 - Present
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">TESS</h3>
                        <p className="text-cosmic-cyan font-semibold">Transiting Exoplanet Survey Satellite</p>
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Missions</h4>
                        <p className="text-white/80 leading-relaxed">
                          Launched in 2018, TESS is the successor to Kepler and represents the next generation of planet-hunting
                          missions. Unlike Kepler, which focused on a specific region, TESS conducts a survey of nearly the entire sky,
                          monitoring the brightest and closest stars to Earth.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Observation Strategy</h4>
                        <p className="text-white/80 leading-relaxed">
                          TESS divides the sky into 26 sectors, observing each for 27 days. Its four wide-field cameras cover an area 400 times larger than Kepler. It focuses on stars 30-100 times brighter, facilitating follow-up studies with{" "}
                          <span className="text-cosmic-cyan font-semibold">ground-based telescopes and the James Webb</span>.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="achievements" className="border-white/10">
                          <AccordionTrigger className="text-white hover:text-cosmic-cyan">
                            Key Achievements
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 space-y-2">
                            <p>• Discovered over 400 confirmed exoplanets to date</p>
                            <p>• Identified over 6,000 exoplanet candidates</p>
                            <p>
                              • Found the first Earth-sized planet in the habitable zone of its star (TOI
                              700 d)
                            </p>
                            <p>
                              • Discovered planetary systems around nearby stars ideal for atmospheric studies
                            </p>
                            <p>• Provided priority targets for the James Webb Space Telescope</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-3 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                          <div className="text-xl font-bold text-cosmic-cyan">400+</div>
                          <div className="text-xs text-white/70">Planets</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                          <div className="text-xl font-bold text-cosmic-cyan">200,000+</div>
                          <div className="text-xs text-white/70">Stars</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
                          <div className="text-xl font-bold text-cosmic-cyan">Active</div>
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
                  <h3 className="text-lg font-bold text-white mb-2">The future of exploration</h3>
                  <p className="text-white/70 leading-relaxed">
                    With the <span className="text-cosmic-cyan font-semibold">James Webb Space Telescope</span> now
                    operational, we can analyze the atmospheres of exoplanets in unprecedented detail, searching
                    for biosignatures - chemical signs that may indicate life. Future missions such as the{" "}
                    <span className="text-nebula-pink font-semibold">Nancy Grace Roman Space Telescope</span> and the{" "}
                    <span className="text-nebula-purple font-semibold">PLATO</span> mission by ESA will continue to expand our
                    knowledge of distant worlds.
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
