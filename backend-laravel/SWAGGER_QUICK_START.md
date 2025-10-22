# ⚡ Swagger Quick Start

## Installation Automatique (Recommandé)

### Windows
```bash
install-swagger.bat
```

### Linux/Mac
```bash
bash install-swagger.sh
```

## Installation Manuelle

```bash
# 1. Installer le package
composer require "darkaonline/l5-swagger"

# 2. Publier la configuration
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"

# 3. Ajouter dans .env
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_CONST_HOST=http://localhost:8000/api/v1

# 4. Générer la documentation
php artisan l5-swagger:generate

# 5. Lancer le serveur
php artisan serve

# 6. Ouvrir dans le navigateur
# http://localhost:8000/api/documentation
```

## 🎯 Ce Qui Est Déjà Fait

✅ **Fichiers de configuration créés**
- `SwaggerController.php` - Définition de base (Info + 14 Tags)
- `MonitorSchema.php` - Schémas Monitor complets
- `ActivitySchema.php` - Schémas Activity complets

✅ **Contrôleur documenté**
- `MonitorController.php` - 100% documenté avec 6 endpoints

✅ **Guides disponibles**
- `SWAGGER_INSTALLATION_GUIDE.md` - Guide complet
- `SWAGGER_EXAMPLES.md` - Templates et exemples
- `SWAGGER_QUICK_START.md` - Ce fichier

## 📝 Endpoints Déjà Documentés

### Monitors
- `GET /monitors` - Liste avec filtres
- `POST /monitors` - Créer
- `GET /monitors/{id}` - Détails
- `PUT /monitors/{id}` - Modifier
- `DELETE /monitors/{id}` - Supprimer
- `GET /monitors-statistics` - Statistiques

## 🚀 Tester Swagger

1. **Installer** (voir ci-dessus)
2. **Lancer le serveur**
   ```bash
   php artisan serve
   ```
3. **Ouvrir dans le navigateur**
   ```
   http://localhost:8000/api/documentation
   ```
4. **Tester** les endpoints Monitor
5. **Documenter** les autres contrôleurs

## 📚 Prochaines Étapes

### Modules à Documenter

- [x] Monitors (Fait ✅)
- [ ] Children
- [ ] Salles
- [ ] Activities
- [ ] Teachings
- [ ] Worship Reports
- [ ] Blog
- [ ] Videos
- [ ] Photos
- [ ] Expenses
- [ ] Payments
- [ ] Presences
- [ ] Cotisations
- [ ] Sorties

### Comment Documenter un Module

1. **Copier** le template de `SWAGGER_EXAMPLES.md`
2. **Créer** le schéma dans `app/Models/Schemas/`
3. **Ajouter** les annotations au contrôleur
4. **Générer** : `php artisan l5-swagger:generate`
5. **Tester** dans Swagger UI

## 🔄 Commandes Utiles

```bash
# Générer la documentation
php artisan l5-swagger:generate

# Générer et vider le cache
php artisan l5-swagger:generate --clear

# Voir la documentation JSON
curl http://localhost:8000/api/documentation/json
```

## 💡 Tips

- **Génération auto** : `L5_SWAGGER_GENERATE_ALWAYS=true` dans `.env`
- **Tests interactifs** : Utilisez "Try it out" dans Swagger UI
- **Export** : Téléchargez le JSON/YAML depuis l'interface
- **Partage** : Partagez l'URL avec votre équipe frontend

## 🎨 Interface Swagger

L'interface Swagger UI vous permet de :
- 📖 Visualiser tous les endpoints
- 🧪 Tester les requêtes en direct
- 📊 Voir les schémas de données
- 📝 Comprendre les validations
- 💾 Exporter la documentation

## ❓ Problèmes Courants

### Page blanche
```bash
php artisan cache:clear
php artisan config:clear
php artisan l5-swagger:generate --clear
```

### Erreur 403
Vérifier les permissions :
```bash
chmod -R 775 storage/
```

### Annotations non reconnues
Vérifier la syntaxe des annotations `@OA\`

## 📞 Support

Pour plus de détails, consultez :
- `SWAGGER_INSTALLATION_GUIDE.md` - Guide complet
- `SWAGGER_EXAMPLES.md` - Templates et exemples
- Documentation officielle : https://github.com/DarkaOnLine/L5-Swagger

---

**🚀 Lancez l'installation et commencez à documenter vos APIs !**
