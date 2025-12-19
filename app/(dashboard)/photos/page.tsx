"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AlbumGrid } from "@/components/photos/album-grid"
import { UploadPhotoDialog } from "@/components/photos/upload-photo-dialog"

export default function PhotosPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handlePhotoUploaded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      {/* Header responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Photothèque</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gérez vos photos et albums</p>
        </div>
        <Button
          onClick={() => setIsUploadDialogOpen(true)}
          size="sm"
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Uploader Photos</span>
          <span className="sm:hidden">Uploader</span>
        </Button>
      </div>

      {/* Grille des albums */}
      <AlbumGrid
        refreshKey={refreshKey}
        onUploadClick={() => setIsUploadDialogOpen(true)}
      />

      <UploadPhotoDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handlePhotoUploaded}
      />
    </div>
  )
}
