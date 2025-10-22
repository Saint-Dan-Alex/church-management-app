<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::query();

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $perPage = $request->get('per_page', 15);
        $payments = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($payments);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = Payment::create($request->validated());

        return response()->json([
            'message' => 'Paiement créé avec succès',
            'data' => $payment
        ], 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load(['activity', 'receipts']);
        
        return response()->json($payment);
    }

    public function update(StorePaymentRequest $request, Payment $payment): JsonResponse
    {
        $payment->update($request->validated());

        return response()->json([
            'message' => 'Paiement mis à jour avec succès',
            'data' => $payment
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();

        return response()->json([
            'message' => 'Paiement supprimé avec succès'
        ]);
    }

    public function statistics(Request $request): JsonResponse
    {
        $query = Payment::query();

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }

        $stats = [
            'total_paiements' => $query->count(),
            'payes' => $query->where('statut', 'paid')->count(),
            'en_attente' => $query->where('statut', 'pending')->count(),
            'partiels' => $query->where('statut', 'partial')->count(),
            'total_cdf' => $query->where('devise', 'CDF')->sum('montant_paye'),
            'total_usd' => $query->where('devise', 'USD')->sum('montant_paye'),
        ];

        return response()->json($stats);
    }
}
