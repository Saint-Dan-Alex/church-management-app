# 📦 INSTALLATION DU BACKEND LARAVEL

## 🚀 Étape 1 : Créer le projet Laravel

```bash
# Créer le projet
composer create-project laravel/laravel backend-laravel

cd backend-laravel
```

## 📝 Étape 2 : Installer les dépendances

```bash
# Laravel Sanctum pour l'authentification API
composer require laravel/sanctum

# Spatie Laravel Permission pour les rôles et permissions
composer require spatie/laravel-permission

# Laravel Debugbar (dev)
composer require barryvdh/laravel-debugbar --dev
```

## ⚙️ Étape 3 : Configuration

### 3.1 Configurer `.env`

```env
APP_NAME="Church Management API"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=church_management
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DRIVER=cookie
```

### 3.2 Générer la clé d'application

```bash
php artisan key:generate
```

### 3.3 Publier les configurations

```bash
# Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Permissions
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

## 🗄️ Étape 4 : Base de données

### 4.1 Créer la base de données

```sql
CREATE DATABASE church_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4.2 Copier les migrations

Copiez tous les fichiers de migration depuis:
```
backend-laravel/database/migrations/
```

### 4.3 Exécuter les migrations

```bash
php artisan migrate
```

## 📂 Étape 5 : Copier les fichiers du backend

### 5.1 Models
Copiez les fichiers depuis `app/Models/`:
- User.php
- Monitor.php  
- Child.php
- Room.php
- WorshipSession.php
- Activity.php
- Teaching.php
- BlogPost.php
- Video.php
- Photo.php
- PhotoAlbum.php
- (+ autres models)

### 5.2 Controllers
Copiez les fichiers depuis `app/Http/Controllers/`:
- MonitorController.php
- ChildController.php
- WorshipController.php
- RoomController.php
- ActivityController.php
- TeachingController.php
- BlogController.php
- VideoController.php
- PhotoController.php
- UserController.php
- DashboardController.php
- ReportController.php

### 5.3 Requests (Validation)
Créez le dossier `app/Http/Requests/` et copiez:
- StoreMonitorRequest.php
- UpdateMonitorRequest.php
- (+ autres requests)

### 5.4 Resources (API Transform)
Créez le dossier `app/Http/Resources/` et copiez:
- MonitorResource.php
- ChildResource.php
- (+ autres resources)

## 🛣️ Étape 6 : Routes API

Remplacez le contenu de `routes/api.php` par:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    MonitorController,
    ChildController,
    WorshipController,
    RoomController,
    ActivityController,
    TeachingController,
    BlogController,
    VideoController,
    PhotoController,
    UserController,
    DashboardController,
    ReportController
};

// Public routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // User
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);
    
    // Monitors
    Route::apiResource('monitors', MonitorController::class);
    
    // Children
    Route::apiResource('children', ChildController::class);
    
    // Worship
    Route::apiResource('worship', WorshipController::class);
    Route::get('worship/{id}/attendances', [WorshipController::class, 'attendances']);
    Route::post('worship/{id}/mark-attendance', [WorshipController::class, 'markAttendance']);
    
    // Rooms
    Route::apiResource('rooms', RoomController::class);
    
    // Activities
    Route::apiResource('activities', ActivityController::class);
    Route::get('activities/{id}/participants', [ActivityController::class, 'participants']);
    Route::post('activities/{id}/register', [ActivityController::class, 'registerParticipant']);
    
    // Teachings
    Route::apiResource('teachings', TeachingController::class);
    
    // Blog
    Route::apiResource('blog', BlogController::class);
    
    // Videos
    Route::apiResource('videos', VideoController::class);
    
    // Photos
    Route::apiResource('photos', PhotoController::class);
    Route::apiResource('photo-albums', PhotoAlbumController::class);
    
    // Users
    Route::apiResource('users', UserController::class);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent', [DashboardController::class, 'recent']);
    
    // Reports
    Route::get('/reports/monitors', [ReportController::class, 'monitors']);
    Route::get('/reports/children', [ReportController::class, 'children']);
    Route::get('/reports/attendance', [ReportController::class, 'attendance']);
    Route::get('/reports/activities', [ReportController::class, 'activities']);
});
```

## 🌱 Étape 7 : Seeders (Données de test)

```bash
# Créer les seeders
php artisan make:seeder UsersTableSeeder
php artisan make:seeder MonitorsTableSeeder
php artisan make:seeder ChildrenTableSeeder

# Exécuter les seeders
php artisan db:seed
```

## 🔐 Étape 8 : Configuration CORS

Dans `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## ✅ Étape 9 : Lancer le serveur

```bash
php artisan serve
```

L'API sera disponible sur : `http://localhost:8000`

## 🧪 Étape 10 : Tester l'API

### Test avec curl

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get Monitors (avec token)
curl -X GET http://localhost:8000/api/monitors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test avec Postman

1. Importer la collection depuis `postman/Church-Management-API.json`
2. Configurer l'environnement avec `baseUrl` = `http://localhost:8000/api`
3. Login pour obtenir le token
4. Utiliser le token dans les autres requêtes

## 📚 Documentation API

Une fois le serveur lancé, la documentation est disponible sur:
- Swagger UI: `http://localhost:8000/api/documentation`
- OpenAPI JSON: `http://localhost:8000/api/documentation.json`

## 🔧 Commandes utiles

```bash
# Effacer et recréer la base de données
php artisan migrate:fresh

# Avec seeders
php artisan migrate:fresh --seed

# Créer un cache de configuration
php artisan config:cache

# Effacer tous les caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Créer un lien symbolique pour le storage
php artisan storage:link
```

## 🐛 Troubleshooting

### Erreur: "SQLSTATE[HY000] [2002] Connection refused"
- Vérifiez que MySQL est démarré
- Vérifiez les credentials dans `.env`

### Erreur: "No application encryption key has been specified"
```bash
php artisan key:generate
```

### Erreur CORS
- Vérifiez `config/cors.php`
- Vérifiez que Sanctum est correctement configuré
- Redémarrez le serveur après modifications

## ✨ Prêt !

Votre backend Laravel est maintenant opérationnel ! 🎉

Pour connecter le frontend Next.js, utilisez:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```
