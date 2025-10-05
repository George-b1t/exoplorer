"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Mode = "educational" | "technical" | null

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  hasCompletedOnboarding: boolean
  completeOnboarding: () => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem("exoplorer-mode") as Mode
    const savedOnboarding = localStorage.getItem("exoplorer-onboarding")

    if (savedMode) setMode(savedMode)
    if (savedOnboarding === "true") setHasCompletedOnboarding(true)
  }, [])

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode)
    if (newMode) {
      localStorage.setItem("exoplorer-mode", newMode)
    }
  }

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true)
    localStorage.setItem("exoplorer-onboarding", "true")
  }

  return (
    <ModeContext.Provider value={{ mode, setMode: handleSetMode, hasCompletedOnboarding, completeOnboarding }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}
