"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login, verifyTwoFactor, resendTwoFactorCode } from "@/lib/auth"
import { Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<'login' | '2fa'>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  // 6 digit logic
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      if (result.two_factor_required) {
        setStep('2fa')
        toast.success("Code de vérification envoyé")
      } else {
        // Direct login
        handleSuccess(result.user)
      }
    } else {
      setError(result.error || "Une erreur est survenue")
    }

    setLoading(false)
  }

  async function handleTwoFactorSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await verifyTwoFactor(email, twoFactorCode)

    if (result.success) {
      handleSuccess(result.user)
    } else {
      setError(result.error || "Code invalide")
    }
    setLoading(false)
  }

  function handleSuccess(user: any) {
    toast.success("Connexion réussie")
    if (user?.role === "ADMIN") {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
    router.refresh()
  }

  async function handleResendCode() {
    setResending(true)
    const res = await resendTwoFactorCode(email)
    if (res.success) {
      toast.success("Nouveau code envoyé")
    } else {
      toast.error("Erreur lors de l'envoi")
    }
    setResending(false)
  }

  // Auto-focus first input on 2FA step
  useEffect(() => {
    if (step === '2fa' && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [step])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0] // Only one char
    if (!/^\d*$/.test(value)) return // Only digits

    const newCode = twoFactorCode.split('')
    // Pad with spaces if needed
    while (newCode.length < 6) newCode.push('')

    newCode[index] = value
    const finalCode = newCode.join('').slice(0, 6)
    setTwoFactorCode(finalCode)

    // Auto advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !twoFactorCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Render Login Step
  if (step === 'login') {
    return (
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Bienvenue</CardTitle>
          <CardDescription className="text-slate-300">Entrez vos identifiants pour continuer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email" type="email" placeholder="admin@eglise.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Mot de passe</Label>
              <Input
                id="password" type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...</> : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // Render 2FA Step
  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          Vérification
        </CardTitle>
        <CardDescription className="text-slate-300">
          Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <Input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={twoFactorCode[idx] || ''}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-12 text-center text-lg font-bold bg-slate-900/50 border-slate-600 text-white"
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || twoFactorCode.length < 6}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vérification...</> : "Valider"}
          </Button>

          <div className="flex justify-between items-center text-sm">
            <Button type="button" variant="link" className="text-slate-400 p-0" onClick={() => setStep('login')}>
              <ArrowLeft className="mr-1 h-3 w-3" /> Retour
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-blue-400 p-0"
              onClick={handleResendCode}
              disabled={resending}
            >
              {resending ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-1 h-3 w-3" />}
              Renvoyer le code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
