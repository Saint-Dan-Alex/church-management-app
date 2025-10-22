<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieRequest;
use App\Models\Sortie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SortieController extends Controller
{
    /**
     * @OA\Get(path="/sorties", tags={"Sorties"}, summary="Liste toutes les sorties financières",
     *     @OA\Parameter(name="categorie", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Liste récupérée"))
     */
    public function index(Request $request): JsonResponse
    {
        $query = Sortie::query();

        if ($request->has('categorie')) {
            $query->byCategory($request->categorie);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->byPeriod($request->date_debut, $request->date_fin);
        }

        $perPage = $request->get('per_page', 15);
        $sorties = $query->orderBy('date_sortie', 'desc')->paginate($perPage);

        return response()->json($sorties);
    }

    /** @OA\Post(path="/sorties", tags={"Sorties"}, summary="Enregistrer une sortie", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreSortieRequest")), @OA\Response(response=201, description="Sortie enregistrée"), @OA\Response(response=422, description="Erreur de validation")) */
    public function store(StoreSortieRequest $request): JsonResponse
    {
        $sortie = Sortie::create($request->validated());

        return response()->json([
            'message' => 'Sortie enregistrée avec succès',
            'data' => $sortie
        ], 201);
    }

    /** @OA\Get(path="/sorties/{id}", tags={"Sorties"}, summary="Détails d'une sortie", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvée")) */
    public function show(Sortie $sortie): JsonResponse
    {
        return response()->json($sortie);
    }

    /** @OA\Put(path="/sorties/{id}", tags={"Sorties"}, summary="Modifier une sortie", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreSortieRequest")), @OA\Response(response=200, description="Mise à jour"), @OA\Response(response=404, description="Non trouvée")) */
    public function update(StoreSortieRequest $request, Sortie $sortie): JsonResponse
    {
        $sortie->update($request->validated());

        return response()->json([
            'message' => 'Sortie mise à jour avec succès',
            'data' => $sortie
        ]);
    }

    /** @OA\Delete(path="/sorties/{id}", tags={"Sorties"}, summary="Supprimer une sortie", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimée"), @OA\Response(response=404, description="Non trouvée")) */
    public function destroy(Sortie $sortie): JsonResponse
    {
        $sortie->delete();

        return response()->json([
            'message' => 'Sortie supprimée avec succès'
        ]);
    }

    /** @OA\Get(path="/sorties-statistics", tags={"Sorties"}, summary="Statistiques des sorties", @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Response(response=200, description="Statistiques", @OA\JsonContent(@OA\Property(property="total_sorties", type="integer"), @OA\Property(property="total_cdf", type="number"), @OA\Property(property="total_usd", type="number")))) */
    public function statistics(Request $request): JsonResponse
    {
        $query = Sortie::query();

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->byPeriod($request->date_debut, $request->date_fin);
        }

        $stats = [
            'total_sorties' => $query->count(),
            'total_cdf' => $query->where('devise', 'CDF')->sum('montant'),
            'total_usd' => $query->where('devise', 'USD')->sum('montant'),
        ];

        return response()->json($stats);
    }
}
