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

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content?: string
  category: string
  author: string
  status: string
  date: string
  views: number
  image?: string
}

interface ViewBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: BlogPost | null
}

export function ViewBlogDialog({ open, onOpenChange, post }: ViewBlogDialogProps) {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={post.status === "published" ? "default" : "secondary"}>
                {post.status === "published" ? "Publié" : "Brouillon"}
              </Badge>
              <Badge variant="outline">{post.category}</Badge>
            </div>
            <DialogTitle className="text-2xl">{post.title}</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Image */}
            {post.image && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Métadonnées */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-y py-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}</span>
              </div>
              {post.status === "published" && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} vues</span>
                </div>
              )}
            </div>

            {/* Extrait */}
            {post.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm italic text-gray-700">{post.excerpt}</p>
              </div>
            )}

            {/* Contenu */}
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap">
                {post.content || post.excerpt}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
