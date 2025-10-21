"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

// Données mockées
const mockUsers = [
  {
    id: "1",
    nom: "MBUYI",
    prenom: "Jean",
    email: "jean.mbuyi@church.cd",
    telephone: "+243 900 000 001",
    role: UserRole.ADMIN,
    avatar: "/placeholder.svg",
    actif: true,
    dateCreation: "2024-01-15",
  },
  {
    id: "2",
    nom: "LENGE",
    prenom: "Marie",
    email: "marie.lenge@church.cd",
    telephone: "+243 900 000 002",
    role: UserRole.COORDINATION,
    avatar: "/placeholder.svg",
    actif: true,
    dateCreation: "2024-02-10",
  },
  {
    id: "3",
    nom: "NGEA",
    prenom: "Paul",
    email: "paul.ngea@church.cd",
    telephone: "+243 900 000 003",
    role: UserRole.CHEF_SALLE,
    avatar: "/placeholder.svg",
    actif: true,
    dateCreation: "2024-03-05",
  },
  {
    id: "4",
    nom: "KAMANDA",
    prenom: "Sophie",
    email: "sophie.kamanda@church.cd",
    telephone: "+243 900 000 004",
    role: UserRole.MONITEUR,
    avatar: "/placeholder.svg",
    actif: true,
    dateCreation: "2024-03-20",
  },
  {
    id: "5",
    nom: "MUKENDI",
    prenom: "Jacques",
    email: "jacques.mukendi@church.cd",
    telephone: "+243 900 000 005",
    role: UserRole.FINANCIER,
    avatar: "/placeholder.svg",
    actif: true,
    dateCreation: "2024-03-25",
  },
  {
    id: "6",
    nom: "TSHALA",
    prenom: "David",
    email: "david.tshala@parent.cd",
    telephone: "+243 900 000 006",
    role: UserRole.PARENT,
    avatar: "/placeholder.svg",
    actif: false,
    dateCreation: "2024-04-01",
  },
]

interface UsersListProps {
  searchQuery: string
  roleFilter: string
}

export function UsersList({ searchQuery, roleFilter }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleEdit = (user: typeof mockUsers[0]) => {
    console.log("Modifier utilisateur:", user)
    alert(`✏️ Édition de: ${user.prenom} ${user.nom}\n\n(Dialog d'édition à implémenter)`)
  }

  const handleDelete = (user: typeof mockUsers[0]) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.prenom} ${user.nom} ?`)) {
      console.log("Utilisateur supprimé:", user.id)
      alert(`🗑️ Utilisateur "${user.prenom} ${user.nom}" supprimé avec succès !`)
    }
  }

  const handleResetPassword = (user: typeof mockUsers[0]) => {
    if (confirm(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} ?`)) {
      console.log("Réinitialisation mot de passe:", user.id)
      alert(`🔑 Email de réinitialisation envoyé à ${user.email}`)
    }
  }

  const handleToggleStatus = (user: typeof mockUsers[0]) => {
    const action = user.actif ? "désactiver" : "activer"
    if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.prenom} ${user.nom} ?`)) {
      console.log(`${action} utilisateur:`, user.id)
      alert(`✅ Utilisateur ${action}é avec succès !`)
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "destructive"
      case UserRole.COORDINATION:
        return "default"
      case UserRole.CHEF_SALLE:
        return "secondary"
      case UserRole.MONITEUR:
        return "outline"
      case UserRole.PARENT:
        return "outline"
      case UserRole.ENFANT:
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={`${user.prenom} ${user.nom}`} />
                      <AvatarFallback>
                        {user.prenom[0]}
                        {user.nom[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {user.prenom} {user.nom}
                        </h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        {!user.actif && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactif
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{user.telephone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                        <Lock className="mr-2 h-4 w-4" />
                        Réinitialiser mot de passe
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        {user.actif ? "Désactiver" : "Activer"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
