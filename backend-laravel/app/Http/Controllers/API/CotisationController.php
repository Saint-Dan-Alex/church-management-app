<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCotisationRequest;
use App\Models\Cotisation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CotisationController extends Controller
{
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

    public function store(StoreCotisationRequest $request): JsonResponse
    {
        $cotisation = Cotisation::create($request->validated());

        return response()->json([
            'message' => 'Cotisation enregistrée avec succès',
            'data' => $cotisation
        ], 201);
    }

    public function show(Cotisation $cotisation): JsonResponse
    {
        return response()->json($cotisation);
    }

    public function update(StoreCotisationRequest $request, Cotisation $cotisation): JsonResponse
    {
        $cotisation->update($request->validated());

        return response()->json([
            'message' => 'Cotisation mise à jour avec succès',
            'data' => $cotisation
        ]);
    }

    public function destroy(Cotisation $cotisation): JsonResponse
    {
        $cotisation->delete();

        return response()->json([
            'message' => 'Cotisation supprimée avec succès'
        ]);
    }

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
