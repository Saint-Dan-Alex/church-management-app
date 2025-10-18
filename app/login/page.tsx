import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user?.role === "admin") {
    redirect("/dashboard")
  }

  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-slate-300">Accédez à votre espace de gestion</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
