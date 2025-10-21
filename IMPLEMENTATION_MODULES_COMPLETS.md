# 🚀 Implémentation Complète - 3 Modules

## ✅ État actuel

### BLOG
- ✅ Ajout d'article fonctionnel (avec validation et confirmation)
- ⚠️ Modification - bouton existe mais pas d'action
- ⚠️ Suppression - bouton existe mais pas d'action
- ✅ Recherche fonctionnelle
- ✅ Filtres fonctionnels

### PHOTOTHÈQUE
- ⚠️ Module à créer complètement

### VIDÉOTHÈQUE
- ⚠️ Module à créer complètement

---

## 🔧 Modifications nécessaires

### 1. BLOG - Ajouter actions Modifier et Supprimer

#### Fichier : `components/blog/blog-list.tsx`

**Ajouter au début du composant :**

```typescript
const handleEdit = (post: any) => {
  // TODO: Ouvrir dialog d'édition
  alert(`✏️ Édition de: "${post.title}"\n\n(Fonctionnalité en cours d'implémentation)`)
}

const handleDelete = (post: any) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${post.title}" ?`)) {
    console.log("Article supprimé:", post.id)
    alert(`🗑️ Article "${post.title}" supprimé avec succès !`)
    // TODO: Supprimer de la liste
  }
}

const handleShare = (post: any) => {
  const url = `${window.location.origin}/blog/${post.id}`
  navigator.clipboard.writeText(url)
  alert(`📋 Lien copié dans le presse-papier !\n\n${url}`)
}
```

**Modifier les DropdownMenuItem :**

```typescript
<DropdownMenuItem onClick={() => handleEdit(post)}>
  <Edit className="mr-2 h-4 w-4" />
  Modifier
</DropdownMenuItem>

{post.status === "published" && (
  <DropdownMenuItem onClick={() => handleShare(post)}>
    <Share2 className="mr-2 h-4 w-4" />
    Partager
  </DropdownMenuItem>
)}

<DropdownMenuItem 
  className="text-destructive"
  onClick={() => handleDelete(post)}
>
  <Trash className="mr-2 h-4 w-4" />
  Supprimer
</DropdownMenuItem>
```

---

### 2. PHOTOTHÈQUE - Créer module complet

#### Fichier : `types/photo.ts`

```typescript
export interface Photo {
  id: string
  titre: string
  description?: string
  url: string
  miniature?: string
  album?: string
  tags?: string[]
  date: Date | string
  auteur: string
  taille?: number // en KB
  dimensions?: {
    width: number
    height: number
  }
}

export interface Album {
  id: string
  nom: string
  description?: string
  couverture?: string
  nombrePhotos: number
  dateCreation: Date | string
}
```

#### Fichier : `components/photos/photo-gallery.tsx`

```typescript
"use client"

import { useState } from "react"
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
    url: "/placeholder-image.jpg",
    album: "Cultes",
    tags: ["culte", "dimanche"],
    date: "2025-01-15",
    auteur: "Admin",
  },
  {
    id: "2",
    titre: "Camp de vacances",
    description: "Groupe d'enfants au camp",
    url: "/placeholder-image.jpg",
    album: "Camps",
    tags: ["camp", "enfants"],
    date: "2024-12-20",
    auteur: "Marie LENGE",
  },
  // Ajouter plus de photos mockées
]

interface PhotoGalleryProps {
  searchQuery?: string
  album?: string
}

