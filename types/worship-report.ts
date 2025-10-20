// Types pour les rapports de culte

export type SalleType = "Jardin" | "Ainés" | "Juniors" | "Cadets" | "Adolescents"

export interface NouveauVenu {
  id: string
  prenom: string
  nom: string
  adresse: string
  contact: string
}

export interface WorshipReport {
  id: string
  date: string | Date
  salle: SalleType
  
  // Personnel
  orateurs: string[] // Liste des orateurs
  predicateur: string
  moniteurs: string[] // Assistants/Moniteurs ayant servi
  
  // Effectifs
  effectifFreres: number
  effectifSoeurs: number
  effectifTotal: number // Calculé automatiquement
  
  // Finances
  offrandes: string // Montant avec devise (ex: "171,700 FC + 1 GN")
  
  // Nouveaux venus
  nombreNouveauxVenus: number
  nouveauxVenus: NouveauVenu[]
  
  // Métadonnées
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
}

// Type pour les statistiques globales
export interface GlobalStats {
  totalEffectif: number
  totalFreres: number
  totalSoeurs: number
  totalNouveauxVenus: number
  moyenneEffectif: number
  moyenneFreres: number
  moyenneSoeurs: number
  moyenneNouveauxVenus: number
  offrandes: string[] // Liste de toutes les offrandes
  totalOffrandes: string // Texte formaté du total (ex: "685,400 FC + 3 GN")
  rapportsParSalle: {
    [key in SalleType]: number
  }
}

// Type pour les statistiques par salle
export interface SalleStats {
  salle: SalleType
  nombreCultes: number
  totalEffectif: number
  totalFreres: number
  totalSoeurs: number
  totalNouveauxVenus: number
  moyenneEffectif: number
  moyenneFreres: number
  moyenneSoeurs: number
  moyenneNouveauxVenus: number
  offrandes: string[] // Liste de toutes les offrandes
  totalOffrandes: string // Texte formaté du total
  meilleurePresence: {
    date: string
    effectif: number
  }
  moinsPresence: {
    date: string
    effectif: number
  }
}

// Type pour les filtres de rapport
export interface ReportFilter {
  dateDebut?: string | Date
  dateFin?: string | Date
  salle?: SalleType
  periode?: "jour" | "semaine" | "mois" | "trimestre" | "annee" | "personnalisee"
}
