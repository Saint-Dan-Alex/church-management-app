# Script de configuration automatique de .env.local
Write-Host "🔧 Configuration de l'environnement..." -ForegroundColor Cyan

$envLocalPath = ".env.local"
$templatePath = "env.local.template"

if (Test-Path $envLocalPath) {
    Write-Host "⚠️  Le fichier .env.local existe déjà." -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous le remplacer? (o/n)"
    if ($response -ne "o" -and $response -ne "O") {
        Write-Host "❌ Opération annulée." -ForegroundColor Red
        exit
    }
}

if (Test-Path $templatePath) {
    Copy-Item $templatePath $envLocalPath -Force
    Write-Host "✅ Fichier .env.local créé avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Contenu du fichier:" -ForegroundColor Cyan
    Get-Content $envLocalPath | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "🚀 Vous pouvez maintenant démarrer le frontend avec:" -ForegroundColor Green
    Write-Host "   npm run dev" -ForegroundColor White
} else {
    Write-Host "❌ Fichier template non trouvé: $templatePath" -ForegroundColor Red
    exit 1
}
