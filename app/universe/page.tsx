"use client"

import { Galaxy } from "@/components/galaxy"
import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"

export default function GalaxyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <SpaceBackground />

      <div className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Title and description overlay */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
            Galactic Explorer
          </h1>
        </div>

        {/* Galaxy component with decorative border */}
        <div className="flex-1 relative mt-36 mb-8 mx-4 md:mx-8">
          <div className="absolute inset-0 rounded-2xl border-2 border-nebula-purple/30 bg-gradient-to-br from-nebula-purple/5 to-cosmic-cyan/5 backdrop-blur-sm overflow-hidden">
            <Galaxy />
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-nebula-purple/50 rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cosmic-cyan/50 rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cosmic-cyan/50 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-nebula-purple/50 rounded-br-lg" />
        </div>

        {/* Bottom info bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <span>Drag to rotate</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <span>Scroll to zoom</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <span>Click on the planets</span>
          </div>
        </div>
      </div>
    </div>
  )
}
