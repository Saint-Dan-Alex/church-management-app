<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCotisationRequest;
use App\Models\Cotisation;
use App\Models\CotisationType;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CotisationController extends Controller
{
    /**
     * Liste toutes les cotisations
     */
    public function index(Request $request): JsonResponse
    {
        $query = Cotisation::with('type');

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

    /**
     * Enregistrer une cotisation
     */
    public function store(StoreCotisationRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Gérer le type dynamiquement
        if (isset($data['type_cotisation'])) {
            $data['cotisation_type_id'] = $this->handleType($data['type_cotisation']);
            unset($data['type_cotisation']);
        }

        $cotisation = Cotisation::create($data);
        $cotisation->load('type');

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

    /**
     * Détails d'une cotisation
     */
    public function show(Cotisation $cotisation): JsonResponse
    {
        $cotisation->load('type');
        return response()->json($cotisation);
    }

    /**
     * Modifier une cotisation
     */
    public function update(StoreCotisationRequest $request, Cotisation $cotisation): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['type_cotisation'])) {
            $data['cotisation_type_id'] = $this->handleType($data['type_cotisation']);
            unset($data['type_cotisation']);
        }

        $cotisation->update($data);
        $cotisation->load('type');

        return response()->json([
            'message' => 'Cotisation mise à jour avec succès',
            'data' => $cotisation
        ]);
    }

    /**
     * Supprimer une cotisation
     */
    public function destroy(Cotisation $cotisation): JsonResponse
    {
        $cotisation->delete();

        return response()->json([
            'message' => 'Cotisation supprimée avec succès'
        ]);
    }

    /**
     * Statistiques des cotisations
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = Cotisation::query();

        if ($request->has('mois') && $request->has('annee')) {
            $query->byMonth($request->mois, $request->annee);
        }

        $stats = [
            'total_cotisations' => (clone $query)->count(),
            'total_cdf' => (clone $query)->where('devise', 'CDF')->sum('montant'),
            'total_usd' => (clone $query)->where('devise', 'USD')->sum('montant'),
        ];

        return response()->json($stats);
    }

    /**
     * Gérer la création ou récupération du type
     */
    private function handleType($typeInput)
    {
        if (!$typeInput) {
            return null;
        }

        // Si c'est un UUID valide et qu'il existe
        if (Str::isUuid($typeInput)) {
            if (CotisationType::where('id', $typeInput)->exists()) {
                return $typeInput;
            }
        }

        // Sinon chercher par slug ou nom, ou créer
        $slug = Str::slug($typeInput);
        $type = CotisationType::where('slug', $slug)
                              ->orWhere('name', $typeInput)
                              ->first();

        if (!$type) {
            $type = CotisationType::create([
                'name' => $typeInput,
                'slug' => $slug,
            ]);
        }

        return $type->id;
    }
}
