"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCodeSVG } from "qrcode.react"
import { 
  QrCode, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserPlus,
  Download,
} from "lucide-react"
import { ManualPresenceForm } from "./manual-presence-form"
import type { ActivitePresence, Presence } from "@/types/presence"

interface PresenceManagerProps {
  activiteId: string
  activiteNom: string
  dateActivite: Date
  heureFinActivite?: string
}

// Données mockées
const mockPresenceData: ActivitePresence = {
  id: "1",
  activiteId: "1",
  activiteNom: "Réunion des moniteurs",
  dateActivite: new Date(),
  qrCodeData: JSON.stringify({
    activiteId: "1",
    date: new Date().toISOString(),
    token: "abc123",
  }),
  qrCodeActive: true,
  qrCodeExpiration: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 heures
  totalMoniteurs: 10,
  presentsCount: 7,
  absentsCount: 2,
  retardsCount: 1,
  tauxPresence: 70,
  presences: [
    {
      id: "1",
      activiteId: "1",
      activiteNom: "Réunion des moniteurs",
      moniteurId: "1",
      moniteurNom: "LENGE",
      moniteurPrenom: "Marie",
      moniteurNomComplet: "Marie LENGE",
      datePresence: new Date(),
      heureArrivee: "14:00",
      statut: "present",
      modeEnregistrement: "qr_code",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      activiteId: "1",
      activiteNom: "Réunion des moniteurs",
      moniteurId: "2",
      moniteurNom: "NGEA",
      moniteurPrenom: "Paul",
      moniteurNomComplet: "Paul NGEA",
      datePresence: new Date(),
      heureArrivee: "14:15",
      statut: "retard",
      modeEnregistrement: "qr_code",
      remarque: "Arrivé 15 min en retard",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  createdAt: new Date(),
}

export function PresenceManager({ activiteId, activiteNom, dateActivite, heureFinActivite }: PresenceManagerProps) {
  const [presenceData, setPresenceData] = useState<ActivitePresence>(mockPresenceData)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [showManualDialog, setShowManualDialog] = useState(false)

  const handleGenerateQR = () => {
    // Générer un nouveau QR code avec token unique
    const newQRData = JSON.stringify({
      activiteId,
      date: new Date().toISOString(),
      token: Math.random().toString(36).substring(7),
    })
    setPresenceData({
      ...presenceData,
      qrCodeData: newQRData,
      qrCodeActive: true,
      qrCodeExpiration: new Date(Date.now() + 2 * 60 * 60 * 1000),
    })
    setShowQRDialog(true)
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `QR-${activiteNom}-${new Date().toLocaleDateString()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "present":
        return "bg-green-100 text-green-700 border-green-300"
      case "absent":
        return "bg-red-100 text-red-700 border-red-300"
      case "retard":
        return "bg-orange-100 text-orange-700 border-orange-300"
      case "excuse":
        return "bg-blue-100 text-blue-700 border-blue-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "present":
        return <CheckCircle2 className="h-4 w-4" />
      case "absent":
        return <XCircle className="h-4 w-4" />
      case "retard":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Moniteurs</p>
                <p className="text-3xl font-bold text-gray-900">{presenceData.totalMoniteurs}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Présents</p>
                <p className="text-3xl font-bold text-green-600">{presenceData.presentsCount}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retards</p>
                <p className="text-3xl font-bold text-orange-600">{presenceData.retardsCount}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Présence</p>
                <p className="text-3xl font-bold text-blue-600">{presenceData.tauxPresence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion de la Présence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleGenerateQR} className="flex-1">
              <QrCode className="mr-2 h-4 w-4" />
              Générer QR Code
            </Button>
            <Button onClick={() => setShowManualDialog(true)} variant="outline" className="flex-1">
              <UserPlus className="mr-2 h-4 w-4" />
              Saisie Manuelle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des présences */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Présences ({presenceData.presences.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {presenceData.presences.map((presence) => (
              <div
                key={presence.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {presence.moniteurPrenom.charAt(0)}
                    {presence.moniteurNom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{presence.moniteurNomComplet}</p>
                    <p className="text-sm text-gray-600">
                      Arrivée: {presence.heureArrivee}
                      {presence.heureDepart && ` - Départ: ${presence.heureDepart}`}
                    </p>
                    {presence.remarque && (
                      <p className="text-xs text-gray-500 italic mt-1">{presence.remarque}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="text-xs">
                    {presence.modeEnregistrement === "qr_code" ? "QR Code" : "Manuel"}
                  </Badge>
                  <Badge variant="outline" className={getStatutBadge(presence.statut)}>
                    <span className="mr-1">{getStatutIcon(presence.statut)}</span>
                    {presence.statut.charAt(0).toUpperCase() + presence.statut.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog QR Code */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>QR Code de Présence</DialogTitle>
            <DialogDescription>
              Les moniteurs peuvent scanner ce QR code pour marquer leur présence
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-6">
            <div className="p-6 bg-white rounded-lg border-2 border-gray-200">
              <QRCodeSVG
                id="qr-code-svg"
                value={presenceData.qrCodeData}
                size={256}
                level="H"
                includeMargin
              />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-gray-900">{activiteNom}</p>
              <p className="text-sm text-gray-600">
                {new Date(dateActivite).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {presenceData.qrCodeExpiration && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  Expire dans{" "}
                  {Math.round(
                    (presenceData.qrCodeExpiration.getTime() - Date.now()) / (1000 * 60)
                  )}{" "}
                  minutes
                </Badge>
              )}
            </div>
            <Button onClick={handleDownloadQR} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Télécharger le QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Saisie Manuelle */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Saisie Manuelle de la Présence</DialogTitle>
            <DialogDescription>
              Pour les moniteurs sans téléphone ou en cas de problème technique
            </DialogDescription>
          </DialogHeader>
          <ManualPresenceForm
            activiteId={activiteId}
            activiteNom={activiteNom}
            heureFinActivite={heureFinActivite}
            onClose={() => setShowManualDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
