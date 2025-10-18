import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogPublicPage() {
  const posts = [
    {
      id: 1,
      title: "La puissance de la prière",
      excerpt:
        "Découvrez comment la prière peut transformer votre vie quotidienne et renforcer votre relation avec Dieu.",
      content: "La prière est bien plus qu'une simple conversation avec Dieu...",
      date: "15 Mars 2024",
      author: "Pasteur Jean",
      category: "Enseignement",
      image: "/person-praying.png",
    },
    {
      id: 2,
      title: "Vivre dans la gratitude",
      excerpt: "Apprenez à cultiver un cœur reconnaissant et à voir les bénédictions de Dieu dans chaque situation.",
      content: "La gratitude transforme notre perspective...",
      date: "10 Mars 2024",
      author: "Pasteur Marie",
      category: "Vie Chrétienne",
      image: "/hands-heart-nature.png",
    },
    {
      id: 3,
      title: "Le service dans l'église",
      excerpt: "Explorez les différentes façons de servir dans la communauté et de faire une différence.",
      content: "Servir est au cœur de notre appel chrétien...",
      date: "5 Mars 2024",
      author: "Pasteur Paul",
      category: "Communauté",
      image: "/church-service.png",
    },
    {
      id: 4,
      title: "La foi qui déplace les montagnes",
      excerpt: "Comprendre la puissance de la foi et comment elle peut transformer les situations impossibles.",
      content: "La foi est la certitude des choses qu'on espère...",
      date: "1 Mars 2024",
      author: "Pasteur Jean",
      category: "Enseignement",
      image: "/faith-mountains.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Blog & Enseignements</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Découvrez nos articles, enseignements et réflexions pour nourrir votre foi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all group overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full mb-4">
                    {post.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog-public/${post.id}`}
                    className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
                  >
                    Lire l'article complet
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
