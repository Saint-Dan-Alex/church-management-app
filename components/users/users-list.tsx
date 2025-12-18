"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash, Lock, Mail, Phone, Shield } from "lucide-react"
import { UserRole, getRoleLabel } from "@/lib/permissions"
import { EditUserDialog } from "./edit-user-dialog"
import { usersService, type User } from "@/lib/services/users.service"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface UsersListProps {
  searchQuery?: string
  roleFilter?: string
}

export function UsersList({ searchQuery = "", roleFilter = "all" }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        console.log("Fetching users...")
        const data = await usersService.getAll()
        console.log("Users data received:", data)
        // S'assurer que data est un tableau
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Erreur lors du chargement des utilisateurs")
        setUsers([]) // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = Array.isArray(users) ? users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  }) : []

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await usersService.delete(userToDelete.id)
      setUsers(Array.isArray(users) ? users.filter(u => u.id !== userToDelete.id) : [])
      toast.success(`Utilisateur "${userToDelete.name}" supprimé avec succès`)
    } catch (err) {
      toast.error("Erreur lors de la suppression")
      console.error("Erreur:", err)
    } finally {
      setUserToDelete(null)
    }
  }

  const handleResetPassword = (user: User) => {
    toast.info(`Email de réinitialisation envoyé à ${user.email}`)
    // Logic to send email would go here
  }

  const handleToggleStatus = async (user: User) => {
    try {
      const updatedUser = { ...user, active: !user.active }
      await usersService.update(user.id, updatedUser)
      setUsers(Array.isArray(users) ? users.map(u => u.id === user.id ? updatedUser : u) : [])
      toast.success(`Statut de "${user.name}" mis à jour`)
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut")
      console.error("Erreur:", err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-3 animate-pulse" />
          <p className="text-gray-500">Chargement des utilisateurs...</p>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-red-400 mb-3" />
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {!loading && !error && users.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-2">Aucun utilisateur trouvé</p>
              <p className="text-sm text-gray-400">Vérifiez que l'API fonctionne correctement</p>
            </CardContent>
          </Card>
        )}

        {filteredUsers.length === 0 && users.length > 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Aucun utilisateur ne correspond aux filtres</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.active ? "default" : "secondary"}
                      className={user.active ? "bg-green-500" : "bg-gray-500"}
                    >
                      {user.active ? "Actif" : "Inactif"}
                    </Badge>
                    <Badge variant="outline">
                      {getRoleLabel(user.role as UserRole)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <Lock className="h-4 w-4 mr-2" />
                          Réinitialiser mot de passe
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                          className={user.active ? "text-orange-600" : "text-green-600"}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {user.active ? "Désactiver" : "Activer"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
      />

      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer "${userToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="destructive"
      />
    </>
  )
}
