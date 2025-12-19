"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoGallery } from "@/components/videos/video-gallery"
import { UploadVideoDialog } from "@/components/videos/upload-video-dialog"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleVideoUploaded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      {/* Header responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Vidéothèque</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gérez vos vidéos et enregistrements</p>
        </div>
        <Button
          onClick={() => setIsUploadDialogOpen(true)}
          size="sm"
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Ajouter Vidéo</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        {/* Onglets avec scroll horizontal sur mobile */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <TabsList className="inline-flex min-w-max">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Toutes les Vidéos</span>
              <span className="sm:hidden">Toutes</span>
            </TabsTrigger>
            <TabsTrigger value="Cultes" className="text-xs sm:text-sm px-2 sm:px-3">Cultes</TabsTrigger>
            <TabsTrigger value="Témoignages" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden xs:inline">Témoignages</span>
              <span className="xs:hidden">Témoig.</span>
            </TabsTrigger>
            <TabsTrigger value="Formations" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden xs:inline">Formations</span>
              <span className="xs:hidden">Format.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une vidéo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <TabsContent value="all">
          <VideoGallery searchQuery={searchQuery} refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="Cultes">
          <VideoGallery searchQuery={searchQuery} categorie="Cultes" refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="Témoignages">
          <VideoGallery searchQuery={searchQuery} categorie="Témoignages" refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="Formations">
          <VideoGallery searchQuery={searchQuery} categorie="Formations" refreshKey={refreshKey} />
        </TabsContent>
      </Tabs>

      <UploadVideoDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handleVideoUploaded}
      />
    </div>
  )
}
