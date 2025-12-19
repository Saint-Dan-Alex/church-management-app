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
  Video as VideoIcon,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VideoDetailsDialog } from "./video-details-dialog"
import { EditVideoDialog } from "./edit-video-dialog"
import { videosService } from "@/lib/services/videos.service"
import type { Video } from "@/lib/types/api"
import { toast } from "sonner"

interface VideoGalleryProps {
  searchQuery?: string
  categorie?: string
  refreshKey?: number  // Permet de forcer le rechargement depuis le parent
}

export function VideoGallery({ searchQuery = "", categorie, refreshKey = 0 }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [internalRefreshKey, setInternalRefreshKey] = useState(0)

  // Fonction pour recharger la liste après modification
  const reloadVideos = () => {
    setInternalRefreshKey(prev => prev + 1)
  }

  // Recharger quand refreshKey change (après upload d'une vidéo)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        // On récupère tout et on filtre localement pour l'instant pour la catégorie si c'est un onglet UI simple
        // Ou on peut passer le params
        // L'implémentation actuelle de VideoGallery semble attendre props categorie.
        // Mais si "Tous", categorie est undefined.
        const response: any = await videosService.getAll({ category: categorie })
        const data = response.data || response
        setVideos(Array.isArray(data) ? data : [])
      } catch (err) {
        setError("Erreur lors du chargement des vidéos")
        console.error("Erreur:", err)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [categorie, refreshKey, internalRefreshKey])

  const filteredVideos = Array.isArray(videos) ? videos.filter((video) => {
    const title = video.titre || video.title || "";
    const description = video.description || "";

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())

    // Le filtrage catégorie est déjà fait par l'API normalement via getAll({ category: categorie })
    // Mais on peut double checker si besoin.
    // Si categorie prop est présent, on suppose que result est filtré.
    return matchesSearch
  }) : []

  const handlePlay = (video: Video) => {
    if (video.type === "youtube" || video.url.includes("youtube") || video.url.includes("vimeo")) {
      window.open(video.url, "_blank")
    } else {
      // Lien direct (upload)
      // Ouvrir dans un nouvel onglet
      window.open(video.url, "_blank")
    }
  }

  const handleView = (video: Video) => {
    setSelectedVideo(video)
    setIsDetailsDialogOpen(true)
  }

  const handleEdit = (video: Video) => {
    setSelectedVideo(video)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (video: Video) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${video.titre || video.title}" ?`)) {
      try {
        await videosService.delete(video.id)
        setVideos(prev => prev.filter(v => v.id !== video.id))
        toast.success(`Vidéo supprimée avec succès`)
      } catch (err) {
        toast.error("Erreur lors de la suppression")
        console.error("Erreur:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <VideoIcon className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse" />
        <p className="text-gray-500">Chargement des vidéos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <VideoIcon className="h-12 w-12 mx-auto text-red-400 mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <VideoIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune vidéo trouvée</p>
        </div>
      ) : (
        filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden group flex flex-col">
            <div className="relative aspect-video bg-gray-100">
              {/* Si miniature, on affiche. Sinon un placeholder ou preview video si possible */}
              {video.miniature ? (
                <img
                  src={video.miniature}
                  alt={video.titre || video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <VideoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => handlePlay(video)}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-16 w-16 rounded-full"
                >
                  <Play className="h-8 w-8 fill-current" />
                </Button>
              </div>

              {video.duree && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duree}
                </div>
              )}

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
                  <DropdownMenuItem onClick={() => handleEdit(video)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
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
            <CardContent className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2">{video.titre || video.title}</h3>
                {video.description && (
                  <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                    {video.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {video.category?.name || (typeof video.categorie === 'string' ? video.categorie : 'Aucune')}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.vues || 0}
                  </div>
                  {video.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(video.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short"
                      })}
                    </div>
                  )}
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
      <EditVideoDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        video={selectedVideo}
        onSuccess={reloadVideos}
      />
    </div>
  )
}
