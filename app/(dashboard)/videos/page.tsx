"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoGallery } from "@/components/videos/video-gallery"
import { UploadVideoDialog } from "@/components/videos/upload-video-dialog"
import { videosService } from "@/lib/services/videos.service"
import type { VideoCategory } from "@/lib/types/api"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Charger les catégories depuis l'API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await videosService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Erreur chargement catégories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

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
        <PermissionGuard permission="videos.create">
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Ajouter Vidéo</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </PermissionGuard>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        {/* Onglets avec scroll horizontal sur mobile - Catégories dynamiques */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          ) : (
            <TabsList className="inline-flex min-w-max">
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Toutes les Vidéos</span>
                <span className="sm:hidden">Toutes</span>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
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

        {/* Contenu de l'onglet "Toutes" */}
        <TabsContent value="all">
          <VideoGallery searchQuery={searchQuery} refreshKey={refreshKey} />
        </TabsContent>

        {/* Contenu des onglets de catégories dynamiques */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <VideoGallery
              searchQuery={searchQuery}
              categorie={category.id}
              refreshKey={refreshKey}
            />
          </TabsContent>
        ))}
      </Tabs>

      <UploadVideoDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handleVideoUploaded}
      />
    </div>
  )
}
