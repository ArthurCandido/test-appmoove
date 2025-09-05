"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TemperatureChartProps {
  city: string
  hourlyTemp: number[]
}

export function TemperatureChart({ city, hourlyTemp }: TemperatureChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || !hourlyTemp.length) return

    const initChart = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (!ctx) return

      const hours = Array.from({ length: 12 }, (_, i) => {
        const hour = (6 + i) % 24
        return `${hour.toString().padStart(2, "0")}:00`
      })

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: "Temperatura (°C)",
              data: hourlyTemp,
              borderColor: "#0891b2",
              backgroundColor: "rgba(8, 145, 178, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#f59e0b",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
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
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "#0891b2",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                label: (context) => `${context.parsed.y}°C`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: {
                  size: 12,
                },
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: {
                  size: 12,
                },
                callback: (value) => value + "°C",
              },
            },
          },
          elements: {
            point: {
              hoverBackgroundColor: "#f59e0b",
            },
          },
        },
      })
    }

    initChart()

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [hourlyTemp])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Variação de Temperatura - {city}
        </CardTitle>
        <CardDescription>Temperatura ao longo do dia (próximas 12 horas)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}
