// Types pour la gestion de présence des moniteurs

export interface Presence {
  id: string
  activiteId: string
  activiteNom: string
  moniteurId: string
  moniteurNom: string
  moniteurPrenom: string
  moniteurNomComplet: string
  datePresence: Date
  heureArrivee: string
  heureDepart?: string
  statut: "present" | "absent" | "retard" | "excuse"
  modeEnregistrement: "qr_code" | "manuel" | "auto"
  remarque?: string
  createdAt: Date
  updatedAt: Date
}

export interface ActivitePresence {
  id: string
  activiteId: string
  activiteNom: string
  dateActivite: Date
  qrCodeData: string // Données encodées dans le QR code
  qrCodeActive: boolean
  qrCodeExpiration?: Date
  totalMoniteurs: number
  presentsCount: number
  absentsCount: number
  retardsCount: number
  tauxPresence: number // Pourcentage
  presences: Presence[]
  createdAt: Date
}

export interface PresenceStats {
  moniteurId: string
  moniteurNom: string
  totalActivites: number
  presences: number
  absences: number
  retards: number
  tauxPresenceGlobal: number
}
