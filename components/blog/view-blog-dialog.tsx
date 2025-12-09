"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, User, Eye } from "lucide-react"
import type { Blog } from "@/lib/types/api"

interface ViewBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog: Blog | null
}

export function ViewBlogDialog({ open, onOpenChange, blog }: ViewBlogDialogProps) {
  if (!blog) return null

  const categoryName = typeof blog.category === 'object' && blog.category?.name
    ? blog.category.name
    : (typeof blog.category === 'string' ? blog.category : (blog.categorie || 'Sans catégorie'))

  const status = blog.status || blog.statut
  const isPublished = status === "published" || status === "publie"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Publié" : "Brouillon"}
              </Badge>
              <Badge variant="outline">{categoryName}</Badge>
            </div>
            <DialogTitle className="text-2xl">{blog.title || blog.titre}</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Image */}
            {blog.image && (
              <div className="w-full h-64 rounded-lg overflow-hidden bg-muted">
                <img
                  src={blog.image}
                  alt={blog.title || blog.titre}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Métadonnées */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-y py-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{blog.author || blog.auteur}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {(blog.published_at || blog.date || blog.created_at) && new Date(blog.published_at || blog.date || blog.created_at!).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
              {isPublished && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{blog.views || blog.vues || 0} vues</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {blog.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Extrait */}
            {(blog.excerpt || blog.extrait) && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm italic text-gray-700">{blog.excerpt || blog.extrait}</p>
              </div>
            )}

            {/* Contenu */}
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap">
                {blog.content || blog.contenu}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
