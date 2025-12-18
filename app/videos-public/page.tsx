import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Calendar, Eye } from "lucide-react"
import Link from "next/link"

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

async function getVideos() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public/videos?per_page=20`, { cache: 'no-store' })
    if (!res.ok) return { data: [] }
    return await res.json()
  } catch (error) {
    console.error("Error fetching videos:", error)
    return { data: [] }
  }
}

export default async function VideosPublicPage() {
  const [settings, videosData] = await Promise.all([
    getSettings(),
    getVideos()
  ])

  const videos = videosData.data || []

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">Vidéothèque</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Retrouvez tous nos cultes, enseignements et moments de louange
            </p>
          </div>

          {videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video: any) => (
                <Link key={video.id} href={`/videos-public/${video.id}`} className="block h-full">
                  <Card
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all group overflow-hidden h-full flex flex-col"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      {video.miniature || video.thumbnail ? (
                        <img
                          src={video.miniature || video.thumbnail}
                          alt={video.titre || video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                          <Play className="w-6 h-6 text-white ml-1" fill="white" />
                        </div>
                      </div>
                      {(video.duree || video.duration) && (
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
                          {video.duree || video.duration}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      {video.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-500 rounded-full mb-2 w-fit">
                          {video.category.name || video.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
                        {video.titre || video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{video.description}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(video.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{video.vues || video.views || 0} vues</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
              <Play className="h-16 w-16 text-slate-700 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Aucune vidéo disponible</h3>
              <p className="text-slate-500">Revenez plus tard pour voir nos nouveaux contenus.</p>
            </div>
          )}
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  )
}
