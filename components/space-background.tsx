"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: {
      x: number
      y: number
      radius: number
      opacity: number
      speed: number
      trail: { x: number; y: number }[]
    }[] = []
    const starCount = 200
    const trailLength = 3

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
        trail: [],
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.fillStyle = "rgba(10, 10, 30, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.trail.forEach((pos, index) => {
          const trailOpacity = (star.opacity * (index + 1)) / star.trail.length
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, star.radius * 0.7, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity * 0.4})`
          ctx.fill()
        })

        // Draw main star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        star.trail.push({ x: star.x, y: star.y })
        if (star.trail.length > trailLength) {
          star.trail.shift()
        }

        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
          star.trail = []
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-space-dark via-[#0a0a1e] to-[#050510]"
      style={{ zIndex: 0 }}
    />
  )
}
