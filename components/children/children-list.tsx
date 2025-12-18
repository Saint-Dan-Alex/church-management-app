"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, Eye, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditChildDialog } from "@/components/children/edit-child-dialog"
import { childrenService } from "@/lib/services/children.service"
import type { Child } from "@/lib/types/api"
import { toast } from "sonner"

interface ChildrenListProps {
  searchQuery?: string
  group?: string
  onSelectChild: (childId: string) => void
  refreshTrigger?: number
}

export function ChildrenList({ searchQuery = "", group, onSelectChild, refreshTrigger = 0 }: ChildrenListProps) {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  /* Helper pour calculer l'âge */
  const calculateAge = (dateString: string) => {
    if (!dateString) return 0
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true)
        const response = await childrenService.getAll()
        // API Paginate returns { data: [...], ... }
        // We cast to any to safely access .data if it exists, or use response directly if array
        const data = (response as any).data || (Array.isArray(response) ? response : [])
        setChildren(data)
      } catch (err) {
        setError("Erreur lors du chargement des enfants")
        console.error("Erreur:", err)
        setChildren([])
      } finally {
        setLoading(false)
      }
    }

    fetchChildren()
  }, [refreshTrigger])

  const filteredChildren = Array.isArray(children) ? children.filter((child) => {
    const searchLower = searchQuery.toLowerCase()

    // Safely access properties with optional chaining in case data is incomplete
    const nom = child.nom?.toLowerCase() || ''
    const prenom = child.prenom?.toLowerCase() || ''
    const nomPere = child.nom_pere?.toLowerCase() || ''
    const nomMere = child.nom_mere?.toLowerCase() || ''
    const salle = child.salle_nom?.toLowerCase() || ''

    return nom.includes(searchLower) ||
      prenom.includes(searchLower) ||
      nomPere.includes(searchLower) ||
      nomMere.includes(searchLower) ||
      salle.includes(searchLower)
  }) : []

  const handleDelete = (childId: string, childName: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'enfant ${childName} ?`)) {
      setChildren(Array.isArray(children) ? children.filter(c => c.id !== childId) : [])
      childrenService.delete(childId)
        .then(() => toast.success(`L'enfant ${childName} a été supprimé avec succès`))
        .catch((err) => {
          toast.error(`Erreur lors de la suppression de l'enfant ${childName}`)
          // Refresh list in case of error (optional)
        })
    }
  }

  const handleEdit = (child: Child) => {
    setEditingChild(child)
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChildren.map((child) => (
          <Card
            key={child.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/children/${child.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={child.photo || undefined} />
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {child.prenom?.[0]}
                    {child.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">
                    {child.prenom} {child.nom}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {calculateAge(child.date_naissance)} ans
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/children/${child.id}`)
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(child)
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(child.id, `${child.prenom} ${child.nom}`)
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Groupe</span>
                <Badge variant="outline">{child.salle_nom || 'Non affecté'}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{child.date_naissance ? new Date(child.date_naissance).toLocaleDateString("fr-FR") : 'Date inconnue'}</span>
              </div>
            </div>

            <div className="mt-4 border-t pt-3">
              <p className="text-xs text-muted-foreground">Parents</p>
              <p className="text-sm font-medium truncate" title={`${child.nom_pere} & ${child.nom_mere}`}>
                {child.nom_pere} {child.nom_mere ? `& ${child.nom_mere}` : ''}
              </p>
              <p className="text-xs text-muted-foreground">{child.telephone_parent1}</p>
            </div>

            {child.allergies_connues && (
              <div className="mt-3">
                <Badge variant="destructive" className="text-xs">
                  Allergies: {child.allergies_details || 'Oui'}
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      <EditChildDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        child={editingChild}
      />
    </>
  )
}
