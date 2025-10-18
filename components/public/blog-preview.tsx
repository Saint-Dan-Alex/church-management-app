import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export function BlogPreview() {
  const posts = [
    {
      id: 1,
      title: "La puissance de la prière",
      excerpt:
        "Découvrez comment la prière peut transformer votre vie quotidienne et renforcer votre relation avec Dieu.",
      date: "15 Mars 2024",
      category: "Enseignement",
    },
    {
      id: 2,
      title: "Vivre dans la gratitude",
      excerpt: "Apprenez à cultiver un cœur reconnaissant et à voir les bénédictions de Dieu dans chaque situation.",
      date: "10 Mars 2024",
      category: "Vie Chrétienne",
    },
    {
      id: 3,
      title: "Le service dans l'église",
      excerpt: "Explorez les différentes façons de servir dans la communauté et de faire une différence.",
      date: "5 Mars 2024",
      category: "Communauté",
    },
  ]

  return (
    <section className="py-24 px-4 bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Derniers Messages</h2>
            <p className="text-xl text-slate-400">Enseignements et réflexions pour nourrir votre foi</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden md:flex border-amber-600 text-amber-400 hover:bg-slate-800 bg-transparent hover:text-amber-300"
          >
            <Link href="/blog-public">
              Voir tous les messages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-slate-800/50 border-amber-600/30 hover:bg-slate-800 transition-colors group"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-amber-400 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-300 rounded-full mb-4">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog-public/${post.id}`}
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium inline-flex items-center gap-1"
                >
                  Lire la suite
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:hidden text-center">
          <Button
            asChild
            variant="outline"
            className="border-amber-600 text-amber-400 hover:bg-slate-800 bg-transparent hover:text-amber-300"
          >
            <Link href="/blog-public">
              Voir tous les messages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
