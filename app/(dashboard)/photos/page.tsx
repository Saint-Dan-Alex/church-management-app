"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Search } from "lucide-react"
import { PhotoGallery } from "@/components/media/photo-gallery"

export default function PhotosPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Photothèque</h1>
          <p className="text-muted-foreground">Galerie de photos et albums</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Ajouter des Photos
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher des photos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <PhotoGallery searchQuery={searchQuery} />
    </div>
  )
}
