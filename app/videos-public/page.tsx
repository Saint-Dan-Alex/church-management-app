import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Calendar, Eye } from "lucide-react"

export default function VideosPublicPage() {
  const videos = [
    {
      id: 1,
      title: "Culte du Dimanche - La Foi qui Transforme",
      description: "Message puissant sur la foi qui transforme nos vies",
      thumbnail: "/church-worship.png",
      date: "17 Mars 2024",
      duration: "45:30",
      views: 1250,
      category: "Culte",
    },
    {
      id: 2,
      title: "Enseignement - La Prière Efficace",
      description: "Comment prier de manière efficace selon la Parole de Dieu",
      thumbnail: "/prayer-teaching.jpg",
      date: "15 Mars 2024",
      duration: "32:15",
      views: 890,
      category: "Enseignement",
    },
    {
      id: 3,
      title: "Louange et Adoration - Session Spéciale",
      description: "Moment de louange et d'adoration avec l'équipe de worship",
      thumbnail: "/uplifting-worship.png",
      date: "12 Mars 2024",
      duration: "28:45",
      views: 2100,
      category: "Louange",
    },
    {
      id: 4,
      title: "Témoignage - Dieu m'a Restauré",
      description: "Témoignage puissant de restauration et de transformation",
      thumbnail: "/testimony.jpg",
      date: "10 Mars 2024",
      duration: "15:20",
      views: 1560,
      category: "Témoignage",
    },
    {
      id: 5,
      title: "Culte des Jeunes - Vivre pour Christ",
      description: "Message inspirant pour la jeunesse sur l'engagement chrétien",
      thumbnail: "/youth-church.jpg",
      date: "8 Mars 2024",
      duration: "38:10",
      views: 980,
      category: "Jeunesse",
    },
    {
      id: 6,
      title: "Série - Les Fondements de la Foi (Partie 1)",
      description: "Première partie de notre série sur les fondements bibliques",
      thumbnail: "/bible-study-group.png",
      date: "5 Mars 2024",
      duration: "42:00",
      views: 1340,
      category: "Série",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Vidéothèque</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Retrouvez tous nos cultes, enseignements et moments de louange
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all group overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full mb-2">
                    {video.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{video.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{video.views} vues</span>
                    </div>
                  </div>
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
