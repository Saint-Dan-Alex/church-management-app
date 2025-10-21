// Types pour le système de facturation et paiements

export type Currency = "CDF" | "USD" // Francs Congolais | Dollars US

export type PaymentStatus = "pending" | "paid" | "partial" | "overdue" | "cancelled"

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "card" | "other"

export interface Payment {
  id: string
  activiteId: string
  activiteNom: string
  participantId: string
  participantNom: string
  participantPrenom: string
  participantNomComplet: string
  montant: number
  devise: Currency
  montantPaye: number
  montantRestant: number
  statut: PaymentStatus
  methodePaiement?: PaymentMethod
  dateEcheance: Date | string
  datePaiement?: Date | string
  numeroPaiement: string // Numéro unique de paiement
  numeroRecu?: string // Numéro de reçu généré
  remarque?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Receipt {
  id: string
  numeroRecu: string
  paiementId: string
  activiteId: string
  activiteNom: string
  participantNom: string
  montantPaye: number
  devise: Currency
  montantEnLettres: string // Montant en toutes lettres
  methodePaiement: PaymentMethod
  datePaiement: Date | string
  emetteur: string // Nom de la personne qui a émis le reçu
  remarques?: string
  createdAt: Date | string
}

export interface ActivityPaymentConfig {
  id: string
  activiteId: string
  activiteNom: string
  montantRequis: number
  devise: Currency
  montantAlternatif?: number // Montant dans l'autre devise
  deviseAlternative?: Currency
  descriptionPaiement: string
  dateEcheance: Date | string
  paiementObligatoire: boolean
  active: boolean
  createdAt: Date | string
}

export interface PaymentStats {
  totalParticipants: number
  totalPaye: number
  totalRestant: number
  totalAttendus: number
  tauxPaiement: number // Pourcentage
  nombrePaiesComplet: number
  nombrePaiesPartiel: number
  nombreEnAttente: number
  nombreEnRetard: number
}

export interface PaymentSummary {
  activiteId: string
  activiteNom: string
  config: ActivityPaymentConfig
  stats: PaymentStats
  paiements: Payment[]
  recus: Receipt[]
}
