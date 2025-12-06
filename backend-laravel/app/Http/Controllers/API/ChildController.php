<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChildRequest;
use App\Http\Requests\UpdateChildRequest;
use App\Models\Child;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChildController extends Controller
{
    /**
     * @OA\Get(
     *     path="/children",
     *     tags={"Children"},
     *     summary="Liste tous les enfants",
     *     description="Retourne la liste paginée des enfants avec filtres optionnels",
     *     @OA\Parameter(
     *         name="genre",
     *         in="query",
     *         description="Filtrer par genre",
     *         required=false,
     *         @OA\Schema(type="string", enum={"Masculin", "Féminin"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Recherche par nom, prénom ou email",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Nombre d'éléments par page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des enfants récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Child")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Child::query();

        if ($request->has('genre')) {
            $query->where('genre', $request->genre);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $children = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($children);
    }

    /**
     * @OA\Post(
     *     path="/children",
     *     tags={"Children"},
     *     summary="Créer un nouvel enfant",
     *     description="Crée un nouvel enfant avec les données fournies",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreChildRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Enfant créé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Enfant créé avec succès"),
     *             @OA\Property(property="data", ref="#/components/schemas/Child")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StoreChildRequest $request): JsonResponse
    {
        $data = $request->validated();
        $child = new Child($data);
        
        // Calcul automatique de la salle selon l'âge
        $salleInfo = $child->computeSalleForAge();
        $child->salle_id = $salleInfo['salle_id'];
        $child->salle_nom = $salleInfo['salle_nom'];
        
        $child->save();

        return response()->json([
            'message' => 'Enfant créé avec succès',
            'data' => $child
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/children/{id}",
     *     tags={"Children"},
     *     summary="Détails d'un enfant",
     *     description="Retourne les détails d'un enfant",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'enfant",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de l'enfant",
     *         @OA\JsonContent(ref="#/components/schemas/Child")
     *     ),
     *     @OA\Response(response=404, description="Enfant non trouvé")
     * )
     */
    public function show(Child $child): JsonResponse
    {
        return response()->json($child);
    }

    /**
     * @OA\Put(
     *     path="/children/{id}",
     *     tags={"Children"},
     *     summary="Modifier un enfant",
     *     description="Met à jour les informations d'un enfant",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'enfant",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateChildRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Enfant mis à jour avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Child")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Enfant non trouvé"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(UpdateChildRequest $request, Child $child): JsonResponse
    {
        $data = $request->validated();
        $child->fill($data);
        
        // Recalcul automatique de la salle si la date de naissance change (ou toujours)
        $salleInfo = $child->computeSalleForAge();
        $child->salle_id = $salleInfo['salle_id'];
        $child->salle_nom = $salleInfo['salle_nom'];
        
        $child->save();

        return response()->json([
            'message' => 'Enfant mis à jour avec succès',
            'data' => $child
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/children/{id}",
     *     tags={"Children"},
     *     summary="Supprimer un enfant",
     *     description="Supprime (soft delete) un enfant",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'enfant",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Enfant supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Enfant supprimé avec succès")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Enfant non trouvé")
     * )
     */
    public function destroy(Child $child): JsonResponse
    {
        $child->delete();

        return response()->json([
            'message' => 'Enfant supprimé avec succès'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/children-statistics",
     *     tags={"Children"},
     *     summary="Statistiques des enfants",
     *     description="Retourne les statistiques globales des enfants",
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques récupérées avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="garcons", type="integer"),
     *             @OA\Property(property="filles", type="integer"),
     *             @OA\Property(property="ouvriers", type="integer")
     *         )
     *     )
     * )
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Child::count(),
            'garcons' => Child::where('genre', 'Masculin')->count(),
            'filles' => Child::where('genre', 'Féminin')->count(),
            'ouvriers' => Child::where('est_ouvrier', true)->count(),
        ];

        return response()->json($stats);
    }
}
