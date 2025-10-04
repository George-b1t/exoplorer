import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const exoId = searchParams.get("exo_id")

  if (!exoId) {
    return NextResponse.json({ error: "exo_id parameter is required" }, { status: 400 })
  }

  const exoplanets = [
    {
      "name": "11 Com b",
      "id": "11 Com b",
      "x": -0.9482785552292412,
      "y": -0.08594599715079713,
      "z": 0.30558315932999
    },
    {
      "name": "11 UMi b",
      "id": "11 UMi b",
      "x": -0.20351905589977654,
      "y": -0.2364006292197517,
      "z": 0.9501024873086952
    },
    {
      "name": "14 And b",
      "id": "14 And b",
      "x": 0.7684823216852471,
      "y": -0.09675282917965759,
      "z": 0.6325138823006058
    },
    {
      "name": "14 Her b",
      "id": "14 Her b",
      "x": -0.33203943073548037,
      "y": -0.6406265041972723,
      "z": 0.6923492605302908
    },
    {
      "name": "16 Cyg B b",
      "id": "16 Cyg B b",
      "x": 0.2733969771383085,
      "y": -0.5740743568792223,
      "z": 0.7718113277643329
    },
    {
      "name": "17 Sco b",
      "id": "17 Sco b",
      "x": -0.4372876982802885,
      "y": -0.8756120016726291,
      "z": -0.20514163755702827
    },
    {
      "name": "18 Del b",
      "id": "18 Del b",
      "x": 0.6897216116132373,
      "y": -0.6992284661410434,
      "z": 0.18805225500291758
    },
    {
      "name": "1RXS J160929.1-210524 b",
      "id": "1RXS J160929.1-210524 b",
      "x": -0.43262567702121907,
      "y": -0.8267012254982905,
      "z": -0.3597222641727317
    },
    {
      "name": "24 Boo b",
      "id": "24 Boo b",
      "x": -0.5139545983396433,
      "y": -0.38948433004614164,
      "z": 0.7642987815599632
    },
    {
      "name": "24 Sex b",
      "id": "24 Sex b",
      "x": -0.9124962647164439,
      "y": 0.40878176290878193,
      "z": -0.0157491965422442
    }
  ]

  const planet = exoplanets.find((p) => p.id.toLowerCase() === exoId.toLowerCase())

  if (planet) {
    return NextResponse.json([planet])
  }

  try {
    // Fetch from NASA's exoplanet API
    const nasaUrl = `https://science.nasa.gov/wp-json/wp/v2/exoplanet?exo_id=${encodeURIComponent(exoId)}`
    console.log("Fetching from NASA API:", nasaUrl)

    const response = await fetch(nasaUrl, {
      headers: {
        "User-Agent": "ExoplanetViewer/1.0",
      },
    })

    if (!response.ok) {
      console.log("NASA API response not ok:", response.status)
      return NextResponse.json({ error: "Planet not found" }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from NASA API:", error)
    return NextResponse.json({ error: "Failed to fetch planet data" }, { status: 500 })
  }
}
