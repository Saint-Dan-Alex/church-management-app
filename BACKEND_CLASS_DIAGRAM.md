# 🏗️ Diagramme de Classes - Backend

## Architecture Backend pour l'Application de Gestion d'Église

---

## 📊 Diagramme de Classes UML

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES UTILISATEURS                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│      User (Utilisateur)  │
├──────────────────────────┤
│ - id: UUID               │
│ - email: String          │
│ - password: String       │
│ - nom: String            │
│ - prenom: String         │
│ - role: UserRole         │
│ - telephone: String?     │
│ - avatar: String?        │
│ - dateCreation: DateTime │
│ - dateModif: DateTime    │
│ - actif: Boolean         │
├──────────────────────────┤
│ + login()                │
│ + logout()               │
│ + updateProfile()        │
│ + changePassword()       │
│ + resetPassword()        │
└──────────────────────────┘
         △
         │
    ┌────┴────┐
    │         │
┌───────┐ ┌──────────┐
│ Admin │ │ Moniteur │
└───────┘ └──────────┘

┌──────────────────────────┐
│     UserRole (Enum)      │
├──────────────────────────┤
│ ADMIN                    │
│ MONITEUR                 │
│ LECTEUR                  │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES ENFANTS                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Enfant               │
├──────────────────────────────┤
│ - id: UUID                   │
│ - nom: String                │
│ - prenom: String             │
│ - dateNaissance: Date        │
│ - genre: Genre               │
│ - adresse: String?           │
│ - quartier: String           │
│ - classe: String             │
│ - niveau: NiveauScolaire     │
│ - photo: String?             │
│ - nomPere: String?           │
│ - telephonePere: String?     │
│ - nomMere: String?           │
│ - telephoneMere: String?     │
│ - tuteur: String?            │
│ - telephoneTuteur: String?   │
│ - contactUrgence: String     │
│ - allergies: String?         │
│ - remarques: String?         │
│ - baptise: Boolean           │
│ - dateBapteme: Date?         │
│ - actif: Boolean             │
│ - dateCreation: DateTime     │
│ - dateModif: DateTime        │
├──────────────────────────────┤
│ + getAge(): Integer          │
│ + getInscriptions(): List    │
│ + inscrireActivite()         │
│ + marquerPresence()          │
└──────────────────────────────┘
         │
         │ 1
         │
         │ 0..*
         ▽
┌──────────────────────────────┐
│      InscriptionActivite     │
├──────────────────────────────┤
│ - id: UUID                   │
│ - enfantId: UUID             │
│ - activiteId: UUID           │
│ - dateInscription: DateTime  │
│ - statut: StatutInscription  │
│ - montantAPayer: Decimal     │
│ - montantPaye: Decimal       │
│ - solde: Decimal             │
├──────────────────────────────┤
│ + calculerSolde()            │
│ + ajouterPaiement()          │
│ + annuler()                  │
└──────────────────────────────┘

┌──────────────────────────┐
│    Genre (Enum)          │
├──────────────────────────┤
│ GARCON                   │
│ FILLE                    │
└──────────────────────────┘

┌──────────────────────────────┐
│  NiveauScolaire (Enum)       │
├──────────────────────────────┤
│ MATERNELLE                   │
│ PRIMAIRE                     │
│ SECONDAIRE                   │
│ UNIVERSITAIRE                │
└──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES MONITEURS                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Moniteur             │
├──────────────────────────────┤
│ - id: UUID                   │
│ - nom: String                │
│ - prenom: String             │
│ - dateNaissance: Date        │
│ - genre: Genre               │
│ - telephone: String          │
│ - email: String              │
│ - adresse: String            │
│ - photo: String?             │
│ - specialite: String?        │
│ - dateDebut: Date            │
│ - actif: Boolean             │
│ - userId: UUID?              │
│ - dateCreation: DateTime     │
│ - dateModif: DateTime        │
├──────────────────────────────┤
│ + assignerActivite()         │
│ + getActivites(): List       │
│ + marquerPresence()          │
│ + ajouterRapport()           │
└──────────────────────────────┘
         │
         │ 0..*
         │
         │ 0..*
         ▽
