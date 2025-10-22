# Exemples d'Annotations Swagger

Ce document montre comment ajouter des annotations Swagger aux contrôleurs restants.

## Template pour un Contrôleur Complet

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExampleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/examples",
     *     tags={"Examples"},
     *     summary="Liste tous les exemples",
     *     description="Retourne la liste paginée des exemples",
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Nombre d'éléments par page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Example")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        // Implementation
    }

    /**
     * @OA\Post(
     *     path="/examples",
     *     tags={"Examples"},
     *     summary="Créer un exemple",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreExampleRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Exemple créé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Example")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        // Implementation
    }

    /**
     * @OA\Get(
     *     path="/examples/{id}",
     *     tags={"Examples"},
     *     summary="Détails d'un exemple",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails récupérés",
     *         @OA\JsonContent(ref="#/components/schemas/Example")
     *     ),
     *     @OA\Response(response=404, description="Non trouvé")
     * )
     */
    public function show(string $id): JsonResponse
    {
        // Implementation
    }

    /**
     * @OA\Put(
     *     path="/examples/{id}",
     *     tags={"Examples"},
     *     summary="Modifier un exemple",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateExampleRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Exemple mis à jour",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Example")
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Implementation
    }

    /**
     * @OA\Delete(
     *     path="/examples/{id}",
     *     tags={"Examples"},
     *     summary="Supprimer un exemple",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        // Implementation
    }
}
```

## Template pour un Schéma

```php
<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Example",
 *     type="object",
 *     title="Example",
 *     description="Modèle d'exemple",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="name", type="string", example="Mon Exemple"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="status", type="string", enum={"active", "inactive"}),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreExampleRequest",
 *     type="object",
 *     required={"name"},
 *     @OA\Property(property="name", type="string", example="Mon Exemple"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="status", type="string", enum={"active", "inactive"}, example="active")
 * )
 */
class ExampleSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
```

## Instructions pour Ajouter Swagger aux Autres Contrôleurs

1. **Copier le template** ci-dessus
2. **Remplacer** "Example" par le nom du module
3. **Adapter les paramètres** selon les besoins
4. **Créer le schéma** correspondant dans `app/Models/Schemas/`
5. **Générer la documentation** : `php artisan l5-swagger:generate`

## Modules à Documenter

- [x] MonitorController (Fait)
- [ ] ChildController
- [ ] SalleController
- [ ] ActivityController (Schéma créé)
- [ ] TeachingController
- [ ] WorshipReportController
- [ ] BlogController
- [ ] VideoController
- [ ] PhotoController
- [ ] ExpenseController
- [ ] PaymentController
- [ ] PresenceController
- [ ] CotisationController
- [ ] SortieController

## Commandes Utiles

```bash
# Générer la documentation
php artisan l5-swagger:generate

# Publier la configuration (si pas déjà fait)
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"

# Vider le cache de la documentation
php artisan l5-swagger:generate --clear
```

## Accès à la Documentation

Une fois généré:
- Interface Swagger UI : `http://localhost:8000/api/documentation`
- JSON OpenAPI : `http://localhost:8000/api/documentation/json`
