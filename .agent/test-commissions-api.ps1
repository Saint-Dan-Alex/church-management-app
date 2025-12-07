# Test du système de commissions

## Test 1: Récupérer toutes les commissions
Write-Host "Test 1: GET /api/v1/commissions" -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/commissions" -Method GET
Write-Host "Commissions trouvées: $($response.Count)" -ForegroundColor Green
$response | Format-Table -Property nom, description

## Test 2: Créer une nouvelle commission
Write-Host "`nTest 2: POST /api/v1/commissions" -ForegroundColor Cyan
$newCommission = @{
    nom = "Média et Communication"
    description = "Commission de gestion des médias et de la communication"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/commissions" -Method POST -Body $newCommission -ContentType "application/json"
    Write-Host "Commission créée avec succès!" -ForegroundColor Green
    Write-Host "ID: $($created.id)"
    Write-Host "Nom: $($created.nom)"
    Write-Host "Description: $($created.description)"
} catch {
    Write-Host "Erreur lors de la création: $($_.Exception.Message)" -ForegroundColor Red
}

## Test 3: Vérifier que la commission a été ajoutée
Write-Host "`nTest 3: Vérification de l'ajout" -ForegroundColor Cyan
$response2 = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/commissions" -Method GET
Write-Host "Nombre total de commissions: $($response2.Count)" -ForegroundColor Green
$response2 | Format-Table -Property nom, description

Write-Host "`nTests terminés!" -ForegroundColor Green
