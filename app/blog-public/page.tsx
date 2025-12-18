import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getSettings() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public-settings`, { cache: 'no-store' })
    if (!res.ok) return {}
    return await res.json()
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {}
  }
}

async function getBlogs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public/blogs?per_page=20`, { cache: 'no-store' })
    if (!res.ok) return { data: [] }
    return await res.json()
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return { data: [] }
  }
}

export default async function BlogPublicPage() {
  const [settings, blogsData] = await Promise.all([
    getSettings(),
    getBlogs()
  ])

  const posts = blogsData.data || []

  // Helper to strip HTML tags for excerpt
  const getExcerpt = (html: string) => {
    if (!html) return ""
    return html.replace(/<[^>]+>/g, '').substring(0, 150) + "..."
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Intl.DateTimeFormat("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicHeader settings={settings} />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Blog & Enseignements</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Découvrez nos articles, enseignements et réflexions pour nourrir votre foi.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Card
                  key={post.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all group overflow-hidden flex flex-col h-full"
                >
                  <div className="aspect-video overflow-hidden bg-slate-900 relative">
                    {/* If post has image, use it. Else placeholder */}
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                        <User className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                      {post.author_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author_name}</span>
                        </div>
                      )}
                    </div>
                    {post.category && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full mb-4 w-fit">
                        {post.category.name}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3 flex-1">
                      {post.excerpt || getExcerpt(post.content)}
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={`/blog-public/${post.id}`}
                        className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
                      >
                        Lire l'article complet
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
              <p className="text-slate-500 text-lg">Aucun article publié pour le moment.</p>
            </div>
          )}
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  )
}
