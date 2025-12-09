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
import { Check, ChevronsUpDown, Plus } from "lucide-react"
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
  })

  // Gestion des catégories
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [openCategory, setOpenCategory] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [loading, setLoading] = useState(false)

  // Charger les catégories à l'ouverture du dialogue
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

      await blogsService.create({
        ...formData,
        status: formData.status as 'draft' | 'published',
        author: formData.author || "Admin",
      })

      toast({
        title: "Succès",
        description: `Article "${formData.title}" créé avec succès !`,
      })

      // Réinitialiser le formulaire
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        status: "draft",
      })

      onOpenChange(false)

      // Rafraîchir la page pour voir le nouvel article (solution simple)
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
                  placeholder="La Puissance de la Prière - Gloire à Dieu"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Un court résumé de l'article..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Écrivez votre article ici..."
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
                          : "Sélectionner une catégorie..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher ou créer..." onValueChange={setCategorySearch} />
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
                  <p className="text-[10px] text-muted-foreground">Sélectionnez ou tapez pour créer.</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="author">Auteur *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Nom de l'auteur"
                    required
                  />
                </div>
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
            <DialogFooter className="pr-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : (formData.status === "published" ? "Publier" : "Enregistrer")}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
