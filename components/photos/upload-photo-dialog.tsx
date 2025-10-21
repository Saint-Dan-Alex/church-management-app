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
      alert("⚠️ Veuillez sélectionner au moins une photo")
      return
    }

    const uploadedPhotos = selectedFiles.map((file, index) => ({
      id: `${Date.now()}_${index}`,
      titre: formData.titre || file.name,
      description: formData.description,
      album: formData.album,
      file: file,
      url: URL.createObjectURL(file),
      date: new Date().toISOString(),
      auteur: "Admin",
    }))

    console.log("Photos uploadées:", uploadedPhotos)
    alert(`✅ ${selectedFiles.length} photo(s) uploadée(s) avec succès !`)

    // Reset
    setFormData({ titre: "", description: "", album: "" })
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
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={selectedFiles.length === 0}>
              Uploader {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
