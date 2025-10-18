import { Button } from "@/components/ui/button"
import { Church } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Background gradient with church colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8 inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto">
            <Church className="w-16 h-16 text-slate-950" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance">
          Centre Evangelique Arche de l'Alliance
        </h1>

        <p className="text-lg md:text-xl text-amber-400 mb-6 font-semibold">
          Ministère auprès des Enfants & Adolescents
        </p>

        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty">
          Une communauté vivante où la foi, l'amour et l'espérance se rencontrent pour transformer des vies et former
          les générations futures
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
