"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, Eye, Calendar, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WorshipReport } from "@/types/worship-report"

// Données mockées pour test
const mockReports: WorshipReport[] = [
  {
    id: "1",
    date: "2023-12-03",
    salle: "Adolescents",
    orateurs: ["Soeur LENGE", "Frère NGEA"],
    predicateur: "Frère NFEO",
    moniteurs: ["Soeur JEMMA", "Frère CHRISTIAN", "MUKEBA"],
    effectifFreres: 133,
    effectifSoeurs: 277,
    effectifTotal: 410,
    offrandes: "171,700 FC + 1 GN",
    nombreNouveauxVenus: 1,
    nouveauxVenus: [
      {
        id: "1",
        prenom: "Nou",
        nom: "Seulo",
        adresse: "",
        contact: "",
      },
    ],
  },
  {
    id: "2",
    date: "2023-11-26",
    salle: "Jardin",
    orateurs: ["Frère PAUL"],
    predicateur: "Frère PAUL",
    moniteurs: ["Soeur MARIE", "Frère JEAN"],
    effectifFreres: 45,
    effectifSoeurs: 52,
    effectifTotal: 97,
    offrandes: "85,000 FC",
    nombreNouveauxVenus: 2,
    nouveauxVenus: [],
  },
  {
    id: "3",
    date: "2023-11-26",
    salle: "Juniors",
    orateurs: ["Soeur RUTH"],
    predicateur: "Soeur RUTH",
    moniteurs: ["Frère DAVID"],
    effectifFreres: 68,
    effectifSoeurs: 75,
    effectifTotal: 143,
    offrandes: "120,500 FC",
    nombreNouveauxVenus: 0,
    nouveauxVenus: [],
  },
]

interface WorshipReportListProps {
  searchQuery: string
}

export function WorshipReportList({ searchQuery }: WorshipReportListProps) {
  const router = useRouter()

  const handleDelete = (reportId: string, salle: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le rapport de ${salle} ?`)) {
      console.log("Suppression du rapport:", reportId)
      // Logique de suppression ici
    }
  }

  const filteredReports = mockReports.filter(
    (report) =>
      report.salle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(report.date).toLocaleDateString("fr-FR").includes(searchQuery)
  )

  const getSalleBadgeColor = (salle: string) => {
    const colors: { [key: string]: string } = {
      Jardin: "bg-green-100 text-green-800 border-green-300",
      Ainés: "bg-blue-100 text-blue-800 border-blue-300",
      Juniors: "bg-purple-100 text-purple-800 border-purple-300",
      Cadets: "bg-orange-100 text-orange-800 border-orange-300",
      Adolescents: "bg-red-100 text-red-800 border-red-300",
    }
    return colors[salle] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredReports.map((report) => (
        <Card
          key={report.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/worship/${report.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{formatDate(report.date)}</span>
              </div>

              <Badge variant="outline" className={`${getSalleBadgeColor(report.salle)} mb-3`}>
                {report.salle}
              </Badge>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span className="font-semibold text-gray-900">{report.effectifTotal}</span>
                  <span className="text-gray-600">participants</span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">{report.effectifFreres}</span> Frères •{" "}
                  <span className="text-pink-600 font-medium">{report.effectifSoeurs}</span> Sœurs
                </div>

                {report.nombreNouveauxVenus > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    ✨ {report.nombreNouveauxVenus} nouveau{report.nombreNouveauxVenus > 1 ? "x" : ""}
                  </Badge>
                )}
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-600">
                  <div>
                    <strong>Prédicateur:</strong> {report.predicateur}
                  </div>
                  {report.moniteurs.length > 0 && (
                    <div className="mt-1">
                      <strong>Moniteurs:</strong> {report.moniteurs.slice(0, 2).join(", ")}
                      {report.moniteurs.length > 2 && ` +${report.moniteurs.length - 2}`}
                    </div>
                  )}
                </div>
              </div>
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
                    router.push(`/worship/${report.id}`)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Ouvrir le dialog d'édition
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(report.id, report.salle)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  )
}
