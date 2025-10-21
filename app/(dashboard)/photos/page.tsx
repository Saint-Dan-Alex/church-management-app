"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhotoGallery } from "@/components/photos/photo-gallery"
import { UploadPhotoDialog } from "@/components/photos/upload-photo-dialog"

export default function PhotosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Photothèque</h1>
          <p className="text-muted-foreground">Gérez vos photos et albums</p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Uploader Photos
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes les Photos</TabsTrigger>
          <TabsTrigger value="Cultes">Cultes</TabsTrigger>
          <TabsTrigger value="Camps">Camps</TabsTrigger>
          <TabsTrigger value="Sorties">Sorties</TabsTrigger>
        </TabsList>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une photo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <TabsContent value="all">
          <PhotoGallery searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="Cultes">
          <PhotoGallery searchQuery={searchQuery} album="Cultes" />
        </TabsContent>

        <TabsContent value="Camps">
          <PhotoGallery searchQuery={searchQuery} album="Camps" />
        </TabsContent>

        <TabsContent value="Sorties">
          <PhotoGallery searchQuery={searchQuery} album="Sorties" />
        </TabsContent>
      </Tabs>

      <UploadPhotoDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
    </div>
  )
}
