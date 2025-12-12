"use server"

import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

export interface User {
  id: number
  email: string
  name: string
  role: string
  token?: string
}

export type LoginResult =
  | { success: true; user?: User; token?: string; two_factor_required?: false }
  | { success: true; two_factor_required: true; email: string }
  | { success: false; error: string }

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    })

    const data = await response.json()

    if (!response.ok) {
      // Validation error or other
      const errorMessage = data.message || data.errors?.email?.[0] || "Erreur de connexion"
      return { success: false, error: errorMessage }
    }

    if (data.two_factor_required) {
      return { success: true, two_factor_required: true, email: data.email }
    }

    // Should not happen with current backend logic (always 2FA), but consistent handling:
    if (data.token) {
      await createSession(data.user, data.token)
      return { success: true, user: data.user, token: data.token }
    }

    return { success: false, error: "Réponse inattendue du serveur" }

  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Erreur de connexion au serveur" }
  }
}

export async function verifyTwoFactor(email: string, code: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-2fa`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, code }),
      cache: 'no-store'
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || data.errors?.code?.[0] || "Code invalide"
      return { success: false, error: errorMessage }
    }

    if (data.token) {
      await createSession(data.user, data.token)
      return { success: true, user: data.user, token: data.token }
    }

    return { success: false, error: "Token manquant dans la réponse" }

  } catch (error) {
    return { success: false, error: "Erreur lors de la vérification" }
  }
}

export async function resendTwoFactorCode(email: string) {
  try {
    await fetch(`${API_URL}/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email }),
    })
    return { success: true }
  } catch (e) {
    return { success: false }
  }
}

async function createSession(user: User, token: string) {
  const cookieStore = await cookies()

  // Cookie de session sécurisé pour Next.js Middleware & Server Components
  cookieStore.set("auth-user", JSON.stringify({ ...user, token }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Cookie accessible par JS pour les appels API client-side (Bearer Token)
  cookieStore.set("api-token", token, {
    httpOnly: false, // Accesssible via JS for api.ts
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function logout() {
  const cookieStore = await cookies()

  // Optional: Call API to revoke token
  const token = cookieStore.get("api-token")?.value
  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })
    } catch (e) {
      // Ignore logout errors
    }
  }

  cookieStore.delete("auth-user")
  cookieStore.delete("api-token")
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
  return user?.role === "ADMIN" // Backend returns uppercase role
}
