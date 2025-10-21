"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UserRole, Permission, permissionGroups, getRoleLabel, getPermissionLabel, hasPermission } from "@/lib/permissions"
import { Shield, Check, X } from "lucide-react"

export function RolesPermissions() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN)

  const roles = [
    { value: UserRole.ADMIN, label: getRoleLabel(UserRole.ADMIN), color: "bg-red-500" },
    { value: UserRole.COORDINATION, label: getRoleLabel(UserRole.COORDINATION), color: "bg-blue-500" },
    { value: UserRole.CHEF_SALLE, label: getRoleLabel(UserRole.CHEF_SALLE), color: "bg-purple-500" },
    { value: UserRole.MONITEUR, label: getRoleLabel(UserRole.MONITEUR), color: "bg-green-500" },
    { value: UserRole.FINANCIER, label: getRoleLabel(UserRole.FINANCIER), color: "bg-yellow-600" },
    { value: UserRole.PARENT, label: getRoleLabel(UserRole.PARENT), color: "bg-orange-500" },
    { value: UserRole.ENFANT, label: getRoleLabel(UserRole.ENFANT), color: "bg-gray-500" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rôles de l'utilisateur</CardTitle>
          <CardDescription>
            Sélectionnez un rôle pour voir ses permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedRole === role.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  <span className="font-semibold">{role.label}</span>
                </div>
                {selectedRole === role.value && (
                  <Badge variant="default" className="text-xs">
                    Sélectionné
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions octroyées à {getRoleLabel(selectedRole)}</CardTitle>
              <CardDescription>
                Liste des permissions pour ce rôle
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([groupKey, group]) => (
              <div key={groupKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm uppercase text-gray-700">
                    {group.label}
                  </h3>
                </div>

                <div className="grid gap-2 pl-6">
                  {group.permissions.map((permission) => {
                    const hasAccess = hasPermission(selectedRole, permission)
                    const permissionKey = permission.split(".")[1] // e.g., "create" from "enfants.create"
                    
                    return (
                      <div
                        key={permission}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          hasAccess ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={permission}
                            checked={hasAccess}
                            disabled
                            className={hasAccess ? "border-green-500" : ""}
                          />
                          <Label
                            htmlFor={permission}
                            className={`cursor-pointer ${
                              hasAccess ? "text-green-900 font-medium" : "text-gray-600"
                            }`}
                          >
                            {getPermissionLabel(permission)}
                          </Label>
                        </div>
                        <div>
                          {hasAccess ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tableau récapitulatif */}
      <Card>
        <CardHeader>
          <CardTitle>Tableau récapitulatif des permissions</CardTitle>
          <CardDescription>
            Vue d'ensemble des permissions par rôle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Module</th>
                  {roles.map((role) => (
                    <th key={role.value} className="text-center p-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${role.color}`} />
                        <span className="text-xs">{role.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionGroups).map(([groupKey, group]) => (
                  <tr key={groupKey} className="border-b">
                    <td className="p-2 font-medium">{group.label}</td>
                    {roles.map((role) => {
                      const permissionsCount = group.permissions.filter((p) =>
                        hasPermission(role.value, p)
                      ).length
                      const totalPermissions = group.permissions.length

                      return (
                        <td key={role.value} className="p-2 text-center">
                          {permissionsCount === totalPermissions ? (
                            <Badge variant="default" className="bg-green-500">
                              Complet
                            </Badge>
                          ) : permissionsCount > 0 ? (
                            <Badge variant="secondary">
                              {permissionsCount}/{totalPermissions}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400">
                              Aucun
                            </Badge>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
