"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  DollarSign,
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Search,
  Banknote,
} from "lucide-react"
import { AddPaymentDialog } from "./add-payment-dialog"
import { ReceiptGenerator } from "./receipt-generator"
import type { Payment, PaymentStats, ActivityPaymentConfig, Currency } from "@/types/payment"
import type { Child } from "@/types/child"
import type { Monitor } from "@/types/monitor"
import { combineParticipants, type Participant } from "@/lib/utils/payment-helpers"

interface PaymentManagerProps {
  activiteId: string
  activiteNom: string
  dateActivite: Date
}

// Données mockées - Enfants
const mockChildren: Child[] = [
  {
    id: "c1",
    nom: "MUKEBA",
    postNom: "KABONGO",
    prenom: "David",
    nomComplet: "David MUKEBA",
    dateNaissance: "2015-03-15",
    genre: "Masculin",
    etatCivil: "Célibataire",
    adresse: "Kinshasa, Lemba",
    telephone: "+243 900 000 001",
    email: "david.mukeba@example.com",
    nomPere: "MUKEBA Joseph",
    nomMere: "MUKEBA Marie",
    telephoneParent1: "+243 900 000 002",
    emailParents: "mukeba.parents@example.com",
    contactUrgence: "+243 900 000 003",
    lienContactUrgence: "Oncle",
    baptiseSaintEsprit: "Non",
    vieDonneeAJesus: "Oui",
    estOuvrier: false,
    allergiesConnues: false,
    autorisationSoins: true,
    gagneUneAme: "Non",
    encadreur: "Non",
  } as Child,
  {
    id: "c2",
    nom: "NZITA",
    postNom: "MPIANA",
    prenom: "Grace",
    nomComplet: "Grace NZITA",
    dateNaissance: "2014-07-22",
    genre: "Féminin",
    etatCivil: "Célibataire",
    adresse: "Kinshasa, Ngaliema",
    telephone: "+243 900 000 004",
    email: "grace.nzita@example.com",
    nomPere: "NZITA Pierre",
    nomMere: "NZITA Rachel",
    telephoneParent1: "+243 900 000 005",
    emailParents: "nzita.parents@example.com",
    contactUrgence: "+243 900 000 006",
    lienContactUrgence: "Mère",
    baptiseSaintEsprit: "Oui",
    vieDonneeAJesus: "Oui",
    estOuvrier: true,
    allergiesConnues: false,
    autorisationSoins: true,
    gagneUneAme: "Oui",
    encadreur: "Non",
  } as Child,
]

// Données mockées - Moniteurs
const mockMonitors: Monitor[] = [
  {
    id: "m1",
    nom: "LENGE",
    postNom: "KADI",
    prenom: "Marie",
    dateNaissance: "1995-05-10",
    email: "marie.lenge@example.com",
    telephone: "+243 900 000 010",
    adresse: "Kinshasa, Matete",
    baptiseSaintEsprit: true,
    etatCivil: "Célibataire",
    dateAdhesion: "2020-01-15",
  },
  {
    id: "m2",
    nom: "NGEA",
    postNom: "MAKILA",
    prenom: "Paul",
    dateNaissance: "1992-08-20",
    email: "paul.ngea@example.com",
    telephone: "+243 900 000 011",
    adresse: "Kinshasa, Kasa-Vubu",
    baptiseSaintEsprit: true,
    etatCivil: "Marié(e)",
    dateAdhesion: "2019-06-01",
  },
  {
    id: "m3",
    nom: "NFEO",
    postNom: "LUMBU",
    prenom: "Jean",
    dateNaissance: "1998-12-05",
    email: "jean.nfeo@example.com",
    telephone: "+243 900 000 012",
    adresse: "Kinshasa, Bandalungwa",
    baptiseSaintEsprit: true,
    etatCivil: "Célibataire",
    dateAdhesion: "2021-03-10",
  },
]

// Données mockées
const mockConfig: ActivityPaymentConfig = {
  id: "1",
  activiteId: "1",
  activiteNom: "Réunion des moniteurs",
  montantRequis: 5000,
  devise: "CDF",
  montantAlternatif: 3,
  deviseAlternative: "USD",
  descriptionPaiement: "Cotisation mensuelle pour les moniteurs",
  dateEcheance: "2025-01-31",
  paiementObligatoire: true,
  active: true,
  createdAt: "2025-01-01",
}

