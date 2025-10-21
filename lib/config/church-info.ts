// Configuration des informations de l'église

export const CHURCH_INFO = {
  // Nom officiel de l'église
  name: "Centre Evangélique Arche de l'Alliance",
  shortName: "CEAA",
  
  // Ministère
  ministry: "Ministère auprès des Enfants et Adolescents",
  ministryShort: "MAE",
  
  // Logo
  logo: "/logo-arche.png",
  logoAlt: "Logo Centre Evangélique Arche de l'Alliance",
  
  // Coordonnées (à compléter)
  address: "Kinshasa, République Démocratique du Congo",
  phone: "+243 XXX XXX XXX",
  email: "contact@arche-alliance.org",
  website: "www.arche-alliance.org",
  
  // Réseaux sociaux (optionnel)
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  },
  
  // Informations bancaires (pour les reçus)
  banking: {
    accountName: "Centre Evangélique Arche de l'Alliance",
    accountNumber: "",
    bank: "",
    mobileMoney: {
      mpesa: "",
      airtelMoney: "",
      orangeMoney: "",
    },
  },
  
  // Signature pour les documents officiels
  signature: {
    title: "Le Responsable du Ministère",
    name: "Jean Semeki",
  },
  
  // Slogan ou devise
  motto: "Former la nouvelle génération pour Christ",
  
  // Couleurs officielles (basées sur le logo)
  colors: {
    primary: "#1E40AF", // Bleu
    secondary: "#F59E0B", // Jaune/Or
    accent: "#3B82F6",
  },
}

// Helper pour obtenir l'URL complète du logo
export function getChurchLogoUrl(): string {
  return CHURCH_INFO.logo
}

// Helper pour obtenir le nom complet
export function getChurchFullName(): string {
  return `${CHURCH_INFO.name} - ${CHURCH_INFO.ministry}`
}

// Helper pour obtenir l'adresse formatée
export function getChurchAddress(): string {
  return CHURCH_INFO.address
}
