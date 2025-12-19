"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, MoreVertical, Edit, Trash, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ViewBlogDialog } from "./view-blog-dialog"
import { EditBlogDialog } from "./edit-blog-dialog"
import { blogsService } from "@/lib/services/blogs.service"
import type { Blog } from "@/lib/types/api"
import { toast } from "sonner"

interface BlogListProps {
  searchQuery?: string
  status?: string
  filter?: string  // Alias pour status, pour compatibilité
  refreshKey?: number  // Permet de forcer le rechargement depuis le parent
}

export function BlogList({ searchQuery = "", status, filter, refreshKey = 0 }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [internalRefreshKey, setInternalRefreshKey] = useState(0)  // Pour rafraîchir après modification interne

  // Fonction pour recharger la liste
  const reloadBlogs = () => {
    setInternalRefreshKey(prev => prev + 1)
  }

  // Utiliser filter comme fallback pour status
  const effectiveStatus = status || (filter && filter !== "all" ? filter : undefined)

  // Recharger quand refreshKey change (après création d'un article)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response: any = await blogsService.getAll({ status: effectiveStatus })
        // L'API Laravel renvoie une réponse paginée { data: [...], ... }
        const data = response.data || response
        setBlogs(Array.isArray(data) ? data : [])
      } catch (err) {
        setError("Erreur lors du chargement des articles")
        console.error("Erreur:", err)
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [effectiveStatus, refreshKey, internalRefreshKey])  // Inclure internalRefreshKey

  const filteredBlogs = Array.isArray(blogs) ? blogs.filter((blog) => {
    const title = blog.title || blog.titre || ""
    const excerpt = blog.excerpt || blog.extrait || ""
    const content = blog.content || blog.contenu || ""

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !status || blog.status === status || blog.statut === status

    return matchesSearch && matchesStatus
  }) : []

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsViewOpen(true)
  }

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsEditOpen(true)
  }

  const handleDelete = async (blog: Blog) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${blog.title || blog.titre}" ?`)) {
      try {
        await blogsService.delete(blog.id)
        setBlogs(prev => prev.filter(b => b.id !== blog.id))
        toast.success(`Article "${blog.title || blog.titre}" supprimé avec succès`)
      } catch (err) {
        toast.error("Erreur lors de la suppression")
        console.error("Erreur:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse">📝</div>
        <p className="text-gray-500">Chargement des articles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="h-12 w-12 mx-auto text-red-400 mb-3">📝</div>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredBlogs.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="h-12 w-12 mx-auto text-gray-400 mb-3">📝</div>
          <p className="text-gray-500">Aucun article trouvé</p>
        </div>
      ) : (
        filteredBlogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden flex flex-col">
            {blog.image && (
              <div className="relative h-48 w-full bg-muted">
                <img
                  src={blog.image}
                  alt={blog.title || blog.titre}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 mb-2">
                    {blog.title || blog.titre}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {typeof blog.category === 'object' && blog.category?.name
                        ? blog.category.name
                        : (typeof blog.category === 'string' ? blog.category : (blog.categorie || 'Sans catégorie'))
                      }
                    </Badge>
                    <Badge
                      className={`text-xs ${blog.status === "published" || blog.statut === "publie"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                        }`}
                    >
                      {blog.status === "published" || blog.statut === "publie" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(blog)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(blog)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(blog)}
                      className="text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {blog.excerpt || blog.extrait}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{blog.author || blog.auteur}</span>
                  </div>
                  {(blog.published_at || blog.date || blog.created_at) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.published_at || blog.date || blog.created_at!).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{blog.views || blog.vues || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      <ViewBlogDialog open={isViewOpen} onOpenChange={setIsViewOpen} blog={selectedBlog} />
      <EditBlogDialog open={isEditOpen} onOpenChange={setIsEditOpen} blog={selectedBlog} onSuccess={reloadBlogs} />
    </div>
  )
}
