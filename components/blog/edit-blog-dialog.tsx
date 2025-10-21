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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content?: string
  category: string
  author: string
  status: string
}

interface EditBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: BlogPost | null
}

export function EditBlogDialog({ open, onOpenChange, post }: EditBlogDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    status: "draft",
  })

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content || "",
        category: post.category,
        author: post.author,
        status: post.status,
      })
    }
  }, [post])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.category) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const updatedPost = {
      ...post,
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    console.log("Article modifié:", updatedPost)
    alert(`✅ Article "${formData.title}" modifié avec succès !`)
    
    onOpenChange(false)
  }

  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'article
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Bref résumé de l'article"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenu complet de l'article"
                rows={8}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enseignement">Enseignement</SelectItem>
                  <SelectItem value="Témoignage">Témoignage</SelectItem>
                  <SelectItem value="Réflexion">Réflexion</SelectItem>
                  <SelectItem value="Annonce">Annonce</SelectItem>
                  <SelectItem value="Actualité">Actualité</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nom de l'auteur"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
