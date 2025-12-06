// Types pour le module Salles

export type SalleType = "Jardin" | "Ainés" | "Juniors" | "Cadets" | "Adolescents"

export type RoleMoniteur = "responsable" | "adjoint" | "membre"

export interface Salle {
  id: string
  nom: string // Nom libre de la salle
  description: string
  capacite: number
  responsableId?: string // ID du moniteur responsable
  responsableNom?: string // Nom complet du responsable
  adjointId?: string // ID de l'adjoint
  adjointNom?: string // Nom complet de l'adjoint
  moniteurs: MoniteurSalle[] // Liste des moniteurs membres
  historique?: MoniteurSalleHistorique[] // Historique complet
  actif: boolean
  createdAt: Date
  updatedAt: Date
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