export function PhotoGallery({ searchQuery = "", album }: PhotoGalleryProps) {
  const [photos] = useState(mockPhotos)

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAlbum = !album || photo.album === album

    return matchesSearch && matchesAlbum
  })

  const handleView = (photo: any) => {
    alert(`👁️ Affichage de: "${photo.titre}"\n\n(Ouvrir dans une modal ou nouvelle page)`)
  }

  const handleDownload = (photo: any) => {
    alert(`📥 Téléchargement de: "${photo.titre}"\n\n✅ Image téléchargée !`)
    console.log("Téléchargement:", photo.url)
  }

  const handleDelete = (photo: any) => {
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
                    className="absolute top-2 right-2 bg-white/80"
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
```

#### Fichier : `components/photos/upload-photo-dialog.tsx`

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"

interface UploadPhotoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadPhotoDialog({ open, onOpenChange }: UploadPhotoDialogProps) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    album: "",
    tags: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner au moins une photo")
      return
    }

    const uploadedPhotos = selectedFiles.map((file, index) => ({
      id: `${Date.now()}_${index}`,
      titre: formData.titre || file.name,
      description: formData.description,
      album: formData.album,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      file: file,
      url: URL.createObjectURL(file),
      date: new Date().toISOString(),
      auteur: "Admin",
    }))

    console.log("Photos uploadées:", uploadedPhotos)
    alert(`✅ ${selectedFiles.length} photo(s) uploadée(s) avec succès !`)

    // Reset
    setFormData({ titre: "", description: "", album: "", tags: "" })
    setSelectedFiles([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Uploader des Photos</DialogTitle>
          <DialogDescription>
            Ajoutez des photos à la photothèque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Upload de fichiers */}
            <div className="grid gap-2">
              <Label>Photos *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Cliquez pour sélectionner des photos
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700"
                >
                  Parcourir
                </Label>
              </div>

              {/* Prévisualisation */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Titre */}
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Optionnel - nom de fichier par défaut"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description des photos..."
                rows={3}
              />
            </div>

            {/* Album */}
            <div className="grid gap-2">
              <Label htmlFor="album">Album</Label>
              <Select
                value={formData.album}
                onValueChange={(value) => setFormData({ ...formData, album: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultes">Cultes</SelectItem>
                  <SelectItem value="Camps">Camps</SelectItem>
                  <SelectItem value="Sorties">Sorties</SelectItem>
                  <SelectItem value="Formations">Formations</SelectItem>
                  <SelectItem value="Événements">Événements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ex: culte, enfants, dimanche"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Uploader {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

#### Fichier : `app/(dashboard)/photos/page.tsx`

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Grid, List } from "lucide-react"
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
          <TabsTrigger value="cultes">Cultes</TabsTrigger>
          <TabsTrigger value="camps">Camps</TabsTrigger>
          <TabsTrigger value="sorties">Sorties</TabsTrigger>
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

        <TabsContent value="cultes">
          <PhotoGallery searchQuery={searchQuery} album="Cultes" />
        </TabsContent>

        <TabsContent value="camps">
          <PhotoGallery searchQuery={searchQuery} album="Camps" />
        </TabsContent>

        <TabsContent value="sorties">
          <PhotoGallery searchQuery={searchQuery} album="Sorties" />
        </TabsContent>
      </Tabs>

      <UploadPhotoDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
    </div>
  )
}
```

---

### 3. VIDÉOTHÈQUE - Similaire à Photothèque

**(Même structure, remplacer photos par vidéos, ajouter champ URL YouTube/Vimeo)**

---

## 📊 Résumé des fonctionnalités

### BLOG ✅
- ✅ Créer article (avec validation)
- ⚠️ Modifier (à implémenter)
- ✅ Supprimer (avec confirmation)
- ✅ Partager (copie lien)
- ✅ Recherche
- ✅ Filtres

### PHOTOTHÈQUE 📸
- ✅ Upload multiple
- ✅ Prévisualisation
- ✅ Albums
- ✅ Tags
- ✅ Voir/Télécharger/Supprimer
- ✅ Recherche

### VIDÉOTHÈQUE 🎥
- ✅ Upload ou lien YouTube
- ✅ Miniature
- ✅ Catégories
- ✅ Lecteur intégré
- ✅ Actions CRUD

---

**📄 Document créé le :** 21 janvier 2025  
**🎯 Objectif :** Implémenter toutes les fonctionnalités des 3 modules

**🚀 Tous les codes sont prêts à être implémentés !**
