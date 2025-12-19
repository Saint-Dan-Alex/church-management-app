"use client"

import { useState, useEffect } from "react"
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
import { Upload, X, ChevronsUpDown, Check, Plus } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { photosService, type PhotoAlbum } from "@/lib/services/photos.service"
import { blogsService } from "@/lib/services/blogs.service"
import { useToast } from "@/hooks/use-toast"

interface UploadPhotoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void  // Callback appelé après upload réussi
}

export function UploadPhotoDialog({ open, onOpenChange, onSuccess }: UploadPhotoDialogProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    album: "",
    auteur: "Admin",
    date: new Date().toISOString().split('T')[0],
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [albums, setAlbums] = useState<PhotoAlbum[]>([])
  const [openAlbum, setOpenAlbum] = useState(false)
  const [albumSearch, setAlbumSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadAlbums()
    }
  }, [open])

  const loadAlbums = async () => {
    try {
      const data = await photosService.getAlbums()
      setAlbums(data)
    } catch (error) {
      console.error("Erreur chargement albums:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      // Validation taille max (par exemple 20MB par photo pour être large, server limit is 500MB global request but checked per file in controller)
      const validFiles = files.filter(file => {
        if (file.size > 20 * 1024 * 1024) {
          toast({ title: "Fichier ignoré", description: `${file.name} dépasse 20Mo`, variant: "destructive" })
          return false
        }
        return true
      })
      setSelectedFiles((prev) => [...prev, ...validFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      toast({ title: "Erreur", description: "Veuillez sélectionner au moins une photo", variant: "destructive" })
      return
    }

    if (!formData.album) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un album", variant: "destructive" })
      return
    }

    setLoading(true)
    let successCount = 0
    let errors = 0

    try {
      for (const file of selectedFiles) {
        try {
          // 1. Upload file
          const uploadData = new FormData()
          uploadData.append("file", file)
          const res = await blogsService.uploadImage(uploadData)
          const finalUrl = res.url

          // 2. Nettoyer le nom de fichier pour le titre par défaut
          // Enlever l'extension et les caractères spéciaux
          const cleanFileName = file.name
            .replace(/\.[^/.]+$/, '') // Enlever l'extension
            .replace(/[()]/g, '')    // Enlever les parenthèses
            .trim()

          // 3. Create Photo entry
          await photosService.create({
            titre: formData.titre || cleanFileName || 'Sans titre',
            description: formData.description || null,
            album: formData.album,
            auteur: formData.auteur || 'Admin',
            date: formData.date || null,
            url: finalUrl,
          })

          successCount++
        } catch (err) {
          console.error(`Erreur upload ${file.name}:`, err)
          errors++
        }
      }

      if (successCount > 0) {
        toast({ title: "Succès", description: `${successCount} photo(s) uploadée(s) !` })
        setFormData({ ...formData, titre: "", description: "" }) // Keep album ?
        setSelectedFiles([])
        onOpenChange(false)
        if (onSuccess) onSuccess()  // Rafraîchir la liste au lieu de recharger la page
      }

      if (errors > 0) {
        toast({ title: "Attention", description: `${errors} échec(s) lors de l'upload.`, variant: "destructive" })
      }

    } catch (error) {
      console.error("Erreur globale:", error)
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uploader des Photos</DialogTitle>
          <DialogDescription>
            Ajoutez des photos à la photothèque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
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
                  key="photo-upload-input" // Clé unique pour éviter erreur controlled/uncontrolled
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
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
                        className="w-full aspect-square object-cover rounded border"
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
                      <p className="text-xs text-gray-600 truncate mt-1">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Album Dynamique */}
            <div className="grid gap-2">
              <Label>Album *</Label>
              <Popover open={openAlbum} onOpenChange={setOpenAlbum}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openAlbum}
                    className="w-full justify-between"
                  >
                    {formData.album
                      ? albums.find((a) => a.id === formData.album)?.name || formData.album
                      : "Sélectionner un album..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher un album..." onValueChange={setAlbumSearch} />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setFormData({ ...formData, album: albumSearch });
                              setOpenAlbum(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter "{albumSearch}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {albums.map((album) => (
                          <CommandItem
                            key={album.id}
                            value={album.name}
                            onSelect={() => {
                              setFormData({ ...formData, album: album.id })
                              setOpenAlbum(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.album === album.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {album.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Titre */}
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre (Défaut)</Label>
              <Input
                id="titre"
                value={formData.titre || ""}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Optionnel - nom de fichier par défaut"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description des photos..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="auteur">Auteur</Label>
                <Input
                  id="auteur"
                  value={formData.auteur || ""}
                  onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                  placeholder="Admin"
                />
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={selectedFiles.length === 0 || loading || !formData.album}>
              {loading ? "Upload en cours..." : `Uploader ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
