# Backend Laravel - Church Management System

## 🎯 Description

Backend API REST complet pour le système de gestion d'église développé avec **Laravel 11**, **Eloquent ORM** et **MySQL**.

## 📦 Modules Implémentés

### ✅ 12 Modules Principaux

| # | Module | Tables | Contrôleur | Validations |
|---|--------|--------|------------|-------------|
| 1 | **Monitors** | monitors, moniteur_salle, moniteur_salle_historique | MonitorController | ✅ |
| 2 | **Children** | children | ChildController | ✅ |
| 3 | **Salles** | salles | SalleController | ✅ |
| 4 | **Activities** | activities, activity_participants | ActivityController | ✅ |
| 5 | **Teachings** | teachings + 6 tables relationnelles | TeachingController | ✅ |
| 6 | **Worship Reports** | worship_reports, nouveaux_venus | WorshipReportController | ✅ |
| 7 | **Blog** | blogs | BlogController | ✅ |
| 8 | **Videos** | videos | VideoController | ✅ |
| 9 | **Photos** | photos | PhotoController | ✅ |
| 10 | **Expenses** | expenses | ExpenseController | ✅ |
| 11 | **Payments** | payments, receipts | PaymentController | ✅ |
| 12 | **Presences** | presences | PresenceController | ✅ |

### ✅ Modules Financiers

| # | Module | Table | Contrôleur |
|---|--------|-------|------------|
| 13 | **Cotisations** | cotisations | CotisationController |
| 14 | **Sorties** | sorties | SortieController |

## 📁 Structure du Projet

```
backend-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── API/
│   │   │       ├── MonitorController.php
│   │   │       ├── ChildController.php
│   │   │       ├── SalleController.php
│   │   │       ├── ActivityController.php
│   │   │       ├── TeachingController.php
│   │   │       ├── WorshipReportController.php
│   │   │       ├── BlogController.php
│   │   │       ├── VideoController.php
│   │   │       ├── PhotoController.php
│   │   │       ├── ExpenseController.php
│   │   │       ├── PaymentController.php
│   │   │       ├── PresenceController.php
│   │   │       ├── CotisationController.php
│   │   │       └── SortieController.php
│   │   └── Requests/
│   │       ├── StoreMonitorRequest.php
│   │       ├── UpdateMonitorRequest.php
│   │       ├── StoreChildRequest.php
│   │       ├── UpdateChildRequest.php
│   │       ├── StoreSalleRequest.php
│   │       ├── UpdateSalleRequest.php
│   │       ├── StoreActivityRequest.php
│   │       ├── UpdateActivityRequest.php
│   │       ├── StoreTeachingRequest.php
│   │       ├── StoreWorshipReportRequest.php
│   │       ├── StoreBlogRequest.php
│   │       ├── StoreVideoRequest.php
│   │       ├── StorePhotoRequest.php
│   │       ├── StoreExpenseRequest.php
│   │       ├── StorePaymentRequest.php
│   │       ├── StorePresenceRequest.php
│   │       ├── StoreCotisationRequest.php
│   │       └── StoreSortieRequest.php
│   └── Models/
│       ├── Monitor.php
│       ├── Child.php
│       ├── Salle.php
│       ├── MoniteurSalleHistorique.php
│       ├── Activity.php
│       ├── ActivityParticipant.php
│       ├── Teaching.php
│       ├── TeachingChant.php
│       ├── TeachingPoint.php
│       ├── TeachingSousPoint.php
│       ├── TeachingEvenement.php
│       ├── TeachingEnseignement.php
│       ├── WorshipReport.php
│       ├── NouveauVenu.php
│       ├── Blog.php
│       ├── Video.php
│       ├── Photo.php
│       ├── Expense.php
│       ├── Payment.php
│       ├── Receipt.php
│       ├── Presence.php
│       ├── Cotisation.php
│       └── Sortie.php
├── database/
│   └── migrations/
│       ├── 2025_10_22_100001_create_monitors_table.php
│       ├── 2025_10_22_100002_create_children_table.php
│       ├── 2025_10_22_100003_create_salles_table.php
│       ├── 2025_10_22_100004_create_moniteur_salle_table.php
│       ├── 2025_10_22_100005_create_moniteur_salle_historique_table.php
│       ├── 2025_10_22_100006_create_activities_table.php
│       ├── 2025_10_22_100007_create_activity_participants_table.php
│       ├── 2025_10_22_100008_create_teachings_table.php
│       ├── 2025_10_22_100009_create_teaching_chants_table.php
│       ├── 2025_10_22_100010_create_teaching_points_table.php
│       ├── 2025_10_22_100011_create_teaching_sous_points_table.php
│       ├── 2025_10_22_100012_create_teaching_evenements_table.php
│       ├── 2025_10_22_100013_create_teaching_enseignements_table.php
│       ├── 2025_10_22_100014_create_worship_reports_table.php
│       ├── 2025_10_22_100015_create_nouveaux_venus_table.php
│       ├── 2025_10_22_100016_create_blogs_table.php
│       ├── 2025_10_22_100017_create_videos_table.php
│       ├── 2025_10_22_100018_create_photos_table.php
│       ├── 2025_10_22_100019_create_expenses_table.php
│       ├── 2025_10_22_100020_create_payments_table.php
│       ├── 2025_10_22_100021_create_receipts_table.php
│       ├── 2025_10_22_100022_create_presences_table.php
│       ├── 2025_10_22_100023_create_cotisations_table.php
│       └── 2025_10_22_100024_create_sorties_table.php
└── routes/
    └── api.php
```

