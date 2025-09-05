"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart } from "lucide-react"
import type { WeatherData } from "@/lib/weather-context"

interface WeatherAnalyticsProps {
  weatherData: WeatherData
}

export function WeatherAnalytics({ weatherData }: WeatherAnalyticsProps) {
  const humidityChartRef = useRef<HTMLCanvasElement>(null)
  const conditionsChartRef = useRef<HTMLCanvasElement>(null)
  const humidityChartInstanceRef = useRef<any>(null)
  const conditionsChartInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!humidityChartRef.current || !conditionsChartRef.current) return

    const initCharts = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      // Destroy existing charts
      if (humidityChartInstanceRef.current) {
        humidityChartInstanceRef.current.destroy()
      }
      if (conditionsChartInstanceRef.current) {
        conditionsChartInstanceRef.current.destroy()
      }

      // Humidity and other metrics chart
      const humidityCtx = humidityChartRef.current.getContext("2d")
      if (humidityCtx) {
        humidityChartInstanceRef.current = new Chart(humidityCtx, {
          type: "doughnut",
          data: {
            labels: ["Umidade", "Ar Seco"],
            datasets: [
              {
                data: [weatherData.humidity, 100 - weatherData.humidity],
                backgroundColor: ["#0891b2", "#e5e7eb"],
                borderWidth: 0,
                cutout: "70%",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  color: "#6b7280",
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.parsed}%`,
                },
              },
            },
          },
        })
      }

      // Weather conditions comparison chart
      const conditionsCtx = conditionsChartRef.current.getContext("2d")
      if (conditionsCtx) {
        const metrics = [
          { label: "Temperatura", value: weatherData.temperature, max: 50, color: "#f59e0b" },
          { label: "Umidade", value: weatherData.humidity, max: 100, color: "#0891b2" },
          { label: "Vento", value: weatherData.windSpeed, max: 50, color: "#10b981" },
          { label: "UV", value: weatherData.uvIndex, max: 15, color: "#ef4444" },
        ]

        conditionsChartInstanceRef.current = new Chart(conditionsCtx, {
          type: "bar",
          data: {
            labels: metrics.map((m) => m.label),
            datasets: [
              {
                label: "Valores Atuais",
                data: metrics.map((m) => (m.value / m.max) * 100),
                backgroundColor: metrics.map((m) => m.color),
                borderRadius: 8,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const metric = metrics[context.dataIndex]
                    return `${metric.label}: ${metric.value}${metric.label === "Temperatura" ? "°C" : metric.label === "Umidade" ? "%" : metric.label === "Vento" ? " km/h" : ""}`
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#6b7280",
                },
              },
              y: {
                display: false,
                max: 100,
              },
            },
          },
        })
      }
    }

    initCharts()

    return () => {
      if (humidityChartInstanceRef.current) {
        humidityChartInstanceRef.current.destroy()
        humidityChartInstanceRef.current = null
      }
      if (conditionsChartInstanceRef.current) {
        conditionsChartInstanceRef.current.destroy()
        conditionsChartInstanceRef.current = null
      }
    }
  }, [weatherData])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Umidade Relativa
          </CardTitle>
          <CardDescription>Distribuição da umidade do ar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full relative">
            <canvas ref={humidityChartRef} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{weatherData.humidity}%</div>
                <div className="text-xs text-muted-foreground">Umidade</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Métricas Climáticas
          </CardTitle>
          <CardDescription>Comparação dos indicadores meteorológicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <canvas ref={conditionsChartRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
