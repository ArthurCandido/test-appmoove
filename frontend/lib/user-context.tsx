"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "./api"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  city: string
  status: "active" | "inactive"
  createdAt: string
  lastLogin: string
}

interface UserContextType {
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt" | "lastLogin">) => Promise<void>
  updateUser: (id: number, user: Partial<User>) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  getUserById: (id: number) => User | undefined
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<User[]>(`/users`)
        const data = res.data.map((u: any) => ({
          ...u,
          createdAt: typeof u.createdAt === 'string' ? u.createdAt : new Date(u.createdAt).toISOString().split('T')[0],
          lastLogin: typeof u.lastLogin === 'string' ? u.lastLogin : new Date(u.lastLogin).toISOString().split('T')[0],
        }))
        setUsers(data)
      } catch (e) {
        console.error('Falha ao carregar usuários', e)
      }
    }
    load()
  }, [])

  const addUser = async (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    const res = await api.post<User>(`/users`, userData)
    const u = res.data as any
    const normalized: User = {
      ...u,
      createdAt: typeof u.createdAt === 'string' ? u.createdAt : new Date(u.createdAt).toISOString().split('T')[0],
      lastLogin: typeof u.lastLogin === 'string' ? u.lastLogin : new Date(u.lastLogin).toISOString().split('T')[0],
    }
    setUsers((prev) => [...prev, normalized])
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    const res = await api.put<User>(`/users/${id}`, userData)
    const u = res.data as any
    const normalized: User = {
      ...u,
      createdAt: typeof u.createdAt === 'string' ? u.createdAt : new Date(u.createdAt).toISOString().split('T')[0],
      lastLogin: typeof u.lastLogin === 'string' ? u.lastLogin : new Date(u.lastLogin).toISOString().split('T')[0],
    }
    setUsers((prev) => prev.map((user) => (user.id === id ? normalized : user)))
  }

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`)
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const getUserById = (id: number) => users.find((user) => user.id === id)

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, getUserById }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider")
  }
  return context
}
