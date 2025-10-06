"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMode } from "@/contexts/mode-context"
import { GraduationCap, Microscope } from "lucide-react"

export function ModeSwitcherDialog() {
  const { mode, setMode } = useMode()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-2 border-nebula-purple/30 hover:border-nebula-purple hover:bg-nebula-purple/10 text-white bg-transparent"
        >
          {mode === "educational" ? "Modo Educacional ✓" : mode === "technical" ? "Modo Técnico ✓" : "Selecionar Modo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-deep-space/95 backdrop-blur-xl border-2 border-nebula-purple/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Select your viewing mode</DialogTitle>
          <DialogDescription className="text-white/70">
            Select how you prefer to explore exoplanets
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <button
            onClick={() => setMode("educational")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              mode === "educational"
                ? "border-cosmic-cyan bg-cosmic-cyan/20 shadow-lg shadow-cosmic-cyan/30"
                : "border-nebula-purple/30 hover:border-cosmic-cyan/50 hover:bg-cosmic-cyan/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <GraduationCap className="w-8 h-8 text-cosmic-cyan flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-white">Educational Mode</h3>
                <p className="text-sm text-white/80">
                  Simplified explanations, analogies with Earth, and accessible descriptions for students and
                  enthusiasts.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode("technical")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              mode === "technical"
                ? "border-nebula-purple bg-nebula-purple/20 shadow-lg shadow-nebula-purple/30"
                : "border-nebula-purple/30 hover:border-nebula-purple/50 hover:bg-nebula-purple/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <Microscope className="w-8 h-8 text-nebula-purple flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-white">Technical Mode</h3>
                <p className="text-sm text-white/80">
                  Scientific notation, astronomical units, and technical terminology for researchers and specialists.
                </p>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