┌──────────────────────────────┐
│   MoniteurActivite           │
├──────────────────────────────┤
│ - id: UUID                   │
│ - moniteurId: UUID           │
│ - activiteId: UUID           │
│ - role: RoleMoniteur         │
│ - dateDebut: Date            │
│ - dateFin: Date?             │
├──────────────────────────────┤
│ + finirMission()             │
└──────────────────────────────┘

┌──────────────────────────┐
│  RoleMoniteur (Enum)     │
├──────────────────────────┤
│ RESPONSABLE              │
│ ASSISTANT                │
│ INTERVENANT              │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES ACTIVITÉS                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Activite             │
├──────────────────────────────┤
│ - id: UUID                   │
│ - nom: String                │
│ - description: String        │
│ - type: TypeActivite         │
│ - dateDebut: Date            │
│ - dateFin: Date              │
│ - heureDebut: Time           │
│ - heureFin: Time             │
│ - jour: JourSemaine?         │
│ - frequence: Frequence       │
│ - lieu: String               │
│ - salleId: UUID?             │
│ - capaciteMax: Integer       │
│ - ageMin: Integer?           │
│ - ageMax: Integer?           │
│ - cout: Decimal              │
│ - devise: Devise             │
│ - statut: StatutActivite     │
│ - image: String?             │
│ - dateCreation: DateTime     │
│ - dateModif: DateTime        │
├──────────────────────────────┤
│ + inscrireEnfant()           │
│ + assignerMoniteur()         │
│ + creerSeance()              │
│ + calculerNbInscrits(): Int  │
│ + verifierDisponibilite()    │
└──────────────────────────────┘
         │
         │ 1
         │
         │ 0..*
         ▽
┌──────────────────────────────┐
│         Seance               │
├──────────────────────────────┤
│ - id: UUID                   │
│ - activiteId: UUID           │
│ - date: Date                 │
│ - heureDebut: Time           │
│ - heureFin: Time             │
│ - theme: String?             │
│ - description: String?       │
│ - salleId: UUID?             │
│ - statut: StatutSeance       │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + marquerPresences()         │
│ + annuler()                  │
│ + getPresents(): List        │
└──────────────────────────────┘
         │
         │ 1
         │
         │ 0..*
         ▽
┌──────────────────────────────┐
│         Presence             │
├──────────────────────────────┤
│ - id: UUID                   │
│ - seanceId: UUID             │
│ - enfantId: UUID?            │
│ - moniteurId: UUID?          │
│ - present: Boolean           │
│ - heureArrivee: Time?        │
│ - remarque: String?          │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + marquer()                  │
└──────────────────────────────┘

┌──────────────────────────┐
│  TypeActivite (Enum)     │
├──────────────────────────┤
│ CULTE_ENFANTS            │
│ ECOLE_DIMANCHE           │
│ CAMP                     │
│ SORTIE                   │
│ FORMATION                │
│ ATELIER                  │
│ AUTRE                    │
└──────────────────────────┘

┌──────────────────────────┐
│  Frequence (Enum)        │
├──────────────────────────┤
│ UNIQUE                   │
│ HEBDOMADAIRE             │
│ BIHEBDOMADAIRE           │
│ MENSUEL                  │
└──────────────────────────┘

