// Types pour le module Salles

export type SalleType = "Jardin" | "Ainés" | "Juniors" | "Cadets" | "Adolescents"

export type RoleMoniteur = "responsable" | "adjoint" | "membre"

export interface Salle {
  id: string
  nom: string // Nom libre de la salle
  description: string
  capacite: number
  responsable_id?: string // ID du moniteur responsable
  responsable_nom?: string // Nom complet du responsable
  adjoint_id?: string // ID de l'adjoint
  adjoint_nom?: string // Nom complet de l'adjoint
  responsable?: { nomComplet: string; nom: string; prenom: string } // Objet relationnel
  adjoint?: { nomComplet: string; nom: string; prenom: string } // Objet relationnel
  moniteurs: MoniteurSalle[] // Liste des moniteurs membres
  historique?: MoniteurSalleHistorique[] // Historique complet
  actif: boolean
  created_at: Date
  updated_at: Date
}

export interface MoniteurSalle {
  id: string // ID du moniteur
  nom: string
  prenom: string
  nomComplet: string
  role: RoleMoniteur
  dateAffectation: Date
}

export interface MoniteurSalleHistorique {
  id: string
  moniteurId: string
  moniteurNom: string
  moniteurPrenom: string
  moniteurNomComplet: string
  salleId: string
  salleNom: string // Nom de la salle
  role: RoleMoniteur
  dateDebut: Date
  dateFin?: Date // null ou undefined si toujours actif
  actif: boolean
  motifChangement?: string // Raison du changement de salle
  createdAt: Date
}

export interface SalleStats {
  totalMoniteurs: number
  moniteurActifs: number
  moniteurInactifs: number
  nombreChangements: number // Nombre de changements dans l'historique
  anciennete: number // Nombre de jours depuis la création
}
