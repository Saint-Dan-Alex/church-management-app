@echo off
REM Script d'installation de Swagger pour Laravel (Windows)
REM Usage: install-swagger.bat

echo.
echo ================================================
echo    Installation de Swagger pour Laravel
echo ================================================
echo.

REM Étape 1: Installer le package
echo [1/4] Installation du package L5-Swagger...
call composer require "darkaonline/l5-swagger"

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Echec de l'installation du package
    pause
    exit /b 1
)

echo.
echo [OK] Package installe avec succes
echo.

REM Étape 2: Publier la configuration
echo [2/4] Publication de la configuration...
call php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Echec de la publication de la configuration
    pause
    exit /b 1
)

echo.
echo [OK] Configuration publiee avec succes
echo.

REM Étape 3: Configurer .env
echo [3/4] Configuration des variables d'environnement...

findstr /C:"L5_SWAGGER_GENERATE_ALWAYS" .env >nul 2>&1
if %errorlevel% neq 0 (
    echo. >> .env
    echo # Swagger Configuration >> .env
    echo L5_SWAGGER_GENERATE_ALWAYS=true >> .env
    echo L5_SWAGGER_CONST_HOST=http://localhost:8000/api/v1 >> .env
    echo [OK] Variables ajoutees au fichier .env
) else (
    echo [INFO] Variables Swagger deja presentes dans .env
)

echo.

REM Étape 4: Générer la documentation
echo [4/4] Generation de la documentation...
call php artisan l5-swagger:generate

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Echec de la generation de la documentation
    pause
    exit /b 1
)

echo.
echo [OK] Documentation generee avec succes
echo.

REM Succès
echo ================================================
echo    Installation terminee avec succes !
echo ================================================
echo.
echo Documentation Swagger accessible sur :
echo    http://localhost:8000/api/documentation
echo.
echo Prochaines etapes :
echo    1. Lancer le serveur : php artisan serve
echo    2. Ouvrir : http://localhost:8000/api/documentation
echo    3. Documenter les autres controleurs
echo.
echo ================================================
echo.

pause
