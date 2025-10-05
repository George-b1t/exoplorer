"use client"

import Link from "next/link"
import { useMode } from "@/contexts/mode-context"
import { Rocket } from "lucide-react"
import { ModeSwitcherDialog } from "@/components/mode-switcher-dialog"

export function Header() {
  const { mode } = useMode()

  return (
    <div className="w-full">
      <header className="border-b-2 border-nebula-purple/30 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-10 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold group">
              <Rocket className="w-8 h-8 text-nebula-purple group-hover:text-cosmic-cyan transition-colors" />
              <span className="bg-gradient-to-r from-nebula-purple via-cosmic-cyan to-nebula-pink bg-clip-text text-transparent">
                Exoplorer
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/catalog"
                className="text-sm font-medium text-white/80 hover:text-cosmic-cyan transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/galaxy"
                className="text-sm font-medium text-white/80 hover:text-nebula-purple transition-colors"
              >
                Galáxia 3D
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-white/80 hover:text-nebula-pink transition-colors"
              >
                Sobre
              </Link>

              {mode && <ModeSwitcherDialog />}
            </nav>
          </div>
        </div>
      </header>
    </div>
  )
}
