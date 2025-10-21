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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vidéothèque</h1>
          <p className="text-muted-foreground">Gérez vos vidéos et enregistrements</p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Vidéo
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes les Vidéos</TabsTrigger>
          <TabsTrigger value="Cultes">Cultes</TabsTrigger>
          <TabsTrigger value="Témoignages">Témoignages</TabsTrigger>
          <TabsTrigger value="Formations">Formations</TabsTrigger>
        </TabsList>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une vidéo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <TabsContent value="all">
          <VideoGallery searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="Cultes">
          <VideoGallery searchQuery={searchQuery} categorie="Cultes" />
        </TabsContent>

        <TabsContent value="Témoignages">
          <VideoGallery searchQuery={searchQuery} categorie="Témoignages" />
        </TabsContent>

        <TabsContent value="Formations">
          <VideoGallery searchQuery={searchQuery} categorie="Formations" />
        </TabsContent>
      </Tabs>

      <UploadVideoDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
    </div>
  )
}
