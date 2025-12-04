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

interface TeachingListProps {
  searchQuery: string
}

export function TeachingList({ searchQuery }: TeachingListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [teachings, setTeachings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTeaching, setEditingTeaching] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadTeachings()
  }, [])

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

  const filteredTeachings = teachings.filter(
    (teaching) =>
      teaching.theme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.sousTheme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.sujet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teaching.textesBibliques?.toLowerCase().includes(searchQuery.toLowerCase())
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
                {teaching.chantsCount || 0} chant{(teaching.chantsCount || 0) > 1 ? "s" : ""}
              </Badge>
              {teaching.typeContenu === "points_developper" ? (
                <Badge className="bg-blue-600 text-xs">
                  {teaching.pointsCount || 0} point{(teaching.pointsCount || 0) > 1 ? "s" : ""}
                </Badge>
              ) : (
                <Badge className="bg-green-600 text-xs">
                  {teaching.evenementsCount || 0} événement{(teaching.evenementsCount || 0) > 1 ? "s" : ""}
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
