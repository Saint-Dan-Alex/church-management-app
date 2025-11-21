/**
 * Types pour l'API Laravel
 */

// Réponse paginée standard Laravel
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

// User
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'ADMIN' | 'COORDINATION' | 'CHEF_SALLE' | 'MONITEUR' | 'FINANCIER' | 'ENFANT' | 'PARENT';
  avatar?: string | null;
  actif: boolean;
  dateCreation: string;
  created_at: string;
  updated_at: string;
}

// Monitor
export interface Monitor {
  id: string;
  // Champs originaux de la base de données
  nom: string;
  post_nom: string;
  prenom: string;
  date_naissance: string;
  genre: 'Masculin' | 'Féminin';
  etat_civil: 'Célibataire' | 'Marié(e)' | 'Veuf(ve)' | 'Divorcé(e)';
  adresse: string;
  telephone: string;
  email: string;
  photo?: string | null;
  nom_pere: string;
  nom_mere: string;
  telephone_parent1: string;
  telephone_parent2?: string | null;
  email_parents: string;
  contact_urgence: string;
  lien_contact_urgence: string;
  date_conversion?: string | null;
  date_bapteme?: string | null;
  baptise_saint_esprit: 'Oui' | 'Non' | 'NSP';
  vie_donnee_a_jesus: 'Oui' | 'Non' | 'Je ne sais pas';
  est_ouvrier: boolean;
  commission_actuelle?: string | null;
  commission_souhaitee?: string | null;
  date_adhesion?: string | null;
  allergies_connues: boolean;
  allergies_details?: string | null;
  maladies?: string | null;
  traitement?: string | null;
  autorisation_soins: boolean;
  salle_actuelle_id?: string | null;
  salle_actuelle_nom?: string | null;
  role_actuel?: 'responsable' | 'adjoint' | 'membre' | null;
  date_affectation_actuelle?: string | null;
  // Champs ajoutés pour compatibilité frontend (camelCase)
  nom_complet?: string;
  postNom?: string;
  dateNaissance?: string;
  dateConversion?: string;
  dateBapteme?: string;
  baptiseSaintEsprit?: boolean;
  etatCivil?: 'Célibataire' | 'Marié(e)' | 'Veuf(ve)' | 'Divorcé(e)';
  dateAdhesion?: string;
  salleActuelleId?: string | null;
  salleActuelleNom?: string | null;
  roleActuel?: 'responsable' | 'adjoint' | 'membre' | null;
  dateAffectationActuelle?: string | null;
  created_at: string;
  updated_at: string;
}

// Child
export interface Child {
  id: string;
  // Champs originaux de la base de données
  nom: string;
  post_nom: string;
  prenom: string;
  date_naissance: string;
  genre: 'Masculin' | 'Féminin';
  etat_civil: 'Célibataire' | 'Marié(e)' | 'Veuf(ve)' | 'Divorcé(e)';
  adresse: string;
  telephone: string;
  email: string;
  photo?: string | null;
  nom_pere: string;
  nom_mere: string;
  telephone_parent1: string;
  telephone_parent2?: string | null;
  email_parents: string;
  contact_urgence: string;
  lien_contact_urgence: string;
  date_conversion?: string | null;
  date_bapteme?: string | null;
  baptise_saint_esprit: 'Oui' | 'Non' | 'NSP';
  vie_donnee_a_jesus: 'Oui' | 'Non' | 'Je ne sais pas';
  est_ouvrier: boolean;
  commission_actuelle?: string | null;
  commission_souhaitee?: string | null;
  date_adhesion?: string | null;
  allergies_connues: boolean;
  allergies_details?: string | null;
  maladies?: string | null;
  traitement?: string | null;
  autorisation_soins: boolean;
  salle_id?: string | null;
  salle_nom?: string | null;
  // Champs ajoutés pour compatibilité frontend
  firstName?: string;
  lastName?: string;
  age?: number;
  birthDate?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  group?: string;
  allergies?: string | null;
  medicalNotes?: string | null;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Salle
export interface Salle {
  id: string;
  nom: string;
  description: string;
  capacite: number;
  responsableId?: string | null;
  responsableNom?: string | null;
  adjointId?: string | null;
  adjointNom?: string | null;
  moniteurs: any[];
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

// Activity
export interface Activity {
  id: string;
  // Champs originaux de la base de données
  titre: string;
  description: string;
  type: 'gratuite' | 'payante';
  date: string;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  responsable: string;
  responsable_id: string;
  montant_requis?: number | null;
  devise?: 'CDF' | 'USD' | null;
  montant_alternatif?: number | null;
  devise_alternative?: 'CDF' | 'USD' | null;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  // Champs ajoutés pour compatibilité frontend
  title?: string;
  time?: string;
  duration?: string;
  location?: string;
  category?: string;
  participants?: number;
  maxParticipants?: number | null;
  status?: 'upcoming' | 'ongoing' | 'completed';
  organizer?: string;
  created_at: string;
  updated_at: string;
}

// Blog
export interface Blog {
  id: string;
  // Champs originaux de la base de données
  titre: string;
  contenu: string;
  extrait?: string | null;
  auteur: string;
  categorie: string;
  statut: 'brouillon' | 'publie';
  vues: number;
  image?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
  // Champs ajoutés pour compatibilité frontend
  title?: string;
  excerpt?: string | null;
  content?: string;
  author?: string;
  date?: string;
  category?: string;
  status?: 'draft' | 'published';
  views?: number;
  created_at: string;
  updated_at: string;
}

// Video
export interface Video {
  id: string;
  // Champs originaux de la base de données
  titre: string;
  description?: string | null;
  url: string;
  type: string;
  categorie: string;
  duree?: string | null;
  date?: string | null;
  auteur?: string | null;
  vues: number;
  miniature?: string | null;
  // Champs ajoutés pour compatibilité frontend
  title?: string;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

// Photo
export interface Photo {
  id: string;
  // Champs originaux de la base de données
  titre: string;
  description?: string | null;
  url: string;
  album: string;
  date_prise?: string | null;
  auteur?: string | null;
  // Champs ajoutés pour compatibilité frontend
  title?: string;
  date?: string | null;
  created_at: string;
  updated_at: string;
}

// Cotisation
export interface Cotisation {
  id: string;
  // Champs originaux de la base de données
  membre_nom: string;
  type_cotisation: 'mensuelle' | 'annuelle' | 'speciale' | 'autre';
  montant: number;
  devise: 'CDF' | 'USD';
  date_cotisation: string;
  mois: string;
  annee: string;
  mode_paiement: 'cash' | 'mobile_money' | 'bank_transfer' | 'card' | 'other';
  numero_recu?: string | null;
  remarque?: string | null;
  enregistre_par: string;
  enregistre_par_nom: string;
  // Champs ajoutés pour compatibilité frontend
  moniteur?: string;
  periode?: string;
  datePaiement?: string | null;
  statut?: 'Payé' | 'En attente' | 'Annulé';
  modePaiement?: string;
  created_at: string;
  updated_at: string;
}

// Statistics
export interface Statistics {
  total?: number;
  [key: string]: any;
}
