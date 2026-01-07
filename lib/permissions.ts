// Système de permissions et rôles

export enum UserRole {
  ADMIN = "ADMIN",
  COORDINATION = "COORDINATION",
  CHEF_SALLE = "CHEF_SALLE",
  MONITEUR = "MONITEUR",
  FINANCIER = "FINANCIER",
  COM_ACTIVITES = "COM_ACTIVITES",
  ENFANT = "ENFANT",
  PARENT = "PARENT",
}

export enum Permission {
  // Dashboard
  DASHBOARD_VIEW = "dashboard.view",

  // Enfants
  ENFANTS_CREATE = "enfants.create",
  ENFANTS_READ = "enfants.read",
  ENFANTS_UPDATE = "enfants.update",
  ENFANTS_DELETE = "enfants.delete",

  // Moniteurs
  MONITEURS_CREATE = "moniteurs.create",
  MONITEURS_READ = "moniteurs.read",
  MONITEURS_UPDATE = "moniteurs.update",
  MONITEURS_DELETE = "moniteurs.delete",

  // Activités
  ACTIVITES_CREATE = "activites.create",
  ACTIVITES_READ = "activites.read",
  ACTIVITES_UPDATE = "activites.update",
  ACTIVITES_DELETE = "activites.delete",

  // Présences
  PRESENCES_CREATE = "presences.create",
  PRESENCES_READ = "presences.read",
  PRESENCES_UPDATE = "presences.update",
  PRESENCES_DELETE = "presences.delete",

  // Salles
  SALLES_CREATE = "salles.create",
  SALLES_READ = "salles.read",
  SALLES_UPDATE = "salles.update",
  SALLES_DELETE = "salles.delete",

  // Paiements
  PAIEMENTS_CREATE = "paiements.create",
  PAIEMENTS_READ = "paiements.read",
  PAIEMENTS_UPDATE = "paiements.update",
  PAIEMENTS_DELETE = "paiements.delete",

  // Dépenses
  DEPENSES_CREATE = "depenses.create",
  DEPENSES_READ = "depenses.read",
  DEPENSES_UPDATE = "depenses.update",
  DEPENSES_DELETE = "depenses.delete",

  // Caisse (Cotisations)
  CAISSE_CREATE = "caisse.create",
  CAISSE_READ = "caisse.read",
  CAISSE_UPDATE = "caisse.update",
  CAISSE_DELETE = "caisse.delete",

  // Enseignements
  TEACHINGS_CREATE = "teachings.create",
  TEACHINGS_READ = "teachings.read",
  TEACHINGS_UPDATE = "teachings.update",
  TEACHINGS_DELETE = "teachings.delete",

  // Blog
  BLOG_CREATE = "blog.create",
  BLOG_READ = "blog.read",
  BLOG_UPDATE = "blog.update",
  BLOG_DELETE = "blog.delete",

  // Photos
  PHOTOS_CREATE = "photos.create",
  PHOTOS_READ = "photos.read",
  PHOTOS_UPDATE = "photos.update",
  PHOTOS_DELETE = "photos.delete",

  // Vidéos
  VIDEOS_CREATE = "videos.create",
  VIDEOS_READ = "videos.read",
  VIDEOS_UPDATE = "videos.update",
  VIDEOS_DELETE = "videos.delete",

  // Utilisateurs
  USERS_CREATE = "users.create",
  USERS_READ = "users.read",
  USERS_UPDATE = "users.update",
  USERS_DELETE = "users.delete",

  // Rôles et permissions
  ROLES_MANAGE = "roles.manage",
  PERMISSIONS_MANAGE = "permissions.manage",

  // Statistiques
  STATS_VIEW = "stats.view",
  REPORTS_VIEW = "reports.view",
}

