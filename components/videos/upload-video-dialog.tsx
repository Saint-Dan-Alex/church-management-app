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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { videosService } from "@/lib/services/videos.service"
import { blogsService } from "@/lib/services/blogs.service"
import type { VideoCategory } from "@/lib/types/api"
import { useToast } from "@/hooks/use-toast"

interface UploadVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadVideoDialog({ open, onOpenChange }: UploadVideoDialogProps) {
  const { toast } = useToast()

  const [uploadType, setUploadType] = useState<"upload" | "youtube">("youtube")
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    url: "",
    miniature: "",
    auteur: "",
    date: new Date().toISOString().split('T')[0],
    duree: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [openCategory, setOpenCategory] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    try {
      const data = await videosService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedThumbnail(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titre || !formData.categorie) {
      toast({ title: "Erreur", description: "Titre et catégorie requis", variant: "destructive" })
      return
    }

    if (uploadType === "youtube" && !formData.url) {
      toast({ title: "Erreur", description: "URL requise", variant: "destructive" })
      return
    }

    if (uploadType === "upload" && !selectedFile) {
      toast({ title: "Erreur", description: "Fichier requis", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      let finalUrl = formData.url

      if (uploadType === "upload" && selectedFile) {
        const uploadData = new FormData()
        uploadData.append("file", selectedFile)
        const res = await blogsService.uploadImage(uploadData)
        finalUrl = res.url
      }

      let miniatureUrl = formData.miniature
      if (selectedThumbnail) {
        const thumbData = new FormData()
        thumbData.append("file", selectedThumbnail)
        const thumbRes = await blogsService.uploadImage(thumbData)
        miniatureUrl = thumbRes.url
      }

      await videosService.create({
        ...formData,
        url: finalUrl,
        miniature: miniatureUrl,
        type: uploadType,
        date: formData.date || null,
        auteur: formData.auteur || "Admin",
      })

      toast({ title: "Succès", description: "Vidéo ajoutée avec succès !" })
      onOpenChange(false)
      window.location.reload()

    } catch (error) {
      console.error("Erreur création vidéo:", error)
      toast({ title: "Erreur", description: "Échec de la création", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une Vidéo</DialogTitle>
          <DialogDescription>
            Uploadez une vidéo ou ajoutez un lien YouTube/Vimeo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 pr-2">

            <div className="grid gap-2">
              <Label>Type d'ajout *</Label>
              <RadioGroup
                value={uploadType}
                onValueChange={(value: "upload" | "youtube") => {
                  setUploadType(value);
                  setFormData({ ...formData, url: "" })
                  setSelectedFile(null)
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="youtube" id="youtube" />
                  <Label htmlFor="youtube">Lien YouTube/Vimeo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Uploader fichier</Label>
                </div>
              </RadioGroup>
            </div>

            {uploadType === "youtube" ? (
              <div className="grid gap-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  key="youtube-url"
                  id="url"
                  type="url"
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://youtube.com/..."
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>Fichier vidéo *</Label>
                <Input
                  key="video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                />
                {selectedFile && <p className="text-sm text-green-600">{selectedFile.name}</p>}
              </div>
            )}

            <div className="grid gap-2">
              <Label>Miniature (Image) {uploadType === 'youtube' ? '(Optionnel)' : '*'}</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
              />
              {selectedThumbnail && <p className="text-sm text-green-600">{selectedThumbnail.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre || ""}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Catégorie *</Label>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="w-full justify-between"
                  >
                    {formData.categorie
                      ? categories.find((cat) => cat.id === formData.categorie)?.name || formData.categorie
                      : "Sélectionner..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher..." onValueChange={setCategorySearch} />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setFormData({ ...formData, categorie: categorySearch });
                              setOpenCategory(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter "{categorySearch}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              setFormData({ ...formData, categorie: category.id })
                              setOpenCategory(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categorie === category.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

            <div className="grid gap-2">
              <Label htmlFor="duree">Durée</Label>
              <Input
                id="duree"
                value={formData.duree || ""}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                placeholder="ex: 10:30"
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter la Vidéo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
