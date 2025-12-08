<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Payment;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/payments",
     *     tags={"Payments"},
     *     summary="Liste tous les paiements",
     *     description="Retourne la liste paginée des paiements avec filtres",
     *     @OA\Parameter(name="activity_id", in="query", description="Filtrer par activité", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Parameter(name="statut", in="query", description="Filtrer par statut", required=false, @OA\Schema(type="string", enum={"pending", "paid", "partial", "overdue", "cancelled"})),
     *     @OA\Parameter(name="per_page", in="query", description="Éléments par page", required=false, @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Liste récupérée avec succès", @OA\JsonContent(@OA\Property(property="current_page", type="integer"), @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Payment")), @OA\Property(property="total", type="integer")))
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/payments",
     *     tags={"Payments"},
     *     summary="Créer un paiement",
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StorePaymentRequest")),
     *     @OA\Response(response=201, description="Paiement créé", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Payment"))),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = Payment::create($request->validated());

        // Logique de synchronisation avec les participants
        try {
            // 1. Trouver ou créer le participant dans l'activité
            $query = \App\Models\ActivityParticipant::where('activity_id', $payment->activity_id);
            
            if ($payment->participant_id) {
                $query->where('participant_id', $payment->participant_id);
            } else {
                $query->where('participant_nom', $payment->participant_nom)
                      ->where('participant_prenom', $payment->participant_prenom);
            }

            $participant = $query->first();

            if (!$participant) {
                // Créer le participant s'il n'existe pas (inscription via paiement)
                $participant = \App\Models\ActivityParticipant::create([
                    'activity_id' => $payment->activity_id,
                    'participant_id' => $payment->participant_id,
                    'participant_nom' => $payment->participant_nom,
                    'participant_prenom' => $payment->participant_prenom,
                    'participant_nom_complet' => $payment->participant_nom_complet,
                    'participant_type' => 'visiteur', // Par défaut si via paiement
                    'ajoute_via' => 'paiement',
                    'date_ajout' => now(),
                    'est_present' => false,
                    'statut_presence' => 'absent',
                    'montant_paye' => 0,
                    'a_paye' => false,
                    'statut_paiement' => 'pending',
                ]);
            }

            // 2. Mettre à jour les montants
            $participant->montant_paye = ($participant->montant_paye ?? 0) + $payment->montant;

            // 3. Vérifier le statut de paiement par rapport au prix de l'activité
            $activity = \App\Models\Activity::find($payment->activity_id);
            if ($activity && $activity->price > 0) {
                if ($participant->montant_paye >= $activity->price) {
                    $participant->statut_paiement = 'paid';
                    $participant->a_paye = true;
                } elseif ($participant->montant_paye > 0) {
                    $participant->statut_paiement = 'partial';
                    $participant->a_paye = false;
                }
            } else {
                // Si activité gratuite ou prix non défini mais payé quand même (?)
                $participant->statut_paiement = 'paid';
                $participant->a_paye = true;
            }
            
            $participant->save();

            // Lier le paiement au participant interne si possible (optionnel, activity_participants n'a pas nécessairement d'ID fixe utilisé ailleurs)
            
        } catch (\Exception $e) {
            // Log silentieux, ne doit pas bloquer la création du paiement
            \Illuminate\Support\Facades\Log::error("Erreur sync participant paiement: " . $e->getMessage());
        }

        // Créer une notification
        NotificationService::notifyPayment(
            auth()->id() ?? 1, // ID de l'utilisateur (ou 1 par défaut pour les tests)
            [
                'id' => $payment->id,
                'participant_nom' => $payment->participant_nom_complet,
                'montant' => $payment->montant,
                'devise' => $payment->devise,
            ]
        );

        return response()->json([
            'message' => 'Paiement créé avec succès',
            'data' => $payment
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/payments/{id}",
     *     tags={"Payments"},
     *     summary="Détails d'un paiement",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Détails du paiement", @OA\JsonContent(ref="#/components/schemas/Payment")),
     *     @OA\Response(response=404, description="Paiement non trouvé")
     * )
     */
    public function show(Payment $payment): JsonResponse
    {
        $payment->load(['activity', 'receipts']);
        
        return response()->json($payment);
    }

    /**
     * @OA\Put(
     *     path="/payments/{id}",
     *     tags={"Payments"},
     *     summary="Modifier un paiement",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StorePaymentRequest")),
     *     @OA\Response(response=200, description="Mis à jour", @OA\JsonContent(@OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Payment"))),
     *     @OA\Response(response=404, description="Non trouvé"), @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(StorePaymentRequest $request, Payment $payment): JsonResponse
    {
        $payment->update($request->validated());

        return response()->json([
            'message' => 'Paiement mis à jour avec succès',
            'data' => $payment
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/payments/{id}",
     *     tags={"Payments"},
     *     summary="Supprimer un paiement",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Supprimé", @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Non trouvé")
     * )
     */
    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();

        return response()->json([
            'message' => 'Paiement supprimé avec succès'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/payments-statistics",
     *     tags={"Payments"},
     *     summary="Statistiques des paiements",
     *     @OA\Parameter(name="activity_id", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Statistiques", @OA\JsonContent(@OA\Property(property="total_paiements", type="integer"), @OA\Property(property="payes", type="integer"), @OA\Property(property="en_attente", type="integer"), @OA\Property(property="total_cdf", type="number"), @OA\Property(property="total_usd", type="number")))
     * )
     */
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
