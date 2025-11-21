"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trash,
  Eye,
  MoreVertical,
  Calendar,
  Play,
  Video,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VideoDetailsDialog } from "./video-details-dialog"
import { videosService, type Video } from "@/lib/services/videos.service"
import { toast } from "sonner"

interface VideoGalleryProps {
  searchQuery?: string
  categorie?: string
}

export function VideoGallery({ searchQuery = "", categorie }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const data = await videosService.getAll({ categorie })
        setVideos(data)
      } catch (err) {
        setError("Erreur lors du chargement des vidéos")
        console.error("Erreur:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [categorie])

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategorie = !categorie || video.categorie === categorie

    return matchesSearch && matchesCategorie
  })

  const handlePlay = (video: Video) => {
    if (video.type === "youtube") {
      window.open(video.url, "_blank")
    } else {
      alert(`▶️ Lecture de: "${video.titre}"\n\n(Ouvrir dans un lecteur vidéo)`)
    }
  }

  const handleView = (video: Video) => {
    setSelectedVideo(video)
    setIsDetailsDialogOpen(true)
  }

  const handleDelete = async (video: Video) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${video.titre}" ?`)) {
      try {
        await videosService.delete(video.id)
        setVideos(videos.filter(v => v.id !== video.id))
        toast.success(`Vidéo "${video.titre}" supprimée avec succès`)
      } catch (err) {
        toast.error("Erreur lors de la suppression")
        console.error("Erreur:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <Video className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse" />
        <p className="text-gray-500">Chargement des vidéos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <Video className="h-12 w-12 mx-auto text-red-400 mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <Video className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune vidéo trouvée</p>
        </div>
      ) : (
        filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden group">
            <div className="relative aspect-video bg-gray-100">
              <img
                src={video.miniature}
                alt={video.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-16 w-16 rounded-full"
                  onClick={() => handlePlay(video)}
                >
                  <Play className="h-8 w-8 fill-current" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duree}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePlay(video)}>
                    <Play className="mr-2 h-4 w-4" />
                    Lire
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleView(video)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Détails
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(video)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2">{video.titre}</h3>
              {video.description && (
                <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                  {video.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {video.categorie}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.vues}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.date).toLocaleDateString("fr-FR", { 
                      day: "numeric", 
                      month: "short" 
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <VideoDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        video={selectedVideo}
      />
    </div>
  )
}
