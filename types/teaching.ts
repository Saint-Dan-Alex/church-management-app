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
  sousPoints: SousPoint[]
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
  dateSeance: Date | string
  theme: string
  sousTheme?: string
  sujet: string
  textesBibliques: string
  butPedagogique: string
  versetRetenir: string // V.A.R
  
  // Chants
  chants: Chant[]
  
  // Matériel et révision
  materielDidactique?: string // M/D
  sujetRevision?: string // S/R
  
  // Introduction
  sensibilisation?: string // chants
  questionsReponses?: string // Q.R
  questionDecouverte?: string // Q.D
  reponseDecouverte?: string // R
  
  // Type de contenu
  typeContenu: TypeContenu
  
  // Points à développer (si typeContenu = "points_developper")
  pointsDevelopper?: PointDeveloppement[]
  
  // Développement (si typeContenu = "developpement")
  developpement?: string
  evenements?: Evenement[]
  
  // Conclusion
  conclusion?: string
  
  // Métadonnées
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
}

export type TeachingFormData = Omit<Teaching, "id" | "createdAt" | "updatedAt">
