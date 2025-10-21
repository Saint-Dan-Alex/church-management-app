// Types pour la gestion des dépenses des activités

export type ExpenseCategory = 
  | "transport"
  | "repas"
  | "materiel"
  | "location"
  | "decoration"
  | "sonorisation"
  | "honoraires"
  | "cadeaux"
  | "autre"

export type Currency = "CDF" | "USD"

export interface Expense {
  id: string
  activiteId: string
  activiteNom: string
  categorie: ExpenseCategory
  description: string
  montant: number
  devise: Currency
  date: Date | string
  beneficiaire?: string
  referenceFacture?: string
  remarque?: string
  ajoutePar: string // ID du responsable
  ajouteParNom: string
  createdAt: Date
}

export interface Income {
  id: string
  activiteId: string
  source: string // Ex: "Paiements participants", "Don", "Subvention"
  description: string
  montant: number
  devise: Currency
  date: Date | string
  referenceRecu?: string
  remarque?: string
  createdAt: Date
}

export interface FinancialSummary {
  activiteId: string
  activiteNom: string
  
  // Entrées (revenus)
  totalEntrees: number
  totalEntreesCDF: number
  totalEntreesUSD: number
  
  // Dépenses
  totalDepenses: number
  totalDepensesCDF: number
  totalDepensesUSD: number
  
  // Bilan
  bilanCDF: number // Entrées - Dépenses
  bilanUSD: number
  
  // Répartition des dépenses par catégorie
  depensesParCategorie: {
    [key in ExpenseCategory]?: number
  }
  
  // Statistiques
  nombreDepenses: number
  nombreEntrees: number
  tauxCouverture: number // (Entrées / Dépenses) * 100
}

// Catégories de dépenses avec labels
export const EXPENSE_CATEGORIES: {
  value: ExpenseCategory
  label: string
  icon: string
}[] = [
  { value: "transport", label: "Transport", icon: "🚗" },
  { value: "repas", label: "Repas & Rafraîchissements", icon: "🍽️" },
  { value: "materiel", label: "Matériel & Fournitures", icon: "📦" },
  { value: "location", label: "Location de salle/équipement", icon: "🏢" },
  { value: "decoration", label: "Décoration", icon: "🎨" },
  { value: "sonorisation", label: "Sonorisation", icon: "🔊" },
  { value: "honoraires", label: "Honoraires", icon: "💼" },
  { value: "cadeaux", label: "Cadeaux & Prix", icon: "🎁" },
  { value: "autre", label: "Autre", icon: "📝" },
]
