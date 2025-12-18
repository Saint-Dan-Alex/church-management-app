import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getSettings() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public-settings`, { cache: 'no-store' })
        if (!res.ok) return {}
        return await res.json()
    } catch (error) {
        return {}
    }
}

async function getVideo(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public/videos/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch (error) {
        return null
    }
}

export default async function VideoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [settings, video] = await Promise.all([
        getSettings(),
        getVideo(id)
    ])

    if (!video) {
        notFound()
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Intl.DateTimeFormat("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
    }

    // Helper for Youtube embed
    const getEmbedUrl = (url: string) => {
        if (!url) return null;
        // Simple regex for youtube ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return null;
    }

    const embedUrl = getEmbedUrl(video.url);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <PublicHeader settings={settings} />

            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-5xl">
                    <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-6 pl-0 hover:bg-transparent">
                        <Link href="/videos-public">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la vidéothèque
                        </Link>
                    </Button>

                    <div className="space-y-6">
                        {/* Video Player */}
                        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={video.titre}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                video.url && video.url.endsWith('.mp4') ? (
                                    <video controls className="w-full h-full" poster={video.miniature}>
                                        <source src={video.url} type="video/mp4" />
                                        Votre navigateur ne supporte pas la lecture vidéo.
                                    </video>
                                ) : (
                                    // Fallback if no playable URL detected
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        {video.miniature && (
                                            <img src={video.miniature} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                        )}
                                        <div className="relative z-10 text-center p-6 bg-black/60 rounded-xl backdrop-blur">
                                            <p className="text-white mb-4">Vidéo non disponible directement.</p>
                                            {video.url && (
                                                <Button asChild>
                                                    <a href={video.url} target="_blank" rel="noopener noreferrer">Regarder sur le site externe</a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Info */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                                    {video.titre}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(video.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{video.vues || 0} vues</span>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-sm md:prose-base max-w-none pt-4 border-t border-slate-800">
                                    <p className="whitespace-pre-wrap text-slate-300">{video.description}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                                    <h3 className="font-bold text-white mb-4">Détails</h3>
                                    <dl className="space-y-3 text-sm">
                                        {video.category && (
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Catégorie</dt>
                                                <dd className="text-amber-500 font-medium">{video.category.name || video.category}</dd>
                                            </div>
                                        )}
                                        {video.duree && (
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Durée</dt>
                                                <dd className="text-slate-300">{video.duree}</dd>
                                            </div>
                                        )}
                                        {video.auteur && (
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Auteur</dt>
                                                <dd className="text-slate-300">{video.auteur}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter settings={settings} />
        </div>
    )
}
