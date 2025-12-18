import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

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

async function getBlog(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public/blogs/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch (error) {
        console.error("Error fetching blog:", error)
        return null
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [settings, post] = await Promise.all([
        getSettings(),
        getBlog(id)
    ])

    if (!post) {
        notFound()
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Intl.DateTimeFormat("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <PublicHeader settings={settings} />

            <main className="flex-1 pt-24 pb-16">
                {/* Hero / Cover */}
                <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900">
                        {post.image && (
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container px-4 max-w-4xl text-center space-y-6">
                            {post.category && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/80 backdrop-blur text-white rounded-full text-sm font-medium">
                                    <Tag className="h-3 w-3" />
                                    {post.category.name}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight shadow-sm drop-shadow-md">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-center gap-6 text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-400" />
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                </div>
                                {post.author_name && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-purple-400" />
                                        <span>{post.author_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-3xl -mt-10 relative z-10">
                    <Button asChild variant="secondary" className="mb-8 hover:bg-slate-200">
                        <Link href="/blog-public">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
                        </Link>
                    </Button>

                    <article className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <div className="prose prose-lg prose-invert max-w-none text-slate-300">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </article>
                </div>
            </main>

            <PublicFooter settings={settings} />
        </div>
    )
}
