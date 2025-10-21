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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Link as LinkIcon } from "lucide-react"

interface UploadVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadVideoDialog({ open, onOpenChange }: UploadVideoDialogProps) {
  const [uploadType, setUploadType] = useState<"upload" | "youtube">("youtube")
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    url: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titre || !formData.categorie) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires")
      return
    }

    if (uploadType === "youtube" && !formData.url) {
      alert("⚠️ Veuillez entrer une URL YouTube ou Vimeo")
      return
    }

    if (uploadType === "upload" && !selectedFile) {
      alert("⚠️ Veuillez sélectionner un fichier vidéo")
      return
    }

    const newVideo = {
      id: Date.now().toString(),
      ...formData,
      type: uploadType,
      file: selectedFile,
      date: new Date().toISOString(),
      auteur: "Admin",
      vues: 0,
    }

    console.log("Vidéo ajoutée:", newVideo)
    alert(`✅ Vidéo "${formData.titre}" ajoutée avec succès !`)

    // Reset
    setFormData({ titre: "", description: "", categorie: "", url: "" })
    setSelectedFile(null)
    setUploadType("youtube")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une Vidéo</DialogTitle>
          <DialogDescription>
            Uploadez une vidéo ou ajoutez un lien YouTube/Vimeo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Type d'upload */}
            <div className="grid gap-2">
              <Label>Type d'ajout *</Label>
              <RadioGroup
                value={uploadType}
                onValueChange={(value: "upload" | "youtube") => setUploadType(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="youtube" id="youtube" />
                  <Label htmlFor="youtube" className="font-normal cursor-pointer flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <span>Lien YouTube/Vimeo</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload" className="font-normal cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Uploader fichier</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* URL YouTube ou Upload fichier */}
            {uploadType === "youtube" ? (
              <div className="grid gap-2">
                <Label htmlFor="url">URL YouTube ou Vimeo *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>Fichier vidéo *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Cliquez pour sélectionner une vidéo
                  </p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <Label
                    htmlFor="video-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Parcourir
                  </Label>
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      📹 {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Titre */}
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Titre de la vidéo"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la vidéo..."
                rows={3}
              />
            </div>

            {/* Catégorie */}
            <div className="grid gap-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultes">Cultes</SelectItem>
                  <SelectItem value="Témoignages">Témoignages</SelectItem>
                  <SelectItem value="Formations">Formations</SelectItem>
                  <SelectItem value="Enseignements">Enseignements</SelectItem>
                  <SelectItem value="Événements">Événements</SelectItem>
                  <SelectItem value="Louange">Louange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter la Vidéo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
