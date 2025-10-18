import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Card } from "@/components/ui/card"
import { Calendar, ImageIcon } from "lucide-react"

export default function GalleryPublicPage() {
  const albums = [
    {
      id: 1,
      title: "Culte du Dimanche - Mars 2024",
      date: "17 Mars 2024",
      photoCount: 45,
      coverImage: "/church-worship-crowd.jpg",
    },
    {
      id: 2,
      title: "Conférence Annuelle 2024",
      date: "10 Mars 2024",
      photoCount: 120,
      coverImage: "/church-conference.png",
    },
    {
      id: 3,
      title: "Camp des Jeunes",
      date: "5 Mars 2024",
      photoCount: 85,
      coverImage: "/youth-camp.png",
    },
    {
      id: 4,
      title: "Baptêmes - Février 2024",
      date: "25 Février 2024",
      photoCount: 32,
      coverImage: "/baptism-ceremony.jpg",
    },
    {
      id: 5,
      title: "Journée Communautaire",
      date: "18 Février 2024",
      photoCount: 67,
      coverImage: "/vibrant-community-gathering.png",
    },
    {
      id: 6,
      title: "Concert de Louange",
      date: "10 Février 2024",
      photoCount: 54,
      coverImage: "/worship-concert.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Galerie Photos</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Revivez les moments forts de notre communauté en images
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card
                key={album.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all group overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={album.coverImage || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{album.title}</h3>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{album.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>{album.photoCount} photos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
