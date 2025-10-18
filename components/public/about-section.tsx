import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section className="py-24 px-4 bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">À propos de nous</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              Le Centre Evangelique Arche de l'Alliance est un ministère dédié aux enfants et adolescents. Nous croyons
              en une communauté authentique, bienveillante et engagée dans la transformation spirituelle des jeunes
              générations.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              À travers nos cultes, nos enseignements bibliques fondés sur la Parole de Dieu et nos activités
              communautaires, nous cherchons à équiper chaque enfant et adolescent pour vivre une vie de foi dynamique
              et impactante dans notre société.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Nous sommes une église pentecôtiste qui croit au pouvoir du Saint-Esprit et à la manifestation de ses dons
              dans nos vies. Notre vision est de former des disciples engagés qui connaissent Jésus-Christ
              personnellement.
            </p>
          </div>

          <Card className="bg-slate-800/50 border-amber-600/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Notre Mission</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <span className="text-slate-300">
                    Proclamer l'Évangile de Jésus-Christ aux enfants et adolescents
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <span className="text-slate-300">Former des disciples engagés et enracinés dans la foi</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <span className="text-slate-300">Servir notre communauté avec amour et compassion</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <span className="text-slate-300">
                    Cultiver une adoration authentique et une expérience du Saint-Esprit
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
