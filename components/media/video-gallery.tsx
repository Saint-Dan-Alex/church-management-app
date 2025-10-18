"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Eye, MoreVertical, Edit, Trash, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const videos = [
  {
    id: "1",
    title: "Culte Dominical - 13 Octobre 2024",
    description: "Message sur la foi et la persévérance",
    date: "2024-10-13",
    duration: "1h 45min",
    views: 342,
    thumbnail: "/church-worship.png",
    category: "Culte",
  },
  {
    id: "2",
    title: "Témoignage de Marie Dupont",
    description: "Comment Dieu a transformé ma vie",
    date: "2024-10-10",
    duration: "15min",
    views: 189,
    thumbnail: "/testimony.jpg",
    category: "Témoignage",
  },
  {
    id: "3",
    title: "École du Dimanche - Les Miracles de Jésus",
    description: "Enseignement pour les enfants",
    date: "2024-10-06",
    duration: "30min",
    views: 156,
    thumbnail: "/children-bible.jpg",
    category: "Enfants",
  },
  {
    id: "4",
    title: "Louange et Adoration",
    description: "Session de louange du groupe de jeunesse",
    date: "2024-10-05",
    duration: "45min",
    views: 267,
    thumbnail: "/uplifting-worship.png",
    category: "Louange",
  },
]

interface VideoGalleryProps {
  searchQuery: string
}

export function VideoGallery({ searchQuery }: VideoGalleryProps) {
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.map((video) => (
        <Card key={video.id} className="overflow-hidden group">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="lg" className="rounded-full h-16 w-16">
                <Play className="h-8 w-8" />
              </Button>
            </div>
            <Badge className="absolute top-2 right-2">{video.category}</Badge>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold leading-tight line-clamp-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{video.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(video.date).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{video.views} vues</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