// Matrice de permissions par rôle
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Accès complet à tout
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_CREATE,
    Permission.ENFANTS_READ,
    Permission.ENFANTS_UPDATE,
    Permission.ENFANTS_DELETE,
    Permission.MONITEURS_CREATE,
    Permission.MONITEURS_READ,
    Permission.MONITEURS_UPDATE,
    Permission.MONITEURS_DELETE,
    Permission.ACTIVITES_CREATE,
    Permission.ACTIVITES_READ,
    Permission.ACTIVITES_UPDATE,
    Permission.ACTIVITES_DELETE,
    Permission.PRESENCES_CREATE,
    Permission.PRESENCES_READ,
    Permission.PRESENCES_UPDATE,
    Permission.PRESENCES_DELETE,
    Permission.SALLES_CREATE,
    Permission.SALLES_READ,
    Permission.SALLES_UPDATE,
    Permission.SALLES_DELETE,
    Permission.PAIEMENTS_CREATE,
    Permission.PAIEMENTS_READ,
    Permission.PAIEMENTS_UPDATE,
    Permission.PAIEMENTS_DELETE,
    Permission.DEPENSES_CREATE,
    Permission.DEPENSES_READ,
    Permission.DEPENSES_UPDATE,
    Permission.DEPENSES_DELETE,
    Permission.CAISSE_CREATE,
    Permission.CAISSE_READ,
    Permission.CAISSE_UPDATE,
    Permission.CAISSE_DELETE,
    Permission.TEACHINGS_CREATE,
    Permission.TEACHINGS_READ,
    Permission.TEACHINGS_UPDATE,
    Permission.TEACHINGS_DELETE,
    Permission.BLOG_CREATE,
    Permission.BLOG_READ,
    Permission.BLOG_UPDATE,
    Permission.BLOG_DELETE,
    Permission.PHOTOS_CREATE,
    Permission.PHOTOS_READ,
    Permission.PHOTOS_UPDATE,
    Permission.PHOTOS_DELETE,
    Permission.VIDEOS_CREATE,
    Permission.VIDEOS_READ,
    Permission.VIDEOS_UPDATE,
    Permission.VIDEOS_DELETE,
    Permission.USERS_CREATE,
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.ROLES_MANAGE,
    Permission.PERMISSIONS_MANAGE,
    Permission.STATS_VIEW,
    Permission.REPORTS_VIEW,
  ],

  [UserRole.COORDINATION]: [
    // Gestion complète sauf utilisateurs et permissions
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_CREATE,
    Permission.ENFANTS_READ,
    Permission.ENFANTS_UPDATE,
    Permission.ENFANTS_DELETE,
    Permission.MONITEURS_CREATE,
    Permission.MONITEURS_READ,
    Permission.MONITEURS_UPDATE,
    Permission.MONITEURS_DELETE,
    Permission.ACTIVITES_CREATE,
    Permission.ACTIVITES_READ,
    Permission.ACTIVITES_UPDATE,
    Permission.ACTIVITES_DELETE,
    Permission.PRESENCES_CREATE,
    Permission.PRESENCES_READ,
    Permission.PRESENCES_UPDATE,
    Permission.PRESENCES_DELETE,
    Permission.SALLES_CREATE,
    Permission.SALLES_READ,
    Permission.SALLES_UPDATE,
    Permission.SALLES_DELETE,
    Permission.PAIEMENTS_CREATE,
    Permission.PAIEMENTS_READ,
    Permission.PAIEMENTS_UPDATE,
    Permission.DEPENSES_CREATE,
    Permission.DEPENSES_READ,
    Permission.DEPENSES_UPDATE,
    Permission.CAISSE_CREATE,
    Permission.CAISSE_READ,
    Permission.CAISSE_UPDATE,
    Permission.CAISSE_DELETE,
    Permission.TEACHINGS_CREATE,
    Permission.TEACHINGS_READ,
    Permission.TEACHINGS_UPDATE,
    Permission.TEACHINGS_DELETE,
    Permission.BLOG_CREATE,
    Permission.BLOG_READ,
    Permission.BLOG_UPDATE,
    Permission.PHOTOS_CREATE,
    Permission.PHOTOS_READ,
    Permission.PHOTOS_UPDATE,
    Permission.VIDEOS_CREATE,
    Permission.VIDEOS_READ,
    Permission.VIDEOS_UPDATE,
    Permission.STATS_VIEW,
    Permission.REPORTS_VIEW,
  ],

  [UserRole.CHEF_SALLE]: [
    // Gestion de sa salle
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_READ,
    Permission.ENFANTS_UPDATE,
    Permission.MONITEURS_READ,
    Permission.ACTIVITES_READ,
    Permission.ACTIVITES_UPDATE,
    Permission.PRESENCES_CREATE,
    Permission.PRESENCES_READ,
    Permission.PRESENCES_UPDATE,
    Permission.SALLES_READ,
    Permission.SALLES_UPDATE,
    Permission.PAIEMENTS_READ,
    Permission.DEPENSES_CREATE,
    Permission.DEPENSES_READ,
    Permission.DEPENSES_READ,
    Permission.BLOG_READ,
    Permission.TEACHINGS_READ,
    Permission.PHOTOS_CREATE,
    Permission.PHOTOS_READ,
    Permission.VIDEOS_READ,
  ],

  [UserRole.MONITEUR]: [
    // Gestion de ses activités (sans finances)
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_READ,
    Permission.MONITEURS_READ,
    Permission.ACTIVITES_READ,
    Permission.PRESENCES_CREATE,
    Permission.PRESENCES_READ,
    Permission.PRESENCES_UPDATE,
    Permission.SALLES_READ,
    Permission.BLOG_READ,
    Permission.TEACHINGS_READ,
    Permission.PHOTOS_READ,
    Permission.VIDEOS_READ,
  ],

  [UserRole.FINANCIER]: [
    // Comme moniteur + gestion des finances
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_READ,
    Permission.MONITEURS_READ,
    Permission.ACTIVITES_READ,
    Permission.PRESENCES_CREATE,
    Permission.PRESENCES_READ,
    Permission.PRESENCES_UPDATE,
    Permission.SALLES_READ,
    Permission.PAIEMENTS_CREATE,
    Permission.PAIEMENTS_READ,
    Permission.PAIEMENTS_UPDATE,
    Permission.PAIEMENTS_DELETE,
    Permission.DEPENSES_CREATE,
    Permission.DEPENSES_READ,
    Permission.DEPENSES_UPDATE,
    Permission.BLOG_READ,
    Permission.PHOTOS_READ,
    Permission.VIDEOS_READ,
  ],

  [UserRole.COM_ACTIVITES]: [
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_READ,
    Permission.MONITEURS_READ,
    Permission.ACTIVITES_READ,
    Permission.ACTIVITES_CREATE,
    Permission.ACTIVITES_UPDATE,
    Permission.ACTIVITES_DELETE,
    Permission.PRESENCES_CREATE,
    Permission.PRESENCES_READ,
    Permission.PRESENCES_UPDATE,
    Permission.PRESENCES_DELETE,
    Permission.SALLES_READ,
    Permission.BLOG_READ,
    Permission.TEACHINGS_CREATE,
    Permission.TEACHINGS_READ,
    Permission.TEACHINGS_UPDATE,
    Permission.TEACHINGS_DELETE,
    Permission.PHOTOS_READ,
    Permission.VIDEOS_READ,
  ],

  [UserRole.PARENT]: [
    // Vue sur ses enfants uniquement
    Permission.DASHBOARD_VIEW,
    Permission.ENFANTS_READ, // Ses enfants seulement
    Permission.ACTIVITES_READ,
    Permission.PRESENCES_READ,
    Permission.PAIEMENTS_READ, // Ses paiements seulement
    Permission.BLOG_READ,
    Permission.PHOTOS_READ,
    Permission.VIDEOS_READ,
  ],

  [UserRole.ENFANT]: [
    // Vue limitée
    Permission.DASHBOARD_VIEW,
    Permission.ACTIVITES_READ,
    Permission.BLOG_READ,
    Permission.PHOTOS_READ,
    Permission.VIDEOS_READ,
  ],
}

