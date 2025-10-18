"use server"

import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

// Mock users database (replace with real database later)
const USERS = [
  { id: "1", email: "admin@eglise.com", password: "admin123", name: "Administrateur", role: "admin" as const },
  { id: "2", email: "user@eglise.com", password: "user123", name: "Utilisateur", role: "user" as const },
]

export async function login(email: string, password: string) {
  const user = USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: "Email ou mot de passe incorrect" }
  }

  const { password: _, ...userWithoutPassword } = user

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set("auth-user", JSON.stringify(userWithoutPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, user: userWithoutPassword }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-user")
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("auth-user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch {
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}
