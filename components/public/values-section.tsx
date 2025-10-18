import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, BookOpen, Flame } from "lucide-react"

export function ValuesSection() {
  const values = [
    {
      icon: Heart,
      title: "Amour & Compassion",
      description: "Nous cultivons un environnement d'amour inconditionnel envers tous les enfants et adolescents",
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Nous croyons en la force d'une communauté unie, solidaire et bienveillante",
    },
    {
      icon: BookOpen,
      title: "Enseignement Biblique",
      description: "Nous fondons notre foi sur la Parole de Dieu et son enseignement pentecôtiste",
    },
    {
      icon: Flame,
      title: "Puissance du Saint-Esprit",
      description: "Nous croyons à la manifestation et aux dons du Saint-Esprit dans nos vies",
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">Nos Valeurs</h2>
        <p className="text-xl text-slate-400 text-center mb-16 max-w-2xl mx-auto">
          Les principes qui guident notre communauté et notre ministère auprès des enfants et adolescents
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card
              key={value.title}
              className="bg-slate-800/50 border-amber-600/30 hover:bg-slate-800 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
