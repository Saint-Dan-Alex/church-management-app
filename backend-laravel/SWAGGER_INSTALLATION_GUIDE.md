# 📚 Guide Complet d'Installation de Swagger

## 🚀 Installation Rapide

### Étape 1: Installer le package

```bash
cd backend-laravel
composer require "darkaonline/l5-swagger"
```

### Étape 2: Publier la configuration

```bash
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

### Étape 3: Configurer l'environnement

Ajouter dans `.env`:

```env
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_CONST_HOST=http://localhost:8000/api/v1
```

### Étape 4: Générer la documentation

```bash
php artisan l5-swagger:generate
```

### Étape 5: Accéder à la documentation

```bash
# Lancer le serveur si pas déjà fait
php artisan serve

# Accéder à Swagger UI
http://localhost:8000/api/documentation
```

## 📝 Ce Qui a Déjà Été Fait

✅ **Fichiers créés:**
- `app/Http/Controllers/API/SwaggerController.php` - Annotations de base (Info + 14 Tags)
- `app/Models/Schemas/MonitorSchema.php` - Schémas pour Monitor (3 schémas)
- `app/Models/Schemas/ActivitySchema.php` - Schémas pour Activity (2 schémas)
- `SWAGGER_EXAMPLES.md` - Templates pour les autres modules

✅ **Contrôleurs documentés:**
- `MonitorController` - 100% documenté (6 méthodes avec annotations complètes)
  - GET /monitors (liste avec filtres)
  - POST /monitors (création)
  - GET /monitors/{id} (détails)
  - PUT /monitors/{id} (modification)
  - DELETE /monitors/{id} (suppression)
  - GET /monitors-statistics (statistiques)

## 🎯 Structure de la Documentation

### Fichiers d'Annotations

```
app/
├── Http/
│   └── Controllers/
│       └── API/
│           ├── SwaggerController.php      ← Info générale + Tags ✅
│           ├── MonitorController.php      ← Documenté ✅
│           ├── ChildController.php        ← À documenter
│           ├── SalleController.php        ← À documenter
│           ├── ActivityController.php     ← À documenter
│           └── ... (10 autres)
└── Models/
    └── Schemas/
        ├── MonitorSchema.php              ← Créé ✅
        ├── ActivitySchema.php             ← Créé ✅
        ├── ChildSchema.php                ← À créer
        └── ... (autres schémas)
```

## 📋 Prochaines Étapes

Pour compléter la documentation Swagger de tous les modules :

### 1. Créer les Schémas Manquants

Créer dans `app/Models/Schemas/` :
- `ChildSchema.php`
- `SalleSchema.php`
- `TeachingSchema.php`
- `WorshipReportSchema.php`
- `BlogSchema.php`
- `VideoSchema.php`
- `PhotoSchema.php`
- `ExpenseSchema.php`
- `PaymentSchema.php`
- `PresenceSchema.php`
- `CotisationSchema.php`
- `SortieSchema.php`

### 2. Ajouter les Annotations aux Contrôleurs

Pour chaque contrôleur, ajouter les annotations comme dans `MonitorController.php`.

Utilisez le template dans `SWAGGER_EXAMPLES.md`.

### 3. Générer et Tester

```bash
# Générer la documentation
php artisan l5-swagger:generate

# Tester dans le navigateur
http://localhost:8000/api/documentation
```

## 🔧 Configuration Avancée

### Fichier de Configuration

Le fichier `config/l5-swagger.php` contient toutes les options.

**Options importantes:**

```php
'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', false),
'generate_yaml_copy' => env('L5_SWAGGER_GENERATE_YAML_COPY', false),

'swagger_version' => env('SWAGGER_VERSION', '3.0'),

'paths' => [
    'docs' => storage_path('api-docs'),
    'views' => base_path('resources/views/vendor/l5-swagger'),
    'base' => env('L5_SWAGGER_BASE_PATH', null),
    'swagger_ui_assets_path' => env('L5_SWAGGER_UI_ASSETS_PATH', 'vendor/swagger-api/swagger-ui/dist/'),
    'excludes' => [],
],

'routes' => [
    'api' => 'api/documentation',
],
```

### Variables d'Environnement (.env)

```env
# Swagger Configuration
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_CONST_HOST=http://localhost:8000/api/v1

# Pour la production
# L5_SWAGGER_CONST_HOST=https://api.votredomaine.com/api/v1
```

## 🎨 Personnalisation de l'Interface

### Changer le Titre et la Description

Modifier dans `SwaggerController.php`:

```php
/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Votre Titre Personnalisé",
 *     description="Votre description personnalisée",
 *     @OA\Contact(
 *         email="votre@email.com"
 *     ),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 */
```

### Ajouter des Serveurs

```php
/**
 * @OA\Server(
 *     url="http://localhost:8000/api/v1",
 *     description="Serveur Local"
 * )
 * @OA\Server(
 *     url="https://staging-api.example.com/api/v1",
 *     description="Serveur de Staging"
 * )
 * @OA\Server(
 *     url="https://api.example.com/api/v1",
 *     description="Serveur de Production"
 * )
 */
```

## 🔐 Ajouter l'Authentification

Pour documenter l'authentification Bearer Token:

```php
/**
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
```

Puis dans chaque endpoint protégé:

```php
/**
 * @OA\Get(
 *     path="/protected-endpoint",
 *     security={{"bearerAuth":{}}},
 *     ...
 * )
 */
