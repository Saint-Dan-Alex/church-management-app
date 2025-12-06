import type { RoleMoniteur } from "./salle"

export interface Monitor {
  id: string
  nom: string
  postNom?: string
  prenom: string
  dateNaissance: Date | string
  email: string
  telephone: string
  adresse: string
  photo?: string
  dateConversion?: Date | string
  dateBapteme?: Date | string
  baptiseSaintEsprit: boolean
  etatCivil: "Célibataire" | "Marié(e)" | "Veuf(ve)" | "Divorcé(e)"
  dateAdhesion: Date | string
  // Affectation actuelle
  salleActuelleId?: string
  salleActuelleNom?: string
  roleActuel?: string
  dateAffectationActuelle?: Date | string
  createdAt?: Date
  updatedAt?: Date
}

export type MonitorFormData = Omit<Monitor, "id" | "createdAt" | "updatedAt">
