"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, MoreVertical, Edit, Trash, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const blogPosts = [
  {
    id: "1",
    title: "La Puissance de la Prière - Gloire à Dieu",
    excerpt:
      "Découvrez comment la prière transforme nos vies et renforce notre relation avec Dieu. Un témoignage inspirant de foi et de persévérance.",
    author: "Pasteur Jean Martin",
    date: "2024-10-15",
    category: "Enseignement",
    status: "published",
    views: 245,
    image: "/person-praying.png",
  },
  {
    id: "2",
    title: "Témoignage: Comment Dieu a Changé Ma Vie",
    excerpt:
      "Un témoignage puissant de transformation et de grâce divine. Marie partage son parcours de foi et les miracles qu'elle a vécus.",
    author: "Marie Dupont",
    date: "2024-10-12",
    category: "Témoignage",
    status: "published",
    views: 189,
    image: "/testimony.jpg",
  },
  {
    id: "3",
    title: "L'Importance de la Communion Fraternelle",
    excerpt:
      "Réflexion sur le rôle essentiel de la communauté dans notre vie spirituelle. Comment grandir ensemble dans la foi.",
    author: "Sophie Bernard",
    date: "2024-10-10",
    category: "Réflexion",
    status: "published",
    views: 156,
    image: "/fellowship.jpg",
  },
  {
    id: "4",
    title: "Préparer son Coeur pour le Culte",
    excerpt:
      "Conseils pratiques pour se préparer spirituellement avant de venir au culte. Brouillon en cours de rédaction.",
    author: "Pasteur Jean Martin",
    date: "2024-10-16",
    category: "Enseignement",
    status: "draft",
    views: 0,
    image: "/act-of-worship.png",
  },
]

interface BlogListProps {
  searchQuery: string
  filter: "all" | "published" | "draft"
}

export function BlogList({ searchQuery, filter }: BlogListProps) {
  const handleEdit = (post: typeof blogPosts[0]) => {
    alert(`✏️ Édition de: "${post.title}"\n\n(Fonctionnalité en cours d'implémentation)`)
    console.log("Éditer l'article:", post)
  }

  const handleDelete = (post: typeof blogPosts[0]) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${post.title}" ?`)) {
      console.log("Article supprimé:", post.id)
      alert(`🗑️ Article "${post.title}" supprimé avec succès !`)
    }
  }

  const handleShare = (post: typeof blogPosts[0]) => {
    const url = `${window.location.origin}/blog/${post.id}`
    navigator.clipboard.writeText(url)
    alert(`📋 Lien copié dans le presse-papier !\n\n${url}`)
  }

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filter === "all" || post.status === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </Badge>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <h3 className="text-lg font-semibold leading-tight">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(post)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  {post.status === "published" && (
                    <DropdownMenuItem onClick={() => handleShare(post)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Partager
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.date).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
              {post.status === "published" && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views} vues</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
