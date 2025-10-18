"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload } from "lucide-react"
import { VideoGallery } from "@/components/media/video-gallery"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vidéothèque</h1>
          <p className="text-muted-foreground">Bibliothèque de vidéos et médias</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Ajouter une Vidéo
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une vidéo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <VideoGallery searchQuery={searchQuery} />
    </div>
  )
}
