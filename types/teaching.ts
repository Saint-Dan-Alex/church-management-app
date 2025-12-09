// Chant
export interface Chant {
  id: string
  titre: string
  numero?: string
}

// Sous-point d'un point
export interface SousPoint {
  id: string
  contenu: string
}

// Point de développement
export interface PointDeveloppement {
  id: string
  titre: string
  sous_points: SousPoint[]
}

// Enseignement d'un événement
export interface EnseignementEvenement {
  id: string
  contenu: string
}

// Événement
export interface Evenement {
  id: string
  titre: string
  enseignements: EnseignementEvenement[]
}

// Type de contenu: Points à développer OU Développement
export type TypeContenu = "points_developper" | "developpement"

// Interface complète Teaching
export interface Teaching {
  id: string

  // Informations générales
  date_seance: Date | string
  theme: string
  sous_theme?: string
  sujet: string
  textes_bibliques: string
  but_pedagogique: string
  verset_retenir: string // V.A.R

  // Chants
  chants: Chant[]

  // Matériel et révision
  materiel_didactique?: string // M/D
  sujet_revision?: string // S/R

  // Introduction
  sensibilisation?: string // chants
  questions_reponses?: string // Q.R
  question_decouverte?: string // Q.D
  reponse_decouverte?: string // R

  // Type de contenu
  type_contenu: TypeContenu

  // Points à développer (si type_contenu = "points_developper")
  points?: PointDeveloppement[]

  // Développement (si type_contenu = "developpement")
  evenements?: Evenement[]

  // Conclusion
  conclusion?: string

  // Métadonnées
  created_at?: Date
  updated_at?: Date
  created_by?: string
}

export type TeachingFormData = Omit<Teaching, "id" | "createdAt" | "updatedAt">
