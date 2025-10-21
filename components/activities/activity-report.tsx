"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generatePDFDownload, formatPDFFilename } from "@/lib/utils/pdf-generator"
import { CHURCH_INFO } from "@/lib/config/church-info"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Printer,
  TrendingUp,
  FileText,
} from "lucide-react"
import type { Payment, PaymentStats } from "@/types/payment"
import type { Presence } from "@/types/presence"

interface ActivityReportProps {
  activite: {
    id: string
    titre: string
    description: string
    date: Date | string
    heureDebut: string
    heureFin: string
    lieu: string
    type: string
    statut: string
    responsable: string
  }
  presences?: Presence[]
  payments?: Payment[]
  paymentStats?: PaymentStats
  paymentConfig?: {
    montantRequis: number
    devise: string
    montantAlternatif?: number
    deviseAlternative?: string
  }
}

export function ActivityReport({
  activite,
  presences = [],
  payments = [],
  paymentStats,
  paymentConfig,
}: ActivityReportProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (montant: number, devise: string) => {
    return `${montant.toLocaleString("fr-FR")} ${devise}`
  }

  // Statistiques de présence
  const presentsCount = presences.filter((p) => p.statut === "present").length
  const retardsCount = presences.filter((p) => p.statut === "retard").length
  const absentsCount = presences.filter((p) => p.statut === "absent").length
  const tauxPresence = presences.length > 0 ? (presentsCount / presences.length) * 100 : 0

  const [isExporting, setIsExporting] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const filename = formatPDFFilename(
        "rapport_activite",
        activite.titre,
        activite.date
      )
      await generatePDFDownload("activity-report", filename)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6" id="activity-report">
      {/* Logo et informations de l'église */}
      <Card className="border-t-4 border-t-blue-600">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 pb-4 border-b">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={CHURCH_INFO.logo}
                alt={CHURCH_INFO.logoAlt}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-900">{CHURCH_INFO.name}</h2>
              <p className="text-base text-blue-700">{CHURCH_INFO.ministry}</p>
              <p className="text-sm text-gray-600 mt-1">{CHURCH_INFO.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* En-tête du rapport */}
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{activite.titre}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                  {activite.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    activite.statut === "termine"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }
                >
                  {activite.statut}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Export en cours..." : "Exporter PDF"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(activite.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Horaire</p>
                <p className="font-medium">
                  {activite.heureDebut} - {activite.heureFin}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Lieu</p>
                <p className="font-medium">{activite.lieu}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Responsable</p>
                <p className="font-medium">{activite.responsable}</p>
              </div>
            </div>
          </div>
          {activite.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-700">{activite.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Présence */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Présents</p>
                <p className="text-3xl font-bold text-green-600">{presentsCount}</p>
                <p className="text-xs text-gray-500">sur {presences.length} inscrits</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Taux de présence */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de présence</p>
                <p className="text-3xl font-bold text-blue-600">{tauxPresence.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Participation</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Paiements collectés */}
        {paymentStats && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total collecté</p>
                    <p className="text-3xl font-bold text-green-600">
                      {paymentConfig && formatCurrency(paymentStats.totalPaye, paymentConfig.devise)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {paymentStats.nombrePaiesComplet} paiements complets
                    </p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taux de paiement</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {paymentStats.tauxPaiement}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {paymentStats.nombreEnAttente} en attente
                    </p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rapport de présence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rapport de Présence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{presentsCount}</p>
                  <p className="text-sm text-green-600">Présents</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">{retardsCount}</p>
                  <p className="text-sm text-orange-600">Retards</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{absentsCount}</p>
                  <p className="text-sm text-red-600">Absents</p>
                </div>
              </div>

              {presences.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {presences.map((presence) => (
                    <div
                      key={presence.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm font-medium">{presence.moniteurNomComplet}</span>
                      <Badge
                        variant="outline"
                        className={
                          presence.statut === "present"
                            ? "bg-green-100 text-green-700"
                            : presence.statut === "retard"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {presence.statut === "present"
                          ? "Présent"
                          : presence.statut === "retard"
                          ? "Retard"
                          : "Absent"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rapport financier */}
        {paymentStats && paymentConfig && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Rapport Financier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-700">Montant requis par personne</span>
                    <span className="font-bold text-blue-900">
                      {formatCurrency(paymentConfig.montantRequis, paymentConfig.devise)}
                    </span>
                  </div>
                  {paymentConfig.montantAlternatif && paymentConfig.deviseAlternative && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Alternative</span>
                      <span className="font-medium text-blue-800">
                        {formatCurrency(
                          paymentConfig.montantAlternatif,
                          paymentConfig.deviseAlternative
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Total collecté</p>
                    <p className="text-xl font-bold text-green-700">
                      {formatCurrency(paymentStats.totalPaye, paymentConfig.devise)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Restant</p>
                    <p className="text-xl font-bold text-orange-700">
                      {formatCurrency(paymentStats.totalRestant, paymentConfig.devise)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paiements complets</span>
                    <span className="font-medium">{paymentStats.nombrePaiesComplet}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paiements partiels</span>
                    <span className="font-medium">{paymentStats.nombrePaiesPartiel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">En attente</span>
                    <span className="font-medium">{paymentStats.nombreEnAttente}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">En retard</span>
                    <span className="font-medium text-red-600">{paymentStats.nombreEnRetard}</span>
                  </div>
                </div>

                {payments.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Liste des paiements ({payments.length})
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{payment.participantNomComplet}</span>
                          <span
                            className={
                              payment.statut === "paid"
                                ? "text-green-600 font-medium"
                                : "text-orange-600"
                            }
                          >
                            {formatCurrency(payment.montantPaye, payment.devise)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Note de bas de page */}
      <Card className="print:block">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-500">
            <p className="font-semibold text-gray-700">{CHURCH_INFO.name}</p>
            <p>{CHURCH_INFO.ministry}</p>
            <p className="mt-2">Rapport généré le {new Date().toLocaleString("fr-FR")}</p>
            <p className="mt-1 italic">{CHURCH_INFO.motto}</p>
          </div>
        </CardContent>
      </Card>

      {/* Styles pour l'impression */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #activity-report,
          #activity-report * {
            visibility: visible;
          }
          #activity-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
