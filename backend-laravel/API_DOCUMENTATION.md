# Church Management API - Documentation

## 📋 Vue d'ensemble

API REST complète pour la gestion d'église développée avec **Laravel 11** et **MySQL**.

### Modules disponibles (12)

1. **Monitors** - Gestion des moniteurs/encadrants
2. **Children** - Gestion des enfants
3. **Salles** - Gestion des salles
4. **Activities** - Gestion des activités et événements
5. **Teachings** - Gestion des enseignements
6. **Worship Reports** - Rapports de culte
7. **Blog** - Articles et témoignages
8. **Videos** - Vidéothèque
9. **Photos** - Photothèque
10. **Expenses** - Dépenses des activités
11. **Payments** - Paiements des participants
12. **Presences** - Présence des moniteurs
13. **Cotisations** - Cotisations des membres
14. **Sorties** - Sorties financières

## 🚀 Installation

### Prérequis

- PHP >= 8.2
- Composer
- MySQL >= 8.0
- Extension PHP : pdo, mbstring, openssl, json, bcmath

### Étapes d'installation

```bash
# 1. Installer les dépendances
composer install

# 2. Copier le fichier d'environnement
copy .env.example .env

# 3. Générer la clé d'application
php artisan key:generate

# 4. Configurer la base de données dans .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=church_management
DB_USERNAME=root
DB_PASSWORD=

# 5. Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE church_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 6. Exécuter les migrations
php artisan migrate

# 7. (Optionnel) Seeder des données de test
php artisan db:seed

# 8. Lancer le serveur
php artisan serve
```

L'API sera accessible sur : `http://localhost:8000/api/v1`

## 📚 Endpoints API

### Base URL
```
http://localhost:8000/api/v1
```

### 1. Monitors

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/monitors` | Liste tous les moniteurs |
| POST | `/monitors` | Créer un moniteur |
| GET | `/monitors/{id}` | Détails d'un moniteur |
| PUT/PATCH | `/monitors/{id}` | Modifier un moniteur |
| DELETE | `/monitors/{id}` | Supprimer un moniteur |
| GET | `/monitors-statistics` | Statistiques globales |

**Filtres disponibles** : `?salle_id=`, `?role=`, `?search=`

### 2. Children

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/children` | Liste tous les enfants |
| POST | `/children` | Créer un enfant |
| GET | `/children/{id}` | Détails d'un enfant |
| PUT/PATCH | `/children/{id}` | Modifier un enfant |
| DELETE | `/children/{id}` | Supprimer un enfant |
| GET | `/children-statistics` | Statistiques globales |

**Filtres disponibles** : `?genre=`, `?search=`

### 3. Salles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/salles` | Liste toutes les salles |
| POST | `/salles` | Créer une salle |
| GET | `/salles/{id}` | Détails d'une salle |
| PUT/PATCH | `/salles/{id}` | Modifier une salle |
| DELETE | `/salles/{id}` | Supprimer une salle |

**Filtres disponibles** : `?actif=true/false`

### 4. Activities

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/activities` | Liste toutes les activités |
| POST | `/activities` | Créer une activité |
| GET | `/activities/{id}` | Détails d'une activité |
| PUT/PATCH | `/activities/{id}` | Modifier une activité |
| DELETE | `/activities/{id}` | Supprimer une activité |
| GET | `/activities/{id}/statistics` | Statistiques de l'activité |

**Filtres disponibles** : `?type=`, `?statut=`, `?date_debut=`, `?date_fin=`

### 5. Teachings

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/teachings` | Liste tous les enseignements |
| POST | `/teachings` | Créer un enseignement |
| GET | `/teachings/{id}` | Détails d'un enseignement |
| DELETE | `/teachings/{id}` | Supprimer un enseignement |

**Filtres disponibles** : `?theme=`, `?date_debut=`, `?date_fin=`