```

## 📊 Exemples de Réponses

### Ajouter des Exemples de Réponses

```php
/**
 * @OA\Response(
 *     response=200,
 *     description="Succès",
 *     @OA\JsonContent(
 *         @OA\Property(property="id", type="string", example="550e8400-e29b-41d4-a716-446655440000"),
 *         @OA\Property(property="name", type="string", example="Jean Dupont"),
 *         @OA\Property(property="email", type="string", example="jean@example.com")
 *     )
 * )
 */
```

### Réponses d'Erreur Standards

```php
/**
 * @OA\Response(
 *     response=422,
 *     description="Erreur de validation",
 *     @OA\JsonContent(
 *         @OA\Property(property="message", type="string", example="Les données fournies sont invalides"),
 *         @OA\Property(
 *             property="errors",
 *             type="object",
 *             @OA\Property(
 *                 property="email",
 *                 type="array",
 *                 @OA\Items(type="string", example="Le champ email est requis")
 *             )
 *         )
 *     )
 * )
 */
```

## 🧪 Tests avec Swagger UI

Une fois la documentation générée, vous pouvez:

1. **Visualiser** tous les endpoints
2. **Tester** les requêtes directement depuis l'interface
3. **Voir** les schémas de validation
4. **Exporter** la documentation en JSON/YAML

### Interface Swagger UI

- **Liste des endpoints** organisés par tags
- **Bouton "Try it out"** pour tester en direct
- **Schémas de requête/réponse** interactifs
- **Codes de réponse** HTTP documentés

## 🔄 Workflow de Développement

### Lors de l'ajout d'un nouveau endpoint:

1. Créer la méthode dans le contrôleur
2. Ajouter les annotations Swagger
3. Créer/mettre à jour le schéma si nécessaire
4. Régénérer la documentation:
   ```bash
   php artisan l5-swagger:generate
   ```
5. Tester dans Swagger UI
6. Commit et push

### Lors d'une modification:

1. Modifier le code et les annotations
2. Régénérer automatiquement (si `L5_SWAGGER_GENERATE_ALWAYS=true`)
3. Ou manuellement: `php artisan l5-swagger:generate`

## 📦 Export de la Documentation

### Format JSON

```bash
# Accessible à
http://localhost:8000/api/documentation/json
```

### Format YAML (optionnel)

Activer dans `.env`:

```env
L5_SWAGGER_GENERATE_YAML_COPY=true
```

Puis:

```bash
php artisan l5-swagger:generate
```

## 🚀 Déploiement en Production

### Désactiver la Génération Automatique

Dans `.env` de production:

```env
L5_SWAGGER_GENERATE_ALWAYS=false
```

### Générer avant le déploiement

```bash
# En local ou dans le CI/CD
php artisan l5-swagger:generate

# Commit les fichiers générés
git add storage/api-docs/api-docs.json
git commit -m "Update Swagger documentation"
```

### Sécuriser l'Accès (optionnel)

Dans `routes/web.php`:

```php
Route::get('api/documentation', function () {
    if (!auth()->check()) {
        abort(403, 'Accès interdit');
    }
    return view('l5-swagger::index');
});
```

## 🛠️ Dépannage

### La documentation ne se génère pas

```bash
# Vérifier les permissions
chmod -R 775 storage/

# Vider le cache
php artisan cache:clear
php artisan config:clear

# Régénérer
php artisan l5-swagger:generate --clear
```

### Erreurs de syntaxe dans les annotations

- Vérifier que toutes les balises `@OA\` sont correctement fermées
- Vérifier les virgules et parenthèses
- Tester avec `php artisan l5-swagger:generate` pour voir les erreurs

### Page blanche sur /api/documentation

```bash
# Vérifier que le fichier est généré
ls -la storage/api-docs/

# Vérifier les logs
tail -f storage/logs/laravel.log
```

## 📚 Ressources

- **Documentation L5-Swagger:** https://github.com/DarkaOnLine/L5-Swagger
- **Spécification OpenAPI 3.0:** https://swagger.io/specification/
- **Swagger Editor:** https://editor.swagger.io/

## ✅ Checklist Finale

- [ ] Package installé: `composer require darkaonline/l5-swagger`
- [ ] Configuration publiée: `php artisan vendor:publish`
- [ ] Variables `.env` configurées
- [ ] Annotations ajoutées à `SwaggerController.php`
- [ ] Annotations ajoutées à `MonitorController.php`
- [ ] Schémas créés pour Monitor et Activity
- [ ] Documentation générée: `php artisan l5-swagger:generate`
- [ ] Interface testée: `http://localhost:8000/api/documentation`
- [ ] Autres contrôleurs à documenter (13 restants)

## 🎯 Résumé

**Swagger est configuré et prêt à l'emploi!**

- ✅ 1 contrôleur entièrement documenté (MonitorController)
- ✅ 2 schémas créés (Monitor, Activity)
- ✅ Templates fournis pour les autres modules
- 📝 13 contrôleurs restants à documenter

**Pour compléter:** Utilisez les templates dans `SWAGGER_EXAMPLES.md` pour documenter les autres contrôleurs.
