# Installation et Configuration Swagger pour Laravel

## 📦 Installation

### 1. Installer le package L5-Swagger

```bash
composer require "darkaonline/l5-swagger"
```

### 2. Publier la configuration

```bash
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

### 3. Générer la documentation

```bash
php artisan l5-swagger:generate
```

## 🔧 Configuration

Le fichier de configuration se trouve dans `config/l5-swagger.php`

### Configuration de base (.env)

```env
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_CONST_HOST=http://localhost:8000/api/v1
```

## 🌐 Accès à la Documentation

Une fois configuré, accédez à la documentation Swagger :

```
http://localhost:8000/api/documentation
```

## 📝 Structure des Annotations

Les annotations OpenAPI sont ajoutées directement dans les contrôleurs avec des commentaires PHPDoc.

## ✅ Étapes d'Installation Complète

```bash
# 1. Installer le package
composer require "darkaonline/l5-swagger"

# 2. Publier la configuration
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"

# 3. Générer la documentation
php artisan l5-swagger:generate

# 4. Lancer le serveur
php artisan serve

# 5. Accéder à la documentation
# Ouvrir http://localhost:8000/api/documentation dans le navigateur
```

## 🎯 Fonctionnalités Swagger

- ✅ Interface interactive pour tester les endpoints
- ✅ Documentation auto-générée à partir des annotations
- ✅ Schémas de validation visibles
- ✅ Exemples de requêtes/réponses
- ✅ Support de l'authentification
- ✅ Export en JSON/YAML

## 🔄 Regénérer la Documentation

Après avoir modifié les annotations :

```bash
php artisan l5-swagger:generate
```

Ou activer la génération automatique dans `.env` :

```env
L5_SWAGGER_GENERATE_ALWAYS=true
```
