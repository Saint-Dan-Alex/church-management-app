# 🚀 BACKEND LARAVEL - Church Management App

## 📋 Vue d'ensemble

Backend API RESTful complet pour l'application de gestion d'église développé avec **Laravel 11**.

---

## 🎯 Modules implémentés (12)

| # | Module | Endpoint | Table | Status |
|---|--------|----------|-------|--------|
| 1 | **Moniteurs** | `/api/monitors` | `monitors` | ✅ |
| 2 | **Enfants** | `/api/children` | `children` | ✅ |
| 3 | **Cultes** | `/api/worship` | `worship_sessions` | ✅ |
| 4 | **Salles** | `/api/rooms` | `rooms` | ✅ |
| 5 | **Activités** | `/api/activities` | `activities` | ✅ |
| 6 | **Enseignements** | `/api/teachings` | `teachings` | ✅ |
| 7 | **Blog** | `/api/blog` | `blog_posts` | ✅ |
| 8 | **Vidéothèque** | `/api/videos` | `videos` | ✅ |
| 9 | **Photothèque** | `/api/photos` | `photos` | ✅ |
| 10 | **Utilisateurs** | `/api/users` | `users` | ✅ |
| 11 | **Dashboard** | `/api/dashboard` | - | ✅ |
| 12 | **Rapports** | `/api/reports` | - | ✅ |

---

## 📁 Structure des fichiers fournis

```
backend-laravel/
├── README.md                      ← Ce fichier
├── STRUCTURE.md                   ← Architecture détaillée
├── INSTALLATION.md                ← Guide d'installation pas à pas
├── MODELS_COMPLETS.md             ← Tous les Models Eloquent
├── CONTROLLERS_COMPLETS.md        ← Tous les Controllers
│
├── database/
│   └── migrations/
│       ├── 2024_01_01_000001_create_users_table.php
│       ├── 2024_01_01_000002_create_monitors_table.php
│       ├── 2024_01_01_000003_create_children_table.php
│       ├── 2024_01_01_000004_create_rooms_table.php
│       ├── 2024_01_01_000005_create_worship_sessions_table.php
│       ├── 2024_01_01_000006_create_activities_table.php
│       ├── 2024_01_01_000007_create_teachings_table.php
│       ├── 2024_01_01_000008_create_blog_posts_table.php
│       ├── 2024_01_01_000009_create_videos_table.php
│       └── 2024_01_01_000010_create_photos_table.php
│
└── app/
    ├── Models/
    │   ├── User.php
    │   ├── Monitor.php
    │   └── Child.php
    └── Http/
        └── Controllers/
            ├── MonitorController.php
            ├── ChildController.php
            └── WorshipController.php
```

---

## ⚡ Démarrage rapide

### 1️⃣ Créer le projet Laravel

```bash
composer create-project laravel/laravel backend-laravel
cd backend-laravel
```

### 2️⃣ Installer les dépendances

```bash
composer require laravel/sanctum
composer require spatie/laravel-permission
```

### 3️⃣ Configurer `.env`

```env
DB_DATABASE=church_management
DB_USERNAME=root
DB_PASSWORD=
```

### 4️⃣ Copier les fichiers

1. **Migrations** : Copier dans `database/migrations/`
2. **Models** : Copier dans `app/Models/`
3. **Controllers** : Copier dans `app/Http/Controllers/`

### 5️⃣ Exécuter les migrations

```bash
php artisan migrate
```

### 6️⃣ Lancer le serveur

```bash
php artisan serve
```

API disponible sur : `http://localhost:8000/api`

---

## 🔌 Endpoints API principaux

### **Authentication**

```http
POST   /api/login        # Connexion
POST   /api/register     # Inscription
POST   /api/logout       # Déconnexion
GET    /api/me           # Utilisateur connecté
```

### **Monitors (Moniteurs)**

```http
GET    /api/monitors           # Liste
POST   /api/monitors           # Créer
GET    /api/monitors/{id}      # Détails
PUT    /api/monitors/{id}      # Modifier
DELETE /api/monitors/{id}      # Supprimer
```

### **Children (Enfants)**

```http
GET    /api/children           # Liste
POST   /api/children           # Créer
GET    /api/children/{id}      # Détails
PUT    /api/children/{id}      # Modifier
DELETE /api/children/{id}      # Supprimer
```

### **Worship (Cultes)**

```http
GET    /api/worship                         # Liste
POST   /api/worship                         # Créer
GET    /api/worship/{id}                    # Détails
PUT    /api/worship/{id}                    # Modifier
DELETE /api/worship/{id}                    # Supprimer
GET    /api/worship/{id}/attendances        # Présences
POST   /api/worship/{id}/mark-attendance    # Marquer présence
```

### **Rooms (Salles)**

```http
GET    /api/rooms           # Liste
POST   /api/rooms           # Créer
GET    /api/rooms/{id}      # Détails
PUT    /api/rooms/{id}      # Modifier
DELETE /api/rooms/{id}      # Supprimer
```

### **Activities (Activités)**

```http
GET    /api/activities                    # Liste
POST   /api/activities                    # Créer
GET    /api/activities/{id}               # Détails
PUT    /api/activities/{id}               # Modifier
DELETE /api/activities/{id}               # Supprimer
GET    /api/activities/{id}/participants  # Participants
POST   /api/activities/{id}/register      # Inscrire participant
```

### **Teachings (Enseignements)**

