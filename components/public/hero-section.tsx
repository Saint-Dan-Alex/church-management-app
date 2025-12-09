import { Button } from "@/components/ui/button"
import { Church } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  settings?: Record<string, any>
}

export function HeroSection({ settings = {} }: HeroSectionProps) {
  // Valeurs par défaut
  const title = settings?.landing_hero_title || "Centre Evangelique Arche de l'Alliance"
  const subtitle = settings?.landing_hero_subtitle || "Ministère auprès des Enfants & Adolescents"
  const description = settings?.app_description || "Une communauté vivante où la foi, l'amour et l'espérance se rencontrent pour transformer des vies et former les générations futures"
  const bgImage = settings?.landing_hero_image
  const logoApp = settings?.app_logo

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 z-0" />

      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8 inline-block">
          {logoApp ? (
            <img src={logoApp} alt="Logo" className="w-32 h-32 object-contain mx-auto" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto">
              <Church className="w-16 h-16 text-slate-950" />
            </div>
          )}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-amber-400 mb-6 font-semibold">
          {subtitle}
        </p>

        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg bg-amber-600 hover:bg-amber-700">
            <Link href="/blog-public">Découvrir nos enseignements</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg border-amber-600 text-amber-400 hover:bg-slate-800 bg-transparent hover:text-amber-300"
          >
            <Link href="#contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
