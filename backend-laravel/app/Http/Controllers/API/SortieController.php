<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieRequest;
use App\Models\Sortie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SortieController extends Controller
{
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

    public function store(StoreSortieRequest $request): JsonResponse
    {
        $sortie = Sortie::create($request->validated());

        return response()->json([
            'message' => 'Sortie enregistrée avec succès',
            'data' => $sortie
        ], 201);
    }

    public function show(Sortie $sortie): JsonResponse
    {
        return response()->json($sortie);
    }

    public function update(StoreSortieRequest $request, Sortie $sortie): JsonResponse
    {
        $sortie->update($request->validated());

        return response()->json([
            'message' => 'Sortie mise à jour avec succès',
            'data' => $sortie
        ]);
    }

    public function destroy(Sortie $sortie): JsonResponse
    {
        $sortie->delete();

        return response()->json([
            'message' => 'Sortie supprimée avec succès'
        ]);
    }

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
