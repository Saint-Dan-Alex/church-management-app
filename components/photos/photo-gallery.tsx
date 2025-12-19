"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Trash,
  Eye,
  MoreVertical,
  Calendar,
  Image as ImageIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { photosService, type Photo } from "@/lib/services/photos.service"
import { toast } from "sonner"

interface PhotoGalleryProps {
  searchQuery?: string
  album?: string
  refreshKey?: number  // Permet de forcer le rechargement depuis le parent
}

export function PhotoGallery({ searchQuery = "", album, refreshKey = 0 }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Recharger quand refreshKey change (après upload d'une photo)
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        const response: any = await photosService.getAll({ album })
        const data = response.data || response // Support pagination or array
        setPhotos(Array.isArray(data) ? data : [])
      } catch (err) {
        setError("Erreur lors du chargement des photos")
        console.error("Erreur:", err)
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [album, refreshKey])

  const filteredPhotos = Array.isArray(photos) ? photos.filter((photo) => {
    const matchesSearch =
      (photo.titre || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.description || "").toLowerCase().includes(searchQuery.toLowerCase())

    // Le filtrage album est fait par le backend si 'album' prop est passé
    // Mais on peut double check si besoin
    return matchesSearch
  }) : []

  const handleView = (photo: Photo) => {
    window.open(photo.url, "_blank")
  }

  const handleDownload = (photo: Photo) => {
    // Create a fake link to force download if possible, usually requires backend headers.
    // Here just open in new tab.
    const link = document.createElement('a')
    link.href = photo.url
    link.download = photo.titre || 'photo' // Doesn't work for cross-origin often
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (photo: Photo) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${photo.titre}" ?`)) {
      try {
        await photosService.delete(photo.id)
        setPhotos(prev => prev.filter(p => p.id !== photo.id))
        toast.success(`Photo supprimée avec succès`)
      } catch (err) {
        toast.error("Erreur lors de la suppression")
        console.error("Erreur:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse" />
        <p className="text-gray-500">Chargement des photos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <ImageIcon className="h-12 w-12 mx-auto text-red-400 mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {filteredPhotos.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune photo trouvée</p>
        </div>
      ) : (
        filteredPhotos.map((photo: Photo) => (
          <Card key={photo.id} className="overflow-hidden group flex flex-col">
            <div className="relative aspect-square bg-gray-100">
              <img
                src={photo.url}
                alt={photo.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleView(photo)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleDownload(photo)}
                >
                  <Download className="h-4 w-4" />
                </Button>
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
                  <DropdownMenuItem onClick={() => handleView(photo)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(photo)}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(photo)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardContent className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm truncate">{photo.titre || 'Sans titre'}</h3>
                {photo.description && (
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {photo.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {photo.album?.name || 'Aucun'}
                </Badge>

                {photo.date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(photo.date).toLocaleDateString("fr-FR")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
