"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface WeatherMapProps {
  city: string
  temperature: number
}

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
  "Belo Horizonte": { lat: -19.9167, lng: -43.9345 },
  Salvador: { lat: -12.9714, lng: -38.5014 },
  Brasília: { lat: -15.8267, lng: -47.9218 },
  Fortaleza: { lat: -3.7319, lng: -38.5267 },
  Manaus: { lat: -3.119, lng: -60.0217 },
  Curitiba: { lat: -25.4284, lng: -49.2733 },
  Recife: { lat: -8.0476, lng: -34.877 },
  "Porto Alegre": { lat: -30.0346, lng: -51.2177 },
}

export function WeatherMap({ city, temperature }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || !city) return

    const coordinates = cityCoordinates[city]
    if (!coordinates) return

    const initMap = async () => {
      const L = (await import("leaflet")).default

      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      const map = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      const customIcon = L.divIcon({
        html: `
          <div style="
            background: linear-gradient(135deg, #0891b2, #f59e0b);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${temperature}°C
          </div>
        `,
        className: "custom-weather-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      L.marker([coordinates.lat, coordinates.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <strong>${city}</strong><br>
            <span style="color: #0891b2; font-size: 18px; font-weight: bold;">${temperature}°C</span>
          </div>
        `)
        .openPopup()

      mapInstanceRef.current = map

      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [city, temperature])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Localização - {city}
        </CardTitle>
        <CardDescription>Mapa interativo da cidade com informações de temperatura</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-64 w-full rounded-lg border border-border" style={{ minHeight: "256px" }} />
      </CardContent>
    </Card>
  )
}
