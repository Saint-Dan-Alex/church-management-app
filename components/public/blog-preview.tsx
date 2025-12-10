import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content?: string
  published_at: string
  category?: { name: string }
}

interface BlogPreviewProps {
  posts?: BlogPost[]
}

export function BlogPreview({ posts = [] }: BlogPreviewProps) {
  const getExcerpt = (post: BlogPost) => {
    if (post.excerpt) return post.excerpt
    if (post.content) {
      // Retire HTML tags et coupe
      const content = post.content.replace(/<[^>]+>/g, '')
      return content.substring(0, 100) + '...'
    }
    return ''
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Intl.DateTimeFormat("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  }

  if (posts.length === 0) return null; // Ne rien afficher si pas de posts

  return (
    <section className="py-24 px-4 bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">Derniers Enseignements</h2>
            <p className="text-slate-400">Ressources pour votre croissance spirituelle</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden md:flex border-amber-600 text-amber-500 hover:bg-amber-600/10"
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
              className="bg-slate-800 border-slate-700 hover:border-amber-600/50 transition-all duration-300 group h-full flex flex-col"
            >
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-amber-500 mb-3 font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at)}</span>
                  {post.category && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{post.category.name}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{getExcerpt(post)}</p>

                <div className="mt-auto pt-4 border-t border-slate-700/50">
                  <Link
                    href={`/blog-public/${post.id}`}
                    className="text-amber-500 hover:text-amber-400 text-sm font-bold uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Lire la suite
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:hidden text-center">
          <Button
            asChild
            variant="outline"
            className="border-amber-600 text-amber-500 hover:bg-amber-600/10 w-full"
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
