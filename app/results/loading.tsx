import { Header } from "@/components/header"
import { SpaceBackground } from "@/components/space-background"

export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-nebula-purple border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Analyzing parameters...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
