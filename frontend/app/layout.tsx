import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { UserProvider } from "@/lib/user-context"
import { WeatherProvider } from "@/lib/weather-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema Brasileiro - Gerenciamento de Usuários e Clima",
  description: "Aplicação para gerenciar usuários e consultar informações climáticas do Brasil",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserProvider>
            <WeatherProvider>{children}</WeatherProvider>
          </UserProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
