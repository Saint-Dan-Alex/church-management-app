// Types pour le module Activités

export type ActivityType = "gratuite" | "payante"

export type ActivityStatus = "planifiee" | "en_cours" | "terminee" | "annulee"

export interface Activity {
  id: string
  titre: string
  description: string
  type: ActivityType // Gratuite ou Payante
  date: Date | string
  heureDebut: string
  heureFin: string
  lieu: string
  responsable: string
  responsableId: string
  
  // Configuration du paiement (si payante)
  montantRequis?: number
  devise?: "CDF" | "USD"
  montantAlternatif?: number
  deviseAlternative?: "CDF" | "USD"
  
  // Participants
  participants: ActivityParticipant[]
  
  // Statut
  statut: ActivityStatus
  
  // Métadonnées
  createdAt: Date
  updatedAt: Date
}

export interface ActivityParticipant {
  id: string
  participantId: string // ID de l'enfant ou moniteur
  participantNom: string
  participantPrenom: string
  participantNomComplet: string
  participantType: "enfant" | "moniteur"
  
  // Présence
  estPresent: boolean
  heureArrivee?: string
  statutPresence?: "present" | "retard" | "absent"
  
  // Paiement (si activité payante)
  aPaye: boolean
  montantPaye?: number
  statutPaiement?: "paid" | "partial" | "pending"
  
  // Méthode d'ajout
  ajouteVia: "inscription" | "presence" | "paiement" | "manuel"
  
  dateAjout: Date
}

// Règles de gestion des participants
export interface ParticipantRules {
  // Pour activités gratuites
  gratuite: {
    ajouteAutomatiquement: "presence" // Les présents sont automatiquement participants
    peutInscrireAvant: boolean // Peut-on inscrire avant l'activité ?
  }
  
  // Pour activités payantes
  payante: {
    ajouteAutomatiquement: "presence" | "paiement" | "les_deux"
    obligatoireAvant: boolean // Le paiement est-il obligatoire avant ?
    peutParticiper: "paiement_complet" | "paiement_partiel" | "inscription"
  }
}

// Configuration par défaut
export const DEFAULT_PARTICIPANT_RULES: ParticipantRules = {
  gratuite: {
    ajouteAutomatiquement: "presence",
    peutInscrireAvant: true,
  },
  payante: {
    ajouteAutomatiquement: "les_deux", // Présence OU paiement
    obligatoireAvant: false,
    peutParticiper: "paiement_partiel", // Accepter les paiements partiels
  },
}
