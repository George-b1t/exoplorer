import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  const teamMembers = [
    { name: "Member 1", role: "Developer" },
    { name: "Member 2", role: "Designer" },
    { name: "Member 3", role: "Data Scientist" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                MoonMonkeys
              </h1>
              <p className="text-xl text-white/80">Our team of space explorers</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">About the Project</h2>
                <p className="text-white/80 leading-relaxed">
                  Exoplorer was born from a passion for astronomy and technology. Our mission is to make knowledge about
                  exoplanets accessible to everyone, from curious students to experienced researchers.
                </p>
                <p className="text-white/80 leading-relaxed">
                  We use real data from space missions and advanced algorithms to help you discover and understand
                  worlds beyond our solar system.
                </p>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-nebula-purple/20 to-cosmic-cyan/20 border-2 border-nebula-purple/30 backdrop-blur-sm">
                  <img
                    src="/images/design-mode/Screenshot%202025-10-04%20at%2020.28.21.png"
                    alt="MoonMonkeys Astronaut"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-white">Our Team</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="p-6 bg-card/80 backdrop-blur-sm border-2 border-nebula-purple/20">
                    <div className="space-y-4">
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-nebula-purple/20 to-cosmic-cyan/20 flex items-center justify-center border border-nebula-purple/30">
                        <span className="text-6xl">👨‍🚀</span>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-white">{member.name}</h3>
                        <p className="text-sm text-white/70">{member.role}</p>
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
