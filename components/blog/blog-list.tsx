"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, MoreVertical, Edit, Trash, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ViewBlogDialog } from "./view-blog-dialog"
import { EditBlogDialog } from "./edit-blog-dialog"
import { blogsService, type Blog } from "@/lib/services/blogs.service"
import { toast } from "sonner"

interface BlogListProps {
  searchQuery?: string
  status?: string
}

export function BlogList({ searchQuery = "", status }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const data = await blogsService.getAll({ status })
        setBlogs(data)
      } catch (err) {
        setError("Erreur lors du chargement des articles")
        console.error("Erreur:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [status])

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      (blog.title || blog.titre)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.excerpt || blog.extrait)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.content || blog.contenu)?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !status || blog.status === status || blog.statut === status

    return matchesSearch && matchesStatus
  })

  const handleView = (blog: Blog) => {
    alert(`👁️ Affichage de: "${blog.title || blog.titre}"\n\n(Ouvrir dans une modal ou nouvelle page)`)
  }

  const handleEdit = (blog: Blog) => {
    alert(`✏️ Modification de: "${blog.title || blog.titre}"\n\n(Ouvrir dans un formulaire d'édition)`)
  }

  const handleDelete = async (blog: Blog) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${blog.title || blog.titre}" ?`)) {
      try {
        await blogsService.delete(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
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
          <Card key={blog.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 mb-2">
                    {blog.title || blog.titre}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {blog.category || blog.categorie}
                    </Badge>
                    <Badge
                      className={`text-xs ${
                        blog.status === "published" || blog.statut === "publie"
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
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {blog.excerpt || blog.extrait}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{blog.author || blog.auteur}</span>
                  </div>
                  {blog.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
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
    </div>
  )
}