┌──────────────────────────┐
│  StatutActivite (Enum)   │
├──────────────────────────┤
│ PLANIFIEE                │
│ EN_COURS                 │
│ TERMINEE                 │
│ ANNULEE                  │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES PAIEMENTS                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Paiement             │
├──────────────────────────────┤
│ - id: UUID                   │
│ - numeroPaiement: String     │
│ - numeroRecu: String         │
│ - inscriptionId: UUID        │
│ - montantPaye: Decimal       │
│ - devise: Devise             │
│ - modePaiement: ModePaiement │
│ - datePaiement: DateTime     │
│ - reference: String?         │
│ - remarques: String?         │
│ - effectuePar: String        │
│ - valide: Boolean            │
│ - dateValidation: DateTime?  │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + genererRecu()              │
│ + valider()                  │
│ + annuler()                  │
└──────────────────────────────┘

┌──────────────────────────┐
│  ModePaiement (Enum)     │
├──────────────────────────┤
│ ESPECES                  │
│ MOBILE_MONEY             │
│ VIREMENT                 │
│ CHEQUE                   │
└──────────────────────────┘

┌──────────────────────────┐
│     Devise (Enum)        │
├──────────────────────────┤
│ USD                      │
│ CDF                      │
│ EUR                      │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES SALLES                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Salle                │
├──────────────────────────────┤
│ - id: UUID                   │
│ - nom: String                │
│ - description: String?       │
│ - type: TypeSalle            │
│ - capacite: Integer          │
│ - equipements: String[]      │
│ - etage: Integer?            │
│ - disponible: Boolean        │
│ - dateCreation: DateTime     │
│ - dateModif: DateTime        │
├──────────────────────────────┤
│ + reserver()                 │
│ + liberer()                  │
│ + verifierDisponibilite()    │
│ + getReservations(): List    │
└──────────────────────────────┘
         │
         │ 1
         │
         │ 0..*
         ▽
┌──────────────────────────────┐
│      ReservationSalle        │
├──────────────────────────────┤
│ - id: UUID                   │
│ - salleId: UUID              │
│ - activiteId: UUID?          │
│ - seanceId: UUID?            │
│ - dateDebut: DateTime        │
│ - dateFin: DateTime          │
│ - reservePar: String         │
│ - motif: String?             │
│ - statut: StatutReservation  │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + confirmer()                │
│ + annuler()                  │
└──────────────────────────────┘

┌──────────────────────────┐
│   TypeSalle (Enum)       │
├──────────────────────────┤
│ CLASSE                   │
│ SALLE_REUNION            │
│ SALLE_JEUX               │
│ AUDITORIUM               │
│ EXTERIEUR                │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES DÉPENSES                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Depense              │
├──────────────────────────────┤
│ - id: UUID                   │
│ - numeroDepense: String      │
│ - titre: String              │
│ - description: String?       │
│ - categorie: CategorieDepense│
│ - montant: Decimal           │
│ - devise: Devise             │
│ - date: Date                 │
│ - fournisseur: String?       │
│ - activiteId: UUID?          │
│ - recu: String?              │
│ - statut: StatutDepense      │
│ - approuvePar: UUID?         │
│ - dateApprobation: DateTime? │
│ - remarques: String?         │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + approuver()                │
│ + rejeter()                  │
│ + uploadRecu()               │
└──────────────────────────────┘

┌──────────────────────────────┐
│  CategorieDepense (Enum)     │
├──────────────────────────────┤
│ NOURRITURE                   │
│ TRANSPORT                    │
│ MATERIEL_PEDAGOGIQUE         │
│ EQUIPEMENT                   │
│ HONORAIRES                   │
│ ENTRETIEN                    │
│ AUTRE                        │
└──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DU CONTENU                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│         Article (Blog)       │
├──────────────────────────────┤
│ - id: UUID                   │
│ - titre: String              │
│ - slug: String               │
│ - extrait: String?           │
│ - contenu: Text              │
│ - categorie: CategorieArticle│
│ - auteurId: UUID             │
│ - image: String?             │
│ - statut: StatutPublication  │
│ - datePublication: DateTime? │
│ - vues: Integer              │
│ - tags: String[]             │
│ - dateCreation: DateTime     │
│ - dateModif: DateTime        │
├──────────────────────────────┤
│ + publier()                  │
│ + depublier()                │
│ + incrementerVues()          │
└──────────────────────────────┘

