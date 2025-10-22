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

// Monitor
export interface Monitor {
  id: string;
  nom: string;
  post_nom: string;
  prenom: string;
  nom_complet?: string;
  date_naissance: string;
  email: string;
  telephone: string;
  adresse: string;
  photo?: string | null;
  date_conversion?: string | null;
  date_bapteme?: string | null;
  baptise_saint_esprit: boolean;
  etat_civil: 'Célibataire' | 'Marié(e)' | 'Veuf(ve)' | 'Divorcé(e)';
  date_adhesion: string;
  salle_actuelle_id?: string | null;
  salle_actuelle_nom?: string | null;
  role_actuel?: 'responsable' | 'adjoint' | 'membre' | null;
  date_affectation_actuelle?: string | null;
  created_at: string;
  updated_at: string;
}

// Child
export interface Child {
  id: string;
  nom: string;
  post_nom: string;
  prenom: string;
  nom_complet?: string;
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
  created_at: string;
  updated_at: string;
}

// Salle
export interface Salle {
  id: string;
  nom: string;
  description?: string | null;
  capacite: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

// Activity
export interface Activity {
  id: string;
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
  created_at: string;
  updated_at: string;
}

// Blog
export interface Blog {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  views: number;
  image?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Statistics
export interface Statistics {
  total?: number;
  [key: string]: any;
}