// Helper functions
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role]
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Administrateur",
    [UserRole.COORDINATION]: "Coordination",
    [UserRole.CHEF_SALLE]: "Chef de Salle",
    [UserRole.MONITEUR]: "Moniteur",
    [UserRole.FINANCIER]: "Financier",
    [UserRole.COM_ACTIVITES]: "Comité Activités",
    [UserRole.PARENT]: "Parent",
    [UserRole.ENFANT]: "Enfant",
  }
  return labels[role]
}

export function getPermissionLabel(permission: Permission): string {
  const labels: Record<Permission, string> = {
    [Permission.DASHBOARD_VIEW]: "Voir le tableau de bord",
    [Permission.ENFANTS_CREATE]: "Créer des enfants",
    [Permission.ENFANTS_READ]: "Voir les enfants",
    [Permission.ENFANTS_UPDATE]: "Modifier les enfants",
    [Permission.ENFANTS_DELETE]: "Supprimer les enfants",
    [Permission.MONITEURS_CREATE]: "Créer des moniteurs",
    [Permission.MONITEURS_READ]: "Voir les moniteurs",
    [Permission.MONITEURS_UPDATE]: "Modifier les moniteurs",
    [Permission.MONITEURS_DELETE]: "Supprimer les moniteurs",
    [Permission.ACTIVITES_CREATE]: "Créer des activités",
    [Permission.ACTIVITES_READ]: "Voir les activités",
    [Permission.ACTIVITES_UPDATE]: "Modifier les activités",
    [Permission.ACTIVITES_DELETE]: "Supprimer les activités",
    [Permission.PRESENCES_CREATE]: "Marquer les présences",
    [Permission.PRESENCES_READ]: "Voir les présences",
    [Permission.PRESENCES_UPDATE]: "Modifier les présences",
    [Permission.PRESENCES_DELETE]: "Supprimer les présences",
    [Permission.SALLES_CREATE]: "Créer des salles",
    [Permission.SALLES_READ]: "Voir les salles",
    [Permission.SALLES_UPDATE]: "Modifier les salles",
    [Permission.SALLES_DELETE]: "Supprimer les salles",
    [Permission.PAIEMENTS_CREATE]: "Créer des paiements",
    [Permission.PAIEMENTS_READ]: "Voir les paiements",
    [Permission.PAIEMENTS_UPDATE]: "Modifier les paiements",
    [Permission.PAIEMENTS_DELETE]: "Supprimer les paiements",
    [Permission.DEPENSES_CREATE]: "Créer des dépenses",
    [Permission.DEPENSES_READ]: "Voir les dépenses",
    [Permission.DEPENSES_UPDATE]: "Modifier les dépenses",
    [Permission.DEPENSES_DELETE]: "Supprimer les dépenses",
    [Permission.CAISSE_CREATE]: "Enregistrer des cotisations",
    [Permission.CAISSE_READ]: "Voir la caisse",
    [Permission.CAISSE_UPDATE]: "Modifier la caisse",
    [Permission.CAISSE_DELETE]: "Supprimer des entrées caisse",
    [Permission.TEACHINGS_CREATE]: "Créer des enseignements",
    [Permission.TEACHINGS_READ]: "Voir les enseignements",
    [Permission.TEACHINGS_UPDATE]: "Modifier les enseignements",
    [Permission.TEACHINGS_DELETE]: "Supprimer les enseignements",
    [Permission.BLOG_CREATE]: "Créer des articles",
    [Permission.BLOG_READ]: "Voir les articles",
    [Permission.BLOG_UPDATE]: "Modifier les articles",
    [Permission.BLOG_DELETE]: "Supprimer les articles",
    [Permission.PHOTOS_CREATE]: "Uploader des photos",
    [Permission.PHOTOS_READ]: "Voir les photos",
    [Permission.PHOTOS_UPDATE]: "Modifier les photos",
    [Permission.PHOTOS_DELETE]: "Supprimer les photos",
    [Permission.VIDEOS_CREATE]: "Uploader des vidéos",
    [Permission.VIDEOS_READ]: "Voir les vidéos",
    [Permission.VIDEOS_UPDATE]: "Modifier les vidéos",
    [Permission.VIDEOS_DELETE]: "Supprimer les vidéos",
    [Permission.USERS_CREATE]: "Créer des utilisateurs",
    [Permission.USERS_READ]: "Voir les utilisateurs",
    [Permission.USERS_UPDATE]: "Modifier les utilisateurs",
    [Permission.USERS_DELETE]: "Supprimer les utilisateurs",
    [Permission.ROLES_MANAGE]: "Gérer les rôles",
    [Permission.PERMISSIONS_MANAGE]: "Gérer les permissions",
    [Permission.STATS_VIEW]: "Voir les statistiques",
    [Permission.REPORTS_VIEW]: "Voir les rapports",
  }
  return labels[permission]
}

