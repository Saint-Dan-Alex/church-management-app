"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ImageIcon, MoreVertical, Edit, Trash, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const albums = [
  {
    id: "1",
    title: "Culte du 13 Octobre 2024",
    date: "2024-10-13",
    photoCount: 45,
    coverImage: "/church-service.png",
    category: "Culte",
  },
  {
    id: "2",
    title: "Sortie Jeunesse - Parc",
    date: "2024-10-08",
    photoCount: 67,
    coverImage: "/youth-outdoor.jpg",
    category: "Jeunesse",
  },
  {
    id: "3",
    title: "École du Dimanche",
    date: "2024-10-06",
    photoCount: 32,
    coverImage: "/children-sunday-school.jpg",
    category: "Enfants",
  },
  {
    id: "4",
    title: "Baptêmes - Septembre 2024",
    date: "2024-09-29",
    photoCount: 28,
    coverImage: "/baptism.jpg",
    category: "Événement",
  },
  {
    id: "5",
    title: "Conférence Annuelle",
    date: "2024-09-15",
    photoCount: 89,
    coverImage: "/business-conference.png",
    category: "Événement",
  },
  {
    id: "6",
    title: "Pique-nique Familial",
    date: "2024-08-20",
    photoCount: 54,
    coverImage: "/family-picnic.png",
    category: "Communauté",
  },
]

interface PhotoGalleryProps {
  searchQuery: string
}

export function PhotoGallery({ searchQuery }: PhotoGalleryProps) {
  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredAlbums.map((album) => (
        <Card key={album.id} className="overflow-hidden group cursor-pointer">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={album.coverImage || "/placeholder.svg"}
              alt={album.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className="absolute top-3 right-3">{album.category}</Badge>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="font-semibold text-lg mb-1">{album.title}</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(album.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  <span>{album.photoCount} photos</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <Button variant="outline" size="sm">
              Voir l'Album
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  )
}
