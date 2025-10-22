#!/bin/bash

# Script d'installation de Swagger pour Laravel
# Usage: bash install-swagger.sh

echo "🚀 Installation de Swagger pour Church Management API"
echo "=================================================="
echo ""

# Étape 1: Installer le package
echo "📦 Étape 1/4 : Installation du package L5-Swagger..."
composer require "darkaonline/l5-swagger"

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation du package"
    exit 1
fi

echo "✅ Package installé avec succès"
echo ""

# Étape 2: Publier la configuration
echo "⚙️  Étape 2/4 : Publication de la configuration..."
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la publication de la configuration"
    exit 1
fi

echo "✅ Configuration publiée avec succès"
echo ""

# Étape 3: Configurer .env
echo "🔧 Étape 3/4 : Configuration des variables d'environnement..."

if ! grep -q "L5_SWAGGER_GENERATE_ALWAYS" .env; then
    echo "" >> .env
    echo "# Swagger Configuration" >> .env
    echo "L5_SWAGGER_GENERATE_ALWAYS=true" >> .env
    echo "L5_SWAGGER_CONST_HOST=http://localhost:8000/api/v1" >> .env
    echo "✅ Variables ajoutées au fichier .env"
else
    echo "⚠️  Variables Swagger déjà présentes dans .env"
fi

echo ""

# Étape 4: Générer la documentation
echo "📚 Étape 4/4 : Génération de la documentation..."
php artisan l5-swagger:generate

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération de la documentation"
    exit 1
fi

echo "✅ Documentation générée avec succès"
echo ""

# Succès
echo "=================================================="
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📖 Accédez à la documentation Swagger :"
echo "   http://localhost:8000/api/documentation"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Lancer le serveur : php artisan serve"
echo "   2. Ouvrir : http://localhost:8000/api/documentation"
echo "   3. Documenter les autres contrôleurs (voir SWAGGER_EXAMPLES.md)"
echo ""
echo "✨ Happy coding!"
echo "=================================================="
