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
    // Force hard navigation to ensure cookies are recognized by the server immediately
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 500) // Petit délai pour laisser le toast s'afficher
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
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">Bienvenue</CardTitle>
          <CardDescription className="text-gray-500">Entrez vos identifiants pour continuer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Input
                  id="email" type="email" placeholder="admin@eglise.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
                <Button variant="link" className="p-0 h-auto text-xs text-primary font-normal" type="button" onClick={() => toast.info("Veuillez contacter l'administrateur")}>
                  Mot de passe oublié ?
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...</> : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  // Render 2FA Step
  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          Vérification
        </CardTitle>
        <CardDescription className="text-gray-500">
          Un code à 6 chiffres a été envoyé à <strong className="text-gray-900">{email}</strong>
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
                className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-primary shadow-sm"
              />
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading || twoFactorCode.length < 6}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vérification...</> : "Valider"}
          </Button>

          <div className="flex justify-between items-center text-sm pt-2">
            <Button type="button" variant="link" className="text-gray-500 hover:text-gray-900 p-0" onClick={() => setStep('login')}>
              <ArrowLeft className="mr-1 h-3 w-3" /> Retour
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/80 p-0"
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