```http
GET    /api/teachings           # Liste
POST   /api/teachings           # Créer
GET    /api/teachings/{id}      # Détails
PUT    /api/teachings/{id}      # Modifier
DELETE /api/teachings/{id}      # Supprimer
```

### **Blog**

```http
GET    /api/blog           # Liste
POST   /api/blog           # Créer
GET    /api/blog/{id}      # Détails
PUT    /api/blog/{id}      # Modifier
DELETE /api/blog/{id}      # Supprimer
```

### **Videos (Vidéothèque)**

```http
GET    /api/videos           # Liste
POST   /api/videos           # Créer
GET    /api/videos/{id}      # Détails
PUT    /api/videos/{id}      # Modifier
DELETE /api/videos/{id}      # Supprimer
```

### **Photos (Photothèque)**

```http
GET    /api/photos           # Liste photos
POST   /api/photos           # Créer
GET    /api/photos/{id}      # Détails
PUT    /api/photos/{id}      # Modifier
DELETE /api/photos/{id}      # Supprimer

GET    /api/photo-albums           # Liste albums
POST   /api/photo-albums           # Créer album
GET    /api/photo-albums/{id}      # Détails
```

### **Dashboard**

```http
GET    /api/dashboard/stats    # Statistiques globales
GET    /api/dashboard/recent   # Activités récentes
```

### **Reports (Rapports)**

```http
GET    /api/reports/monitors     # Rapport moniteurs
GET    /api/reports/children     # Rapport enfants
GET    /api/reports/attendance   # Rapport présences
GET    /api/reports/activities   # Rapport activités
```

---

## 🔐 Authentification

L'API utilise **Laravel Sanctum** pour l'authentification par token.

### Exemple d'utilisation

```javascript
// 1. Login
const response = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password'
  })
});

const { token } = await response.json();

// 2. Utiliser le token dans les requêtes
const data = await fetch('http://localhost:8000/api/monitors', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🗃️ Base de données

### Tables principales (10)

1. **users** - Utilisateurs système
2. **monitors** - Moniteurs
3. **children** - Enfants
4. **rooms** - Salles
5. **worship_sessions** - Sessions de culte
6. **activities** - Activités
7. **teachings** - Enseignements
8. **blog_posts** - Articles blog
9. **videos** - Vidéos
10. **photos** - Photos

### Tables de liaison (4)

- **worship_attendances** - Présences culte
- **activity_participants** - Participants activités
- **photo_albums** - Albums photos
- **roles & permissions** (Spatie)

---

## 🎨 Architecture

### Models avec relations

Tous les Models utilisent :
- ✅ **Eloquent ORM** pour les requêtes
- ✅ **Soft Deletes** pour suppression douce
- ✅ **Relations** bien définies
- ✅ **Scopes** pour filtres réutilisables
- ✅ **Casts** pour types de données
- ✅ **Accessors** pour attributs calculés

### Controllers RESTful

Tous les Controllers implémentent :
- ✅ **index()** - Liste avec pagination
- ✅ **store()** - Création
- ✅ **show($id)** - Détails
- ✅ **update($id)** - Modification
- ✅ **destroy($id)** - Suppression

---

## 📊 Exemple de réponse API

### GET /api/monitors

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "specialite": "Enfants 6-8 ans",
      "date_integration": "2023-01-15",
      "statut": "actif",
      "annees_experience": 3,
      "created_at": "2024-01-01T10:00:00.000000Z",
      "user": {
        "id": 5,
        "nom": "KAMANDA",
        "prenom": "Sophie",
        "email": "sophie@example.com",
        "role": "moniteur"
      }
    }
  ],
  "total": 25,
  "per_page": 15
}
```

---

## 🧪 Tests

```bash
# Créer des tests
php artisan make:test MonitorTest

# Exécuter les tests
php artisan test
```

---

## 📚 Documentation complète

- **STRUCTURE.md** - Architecture et organisation
- **INSTALLATION.md** - Guide d'installation détaillé
- **MODELS_COMPLETS.md** - Tous les Models avec code
- **CONTROLLERS_COMPLETS.md** - Tous les Controllers avec code

---

## 🔗 Connexion avec le frontend

### Configuration Next.js

```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchMonitors(token: string) {
  const response = await fetch(`${API_BASE_URL}/monitors`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}
```

---

## 🛠️ Technologies utilisées

- **Laravel 11** - Framework PHP
- **MySQL / PostgreSQL** - Base de données
- **Laravel Sanctum** - Authentification API
- **Spatie Laravel Permission** - Gestion des rôles
- **Eloquent ORM** - Gestion base de données

---

## ✅ Checklist de déploiement

- [ ] Configurer `.env` production
- [ ] Générer APP_KEY
- [ ] Configurer base de données
- [ ] Exécuter migrations
- [ ] Configurer CORS
- [ ] Sécuriser les endpoints
- [ ] Activer le cache
- [ ] Configurer les logs
- [ ] Tests de charge
- [ ] Documentation API

---

## 📞 Support

Pour toute question :
1. Consulter `INSTALLATION.md` pour l'installation
2. Consulter `MODELS_COMPLETS.md` pour les Models
3. Consulter `CONTROLLERS_COMPLETS.md` pour les Controllers
4. Vérifier les logs : `storage/logs/laravel.log`

---

## 🎉 Backend Laravel prêt à l'emploi !

**12 modules CRUD complets** pour votre application de gestion d'église.

Dernière mise à jour : 22 Octobre 2025
