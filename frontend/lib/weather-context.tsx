"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface WeatherData {
  city: string
  temperature: number
  humidity: number
  condition: string
  forecast: string
  alerts: string[]
  hourlyTemp: number[]
  windSpeed: number
  pressure: number
  visibility: number
  uvIndex: number
  feelsLike: number
  sunrise: string
  sunset: string
  lastUpdated: string
}

interface WeatherContextType {
  favoritesCities: string[]
  searchHistory: string[]
  addToFavorites: (city: string) => void
  removeFromFavorites: (city: string) => void
  addToHistory: (city: string) => void
  clearHistory: () => void
  getWeatherData: (city: string) => WeatherData | null
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

const mockWeatherDatabase: Record<string, WeatherData> = {
  "São Paulo": {
    city: "São Paulo",
    temperature: 23,
    humidity: 65,
    condition: "Parcialmente nublado",
    forecast: "Chuva à tarde com possibilidade de trovoadas",
    alerts: ["Possibilidade de chuva forte", "Alerta de vento"],
    hourlyTemp: [20, 21, 22, 23, 24, 25, 24, 23, 22, 21, 20, 19],
    windSpeed: 15,
    pressure: 1013,
    visibility: 8,
    uvIndex: 6,
    feelsLike: 25,
    sunrise: "06:15",
    sunset: "18:30",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  "Rio de Janeiro": {
    city: "Rio de Janeiro",
    temperature: 28,
    humidity: 78,
    condition: "Ensolarado",
    forecast: "Sol durante todo o dia com algumas nuvens",
    alerts: [],
    hourlyTemp: [25, 26, 27, 28, 29, 30, 29, 28, 27, 26, 25, 24],
    windSpeed: 12,
    pressure: 1015,
    visibility: 10,
    uvIndex: 9,
    feelsLike: 32,
    sunrise: "06:00",
    sunset: "18:45",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  "Belo Horizonte": {
    city: "Belo Horizonte",
    temperature: 21,
    humidity: 55,
    condition: "Nublado",
    forecast: "Tempo estável com nebulosidade variável",
    alerts: [],
    hourlyTemp: [18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 17],
    windSpeed: 8,
    pressure: 1018,
    visibility: 12,
    uvIndex: 4,
    feelsLike: 22,
    sunrise: "06:20",
    sunset: "18:25",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  Salvador: {
    city: "Salvador",
    temperature: 30,
    humidity: 82,
    condition: "Ensolarado com nuvens",
    forecast: "Calor com pancadas de chuva isoladas",
    alerts: ["Alerta de calor intenso"],
    hourlyTemp: [27, 28, 29, 30, 31, 32, 31, 30, 29, 28, 27, 26],
    windSpeed: 18,
    pressure: 1012,
    visibility: 9,
    uvIndex: 11,
    feelsLike: 35,
    sunrise: "05:45",
    sunset: "18:15",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  Brasília: {
    city: "Brasília",
    temperature: 25,
    humidity: 45,
    condition: "Céu limpo",
    forecast: "Tempo seco e ensolarado",
    alerts: ["Baixa umidade do ar"],
    hourlyTemp: [22, 23, 24, 25, 26, 27, 26, 25, 24, 23, 22, 21],
    windSpeed: 10,
    pressure: 1020,
    visibility: 15,
    uvIndex: 8,
    feelsLike: 27,
    sunrise: "06:10",
    sunset: "18:35",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  Fortaleza: {
    city: "Fortaleza",
    temperature: 32,
    humidity: 75,
    condition: "Parcialmente nublado",
    forecast: "Calor com brisa marítima",
    alerts: [],
    hourlyTemp: [29, 30, 31, 32, 33, 34, 33, 32, 31, 30, 29, 28],
    windSpeed: 22,
    pressure: 1011,
    visibility: 11,
    uvIndex: 10,
    feelsLike: 36,
    sunrise: "05:30",
    sunset: "17:50",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  Manaus: {
    city: "Manaus",
    temperature: 31,
    humidity: 88,
    condition: "Chuvoso",
    forecast: "Chuvas tropicais frequentes",
    alerts: ["Chuva intensa", "Alagamentos possíveis"],
    hourlyTemp: [28, 29, 30, 31, 30, 29, 28, 27, 28, 29, 30, 29],
    windSpeed: 6,
    pressure: 1009,
    visibility: 6,
    uvIndex: 7,
    feelsLike: 38,
    sunrise: "06:00",
    sunset: "18:00",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  Curitiba: {
    city: "Curitiba",
    temperature: 18,
    humidity: 70,
    condition: "Nublado",
    forecast: "Tempo frio e úmido",
    alerts: [],
    hourlyTemp: [15, 16, 17, 18, 19, 20, 19, 18, 17, 16, 15, 14],
    windSpeed: 14,
    pressure: 1022,
    visibility: 8,
    uvIndex: 3,
    feelsLike: 16,
    sunrise: "06:45",
    sunset: "18:10",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  Recife: {
    city: "Recife",
    temperature: 29,
    humidity: 80,
    condition: "Parcialmente nublado",
    forecast: "Calor com possibilidade de chuva",
    alerts: [],
    hourlyTemp: [26, 27, 28, 29, 30, 31, 30, 29, 28, 27, 26, 25],
    windSpeed: 16,
    pressure: 1013,
    visibility: 10,
    uvIndex: 9,
    feelsLike: 33,
    sunrise: "05:20",
    sunset: "17:40",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
  "Porto Alegre": {
    city: "Porto Alegre",
    temperature: 20,
    humidity: 68,
    condition: "Chuvoso",
    forecast: "Chuva com ventos fortes",
    alerts: ["Tempestade se aproximando"],
    hourlyTemp: [17, 18, 19, 20, 21, 22, 21, 20, 19, 18, 17, 16],
    windSpeed: 25,
    pressure: 1008,
    visibility: 7,
    uvIndex: 2,
    feelsLike: 18,
    sunrise: "07:00",
    sunset: "18:00",
    lastUpdated: new Date().toLocaleTimeString("pt-BR"),
  },
}

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [favoritesCities, setFavoritesCities] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("weather-favorites")
    const savedHistory = localStorage.getItem("weather-history")

    if (savedFavorites) {
      setFavoritesCities(JSON.parse(savedFavorites))
    }

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("weather-favorites", JSON.stringify(favoritesCities))
  }, [favoritesCities])

  useEffect(() => {
    localStorage.setItem("weather-history", JSON.stringify(searchHistory))
  }, [searchHistory])

  const addToFavorites = (city: string) => {
    setFavoritesCities((prev) => (prev.includes(city) ? prev : [...prev, city]))
  }

  const removeFromFavorites = (city: string) => {
    setFavoritesCities((prev) => prev.filter((c) => c !== city))
  }

  const addToHistory = (city: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((c) => c !== city)
  return [city, ...filtered].slice(0, 10)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const getWeatherData = (city: string): WeatherData | null => {
    return mockWeatherDatabase[city] || null
  }

  return (
    <WeatherContext.Provider
      value={{
        favoritesCities,
        searchHistory,
        addToFavorites,
        removeFromFavorites,
        addToHistory,
        clearHistory,
        getWeatherData,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}