┌──────────────────────────────┐
│         Photo                │
├──────────────────────────────┤
│ - id: UUID                   │
│ - titre: String              │
│ - description: String?       │
│ - url: String                │
│ - miniature: String?         │
│ - album: String?             │
│ - tags: String[]             │
│ - date: Date                 │
│ - auteurId: UUID             │
│ - taille: Integer            │
│ - largeur: Integer?          │
│ - hauteur: Integer?          │
│ - activiteId: UUID?          │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + genererMiniature()         │
│ + supprimer()                │
└──────────────────────────────┘

┌──────────────────────────────┐
│         Video                │
├──────────────────────────────┤
│ - id: UUID                   │
│ - titre: String              │
│ - description: String?       │
│ - url: String                │
│ - type: TypeVideo            │
│ - miniature: String?         │
│ - categorie: CategorieVideo  │
│ - duree: String?             │
│ - date: Date                 │
│ - auteurId: UUID             │
│ - vues: Integer              │
│ - activiteId: UUID?          │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + incrementerVues()          │
│ + genererMiniature()         │
│ + supprimer()                │
└──────────────────────────────┘

┌──────────────────────────┐
│  TypeVideo (Enum)        │
├──────────────────────────┤
│ YOUTUBE                  │
│ VIMEO                    │
│ UPLOAD                   │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES NOTIFICATIONS                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│       Notification           │
├──────────────────────────────┤
│ - id: UUID                   │
│ - titre: String              │
│ - message: Text              │
│ - type: TypeNotification     │
│ - destinataireId: UUID?      │
│ - canal: CanalNotification[] │
│ - telephone: String?         │
│ - email: String?             │
│ - dateProgrammee: DateTime?  │
│ - dateEnvoi: DateTime?       │
│ - statut: StatutNotification │
│ - erreur: String?            │
│ - dateCreation: DateTime     │
├──────────────────────────────┤
│ + envoyer()                  │
│ + programmer()               │
│ + annuler()                  │
└──────────────────────────────┘

┌──────────────────────────────┐
│  TypeNotification (Enum)     │
├──────────────────────────────┤
│ RAPPEL_ACTIVITE              │
│ CONFIRMATION_INSCRIPTION     │
│ RAPPEL_PAIEMENT              │
│ ANNULATION                   │
│ INFORMATION                  │
└──────────────────────────────┘