### 6. Worship Reports

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/worship-reports` | Liste tous les rapports |
| POST | `/worship-reports` | Créer un rapport |
| GET | `/worship-reports/{id}` | Détails d'un rapport |
| DELETE | `/worship-reports/{id}` | Supprimer un rapport |
| GET | `/worship-reports-global-statistics` | Statistiques globales |

**Filtres disponibles** : `?salle=`, `?date_debut=`, `?date_fin=`

### 7. Blog

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/blogs` | Liste tous les articles |
| POST | `/blogs` | Créer un article |
| GET | `/blogs/{id}` | Détails d'un article |
| PUT/PATCH | `/blogs/{id}` | Modifier un article |
| DELETE | `/blogs/{id}` | Supprimer un article |
| GET | `/blogs-published` | Articles publiés uniquement |

**Filtres disponibles** : `?status=`, `?category=`, `?search=`

### 8. Videos

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/videos` | Liste toutes les vidéos |
| POST | `/videos` | Créer une vidéo |
| GET | `/videos/{id}` | Détails d'une vidéo |
| PUT/PATCH | `/videos/{id}` | Modifier une vidéo |
| DELETE | `/videos/{id}` | Supprimer une vidéo |
| GET | `/videos-featured` | Vidéos mises en avant |

**Filtres disponibles** : `?category=`, `?is_featured=true/false`

### 9. Photos

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/photos` | Liste toutes les photos |
| POST | `/photos` | Créer une photo |
| GET | `/photos/{id}` | Détails d'une photo |
| PUT/PATCH | `/photos/{id}` | Modifier une photo |
| DELETE | `/photos/{id}` | Supprimer une photo |
| GET | `/photos-albums` | Liste des albums |

**Filtres disponibles** : `?album=`

### 10. Expenses

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/expenses` | Liste toutes les dépenses |
| POST | `/expenses` | Créer une dépense |
| GET | `/expenses/{id}` | Détails d'une dépense |
| PUT/PATCH | `/expenses/{id}` | Modifier une dépense |
| DELETE | `/expenses/{id}` | Supprimer une dépense |
| GET | `/expenses-statistics` | Statistiques financières |

**Filtres disponibles** : `?activity_id=`, `?categorie=`, `?date_debut=`, `?date_fin=`

### 11. Payments

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/payments` | Liste tous les paiements |
| POST | `/payments` | Créer un paiement |
| GET | `/payments/{id}` | Détails d'un paiement |
| PUT/PATCH | `/payments/{id}` | Modifier un paiement |
| DELETE | `/payments/{id}` | Supprimer un paiement |
| GET | `/payments-statistics` | Statistiques de paiement |

**Filtres disponibles** : `?activity_id=`, `?statut=`

### 12. Presences

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/presences` | Liste toutes les présences |
| POST | `/presences` | Enregistrer une présence |
| GET | `/presences/{id}` | Détails d'une présence |
| PUT/PATCH | `/presences/{id}` | Modifier une présence |
| DELETE | `/presences/{id}` | Supprimer une présence |
| GET | `/presences-statistics` | Statistiques de présence |

**Filtres disponibles** : `?activity_id=`, `?moniteur_id=`, `?statut=`

### 13. Cotisations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/cotisations` | Liste toutes les cotisations |
| POST | `/cotisations` | Créer une cotisation |
| GET | `/cotisations/{id}` | Détails d'une cotisation |
| PUT/PATCH | `/cotisations/{id}` | Modifier une cotisation |
| DELETE | `/cotisations/{id}` | Supprimer une cotisation |
| GET | `/cotisations-statistics` | Statistiques financières |

**Filtres disponibles** : `?type_cotisation=`, `?mois=`, `?annee=`, `?date_debut=`, `?date_fin=`

### 14. Sorties

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/sorties` | Liste toutes les sorties |
| POST | `/sorties` | Créer une sortie |
| GET | `/sorties/{id}` | Détails d'une sortie |
| PUT/PATCH | `/sorties/{id}` | Modifier une sortie |
| DELETE | `/sorties/{id}` | Supprimer une sortie |
| GET | `/sorties-statistics` | Statistiques financières |

**Filtres disponibles** : `?categorie=`, `?date_debut=`, `?date_fin=`

## 📝 Exemples de requêtes

### Créer un moniteur

```bash
POST /api/v1/monitors
Content-Type: application/json

