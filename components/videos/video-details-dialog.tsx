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
import type { Video } from "@/lib/types/api"

interface VideoDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video: Video | null
}

export function VideoDetailsDialog({ open, onOpenChange, video }: VideoDetailsDialogProps) {
  if (!video) return null

  const categoryName = video.category?.name || (typeof video.categorie === 'string' ? video.categorie : 'Aucune')

  const handlePlay = () => {
    window.open(video.url, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit">{categoryName}</Badge>
            <DialogTitle className="text-2xl">{video.titre || video.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Miniature avec bouton play */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
            {video.miniature ? (
              <img
                src={video.miniature}
                alt={video.titre || video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button
                size="icon"
                className="h-16 w-16 rounded-full"
                onClick={handlePlay}
              >
                <Play className="h-8 w-8 fill-current" />
              </Button>
            </div>
            {video.duree && (
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded">
                {video.duree}
              </div>
            )}
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Durée</p>
                <p className="font-medium">{video.duree || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Vues</p>
                <p className="font-medium">{video.vues || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">
                  {video.date ? new Date(video.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  }) : '-'}
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
              <span className="font-medium">{video.auteur || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">
                {video.type === "youtube" ? "YouTube" : "Fichier uploadé"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Catégorie</span>
              <span className="font-medium">{categoryName}</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handlePlay} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Lire la vidéo
            </Button>
            {(video.type === "youtube" || (video.url && video.url.includes('http'))) && (
              <Button variant="outline" onClick={() => window.open(video.url, "_blank")}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir le lien
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
