"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, MoreVertical, Edit, Trash, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ViewBlogDialog } from "./view-blog-dialog"
import { EditBlogDialog } from "./edit-blog-dialog"

const blogPosts = [
  {
    id: "1",
    title: "La Puissance de la Prière - Gloire à Dieu",
    excerpt:
      "Découvrez comment la prière transforme nos vies et renforce notre relation avec Dieu. Un témoignage inspirant de foi et de persévérance.",
    content: `La prière est un pilier fondamental de notre vie spirituelle. Elle nous permet de communiquer directement avec Dieu, de Lui présenter nos besoins, nos joies, et nos peines.

Dans cet article, nous explorons comment la prière peut transformer nos vies de manière profonde et durable. La Bible nous dit dans Philippiens 4:6-7 : "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces."

La prière n'est pas seulement une demande, c'est une relation. C'est un moment privilégié où nous pouvons nous rapprocher de Dieu, Lui exprimer notre reconnaissance et notre amour.

Que Dieu bénisse votre vie de prière et qu'Il vous accorde la persévérance de prier sans cesse !`,
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
    content: `Je m'appelle Marie et je veux partager avec vous comment Dieu a complètement transformé ma vie.

Il y a quelques années, je traversais une période très difficile. J'étais perdue, sans espoir, et je ne savais pas vers qui me tourner. C'est à ce moment-là que j'ai découvert l'amour de Dieu.

Un dimanche matin, j'ai décidé d'entrer dans une église. Ce que j'y ai trouvé a changé ma vie à jamais. J'ai rencontré des gens qui m'ont accueillie avec amour, sans jugement. J'ai entendu parler de Jésus-Christ et de Son sacrifice pour nous.

Aujourd'hui, je peux témoigner que Dieu est fidèle. Il ne m'a jamais abandonnée. Si vous traversez des difficultés, sachez que Dieu vous aime et qu'Il a un plan merveilleux pour votre vie.

Gloire à Dieu pour Sa bonté et Sa miséricorde !`,
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
    content: `La Bible nous rappelle dans Hébreux 10:24-25 : "Veillons les uns sur les autres, pour nous exciter à l'amour et aux bonnes œuvres. N'abandonnons pas notre assemblée, comme c'est la coutume de quelques-uns."

La communion fraternelle n'est pas optionnelle dans la vie chrétienne. C'est un élément essentiel de notre croissance spirituelle. Nous avons besoin les uns des autres pour :

- Nous encourager mutuellement dans la foi
- Porter les fardeaux les uns des autres
- Partager nos joies et nos peines
- Apprendre ensemble de la Parole de Dieu
- Prier les uns pour les autres

Dans notre église, nous croyons en l'importance de créer des liens authentiques entre frères et sœurs. C'est pourquoi nous organisons régulièrement des moments de partage et de communion.

Ne sous-estimez jamais le pouvoir d'une communauté unie dans l'amour du Christ !`,
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
    content: `[Article en cours de rédaction]

Comment pouvons-nous nous préparer à rencontrer Dieu lors du culte ?

Points à développer :
- La prière personnelle avant le culte
- La lecture de la Parole
- L'attitude du cœur
- L'importance de la ponctualité
- Venir avec un esprit d'adoration

À compléter...`,
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
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleView = (post: typeof blogPosts[0]) => {
    setSelectedPost(post)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (post: typeof blogPosts[0]) => {
    setSelectedPost(post)
    setIsEditDialogOpen(true)
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
                  <DropdownMenuItem onClick={() => handleView(post)}>
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

      <ViewBlogDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        post={selectedPost}
      />

      <EditBlogDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        post={selectedPost}
      />
    </div>
  )
}
