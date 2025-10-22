<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * @OA\Get(
     *     path="/expenses",
     *     tags={"Expenses"},
     *     summary="Liste toutes les dépenses",
     *     @OA\Parameter(name="activity_id", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Parameter(name="categorie", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Liste récupérée")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Expense::query();

        if ($request->has('activity_id')) {
            $query->byActivity($request->activity_id);
        }

        if ($request->has('categorie')) {
            $query->byCategory($request->categorie);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $perPage = $request->get('per_page', 15);
        $expenses = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($expenses);
    }

    /**
     * @OA\Post(
     *     path="/expenses",
     *     tags={"Expenses"},
     *     summary="Créer une dépense",
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreExpenseRequest")),
     *     @OA\Response(response=201, description="Dépense créée"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = Expense::create($request->validated());

        return response()->json([
            'message' => 'Dépense créée avec succès',
            'data' => $expense
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/expenses/{id}",
     *     tags={"Expenses"},
     *     summary="Détails d'une dépense",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Détails"),
     *     @OA\Response(response=404, description="Non trouvée")
     * )
     */
    public function show(Expense $expense): JsonResponse
    {
        $expense->load('activity');
        
        return response()->json($expense);
    }

    /**
     * @OA\Put(
     *     path="/expenses/{id}",
     *     tags={"Expenses"},
     *     summary="Modifier une dépense",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreExpenseRequest")),
     *     @OA\Response(response=200, description="Mise à jour"),
     *     @OA\Response(response=404, description="Non trouvée")
     * )
     */
    public function update(StoreExpenseRequest $request, Expense $expense): JsonResponse
    {
        $expense->update($request->validated());

        return response()->json([
            'message' => 'Dépense mise à jour avec succès',
            'data' => $expense
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/expenses/{id}",
     *     tags={"Expenses"},
     *     summary="Supprimer une dépense",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Supprimée"),
     *     @OA\Response(response=404, description="Non trouvée")
     * )
     */
    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();

        return response()->json([
            'message' => 'Dépense supprimée avec succès'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/expenses-statistics",
     *     tags={"Expenses"},
     *     summary="Statistiques des dépenses",
     *     @OA\Parameter(name="activity_id", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Statistiques", @OA\JsonContent(@OA\Property(property="total_cdf", type="number"), @OA\Property(property="total_usd", type="number"), @OA\Property(property="nombre_depenses", type="integer")))
     * )
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = Expense::query();

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }

        $totalCDF = $query->where('devise', 'CDF')->sum('montant');
        $totalUSD = $query->where('devise', 'USD')->sum('montant');

        $stats = [
            'total_cdf' => $totalCDF,
            'total_usd' => $totalUSD,
            'nombre_depenses' => $query->count(),
        ];

        return response()->json($stats);
    }
}
