import { Button } from "@/components/ui/button"
import { Church } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  settings?: Record<string, any>
}

export function HeroSection({ settings = {} }: HeroSectionProps) {
  // Valeurs par défaut
  const title = settings?.landing_hero_title || "CENTRE EVANGELIQUE ARCHE DE L'ALLIANCE"
  const subtitle = settings?.landing_hero_subtitle || "BIENVENUE SUR LA PLATEFORME"
  const description = settings?.app_description || "Une communauté vivante où la foi, l'amour et l'espérance se rencontrent pour transformer des vies."
  const bgImage = settings?.landing_hero_image

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden bg-slate-950">
      {/* Background */}

      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
          <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" /> {/* Touche violette */}
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-black z-0" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">

        <div className="space-y-4">
          <p className="text-sm md:text-base text-amber-500 font-bold tracking-[0.2em] uppercase">
            {subtitle}
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] text-balance drop-shadow-2xl">
            {title}
          </h1>
        </div>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto text-pretty font-light leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Button asChild size="lg" className="text-lg bg-white text-slate-950 hover:bg-slate-200 rounded-full px-8 py-6 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
            <Link href="/login">Nous rejoindre</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full px-8 py-6 backdrop-blur-sm transition-all hover:scale-105"
          >
            <Link href="#contact">En savoir plus</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