const mockPayments: Payment[] = [
  {
    id: "1",
    activiteId: "1",
    activiteNom: "Réunion des moniteurs",
    participantId: "1",
    participantNom: "LENGE",
    participantPrenom: "Marie",
    participantNomComplet: "Marie LENGE",
    montant: 5000,
    devise: "CDF",
    montantPaye: 5000,
    montantRestant: 0,
    statut: "paid",
    methodePaiement: "mobile_money",
    dateEcheance: "2025-01-31",
    datePaiement: "2025-01-15",
    numeroPaiement: "PAY-2025-001",
    numeroRecu: "REC-2025-001",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
  {
    id: "2",
    activiteId: "1",
    activiteNom: "Réunion des moniteurs",
    participantId: "2",
    participantNom: "NGEA",
    participantPrenom: "Paul",
    participantNomComplet: "Paul NGEA",
    montant: 5000,
    devise: "CDF",
    montantPaye: 3000,
    montantRestant: 2000,
    statut: "partial",
    methodePaiement: "cash",
    dateEcheance: "2025-01-31",
    datePaiement: "2025-01-18",
    numeroPaiement: "PAY-2025-002",
    remarque: "Paiement partiel - reste 2000 CDF",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-18",
  },
  {
    id: "3",
    activiteId: "1",
    activiteNom: "Réunion des moniteurs",
    participantId: "3",
    participantNom: "NFEO",
    participantPrenom: "Jean",
    participantNomComplet: "Jean NFEO",
    montant: 3,
    devise: "USD",
    montantPaye: 3,
    montantRestant: 0,
    statut: "paid",
    methodePaiement: "cash",
    dateEcheance: "2025-01-31",
    datePaiement: "2025-01-20",
    numeroPaiement: "PAY-2025-003",
    numeroRecu: "REC-2025-003",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
]

const mockStats: PaymentStats = {
  totalParticipants: 10,
  totalPaye: 13000,
  totalRestant: 7000,
  totalAttendus: 20000,
  tauxPaiement: 65,
  nombrePaiesComplet: 2,
  nombrePaiesPartiel: 1,
  nombreEnAttente: 5,
  nombreEnRetard: 2,
}

export function PaymentManager({ activiteId, activiteNom, dateActivite }: PaymentManagerProps) {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [stats, setStats] = useState<PaymentStats>(mockStats)
  const [config] = useState<ActivityPaymentConfig>(mockConfig)
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Combiner les enfants et moniteurs en une seule liste de participants
  const participants = combineParticipants(mockChildren, mockMonitors)

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      payment.participantNomComplet.toLowerCase().includes(searchLower) ||
      payment.numeroPaiement.toLowerCase().includes(searchLower) ||
      payment.numeroRecu?.toLowerCase().includes(searchLower)
    )
  })

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-300"
      case "partial":
        return "bg-orange-100 text-orange-700 border-orange-300"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "overdue":
        return "bg-red-100 text-red-700 border-red-300"
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />
      case "partial":
      case "pending":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatCurrency = (montant: number, devise: Currency) => {
    return `${montant.toLocaleString("fr-FR")} ${devise}`
  }

  const handleGenerateReceipt = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowReceiptDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Configuration du paiement */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <DollarSign className="h-5 w-5" />
            Configuration du Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-blue-700">Montant requis</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(config.montantRequis, config.devise)}
              </p>
              {config.montantAlternatif && config.deviseAlternative && (
                <p className="text-sm text-blue-700">
                  ou {formatCurrency(config.montantAlternatif, config.deviseAlternative)}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Description</p>
              <p className="text-base text-blue-900">{config.descriptionPaiement}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Date d'échéance</p>
              <p className="text-base text-blue-900">
                {new Date(config.dateEcheance).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Statut</p>
              <Badge className={config.paiementObligatoire ? "bg-red-600" : "bg-blue-600"}>
                {config.paiementObligatoire ? "Obligatoire" : "Optionnel"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payé</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalPaye, config.devise)}
                </p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Restant</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.totalRestant, config.devise)}
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Paiement</p>
                <p className="text-2xl font-bold text-blue-600">{stats.tauxPaiement}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Retard</p>
                <p className="text-2xl font-bold text-red-600">{stats.nombreEnRetard}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des Paiements</CardTitle>
            <Button onClick={() => setShowAddPaymentDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Enregistrer un paiement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, numéro de paiement ou reçu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Paiements Enregistrés ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun paiement trouvé
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {payment.participantPrenom.charAt(0)}
                        {payment.participantNom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payment.participantNomComplet}</p>
                        <p className="text-sm text-gray-600">
                          {payment.numeroPaiement}
                          {payment.numeroRecu && ` • Reçu: ${payment.numeroRecu}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm ml-13">
                      <span className="font-medium text-gray-700">
                        Payé: {formatCurrency(payment.montantPaye, payment.devise)}
                      </span>
                      {payment.montantRestant > 0 && (
                        <span className="text-orange-600">
                          Reste: {formatCurrency(payment.montantRestant, payment.devise)}
                        </span>
                      )}
                      {payment.datePaiement && (
                        <span className="text-gray-600">
                          {new Date(payment.datePaiement).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                    {payment.remarque && (
                      <p className="text-xs text-gray-500 italic mt-1 ml-13">{payment.remarque}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateReceipt(payment)}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      {payment.numeroRecu ? "Voir Reçu" : "Générer Reçu"}
                    </Button>
                    <Badge variant="outline" className={getStatutBadge(payment.statut)}>
                      <span className="mr-1">{getStatutIcon(payment.statut)}</span>
                      {payment.statut === "paid"
                        ? "Payé"
                        : payment.statut === "partial"
                        ? "Partiel"
                        : payment.statut === "pending"
                        ? "En attente"
                        : payment.statut === "overdue"
                        ? "En retard"
                        : "Annulé"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Enregistrer Paiement */}
      <AddPaymentDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        activiteId={activiteId}
        activiteNom={activiteNom}
        config={config}
        participants={participants}
      />

      {/* Dialog Reçu */}
      {selectedPayment && (
        <ReceiptGenerator
          open={showReceiptDialog}
          onOpenChange={setShowReceiptDialog}
          payment={selectedPayment}
          activiteNom={activiteNom}
        />
      )}
    </div>
  )
}