┌──────────────────────────────┐
│  CanalNotification (Enum)    │
├──────────────────────────────┤
│ SMS                          │
│ EMAIL                        │
│ WHATSAPP                     │
│ APP                          │
└──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GESTION DES STATISTIQUES                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│       Statistique            │
├──────────────────────────────┤
│ - id: UUID                   │
│ - type: TypeStatistique      │
│ - periode: String            │
│ - donnees: JSON              │
│ - dateGeneration: DateTime   │
├──────────────────────────────┤
│ + genererRapport()           │
│ + exporter()                 │
└──────────────────────────────┘
```

---

## 🔗 Relations principales

### **Enfant ↔ Activité**
```
Enfant 1 ────── 0..* InscriptionActivite 0..* ────── 1 Activité
```

### **Moniteur ↔ Activité**
```
Moniteur 0..* ────── 0..* MoniteurActivite 0..* ────── 1 Activité
```

### **Activité ↔ Séance**
```
Activité 1 ────── 0..* Séance
```

### **Séance ↔ Présence**
```
Séance 1 ────── 0..* Présence
```

### **InscriptionActivite ↔ Paiement**
```
InscriptionActivite 1 ────── 0..* Paiement
```

### **Salle ↔ Activité**
```
Salle 1 ────── 0..* Activité
Salle 1 ────── 0..* ReservationSalle
```

---

## 📋 Spécifications techniques

### **Base de données recommandée**
- **PostgreSQL** (pour production)
- **SQLite** (pour développement)

### **ORM recommandé**
- **Prisma** (Next.js/TypeScript)
- **Sequelize** (Node.js)
- **TypeORM** (TypeScript)

### **Authentification**
- **NextAuth.js** ou **Supabase Auth**
- JWT tokens
- Refresh tokens
- Sessions sécurisées

### **Stockage fichiers**
- **Supabase Storage**
- **AWS S3**
- **Cloudinary** (pour images)

### **API**
- **REST API** ou **GraphQL**
- Validation avec **Zod** ou **Yup**
- Documentation avec **Swagger**

---

## 🔒 Sécurité

### **Règles d'accès**

| Rôle | Enfants | Moniteurs | Activités | Finances | Contenu |
|------|---------|-----------|-----------|----------|---------|
| **Admin** | CRUD | CRUD | CRUD | CRUD | CRUD |
| **Moniteur** | R | R | R (assigné) | R | R |
| **Lecteur** | R | R | R | - | R |

### **Chiffrement**
- Mots de passe : **bcrypt** ou **argon2**
- Données sensibles : **AES-256**
- Communications : **HTTPS/TLS**

---

## 📊 Indexes recommandés

```sql
-- Performances de recherche
CREATE INDEX idx_enfant_nom ON enfants(nom, prenom);
CREATE INDEX idx_enfant_actif ON enfants(actif);
CREATE INDEX idx_activite_dates ON activites(date_debut, date_fin);
CREATE INDEX idx_presence_seance ON presences(seance_id);
CREATE INDEX idx_paiement_inscription ON paiements(inscription_id);
CREATE INDEX idx_article_statut ON articles(statut, date_publication);
```

---

## 🚀 Stack technique recommandée

### **Backend**
```
- Framework: Next.js API Routes / Express.js
- Langage: TypeScript
- ORM: Prisma
- Base: PostgreSQL
- Cache: Redis
- Files: Supabase Storage
```

### **API**
```
- Type: REST ou GraphQL
- Validation: Zod
- Auth: NextAuth.js
- Docs: Swagger/OpenAPI
```

### **Déploiement**
```
- Backend: Vercel / Railway / Render
- DB: Supabase / Neon / Railway
- Files: Cloudinary / S3
```

---

## 📝 Exemple de schéma Prisma

```prisma
model Enfant {
  id              String   @id @default(uuid())
  nom             String
  prenom          String
  dateNaissance   DateTime
  genre           Genre
  quartier        String
  classe          String
  niveau          NiveauScolaire
  photo           String?
  nomPere         String?
  telephonePere   String?
  nomMere         String?
  telephoneMere   String?
  contactUrgence  String
  actif           Boolean  @default(true)
  dateCreation    DateTime @default(now())
  dateModif       DateTime @updatedAt
  
  inscriptions    InscriptionActivite[]
  presences       Presence[]
  
  @@index([nom, prenom])
  @@index([actif])
}

model Activite {
  id              String   @id @default(uuid())
  nom             String
  description     String
  type            TypeActivite
  dateDebut       DateTime
  dateFin         DateTime
  heureDebut      String
  heureFin        String
  lieu            String
  salleId         String?
  capaciteMax     Int
  cout            Decimal
  devise          Devise
  statut          StatutActivite
  dateCreation    DateTime @default(now())
  dateModif       DateTime @updatedAt
  
  salle           Salle?   @relation(fields: [salleId], references: [id])
  inscriptions    InscriptionActivite[]
  seances         Seance[]
  moniteurs       MoniteurActivite[]
  depenses        Depense[]
  
  @@index([statut])
  @@index([dateDebut, dateFin])
}
```

---

**📄 Document créé le :** 21 janvier 2025  
**🏗️ Architecture :** Backend complet pour gestion d'église  
**💾 Base de données :** PostgreSQL / Prisma
