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
}

export function ChildrenList({ searchQuery = "", group, onSelectChild }: ChildrenListProps) {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true)
        const data = await childrenService.getAll()
        // S'assurer que data est un tableau
        setChildren(Array.isArray(data) ? data : [])
      } catch (err) {
        setError("Erreur lors du chargement des enfants")
        console.error("Erreur:", err)
        setChildren([]) // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setLoading(false)
      }
    }

    fetchChildren()
  }, [])

  const filteredChildren = Array.isArray(children) ? children.filter((child) => {
    const matchesSearch =
      child.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.group.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  }) : []

  const handleDelete = (childId: string, childName: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'enfant ${childName} ?`)) {
      setChildren(Array.isArray(children) ? children.filter(c => c.id !== childId) : [])
      childrenService.delete(childId)
        .then(() => toast.success(`L'enfant ${childName} a été supprimé avec succès`))
        .catch((err) => toast.error(`Erreur lors de la suppression de l'enfant ${childName}`))
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
                  {child.firstName[0]}
                  {child.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">
                  {child.firstName} {child.lastName}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {child.age} ans
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
                    handleDelete(child.id, `${child.firstName} ${child.lastName}`)
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
              <Badge variant="outline">{child.group}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(child.birthDate).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
            <p className="text-xs text-muted-foreground">Parent / Tuteur</p>
            <p className="text-sm font-medium">{child.parentName}</p>
            <p className="text-xs text-muted-foreground">{child.parentPhone}</p>
          </div>

          {child.allergies !== "Aucune" && (
            <div className="mt-3">
              <Badge variant="destructive" className="text-xs">
                Allergies: {child.allergies}
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