{
  "nom": "KABAMBA",
  "post_nom": "MBUYU",
  "prenom": "Jean",
  "date_naissance": "1990-05-15",
  "email": "jean.kabamba@example.com",
  "telephone": "+243900000000",
  "adresse": "Lubumbashi, Congo",
  "baptise_saint_esprit": true,
  "etat_civil": "Marié(e)",
  "date_adhesion": "2020-01-15"
}
```

### Créer une activité payante

```bash
POST /api/v1/activities
Content-Type: application/json

{
  "titre": "Camp de vacances 2025",
  "description": "Camp pour les enfants pendant les vacances",
  "type": "payante",
  "date": "2025-07-15",
  "heure_debut": "09:00",
  "heure_fin": "17:00",
  "lieu": "Centre Kivuli",
  "responsable": "Pastor John",
  "responsable_id": "uuid-here",
  "montant_requis": 50000,
  "devise": "CDF",
  "montant_alternatif": 50,
  "devise_alternative": "USD",
  "statut": "planifiee"
}
```

### Lister les activités avec filtres

```bash
GET /api/v1/activities?type=payante&statut=planifiee&per_page=10
```

## 🔍 Pagination

Toutes les listes sont paginées par défaut (15 éléments par page).

**Paramètres de pagination** :
- `per_page` : Nombre d'éléments par page (max: 100)
- `page` : Numéro de la page

**Exemple** :
```bash
GET /api/v1/monitors?per_page=20&page=2
```

**Réponse** :
```json
{
  "current_page": 2,
  "data": [...],
  "first_page_url": "http://localhost:8000/api/v1/monitors?page=1",
  "from": 21,
  "last_page": 5,
  "last_page_url": "http://localhost:8000/api/v1/monitors?page=5",
  "next_page_url": "http://localhost:8000/api/v1/monitors?page=3",
  "path": "http://localhost:8000/api/v1/monitors",
  "per_page": 20,
  "prev_page_url": "http://localhost:8000/api/v1/monitors?page=1",
  "to": 40,
  "total": 100
}
```

## ⚠️ Gestion des erreurs

L'API retourne des codes HTTP standards :

- `200` : Succès
- `201` : Ressource créée
- `400` : Mauvaise requête
- `404` : Ressource non trouvée
- `422` : Erreur de validation
- `500` : Erreur serveur

**Exemple de réponse d'erreur** :
```json
{
  "message": "Les données fournies sont invalides",
  "errors": {
    "email": [
      "Le champ email est requis."
    ],
    "telephone": [
      "Le format du téléphone est invalide."
    ]
  }
}
```

## 🔐 Sécurité (À implémenter)

Pour la production, il est recommandé d'ajouter :

1. **Authentification Laravel Sanctum**
```bash
php artisan install:api
```

2. **CORS** - Configurer dans `config/cors.php`

3. **Rate Limiting** - Déjà configuré dans Laravel

4. **Validation des permissions** - Utiliser Laravel Policy

## 🧪 Tests

```bash
# Exécuter les tests
php artisan test

# Avec couverture
php artisan test --coverage
```

## 📊 Base de données

### Schéma principal

- **monitors** : Informations des moniteurs
- **children** : Informations des enfants
- **salles** : Salles et classes
- **activities** : Activités et événements
- **activity_participants** : Participants aux activités
- **teachings** : Enseignements
- **worship_reports** : Rapports de culte
- **blogs** : Articles et témoignages
- **videos** : Vidéos
- **photos** : Photos et galeries
- **expenses** : Dépenses des activités
- **payments** : Paiements
- **receipts** : Reçus de paiement
- **presences** : Présences des moniteurs
- **cotisations** : Cotisations des membres
- **sorties** : Sorties financières

## 🛠️ Maintenance

### Commandes utiles

```bash
# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Rafraîchir la base de données
php artisan migrate:fresh

# Optimiser pour la production
php artisan optimize
php artisan config:cache
php artisan route:cache
```

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

## 📄 Licence

Propriété de l'église. Tous droits réservés.
