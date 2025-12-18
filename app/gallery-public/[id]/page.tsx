import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Button } from "@/components/ui/button"
import { Calendar, ImageIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlbumClientView } from "@/components/public/album-client-view"

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

async function getAlbum(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    try {
        const res = await fetch(`${apiUrl}/public/albums/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch (error) {
        return null
    }
}

export default async function AlbumDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [settings, album] = await Promise.all([
        getSettings(),
        getAlbum(id)
    ])

    if (!album) {
        notFound()
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Intl.DateTimeFormat("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
    }

    const photos = album.photos || []

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <PublicHeader settings={settings} />

            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-6 pl-0 hover:bg-transparent">
                        <Link href="/gallery-public">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la galerie
                        </Link>
                    </Button>

                    <div className="space-y-6 mb-8 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                            {album.name}
                        </h1>

                        <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-amber-500" />
                                <span>Créé le {formatDate(album.created_at)}</span>
                            </div>
                            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-amber-500" />
                                <span>{photos.length} photos</span>
                            </div>
                        </div>

                        {album.description && (
                            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
                                {album.description}
                            </p>
                        )}
                    </div>

                    {/* Client Side Grid */}
                    {photos.length > 0 ? (
                        <AlbumClientView albumName={album.name} photos={photos} />
                    ) : (
                        <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <ImageIcon className="h-16 w-16 text-slate-700 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">Cet album est vide</h3>
                            <p className="text-slate-500">Aucune photo n'a encore été ajoutée.</p>
                        </div>
                    )}
                </div>
            </main>

            <PublicFooter settings={settings} />
        </div>
    )
}
