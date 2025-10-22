# Configuration des variables d'environnement

## Frontend (Next.js)

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
# API Backend Laravel
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1

# Autres variables si nécessaire
# NEXT_PUBLIC_APP_NAME=Church Management
```

## Backend (Laravel)

Le fichier `.env` existe déjà dans `backend-laravel/.env`

Vérifiez que ces variables sont correctement configurées :

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=church_management
DB_USERNAME=root
DB_PASSWORD=

# CORS est déjà configuré dans config/cors.php
```

## Démarrage

### Backend
```bash
cd backend-laravel
php artisan serve --host=127.0.0.1 --port=8000
```

### Frontend
```bash
npm run dev
# ou
yarn dev
```

## Test de connexion

Une fois les deux serveurs démarrés, testez l'API :

```bash
# Health check
curl http://127.0.0.1:8000/api/health

# Liste des moniteurs
curl http://127.0.0.1:8000/api/v1/monitors

# Statistiques des enfants
curl http://127.0.0.1:8000/api/v1/children-statistics
```

## Fichiers créés

- `lib/utils/api.ts` - Client HTTP pour consommer l'API
- `lib/types/api.ts` - Types TypeScript pour les entités
- `backend-laravel/config/cors.php` - Configuration CORS
- `backend-laravel/bootstrap/app.php` - Routes API activées

## Prochaines étapes

1. Créer `.env.local` manuellement (non versionné)
2. Démarrer les deux serveurs
3. Tester la connexion avec un composant exemple
