// Fonctions utilitaires pour le système de paiement

import type { Child } from "@/types/child"
import type { Monitor } from "@/types/monitor"

// Interface unifiée pour les participants (enfants + moniteurs)
export interface Participant {
  id: string
  nom: string
  prenom: string
  nomComplet: string
  type: "enfant" | "moniteur"
  email?: string
  telephone?: string
}

/**
 * Convertit un enfant en participant
 */
export function childToParticipant(child: Child): Participant {
  return {
    id: child.id,
    nom: child.nom,
    prenom: child.prenom,
    nomComplet: child.nomComplet || `${child.prenom} ${child.nom}`,
    type: "enfant",
    email: child.email,
    telephone: child.telephone,
  }
}

/**
 * Convertit un moniteur en participant
 */
export function monitorToParticipant(monitor: Monitor): Participant {
  return {
    id: monitor.id,
    nom: monitor.nom,
    prenom: monitor.prenom,
    nomComplet: `${monitor.prenom} ${monitor.nom}`,
    type: "moniteur",
    email: monitor.email,
    telephone: monitor.telephone,
  }
}

/**
 * Combine les enfants et moniteurs en une seule liste de participants
 */
export function combineParticipants(
  children: Child[],
  monitors: Monitor[]
): Participant[] {
  const childParticipants = children.map(childToParticipant)
  const monitorParticipants = monitors.map(monitorToParticipant)
  
  return [...monitorParticipants, ...childParticipants].sort((a, b) =>
    a.nomComplet.localeCompare(b.nomComplet)
  )
}

/**
 * Filtre les participants par type
 */
export function filterParticipantsByType(
  participants: Participant[],
  type?: "enfant" | "moniteur" | "tous"
): Participant[] {
  if (!type || type === "tous") {
    return participants
  }
  return participants.filter((p) => p.type === type)
}

/**
 * Recherche dans la liste des participants
 */
export function searchParticipants(
  participants: Participant[],
  query: string
): Participant[] {
  const searchLower = query.toLowerCase()
  return participants.filter(
    (p) =>
      p.nomComplet.toLowerCase().includes(searchLower) ||
      p.nom.toLowerCase().includes(searchLower) ||
      p.prenom.toLowerCase().includes(searchLower)
  )
}
