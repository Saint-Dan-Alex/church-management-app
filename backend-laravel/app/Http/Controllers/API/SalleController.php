<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSalleRequest;
use App\Http\Requests\UpdateSalleRequest;
use App\Models\Salle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/salles",
     *     tags={"Salles"},
     *     summary="Liste toutes les salles",
     *     description="Retourne la liste paginée des salles avec leurs responsables",
     *     @OA\Parameter(
     *         name="actif",
     *         in="query",
     *         description="Filtrer par statut actif",
     *         required=false,
     *         @OA\Schema(type="boolean")
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
     *         description="Liste des salles récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Salle")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Salle::with(['responsable', 'adjoint', 'moniteurs']);

        if ($request->has('actif')) {
            $query->where('actif', $request->boolean('actif'));
        }

        $perPage = $request->get('per_page', 15);
        $salles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($salles);
    }

    /**
     * @OA\Post(
     *     path="/salles",
     *     tags={"Salles"},
     *     summary="Créer une nouvelle salle",
     *     description="Crée une nouvelle salle avec les données fournies",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreSalleRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Salle créée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Salle créée avec succès"),
     *             @OA\Property(property="data", ref="#/components/schemas/Salle")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StoreSalleRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        $moniteursIds = $data['moniteurs_ids'] ?? [];
        unset($data['moniteurs_ids']);

        $salle = Salle::create($data);

        // Association des moniteurs
        if (!empty($moniteursIds)) {
            \App\Models\Monitor::whereIn('id', $moniteursIds)->update([
                'salle_actuelle_id' => $salle->id,
                'salle_actuelle_nom' => $salle->nom,
                'date_affectation_actuelle' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Salle créée avec succès',
            'data' => $salle
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/salles/{id}",
     *     tags={"Salles"},
     *     summary="Détails d'une salle",
     *     description="Retourne les détails d'une salle avec ses relations",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la salle",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de la salle",
     *         @OA\JsonContent(ref="#/components/schemas/Salle")
     *     ),
     *     @OA\Response(response=404, description="Salle non trouvée")
     * )
     */
    public function show(Salle $salle): JsonResponse
    {
        $salle->load(['responsable', 'adjoint', 'moniteurs', 'historique']);
        
        return response()->json($salle);
    }

    /**
     * @OA\Put(
     *     path="/salles/{id}",
     *     tags={"Salles"},
     *     summary="Modifier une salle",
     *     description="Met à jour les informations d'une salle",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la salle",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateSalleRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle mise à jour avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Salle")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Salle non trouvée"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(UpdateSalleRequest $request, Salle $salle): JsonResponse
    {
        $salle->update($request->validated());

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'data' => $salle
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/salles/{id}",
     *     tags={"Salles"},
     *     summary="Supprimer une salle",
     *     description="Supprime (soft delete) une salle",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la salle",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle supprimée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Salle supprimée avec succès")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Salle non trouvée")
     * )
     */
    public function destroy(Salle $salle): JsonResponse
    {
        $salle->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès'
        ]);
    }
}
