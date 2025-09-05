"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUsers } from "@/lib/user-context"

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

export default function NewUserPage() {
  const router = useRouter()
  const { addUser, users } = useUsers()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    phone: "",
    status: "active" as "active" | "inactive",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    } else if (users.some((user) => user.email === formData.email)) {
      newErrors.email = "Este email já está cadastrado"
    }

    if (!formData.city) {
      newErrors.city = "Cidade é obrigatória"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
      }
      await addUser(payload)
      router.push("/")
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      // Tenta extrair mensagem da API
      const anyErr = error as any
      const apiMsg = anyErr?.response?.data?.message || anyErr?.response?.data?.error
      // Mapear erros do Zod para campos
      const issues = anyErr?.response?.data?.issues as Array<{ path: (string | number)[]; message: string }>
      if (Array.isArray(issues)) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of issues) {
          const key = (issue.path?.[0] as string) || ""
          if (key) fieldErrors[key] = issue.message
        }
        if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors)
      }
      setSubmitError(apiMsg || "Falha ao salvar. Verifique os dados e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Sistema Brasileiro</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-primary font-medium">
                Usuários
              </Link>
              <Link href="/weather" className="text-muted-foreground hover:text-foreground">
                Clima
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar para lista de usuários
          </Link>
          <h2 className="text-3xl font-bold text-foreground mb-2">Cadastrar Novo Usuário</h2>
          <p className="text-muted-foreground">Preencha os dados para cadastrar um novo usuário no sistema</p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Dados do Usuário
              </CardTitle>
              <CardDescription>Informe os dados pessoais e de contato do usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-destructive" : ""}
                      required
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                      required
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-destructive" : ""}
                      required
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                      <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione uma cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Por favor, corrija os erros acima antes de continuar.</AlertDescription>
                  </Alert>
                )}

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Salvando..." : "Salvar Usuário"}
                  </Button>
                  <Link href="/">
                    <Button variant="outline" disabled={isSubmitting}>
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
