"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, Eye, Calendar, BookOpen, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditTeachingDialog } from "@/components/teachings/edit-teaching-dialog"
import { teachingsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { Teaching } from "@/types/teaching"

interface TeachingListProps {
  searchQuery: string
  refreshKey?: number // Permet de forcer le rechargement depuis le parent
}

export function TeachingList({ searchQuery, refreshKey = 0 }: TeachingListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { can } = useUser()
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTeaching, setEditingTeaching] = useState<Teaching | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Recharger quand refreshKey change (après création d'un enseignement)
  useEffect(() => {
    loadTeachings()
  }, [refreshKey])

  const loadTeachings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await teachingsService.getAll()
      setTeachings(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de chargement des enseignements'
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (teaching: any) => {
    setEditingTeaching(teaching)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (teachingId: string, teachingTheme: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'enseignement "${teachingTheme}" ?`)) {
      try {
        await teachingsService.delete(teachingId)
        toast({
          title: "Enseignement supprimé",
          description: "L'enseignement a été supprimé avec succès.",
        })
        loadTeachings()
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message || "Impossible de supprimer l'enseignement",
          variant: "destructive"
        })
      }
    }
  }

  const handleUpdateTeaching = async (updatedTeaching: Teaching) => {
    try {
      await teachingsService.update(updatedTeaching.id, updatedTeaching)
      toast({
        title: "Enseignement mis à jour",
        description: "L'enseignement a été modifié avec succès.",
      })
      loadTeachings()
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour l'enseignement",
        variant: "destructive"
      })
      throw err
    }
  }

  const filteredTeachings = teachings.filter(
    (teaching) =>
      teaching.theme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.sous_theme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.sujet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.textes_bibliques?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des enseignements...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadTeachings} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  if (filteredTeachings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun enseignement trouvé</p>
      </div>
    )
  }

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
                    {new Date(teaching.date_seance).toLocaleDateString("fr-FR")}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{teaching.theme}</h3>
                {teaching.sous_theme && (
                  <p className="text-sm text-gray-600 mb-2">{teaching.sous_theme}</p>
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

                  {can("teachings.update") && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(teaching)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                  )}

                  {can("teachings.delete") && (
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
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-600 font-medium">V.A.R:</span>
                <p className="text-xs text-gray-700 line-clamp-2">{teaching.verset_retenir}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{teaching.textes_bibliques}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="text-xs">
                {teaching.chants?.length || 0} chant{(teaching.chants?.length || 0) > 1 ? "s" : ""}
              </Badge>
              {teaching.type_contenu === "points_developper" ? (
                <Badge className="bg-blue-600 text-xs">
                  {teaching.points?.length || 0} point{(teaching.points?.length || 0) > 1 ? "s" : ""}
                </Badge>
              ) : (
                <Badge className="bg-green-600 text-xs">
                  {teaching.evenements?.length || 0} événement{(teaching.evenements?.length || 0) > 1 ? "s" : ""}
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
        onSave={handleUpdateTeaching}
      />
    </>
  )
}
