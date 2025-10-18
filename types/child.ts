// 1. Identification personnelle
export interface ChildIdentity {
  nom: string
  postNom: string
  prenom: string
  nomComplet?: string // Calculé automatiquement
  dateNaissance: Date | string
  genre: "Masculin" | "Féminin"
  etatCivil: "Célibataire" | "Marié(e)" | "Veuf(ve)" | "Divorcé(e)"
  adresse: string
  telephone: string
  email: string
  photo?: string
}

// 2. Informations familiales
export interface ChildFamily {
  nomPere: string
  nomMere: string
  telephoneParent1: string
  telephoneParent2?: string
  emailParents: string
  contactUrgence: string
  lienContactUrgence: string
}

// 3. Parcours spirituel
export interface ChildSpiritual {
  dateConversion?: Date | string
  dateBapteme?: Date | string
  baptiseSaintEsprit: "Oui" | "Non" | "NSP"
  vieDonneeAJesus: "Oui" | "Non" | "Je ne sais pas"
  estOuvrier: boolean
  commissionActuelle?: string
  commissionSouhaitee?: string
  dateAdhesion?: Date | string
}

// 4. Santé & besoins spécifiques
export interface ChildHealth {
  allergiesConnues: boolean
  allergiesDetails?: string
  maladies?: string
  traitement?: string
  autorisationSoins: boolean
}

// 5. Évaluation personnelle (adolescents / pré-ados)
export interface ChildEvaluation {
  vieChretienne?: "Très bonne" | "Bonne" | "Moyenne" | "Faible" | "Très mauvaise"
  viePriere?: "Excellente" | "Bonne" | "Moyenne" | "Faible" | "Très faible"
  comprehensionBible?: "Excellente" | "Bonne" | "Moyenne" | "Faible" | "Très faible"
  gagneUneAme: "Oui" | "Non" | "Je ne sais pas"
  encadreur: "Oui" | "Non" | "NSP"
  qualiteEnseignements?: "Bonne" | "Moyenne" | "Faible"
  sujetSouhaite?: string
  besoinSuggestion?: string
}

// Interface complète Child
export interface Child {
  id: string
  // Identification personnelle
  nom: string
  postNom: string
  prenom: string
  nomComplet?: string
  dateNaissance: Date | string
  genre: "Masculin" | "Féminin"
  etatCivil: "Célibataire" | "Marié(e)" | "Veuf(ve)" | "Divorcé(e)"
  adresse: string
  telephone: string
  email: string
  photo?: string
  
  // Informations familiales
  nomPere: string
  nomMere: string
  telephoneParent1: string
  telephoneParent2?: string
  emailParents: string
  contactUrgence: string
  lienContactUrgence: string
  
  // Parcours spirituel
  dateConversion?: Date | string
  dateBapteme?: Date | string
  baptiseSaintEsprit: "Oui" | "Non" | "NSP"
  vieDonneeAJesus: "Oui" | "Non" | "Je ne sais pas"
  estOuvrier: boolean
  commissionActuelle?: string
  commissionSouhaitee?: string
  dateAdhesion?: Date | string
  
  // Santé
  allergiesConnues: boolean
  allergiesDetails?: string
  maladies?: string
  traitement?: string
  autorisationSoins: boolean
  
  // Évaluation
  vieChretienne?: "Très bonne" | "Bonne" | "Moyenne" | "Faible" | "Très mauvaise"
  viePriere?: "Excellente" | "Bonne" | "Moyenne" | "Faible" | "Très faible"
  comprehensionBible?: "Excellente" | "Bonne" | "Moyenne" | "Faible" | "Très faible"
  gagneUneAme: "Oui" | "Non" | "Je ne sais pas"
  encadreur: "Oui" | "Non" | "NSP"
  qualiteEnseignements?: "Bonne" | "Moyenne" | "Faible"
  sujetSouhaite?: string
  besoinSuggestion?: string
  
  // Métadonnées
  createdAt?: Date
  updatedAt?: Date
}

export type ChildFormData = Omit<Child, "id" | "nomComplet" | "createdAt" | "updatedAt">
