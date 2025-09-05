"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Mail, Phone, MapPin, Edit, Trash2, Save, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number.parseInt(params.id as string)
  const { getUserById, updateUser, deleteUser, users } = useUsers()

  const user = getUserById(userId)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(
    user || {
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "active" as "active" | "inactive",
    },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Usuário não encontrado</h3>
            <p className="text-muted-foreground mb-4">O usuário solicitado não existe ou foi removido.</p>
            <Link href="/">
              <Button>Voltar para lista</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!editData.name?.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!editData.email?.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = "Email inválido"
    } else if (users.some((u) => u.email === editData.email && u.id !== userId)) {
      newErrors.email = "Este email já está cadastrado"
    }

    if (!editData.city) {
      newErrors.city = "Cidade é obrigatória"
    }

    if (!editData.phone?.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    await updateUser(userId, editData)
    setIsEditing(false)
    setErrors({})
  }

  const handleCancel = () => {
    setEditData(user)
    setIsEditing(false)
    setErrors({})
  }

  const handleDelete = async () => {
    await deleteUser(userId)
    router.push("/")
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Detalhes do Usuário</h2>
          <p className="text-muted-foreground">Informações completas do usuário #{userId}</p>
        </div>

        <div className="max-w-4xl">
          <div className="grid gap-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <CardDescription className="text-base">{user.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={user.status === "active" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Nome Completo</Label>
                        <Input
                          id="edit-name"
                          value={editData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">Telefone</Label>
                        <Input
                          id="edit-phone"
                          value={editData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-city">Cidade</Label>
                        <Select value={editData.city} onValueChange={(value) => handleInputChange("city", value)}>
                          <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                            <SelectValue />
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
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={editData.status}
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
                        <AlertDescription>Por favor, corrija os erros acima antes de salvar.</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Email</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Telefone</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Cidade</p>
                          <p className="text-sm text-muted-foreground">{user.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Status</p>
                          <p className="text-sm text-muted-foreground">
                            {user.status === "active" ? "Usuário Ativo" : "Usuário Inativo"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Data de Cadastro</p>
                    <p className="text-sm text-muted-foreground">{user.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Último Acesso</p>
                    <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Perigosas</CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Usuário
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>? Esta ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
