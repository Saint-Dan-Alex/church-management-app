"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Mail, Phone, MoreVertical, Edit, Trash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const monitors = [
  {
    id: "1",
    name: "Marie Dupont",
    email: "marie.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    role: "Responsable",
    department: "Enfants",
    status: "active",
    lastAttendance: "Dimanche 13 Oct",
    avatar: null,
  },
  {
    id: "2",
    name: "Jean Martin",
    email: "jean.martin@email.com",
    phone: "+33 6 23 45 67 89",
    role: "Moniteur",
    department: "Jeunesse",
    status: "active",
    lastAttendance: "Dimanche 13 Oct",
    avatar: null,
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.bernard@email.com",
    phone: "+33 6 34 56 78 90",
    role: "Moniteur",
    department: "Enfants",
    status: "active",
    lastAttendance: "Dimanche 6 Oct",
    avatar: null,
  },
  {
    id: "4",
    name: "Pierre Dubois",
    email: "pierre.dubois@email.com",
    phone: "+33 6 45 67 89 01",
    role: "Moniteur",
    department: "Accueil",
    status: "inactive",
    lastAttendance: "Dimanche 29 Sep",
    avatar: null,
  },
]

interface MonitorListProps {
  searchQuery: string
  onGenerateQR: (monitorId: string) => void
}

export function MonitorList({ searchQuery, onGenerateQR }: MonitorListProps) {
  const filteredMonitors = monitors.filter(
    (monitor) =>
      monitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monitor.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredMonitors.map((monitor) => (
        <Card key={monitor.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={monitor.avatar || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {monitor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{monitor.name}</h3>
                <Badge variant={monitor.status === "active" ? "default" : "secondary"} className="text-xs">
                  {monitor.status === "active" ? "Actif" : "Inactif"}
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
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onGenerateQR(monitor.id)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Générer QR Code
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{monitor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{monitor.phone}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Département</p>
              <p className="text-sm font-medium">{monitor.department}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Dernier pointage</p>
              <p className="text-sm font-medium">{monitor.lastAttendance}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