// Groupes de permissions par module
export const permissionGroups = {
  dashboard: {
    label: "Tableau de bord",
    permissions: [Permission.DASHBOARD_VIEW],
  },
  enfants: {
    label: "Enfants",
    permissions: [
      Permission.ENFANTS_CREATE,
      Permission.ENFANTS_READ,
      Permission.ENFANTS_UPDATE,
      Permission.ENFANTS_DELETE,
    ],
  },
  moniteurs: {
    label: "Moniteurs",
    permissions: [
      Permission.MONITEURS_CREATE,
      Permission.MONITEURS_READ,
      Permission.MONITEURS_UPDATE,
      Permission.MONITEURS_DELETE,
    ],
  },
  activites: {
    label: "Activités",
    permissions: [
      Permission.ACTIVITES_CREATE,
      Permission.ACTIVITES_READ,
      Permission.ACTIVITES_UPDATE,
      Permission.ACTIVITES_DELETE,
    ],
  },
  presences: {
    label: "Présences",
    permissions: [
      Permission.PRESENCES_CREATE,
      Permission.PRESENCES_READ,
      Permission.PRESENCES_UPDATE,
      Permission.PRESENCES_DELETE,
    ],
  },
  salles: {
    label: "Salles",
    permissions: [
      Permission.SALLES_CREATE,
      Permission.SALLES_READ,
      Permission.SALLES_UPDATE,
      Permission.SALLES_DELETE,
    ],
  },
  paiements: {
    label: "Paiements",
    permissions: [
      Permission.PAIEMENTS_CREATE,
      Permission.PAIEMENTS_READ,
      Permission.PAIEMENTS_UPDATE,
      Permission.PAIEMENTS_DELETE,
    ],
  },
  depenses: {
    label: "Dépenses",
    permissions: [
      Permission.DEPENSES_CREATE,
      Permission.DEPENSES_READ,
      Permission.DEPENSES_UPDATE,
      Permission.DEPENSES_DELETE,
    ],
  },
  caisse: {
    label: "Caisse (Cotisations)",
    permissions: [
      Permission.CAISSE_CREATE,
      Permission.CAISSE_READ,
      Permission.CAISSE_UPDATE,
      Permission.CAISSE_DELETE,
    ],
  },
  blog: {
    label: "Blog",
    permissions: [
      Permission.BLOG_CREATE,
      Permission.BLOG_READ,
      Permission.BLOG_UPDATE,
      Permission.BLOG_DELETE,
    ],
  },
  photos: {
    label: "Photos",
    permissions: [
      Permission.PHOTOS_CREATE,
      Permission.PHOTOS_READ,
      Permission.PHOTOS_UPDATE,
      Permission.PHOTOS_DELETE,
    ],
  },
  videos: {
    label: "Vidéos",
    permissions: [
      Permission.VIDEOS_CREATE,
      Permission.VIDEOS_READ,
      Permission.VIDEOS_UPDATE,
      Permission.VIDEOS_DELETE,
    ],
  },
  users: {
    label: "Utilisateurs",
    permissions: [
      Permission.USERS_CREATE,
      Permission.USERS_READ,
      Permission.USERS_UPDATE,
      Permission.USERS_DELETE,
    ],
  },
  administration: {
    label: "Administration",
    permissions: [
      Permission.ROLES_MANAGE,
      Permission.PERMISSIONS_MANAGE,
      Permission.STATS_VIEW,
      Permission.REPORTS_VIEW,
    ],
  },
}
