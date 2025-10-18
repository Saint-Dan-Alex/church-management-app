"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, Eye, Calendar, BookOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditTeachingDialog } from "@/components/teachings/edit-teaching-dialog"

const mockTeachings = [
  {
    id: "1",
    dateSeance: "2024-01-15",
    theme: "L'amour de Dieu",
    sousTheme: "La miséricorde divine",
    sujet: "Dieu nous aime inconditionnellement",
    textesBibliques: "Jean 3:16, 1 Jean 4:8-10",
    versetRetenir: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique",
    typeContenu: "points_developper",
    chantsCount: 3,
    pointsCount: 4,
  },
  {
    id: "2",
    dateSeance: "2024-01-22",
    theme: "La prière",
    sousTheme: "Prier avec foi",
    sujet: "Comment prier efficacement",
    textesBibliques: "Matthieu 6:5-15, Jacques 5:16",
    versetRetenir: "La prière fervente du juste a une grande efficacité",
    typeContenu: "developpement",
    chantsCount: 2,
    evenementsCount: 3,
  },
  {
    id: "3",
    dateSeance: "2024-01-29",
    theme: "La foi",
    sousTheme: "Vivre par la foi",
    sujet: "La foi qui plaît à Dieu",
    textesBibliques: "Hébreux 11:1-6, Jacques 2:14-26",
    versetRetenir: "Or sans la foi, il est impossible de plaire à Dieu",
    typeContenu: "points_developper",
    chantsCount: 4,
    pointsCount: 5,
  },
]

interface TeachingListProps {
  searchQuery: string
}

export function TeachingList({ searchQuery }: TeachingListProps) {
  const router = useRouter()
  const [editingTeaching, setEditingTeaching] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (teaching: any) => {
    setEditingTeaching(teaching)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (teachingId: string, teachingTheme: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'enseignement "${teachingTheme}" ?`)) {
      console.log("Suppression de l'enseignement:", teachingId)
      // Logique de suppression ici
    }
  }

  const filteredTeachings = mockTeachings.filter(
    (teaching) =>
      teaching.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.sousTheme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.sujet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.textesBibliques.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachings.map((teaching) => (
          <Card
            key={teaching.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/teachings/${teaching.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <Badge variant="outline" className="text-xs">
                    {new Date(teaching.dateSeance).toLocaleDateString("fr-FR")}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{teaching.theme}</h3>
                {teaching.sousTheme && (
                  <p className="text-sm text-gray-600 mb-2">{teaching.sousTheme}</p>
                )}
                <p className="text-sm text-gray-700 font-medium mb-3">{teaching.sujet}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/teachings/${teaching.id}`)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(teaching)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(teaching.id, teaching.theme)
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-600 font-medium">V.A.R:</span>
                <p className="text-xs text-gray-700 line-clamp-2">{teaching.versetRetenir}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{teaching.textesBibliques}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="text-xs">
                {teaching.chantsCount} chant{teaching.chantsCount > 1 ? "s" : ""}
              </Badge>
              {teaching.typeContenu === "points_developper" ? (
                <Badge className="bg-blue-600 text-xs">
                  {teaching.pointsCount} point{teaching.pointsCount > 1 ? "s" : ""}
                </Badge>
              ) : (
                <Badge className="bg-green-600 text-xs">
                  {teaching.evenementsCount} événement{teaching.evenementsCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      <EditTeachingDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        teaching={editingTeaching}
      />
    </>
  )
}