## 🚀 Installation Rapide

```bash
# 1. Se placer dans le dossier backend
cd backend-laravel

# 2. Installer les dépendances
composer install

# 3. Copier le fichier .env
copy .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Configurer la base de données dans .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=church_management
DB_USERNAME=root
DB_PASSWORD=

# 6. Créer la base de données
mysql -u root -p
CREATE DATABASE church_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 7. Exécuter les migrations
php artisan migrate

# 8. Lancer le serveur
php artisan serve
```

API accessible sur : **http://localhost:8000/api/v1**

## 📊 Statistiques du Code

### Fichiers Créés

- **24 Migrations** - Tables de base de données
- **23 Modèles Eloquent** - Avec relations et scopes
- **18 Request Validators** - Validation des données
- **14 Controllers API** - CRUD complet avec filtres
- **1 Fichier de routes** - 60+ endpoints API
- **Soft Deletes** - Sur la majorité des tables

### Fonctionnalités par Module

#### 🎯 CRUD Complet
Tous les modules disposent de :
- ✅ Create (POST)
- ✅ Read (GET) - Liste + Détails
- ✅ Update (PUT/PATCH)
- ✅ Delete (DELETE)
- ✅ Statistiques personnalisées

#### 🔍 Filtres Avancés
- Recherche par texte
- Filtres par date (période)
- Filtres par statut/type/catégorie
- Filtres par relations (activité, moniteur, etc.)

#### 📄 Pagination
- Par défaut : 15 éléments
- Paramètre `per_page` personnalisable
- Métadonnées complètes (total, pages, etc.)

## 🔗 Endpoints Principaux

### Base URL
```
http://localhost:8000/api/v1
```

### Health Check
```bash
GET /api/health
```

### Exemples d'endpoints

```bash
# Monitors
GET    /api/v1/monitors
POST   /api/v1/monitors
GET    /api/v1/monitors/{id}
PUT    /api/v1/monitors/{id}
DELETE /api/v1/monitors/{id}
GET    /api/v1/monitors-statistics

# Activities
GET    /api/v1/activities
POST   /api/v1/activities
GET    /api/v1/activities/{id}
PUT    /api/v1/activities/{id}
DELETE /api/v1/activities/{id}
GET    /api/v1/activities/{id}/statistics

# Teachings
GET    /api/v1/teachings
POST   /api/v1/teachings
GET    /api/v1/teachings/{id}
DELETE /api/v1/teachings/{id}

# Et ainsi de suite pour tous les modules...
```

Voir **API_DOCUMENTATION.md** pour la documentation complète.

## 🗄️ Modèles de Données

### Relations Eloquent

#### Monitor
- `belongsTo` Salle (salle actuelle)
- `belongsToMany` Salle (historique)
- `hasMany` Presence
- `hasMany` MoniteurSalleHistorique

#### Child
- `morphMany` ActivityParticipant

#### Salle
- `belongsTo` Monitor (responsable)
- `belongsTo` Monitor (adjoint)
- `belongsToMany` Monitor
- `hasMany` MoniteurSalleHistorique

#### Activity
- `hasMany` ActivityParticipant
- `hasMany` Expense
- `hasMany` Payment
- `hasMany` Presence

#### Teaching
- `hasMany` TeachingChant
- `hasMany` TeachingPoint
- `hasMany` TeachingEvenement

#### WorshipReport
- `hasMany` NouveauVenu
- `belongsTo` User (created_by)

#### Payment
- `belongsTo` Activity
- `hasMany` Receipt

## 🛡️ Validation des Données

Tous les modules disposent de validations strictes via Laravel Form Requests :

### Exemple - StoreMonitorRequest
```php
'nom' => 'required|string|max:255',
'email' => 'required|email|unique:monitors,email',
'telephone' => 'required|string|max:255',
'date_naissance' => 'required|date',
'etat_civil' => 'required|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
```

### Exemple - StoreActivityRequest
```php
'titre' => 'required|string|max:255',
'type' => 'required|in:gratuite,payante',
'montant_requis' => 'nullable|required_if:type,payante|numeric|min:0',
'heure_fin' => 'required|date_format:H:i|after:heure_debut',
```

