"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Cloud,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Star,
  StarOff,
  History,
  Trash2,
  RefreshCw,
  Sunrise,
  Sunset,
} from "lucide-react"
import Link from "next/link"
import { useWeather } from "@/lib/weather-context"
import { WeatherMap } from "@/components/weather-map"
import { TemperatureChart } from "@/components/temperature-chart"
import { WeatherAnalytics } from "@/components/weather-analytics"

const brazilianCities = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Salvador",
  "Brasília",
  "Fortaleza",
  "Manaus",
  "Curitiba",
  "Recife",
  "Porto Alegre",
]

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {
    favoritesCities,
    searchHistory,
    addToFavorites,
    removeFromFavorites,
    addToHistory,
    clearHistory,
    getWeatherData,
  } = useWeather()

  const weatherData = selectedCity ? getWeatherData(selectedCity) : null
  const isFavorite = favoritesCities.includes(selectedCity)

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    addToHistory(city)
  }

  const handleRefresh = () => {
    if (!selectedCity) return

    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const toggleFavorite = () => {
    if (!selectedCity) return

    if (isFavorite) {
      removeFromFavorites(selectedCity)
    } else {
      addToFavorites(selectedCity)
    }
  }

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return "text-green-600"
    if (uvIndex <= 5) return "text-yellow-600"
    if (uvIndex <= 7) return "text-orange-600"
    if (uvIndex <= 10) return "text-red-600"
    return "text-purple-600"
  }

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return "Baixo"
    if (uvIndex <= 5) return "Moderado"
    if (uvIndex <= 7) return "Alto"
    if (uvIndex <= 10) return "Muito Alto"
    return "Extremo"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Cloud className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Sistema Brasileiro</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Usuários
              </Link>
              <Link href="/weather" className="text-primary font-medium">
                Clima
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Informações Climáticas</h2>
          <p className="text-muted-foreground">Consulte o clima das principais cidades brasileiras</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cloud className="h-5 w-5 text-primary" />
                  Selecionar Cidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedCity} onValueChange={handleCitySelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {brazilianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCity && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={toggleFavorite} className="flex-1 bg-transparent">
                      {isFavorite ? <StarOff className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                      {isFavorite ? "Remover" : "Favoritar"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {favoritesCities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-accent" />
                    Favoritas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {favoritesCities.map((city) => (
                      <Button
                        key={city}
                        variant={selectedCity === city ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <History className="h-5 w-5 text-muted-foreground" />
                      Histórico
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 5).map((city, index) => (
                      <Button
                        key={`${city}-${index}`}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            {weatherData ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{weatherData.city}</h3>
                        <p className="text-muted-foreground">Atualizado às {weatherData.lastUpdated}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-primary">{weatherData.temperature}°C</div>
                        <p className="text-muted-foreground">{weatherData.condition}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Sensação térmica: {weatherData.feelsLike}°C</div>
                  </CardContent>
                </Card>

                {weatherData.alerts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-destructive">Alertas Meteorológicos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {weatherData.alerts.map((alert, index) => (
                          <Badge key={index} variant="destructive" className="mr-2">
                            {alert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Droplets className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{weatherData.humidity}%</div>
                      <p className="text-xs text-muted-foreground">Umidade</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Wind className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-accent">{weatherData.windSpeed} km/h</div>
                      <p className="text-xs text-muted-foreground">Vento</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Gauge className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold">{weatherData.pressure} hPa</div>
                      <p className="text-xs text-muted-foreground">Pressão</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold">{weatherData.visibility} km</div>
                      <p className="text-xs text-muted-foreground">Visibilidade</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Índice UV e Sol</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Índice UV:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getUVIndexColor(weatherData.uvIndex)}`}>
                            {weatherData.uvIndex}
                          </span>
                          <Badge variant="outline" className={getUVIndexColor(weatherData.uvIndex)}>
                            {getUVIndexLabel(weatherData.uvIndex)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sunrise className="h-4 w-4 text-accent" />
                          <span className="text-muted-foreground">Nascer do sol:</span>
                        </div>
                        <span className="font-medium">{weatherData.sunrise}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sunset className="h-4 w-4 text-accent" />
                          <span className="text-muted-foreground">Pôr do sol:</span>
                        </div>
                        <span className="font-medium">{weatherData.sunset}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Previsão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{weatherData.forecast}</p>
                    </CardContent>
                  </Card>
                </div>

                <TemperatureChart city={selectedCity} hourlyTemp={weatherData.hourlyTemp} />

                <WeatherAnalytics weatherData={weatherData} />

                <WeatherMap city={selectedCity} temperature={weatherData.temperature} />
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Selecione uma cidade</h3>
                  <p className="text-muted-foreground mb-4">
                    Escolha uma cidade brasileira para visualizar as informações climáticas detalhadas
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {brazilianCities.slice(0, 5).map((city) => (
                      <Button key={city} variant="outline" size="sm" onClick={() => handleCitySelect(city)}>
                        {city}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
