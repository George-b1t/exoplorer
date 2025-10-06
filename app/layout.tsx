import { ModeProvider } from "@/contexts/mode-context"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import type React from "react"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata = {
  title: "Exoplorer - Exoplanet Explorer",
  description: "Discover exoplanets through scientific parameters",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  )
}
