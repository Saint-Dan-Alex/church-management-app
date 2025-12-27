"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersList } from "@/components/users/users-list"
import { RolesPermissions } from "@/components/users/roles-permissions"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { UserRole, getRoleLabel } from "@/lib/permissions"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les utilisateurs et leurs permissions</p>
        </div>
        <PermissionGuard permission="users.create">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        </PermissionGuard>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Liste des Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filtrer par rôle"
            >
              <option value="all">Tous les rôles</option>
              <option value={UserRole.ADMIN}>{getRoleLabel(UserRole.ADMIN)}</option>
              <option value={UserRole.COORDINATION}>{getRoleLabel(UserRole.COORDINATION)}</option>
              <option value={UserRole.CHEF_SALLE}>{getRoleLabel(UserRole.CHEF_SALLE)}</option>
              <option value={UserRole.MONITEUR}>{getRoleLabel(UserRole.MONITEUR)}</option>
              <option value={UserRole.FINANCIER}>{getRoleLabel(UserRole.FINANCIER)}</option>
              <option value={UserRole.PARENT}>{getRoleLabel(UserRole.PARENT)}</option>
              <option value={UserRole.ENFANT}>{getRoleLabel(UserRole.ENFANT)}</option>
            </select>
          </div>

          <UsersList searchQuery={searchQuery} roleFilter={roleFilter} />
        </TabsContent>

        <TabsContent value="roles">
          <RolesPermissions />
        </TabsContent>
      </Tabs>

      <AddUserDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
