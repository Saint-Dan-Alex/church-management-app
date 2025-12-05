<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCotisationRequest;
use App\Models\Cotisation;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CotisationController extends Controller
{
    /**
     * @OA\Get(path="/cotisations", tags={"Cotisations"}, summary="Liste toutes les cotisations",
     *     @OA\Parameter(name="type_cotisation", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="mois", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="annee", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Liste récupérée"))
     */
    public function index(Request $request): JsonResponse
    {
        $query = Cotisation::query();

        if ($request->has('type_cotisation')) {
            $query->byType($request->type_cotisation);
        }

        if ($request->has('mois') && $request->has('annee')) {
            $query->byMonth($request->mois, $request->annee);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date_cotisation', [$request->date_debut, $request->date_fin]);
        }

        $perPage = $request->get('per_page', 15);
        $cotisations = $query->orderBy('date_cotisation', 'desc')->paginate($perPage);

        return response()->json($cotisations);
    }

    /** @OA\Post(path="/cotisations", tags={"Cotisations"}, summary="Enregistrer une cotisation", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreCotisationRequest")), @OA\Response(response=201, description="Cotisation enregistrée"), @OA\Response(response=422, description="Erreur de validation")) */
    public function store(StoreCotisationRequest $request): JsonResponse
    {
        $cotisation = Cotisation::create($request->validated());

        // Créer une notification
        NotificationService::notifyCotisation(
            auth()->id() ?? 1,
            [
                'id' => $cotisation->id,
                'membre_nom' => $cotisation->membre_nom,
                'montant' => $cotisation->montant,
                'devise' => $cotisation->devise,
                'mois' => $cotisation->mois,
                'annee' => $cotisation->annee,
            ]
        );

        return response()->json([
            'message' => 'Cotisation enregistrée avec succès',
            'data' => $cotisation
        ], 201);
    }

    /** @OA\Get(path="/cotisations/{id}", tags={"Cotisations"}, summary="Détails d'une cotisation", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvée")) */
    public function show(Cotisation $cotisation): JsonResponse
    {
        return response()->json($cotisation);
    }

    /** @OA\Put(path="/cotisations/{id}", tags={"Cotisations"}, summary="Modifier une cotisation", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreCotisationRequest")), @OA\Response(response=200, description="Mise à jour"), @OA\Response(response=404, description="Non trouvée")) */
    public function update(StoreCotisationRequest $request, Cotisation $cotisation): JsonResponse
    {
        $cotisation->update($request->validated());

        return response()->json([
            'message' => 'Cotisation mise à jour avec succès',
            'data' => $cotisation
        ]);
    }

    /** @OA\Delete(path="/cotisations/{id}", tags={"Cotisations"}, summary="Supprimer une cotisation", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimée"), @OA\Response(response=404, description="Non trouvée")) */
    public function destroy(Cotisation $cotisation): JsonResponse
    {
        $cotisation->delete();

        return response()->json([
            'message' => 'Cotisation supprimée avec succès'
        ]);
    }

    /** @OA\Get(path="/cotisations-statistics", tags={"Cotisations"}, summary="Statistiques des cotisations", @OA\Parameter(name="mois", in="query", required=false, @OA\Schema(type="string")), @OA\Parameter(name="annee", in="query", required=false, @OA\Schema(type="string")), @OA\Response(response=200, description="Statistiques", @OA\JsonContent(@OA\Property(property="total_cotisations", type="integer"), @OA\Property(property="total_cdf", type="number"), @OA\Property(property="total_usd", type="number")))) */
    public function statistics(Request $request): JsonResponse
    {
        $query = Cotisation::query();

        if ($request->has('mois') && $request->has('annee')) {
            $query->byMonth($request->mois, $request->annee);
        }

        $stats = [
            'total_cotisations' => $query->count(),
            'total_cdf' => $query->where('devise', 'CDF')->sum('montant'),
            'total_usd' => $query->where('devise', 'USD')->sum('montant'),
        ];

        return response()->json($stats);
    }
}
