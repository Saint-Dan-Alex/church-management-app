# 🚀 BACKEND LARAVEL - Church Management App

## 📋 Modules à implémenter

1. ✅ Moniteurs (Monitors)
2. ✅ Enfants (Children)
3. ✅ Cultes (Worship)
4. ✅ Salles (Rooms)
5. ✅ Activités (Activities)
6. ✅ Enseignements (Teachings)
7. ✅ Blog (Blog)
8. ✅ Vidéothèque (Videos)
9. ✅ Photothèque (Photos)
10. ✅ Utilisateurs (Users)
11. ✅ Dashboard (Dashboard)
12. ✅ Rapports (Reports)

## 🏗️ Structure du projet

```
backend-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MonitorController.php
│   │   │   ├── ChildController.php
│   │   │   ├── WorshipController.php
│   │   │   ├── RoomController.php
│   │   │   ├── ActivityController.php
│   │   │   ├── TeachingController.php
│   │   │   ├── BlogController.php
│   │   │   ├── VideoController.php
│   │   │   ├── PhotoController.php
│   │   │   ├── UserController.php
│   │   │   ├── DashboardController.php
│   │   │   └── ReportController.php
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   │   ├── Monitor.php
│   │   ├── Child.php
│   │   ├── Worship.php
│   │   ├── Room.php
│   │   ├── Activity.php
│   │   ├── Teaching.php
│   │   ├── Blog.php
│   │   ├── Video.php
│   │   ├── Photo.php
│   │   └── User.php
│   └── Policies/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```

## 🔧 Technologies

- **Framework:** Laravel 11
- **Database:** MySQL / PostgreSQL
- **Auth:** Laravel Sanctum
- **API:** RESTful
- **Validation:** Form Requests
- **Permissions:** Laravel Policies
- **Storage:** Laravel Storage (S3-compatible)

## 📦 Installation

```bash
# Créer le projet Laravel
composer create-project laravel/laravel backend-laravel

# Installer dépendances
cd backend-laravel
composer require laravel/sanctum
composer require spatie/laravel-permission

# Configurer .env
cp .env.example .env
php artisan key:generate

# Migrations
php artisan migrate

# Seeders
php artisan db:seed
```

## 🔐 Authentification

- **Type:** Token-based (Laravel Sanctum)
- **Rôles:** Admin, Coordination, Financier, Chef de Salle, Moniteur, Parent, Enfant, Invité
- **Middleware:** auth:sanctum, role, permission

## 📡 API Endpoints

### Base URL: `/api/v1`

**Monitors:**
- GET    `/monitors` - Liste
- POST   `/monitors` - Créer
- GET    `/monitors/{id}` - Détails
- PUT    `/monitors/{id}` - Modifier
- DELETE `/monitors/{id}` - Supprimer

**Children:**
- GET    `/children` - Liste
- POST   `/children` - Créer
- GET    `/children/{id}` - Détails
- PUT    `/children/{id}` - Modifier
- DELETE `/children/{id}` - Supprimer

**Worship:**
- GET    `/worship` - Liste
- POST   `/worship` - Créer
- GET    `/worship/{id}` - Détails
- PUT    `/worship/{id}` - Modifier
- DELETE `/worship/{id}` - Supprimer
- GET    `/worship/{id}/attendances` - Présences

**Rooms:**
- GET    `/rooms` - Liste
- POST   `/rooms` - Créer
- GET    `/rooms/{id}` - Détails
- PUT    `/rooms/{id}` - Modifier
- DELETE `/rooms/{id}` - Supprimer

**Activities:**
- GET    `/activities` - Liste
- POST   `/activities` - Créer
- GET    `/activities/{id}` - Détails
- PUT    `/activities/{id}` - Modifier
- DELETE `/activities/{id}` - Supprimer
- GET    `/activities/{id}/participants` - Participants

**Teachings:**
- GET    `/teachings` - Liste
- POST   `/teachings` - Créer
- GET    `/teachings/{id}` - Détails
- PUT    `/teachings/{id}` - Modifier
- DELETE `/teachings/{id}` - Supprimer

**Blog:**
- GET    `/blog` - Liste
- POST   `/blog` - Créer
- GET    `/blog/{id}` - Détails
- PUT    `/blog/{id}` - Modifier
- DELETE `/blog/{id}` - Supprimer

**Videos:**
- GET    `/videos` - Liste
- POST   `/videos` - Créer
- GET    `/videos/{id}` - Détails
- PUT    `/videos/{id}` - Modifier
- DELETE `/videos/{id}` - Supprimer

**Photos:**
- GET    `/photos` - Liste
- POST   `/photos` - Créer
- GET    `/photos/{id}` - Détails
- PUT    `/photos/{id}` - Modifier
- DELETE `/photos/{id}` - Supprimer

**Users:**
- GET    `/users` - Liste
- POST   `/users` - Créer
- GET    `/users/{id}` - Détails
- PUT    `/users/{id}` - Modifier
- DELETE `/users/{id}` - Supprimer

**Dashboard:**
- GET    `/dashboard/stats` - Statistiques
- GET    `/dashboard/recent` - Activités récentes

**Reports:**
- GET    `/reports/monitors` - Rapport moniteurs
- GET    `/reports/children` - Rapport enfants
- GET    `/reports/attendance` - Rapport présences
- GET    `/reports/activities` - Rapport activités

## 🗃️ Schéma de base de données

### Tables principales

1. **users** - Utilisateurs du système
2. **monitors** - Moniteurs
3. **children** - Enfants
4. **worship_sessions** - Sessions de culte
5. **rooms** - Salles
6. **activities** - Activités
7. **teachings** - Enseignements
8. **blog_posts** - Articles de blog
9. **videos** - Vidéos
10. **photos** - Photos
11. **attendances** - Présences
12. **participants** - Participants aux activités
13. **roles** - Rôles
14. **permissions** - Permissions

## 📝 Prochaines étapes

1. ✅ Créer les migrations
2. ✅ Créer les models
3. ✅ Créer les controllers
4. ✅ Créer les requests
5. ✅ Créer les resources
6. ✅ Créer les policies
7. ✅ Créer les seeders
8. ✅ Configurer les routes
9. ⏳ Tests
10. ⏳ Documentation API (Swagger)
