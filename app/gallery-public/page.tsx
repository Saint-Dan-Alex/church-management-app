import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Card } from "@/components/ui/card"
import { Calendar, ImageIcon } from "lucide-react"
import Link from "next/link"

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

async function getAlbums() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public/albums`, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export default async function GalleryPublicPage() {
  const [settings, albums] = await Promise.all([
    getSettings(),
    getAlbums()
  ])

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">Galerie Photos</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Revivez les moments forts de notre communauté en images
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.length > 0 ? (
              albums.map((album: any) => (
                <Link key={album.id} href={`/gallery-public/${album.id}`} className="block h-full">
                  <Card
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all group overflow-hidden cursor-pointer h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                      {album.cover_image ? (
                        <img
                          src={album.cover_image}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{album.name}</h3>
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(album.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            <span>{album.photo_count || 0} photos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-500 text-lg">Aucun album photo disponible.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  )
}
