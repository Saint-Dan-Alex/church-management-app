<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
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

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = Expense::create($request->validated());

        return response()->json([
            'message' => 'Dépense créée avec succès',
            'data' => $expense
        ], 201);
    }

    public function show(Expense $expense): JsonResponse
    {
        $expense->load('activity');
        
        return response()->json($expense);
    }

    public function update(StoreExpenseRequest $request, Expense $expense): JsonResponse
    {
        $expense->update($request->validated());

        return response()->json([
            'message' => 'Dépense mise à jour avec succès',
            'data' => $expense
        ]);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();

        return response()->json([
            'message' => 'Dépense supprimée avec succès'
        ]);
    }

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
