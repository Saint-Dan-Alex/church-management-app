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

    public function store(StoreSalleRequest $request): JsonResponse
    {
        $salle = Salle::create($request->validated());

        return response()->json([
            'message' => 'Salle créée avec succès',
            'data' => $salle
        ], 201);
    }

    public function show(Salle $salle): JsonResponse
    {
        $salle->load(['responsable', 'adjoint', 'moniteurs', 'historique']);
        
        return response()->json($salle);
    }

    public function update(UpdateSalleRequest $request, Salle $salle): JsonResponse
    {
        $salle->update($request->validated());

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'data' => $salle
        ]);
    }

    public function destroy(Salle $salle): JsonResponse
    {
        $salle->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès'
        ]);
    }
}
