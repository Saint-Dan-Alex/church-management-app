"use client"

import type React from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { blogsService } from "@/lib/services/blogs.service"
import type { BlogCategory } from "@/lib/types/api"
import { useToast } from "@/hooks/use-toast"

interface AddBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBlogDialog({ open, onOpenChange }: AddBlogDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "", // ID (si existant) ou Nom (si nouveau)
    author: "",
    status: "draft",
    image: "",
    tags: "",
    published_at: "",
  })

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [openCategory, setOpenCategory] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    try {
      const data = await blogsService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories.",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 5 Mo.",
        variant: "destructive",
      })
      return
    }

    const uploadData = new FormData()
    uploadData.append("file", file)

    setUploading(true)
    try {
      const res = await blogsService.uploadImage(uploadData)
      setFormData((prev) => ({ ...prev, image: res.url }))
      toast({
        title: "Succès",
        description: "Image uploadée avec succès !",
      })
    } catch (err) {
      console.error("Erreur upload:", err)
      toast({
        title: "Erreur",
        description: "Échec de l'upload de l'image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires (Titre, Contenu, Catégorie).",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const tagsArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : []

      await blogsService.create({
        ...formData,
        tags: tagsArray,
        image: formData.image || null,
        published_at: formData.published_at || null,
        status: formData.status as 'draft' | 'published',
        author: formData.author || "Admin",
      })

      toast({
        title: "Succès",
        description: `Article "${formData.title}" créé avec succès !`,
      })

      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        status: "draft",
        image: "",
        tags: "",
        published_at: "",
      })

      onOpenChange(false)
      window.location.reload()

    } catch (error) {
      console.error("Erreur création article:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'article.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nouvel Article</DialogTitle>
          <DialogDescription>Créez un nouvel article de blog ou témoignage</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 pr-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image de couverture</Label>
                <div className="flex flex-col gap-2">
                  {formData.image && (
                    <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden border">
                      <img src={formData.image || "/placeholder.svg"} alt="Aperçu" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || loading}
                  />
                  {uploading && <p className="text-xs text-muted-foreground animate-pulse">Upload en cours...</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Un court résumé..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu complet..."
                  rows={10}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                        {formData.category
                          ? categories.find((cat) => cat.id === formData.category)?.name || formData.category
                          : "Sélectionner..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
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
                                  setFormData({ ...formData, category: categorySearch });
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
                                  setFormData({ ...formData, category: category.id })
                                  setOpenCategory(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.category === category.id ? "opacity-100" : "opacity-0"
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
                  <Label htmlFor="author">Auteur *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (séparés par virgules)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tag1, tag2"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="published_at">Date de publication</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                />
              </div>

            </div>
            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
