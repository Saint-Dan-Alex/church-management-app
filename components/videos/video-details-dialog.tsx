"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Clock, Play, ExternalLink } from "lucide-react"

interface Video {
  id: string
  titre: string
  description: string
  miniature: string
  url: string
  type: string
  categorie: string
  duree: string
  date: string
  auteur: string
  vues: number
}

interface VideoDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video: Video | null
}

export function VideoDetailsDialog({ open, onOpenChange, video }: VideoDetailsDialogProps) {
  if (!video) return null

  const handlePlay = () => {
    if (video.type === "youtube") {
      window.open(video.url, "_blank")
    } else {
      alert(`▶️ Lecture de la vidéo: "${video.titre}"`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit">{video.categorie}</Badge>
            <DialogTitle className="text-2xl">{video.titre}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Miniature avec bouton play */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={video.miniature}
              alt={video.titre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button
                size="icon"
                className="h-16 w-16 rounded-full"
                onClick={handlePlay}
              >
                <Play className="h-8 w-8 fill-current" />
              </Button>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded">
              {video.duree}
            </div>
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Durée</p>
                <p className="font-medium">{video.duree}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Vues</p>
                <p className="font-medium">{video.vues}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(video.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-700">{video.description}</p>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Auteur</span>
              <span className="font-medium">{video.auteur}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">
                {video.type === "youtube" ? "YouTube" : "Fichier uploadé"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Catégorie</span>
              <span className="font-medium">{video.categorie}</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handlePlay} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Lire la vidéo
            </Button>
            {video.type === "youtube" && (
              <Button variant="outline" onClick={() => window.open(video.url, "_blank")}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir sur YouTube
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
