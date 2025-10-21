"use client"

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

// Données mockées
const mockPhotos = [
  {
    id: "1",
    titre: "Culte du dimanche",
    description: "Photo du culte du 15 janvier 2025",
    url: "/placeholder.svg",
    album: "Cultes",
    date: "2025-01-15",
    auteur: "Admin",
  },
  {
    id: "2",
    titre: "Camp de vacances",
    description: "Groupe d'enfants au camp",
    url: "/placeholder.svg",
    album: "Camps",
    date: "2024-12-20",
    auteur: "Marie LENGE",
  },
  {
    id: "3",
    titre: "Réunion des moniteurs",
    description: "Formation mensuelle",
    url: "/placeholder.svg",
    album: "Formations",
    date: "2025-01-10",
    auteur: "Paul NGEA",
  },
]

interface PhotoGalleryProps {
  searchQuery?: string
  album?: string
}

export function PhotoGallery({ searchQuery = "", album }: PhotoGalleryProps) {
  const filteredPhotos = mockPhotos.filter((photo) => {
    const matchesSearch =
      photo.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAlbum = !album || photo.album === album

    return matchesSearch && matchesAlbum
  })

  const handleView = (photo: typeof mockPhotos[0]) => {
    alert(`👁️ Affichage de: "${photo.titre}"\n\n(Ouvrir dans une modal ou nouvelle page)`)
  }

  const handleDownload = (photo: typeof mockPhotos[0]) => {
    alert(`📥 Téléchargement de: "${photo.titre}"\n\n✅ Image téléchargée !`)
    console.log("Téléchargement:", photo.url)
  }

  const handleDelete = (photo: typeof mockPhotos[0]) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${photo.titre}" ?`)) {
      alert(`🗑️ Photo "${photo.titre}" supprimée avec succès !`)
      console.log("Photo supprimée:", photo.id)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {filteredPhotos.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune photo trouvée</p>
        </div>
      ) : (
        filteredPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
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
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm truncate">{photo.titre}</h3>
              {photo.description && (
                <p className="text-xs text-gray-600 truncate mt-1">
                  {photo.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                {photo.album && (
                  <Badge variant="outline" className="text-xs">
                    {photo.album}
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(photo.date).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
