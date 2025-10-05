export interface Exoplanet {
  id: string
  name: string
  mass: number // Earth masses
  radius: number // Earth radii
  orbitalPeriod: number // days
  temperature: number // Kelvin
  distance: number // light years
  discoveryYear: number
  hostStar: string
  type: string
}

export const exoplanets: Exoplanet[] = [
  {
    id: "1",
    name: "Kepler-452b",
    mass: 5.0,
    radius: 1.6,
    orbitalPeriod: 385,
    temperature: 265,
    distance: 1400,
    discoveryYear: 2015,
    hostStar: "Kepler-452",
    type: "Super Terra",
  },
  {
    id: "2",
    name: "Proxima Centauri b",
    mass: 1.3,
    radius: 1.1,
    orbitalPeriod: 11.2,
    temperature: 234,
    distance: 4.24,
    discoveryYear: 2016,
    hostStar: "Proxima Centauri",
    type: "Terrestre",
  },
  {
    id: "3",
    name: "TRAPPIST-1e",
    mass: 0.77,
    radius: 0.92,
    orbitalPeriod: 6.1,
    temperature: 251,
    distance: 39,
    discoveryYear: 2017,
    hostStar: "TRAPPIST-1",
    type: "Terrestre",
  },
  {
    id: "4",
    name: "HD 209458 b",
    mass: 220,
    radius: 1.38,
    orbitalPeriod: 3.5,
    temperature: 1130,
    distance: 159,
    discoveryYear: 1999,
    hostStar: "HD 209458",
    type: "Júpiter Quente",
  },
  {
    id: "5",
    name: "Kepler-186f",
    mass: 1.4,
    radius: 1.17,
    orbitalPeriod: 130,
    temperature: 188,
    distance: 500,
    discoveryYear: 2014,
    hostStar: "Kepler-186",
    type: "Terrestre",
  },
  {
    id: "6",
    name: "GJ 1214 b",
    mass: 6.55,
    radius: 2.68,
    orbitalPeriod: 1.6,
    temperature: 555,
    distance: 48,
    discoveryYear: 2009,
    hostStar: "GJ 1214",
    type: "Mini-Netuno",
  },
  {
    id: "7",
    name: "K2-18b",
    mass: 8.6,
    radius: 2.6,
    orbitalPeriod: 33,
    temperature: 265,
    distance: 124,
    discoveryYear: 2015,
    hostStar: "K2-18",
    type: "Super Terra",
  },
  {
    id: "8",
    name: "TOI-700 d",
    mass: 1.7,
    radius: 1.19,
    orbitalPeriod: 37.4,
    temperature: 269,
    distance: 101,
    discoveryYear: 2020,
    hostStar: "TOI-700",
    type: "Terrestre",
  },
]

export function findSimilarExoplanets(
  params: {
    mass?: number
    radius?: number
    temperature?: number
    orbitalPeriod?: number
  },
  limit = 4,
): Exoplanet[] {
  const scored = exoplanets.map((planet) => {
    let score = 0
    let count = 0

    if (params.mass !== undefined) {
      score += 1 / (1 + Math.abs(planet.mass - params.mass) / params.mass)
      count++
    }
    if (params.radius !== undefined) {
      score += 1 / (1 + Math.abs(planet.radius - params.radius) / params.radius)
      count++
    }
    if (params.temperature !== undefined) {
      score += 1 / (1 + Math.abs(planet.temperature - params.temperature) / params.temperature)
      count++
    }
    if (params.orbitalPeriod !== undefined) {
      score += 1 / (1 + Math.abs(planet.orbitalPeriod - params.orbitalPeriod) / params.orbitalPeriod)
      count++
    }

    return { planet, score: count > 0 ? score / count : 0 }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.planet)
}

export function analyzeExoplanetPotential(params: {
  mass?: number
  radius?: number
  temperature?: number
  orbitalPeriod?: number
}): { isExoplanet: boolean; confidence: number; reasoning: string } {
  let score = 0
  const reasons: string[] = []

  // Mass analysis
  if (params.mass !== undefined) {
    if (params.mass >= 0.1 && params.mass <= 13) {
      score += 25
      reasons.push("Massa compatível com planeta rochoso")
    } else if (params.mass > 13 && params.mass <= 4000) {
      score += 20
      reasons.push("Massa compatível com gigante gasoso")
    } else {
      reasons.push("Massa fora do intervalo típico de planetas")
    }
  }

  // Radius analysis
  if (params.radius !== undefined) {
    if (params.radius >= 0.5 && params.radius <= 2.5) {
      score += 25
      reasons.push("Raio similar a planetas terrestres")
    } else if (params.radius > 2.5 && params.radius <= 15) {
      score += 20
      reasons.push("Raio compatível com gigante gasoso")
    } else {
      reasons.push("Raio atípico para exoplanetas conhecidos")
    }
  }

  // Temperature analysis
  if (params.temperature !== undefined) {
    if (params.temperature >= 150 && params.temperature <= 350) {
      score += 25
      reasons.push("Temperatura na zona habitável")
    } else if (params.temperature > 0 && params.temperature <= 2000) {
      score += 15
      reasons.push("Temperatura dentro do intervalo observado")
    } else {
      reasons.push("Temperatura extrema")
    }
  }

  // Orbital period analysis
  if (params.orbitalPeriod !== undefined) {
    if (params.orbitalPeriod >= 1 && params.orbitalPeriod <= 500) {
      score += 25
      reasons.push("Período orbital típico de exoplanetas")
    } else {
      reasons.push("Período orbital incomum")
    }
  }

  const isExoplanet = score >= 50
  const confidence = Math.min(score, 100)

  return {
    isExoplanet,
    confidence,
    reasoning: reasons.join(". "),
  }
}