## 📈 Fonctionnalités Avancées

### 1. Statistiques Dynamiques

```bash
# Statistiques globales des moniteurs
GET /api/v1/monitors-statistics

# Statistiques d'une activité
GET /api/v1/activities/{id}/statistics

# Statistiques de paiements
GET /api/v1/payments-statistics?activity_id=xxx
```

### 2. Gestion des Devises

Support de deux devises :
- **CDF** (Francs Congolais)
- **USD** (Dollars US)

Utilisé dans : Activities, Payments, Expenses, Cotisations, Sorties

### 3. Soft Deletes

La plupart des modèles utilisent le soft delete :
- Les données ne sont pas supprimées physiquement
- Possibilité de restauration
- Colonne `deleted_at`

### 4. UUID comme Clés Primaires

Tous les modèles utilisent des UUID au lieu d'ID incrémentaux pour :
- Meilleure sécurité
- Éviter l'énumération
- Compatibilité distribuée

### 5. Scopes Eloquent

Exemples de scopes disponibles :
- `Blog::published()` - Articles publiés
- `Video::featured()` - Vidéos en vedette
- `Photo::recent()` - Photos récentes
- `Payment::paid()` - Paiements complétés
- `Presence::present()` - Présents uniquement

## 🔧 Configuration

### CORS (config/cors.php)

Pour permettre au frontend Next.js de communiquer avec l'API :

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Base de données (.env)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=church_management
DB_USERNAME=root
DB_PASSWORD=
```

## 🧪 Tests (À implémenter)

Structure de tests recommandée :

```bash
tests/
├── Feature/
│   ├── MonitorTest.php
│   ├── ChildTest.php
│   ├── ActivityTest.php
│   └── ...
└── Unit/
    ├── Models/
    │   ├── MonitorTest.php
    │   └── ...
    └── Requests/
        ├── StoreMonitorRequestTest.php
        └── ...
```

## 🔐 Sécurité (Recommandations)

Pour la production :

1. **Authentification** - Implémenter Laravel Sanctum
2. **Rate Limiting** - Déjà configuré dans Laravel
3. **Validation stricte** - Déjà implémentée
4. **HTTPS** - À configurer sur le serveur
5. **Variables d'environnement** - Ne jamais commit .env

## 📝 Commandes Utiles

```bash
# Migrations
php artisan migrate                 # Exécuter les migrations
php artisan migrate:fresh          # Réinitialiser la BD
php artisan migrate:rollback       # Annuler la dernière migration

# Cache
php artisan cache:clear            # Vider le cache
php artisan config:clear           # Vider le cache de configuration
php artisan route:clear            # Vider le cache des routes

# Optimisation (Production)
php artisan optimize               # Optimiser l'application
php artisan config:cache           # Mettre en cache la configuration
php artisan route:cache            # Mettre en cache les routes

# Base de données
php artisan db:seed                # Exécuter les seeders
php artisan tinker                 # Console interactive
```

## 📚 Documentation

- **API_DOCUMENTATION.md** - Documentation complète de l'API
- **README_BACKEND.md** - Ce fichier
- Commentaires dans le code source

## 🎓 Technologies Utilisées

- **Laravel 11** - Framework PHP
- **Eloquent ORM** - Gestion de base de données
- **MySQL 8** - Base de données relationnelle
- **PHP 8.2+** - Langage de programmation
- **Composer** - Gestionnaire de dépendances
- **UUID** - Identifiants uniques

## ✅ Checklist d'Implémentation

- [x] Migrations (24 tables)
- [x] Modèles Eloquent (23 modèles)
- [x] Relations entre modèles
- [x] Request Validators (18 validations)
- [x] Controllers API (14 contrôleurs)
- [x] Routes API (60+ endpoints)
- [x] Filtres et recherche
- [x] Pagination
- [x] Statistiques
- [x] Soft Deletes
- [x] UUID Support
- [x] Documentation API
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Authentification (Sanctum)
- [ ] Seeders de données
- [ ] API Rate Limiting personnalisé

## 🚀 Prochaines Étapes

1. **Implémenter l'authentification** avec Laravel Sanctum
2. **Créer des Seeders** pour les données de test
3. **Écrire des tests** unitaires et d'intégration
4. **Ajouter des Jobs** pour les tâches asynchrones
5. **Implémenter les notifications** (email, SMS)
6. **Créer des ressources API** pour formater les réponses
7. **Ajouter la recherche full-text** avec Laravel Scout
8. **Implémenter le versionning** de l'API

## 👥 Contribution

Pour contribuer au projet :
1. Respecter les conventions de code Laravel
2. Écrire des tests pour les nouvelles fonctionnalités
3. Documenter les endpoints API
4. Utiliser les migrations pour toute modification de BD

## 📞 Support

Pour toute question technique, contactez l'équipe de développement.

---

**Développé avec ❤️ pour la gestion d'église**
