<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieRequest;
use App\Models\Sortie;
use App\Models\SortieCategory;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SortieController extends Controller
{
    /**
     * Liste toutes les sorties financières
     */
    public function index(Request $request): JsonResponse
    {
        $query = Sortie::with('category');

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

    /**
     * Enregistrer une sortie
     */
    public function store(StoreSortieRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Gérer la catégorie dynamiquement
        if (isset($data['categorie'])) {
            $data['sortie_category_id'] = $this->handleCategory($data['categorie']);
            unset($data['categorie']);
        }

        $sortie = Sortie::create($data);
        $sortie->load('category');

        // Créer une notification
        NotificationService::notifyInfo(
            auth()->id() ?? 1,
            'Nouvelle sortie enregistrée',
            "Sortie de {$sortie->montant} {$sortie->devise} pour {$sortie->libelle}",
            "/sorties"
        );

        return response()->json([
            'message' => 'Sortie enregistrée avec succès',
            'data' => $sortie
        ], 201);
    }

    /**
     * Détails d'une sortie
     */
    public function show(Sortie $sortie): JsonResponse
    {
        $sortie->load('category');
        return response()->json($sortie);
    }

    /**
     * Modifier une sortie
     */
    public function update(StoreSortieRequest $request, Sortie $sortie): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['categorie'])) {
            $data['sortie_category_id'] = $this->handleCategory($data['categorie']);
            unset($data['categorie']);
        }

        $sortie->update($data);
        $sortie->load('category');

        return response()->json([
            'message' => 'Sortie mise à jour avec succès',
            'data' => $sortie
        ]);
    }

    /**
     * Supprimer une sortie
     */
    public function destroy(Sortie $sortie): JsonResponse
    {
        $sortie->delete();

        return response()->json([
            'message' => 'Sortie supprimée avec succès'
        ]);
    }

    /**
     * Statistiques des sorties
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = Sortie::query();

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->byPeriod($request->date_debut, $request->date_fin);
        }

        $stats = [
            'total_sorties' => (clone $query)->count(),
            'total_cdf' => (clone $query)->where('devise', 'CDF')->sum('montant'),
            'total_usd' => (clone $query)->where('devise', 'USD')->sum('montant'),
        ];

        return response()->json($stats);
    }

    /**
     * Gérer la création ou récupération de la catégorie
     */
    private function handleCategory($categoryInput)
    {
        if (!$categoryInput) {
            return null;
        }

        // Si c'est un UUID valide et qu'il existe
        if (Str::isUuid($categoryInput)) {
            if (SortieCategory::where('id', $categoryInput)->exists()) {
                return $categoryInput;
            }
        }

        // Sinon chercher par slug ou nom, ou créer
        $slug = Str::slug($categoryInput);
        $category = SortieCategory::where('slug', $slug)
                                  ->orWhere('name', $categoryInput)
                                  ->first();

        if (!$category) {
            $category = SortieCategory::create([
                'name' => $categoryInput,
                'slug' => $slug,
            ]);
        }

        return $category->id;
    }
}
