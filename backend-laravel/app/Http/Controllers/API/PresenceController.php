<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePresenceRequest;
use App\Models\Presence;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    /**
     * @OA\Get(
     *     path="/presences",
     *     tags={"Presences"},
     *     summary="Liste toutes les présences",
     *     @OA\Parameter(name="activity_id", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Parameter(name="moniteur_id", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Parameter(name="statut", in="query", required=false, @OA\Schema(type="string", enum={"present", "absent", "retard", "excuse"})),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Liste récupérée")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Presence::query();

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }

        if ($request->has('moniteur_id')) {
            $query->where('moniteur_id', $request->moniteur_id);
        }

        if ($request->has('participant_id')) {
            $query->where('participant_id', $request->participant_id);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('date_debut')) {
            $query->whereDate('date_presence', '>=', $request->date_debut);
        }

        if ($request->has('date_fin')) {
            $query->whereDate('date_presence', '<=', $request->date_fin);
        }

        $perPage = $request->get('per_page', 15);
        $presences = $query->orderBy('date_presence', 'desc')->paginate($perPage);

        return response()->json($presences);
    }

    /**
     * @OA\Post(
     *     path="/presences",
     *     tags={"Presences"},
     *     summary="Enregistrer une présence",
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StorePresenceRequest")),
     *     @OA\Response(response=201, description="Présence enregistrée"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StorePresenceRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Normalisation pour le polymorphisme
        if (empty($data['participant_id']) && !empty($data['moniteur_id'])) {
            $data['participant_id'] = $data['moniteur_id'];
            $data['participant_type'] = \App\Models\Monitor::class;
        }

        $presence = Presence::create($data);

        // Récupérer le nom pour la notification
        $nomNotification = $presence->moniteur_nom_complet ?? 'Un participant';
        if ($presence->participant) {
            $nomNotification = $presence->participant->nom_complet ?? $nomNotification;
        }

        // Créer une notification
        NotificationService::notifyPresence(
            auth()->id() ?? 1,
            [
                'id' => $presence->id,
                'moniteur_nom' => $presence->moniteur_nom, // Legacy
                'participant_nom' => $nomNotification,
                'activity_nom' => $presence->activity_nom ?? 'Activité',
                'activity_id' => $presence->activity_id,
                'statut' => $presence->statut,
            ]
        );

        return response()->json([
            'message' => 'Présence enregistrée avec succès',
            'data' => $presence
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/presences/{id}",
     *     tags={"Presences"},
     *     summary="Détails d'une présence",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Détails"),
     *     @OA\Response(response=404, description="Non trouvée")
     * )
     */
    public function show(Presence $presence): JsonResponse
    {
        $presence->load(['activity', 'moniteur']);
        
        return response()->json($presence);
    }

    /**
     * @OA\Put(
     *     path="/presences/{id}",
     *     tags={"Presences"},
     *     summary="Modifier une présence",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StorePresenceRequest")),
     *     @OA\Response(response=200, description="Mise à jour"),
     *     @OA\Response(response=404, description="Non trouvée")
     * )
     */
    public function update(StorePresenceRequest $request, Presence $presence): JsonResponse
    {
        $data = $request->validated();
        
        // Normalisation pour update aussi
        if (empty($data['participant_id']) && !empty($data['moniteur_id'])) {
             $data['participant_id'] = $data['moniteur_id'];
             $data['participant_type'] = \App\Models\Monitor::class;
        }

        $presence->update($data);

        return response()->json([
            'message' => 'Présence mise à jour avec succès',
            'data' => $presence
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/presences/{id}",
     *     tags={"Presences"},
     *     summary="Supprimer une présence",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Supprimée"),
     *     @OA\Response(response=404, description="Non trouvée")
     * )
     */
    public function destroy(Presence $presence): JsonResponse
    {
        $presence->delete();

        return response()->json([
            'message' => 'Présence supprimée avec succès'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/presences-statistics",
     *     tags={"Presences"},
     *     summary="Statistiques des présences",
     *     @OA\Parameter(name="activity_id", in="query", required=false, @OA\Schema(type="string", format="uuid")),
     *     @OA\Response(response=200, description="Statistiques", @OA\JsonContent(@OA\Property(property="total", type="integer"), @OA\Property(property="presents", type="integer"), @OA\Property(property="absents", type="integer"), @OA\Property(property="retards", type="integer")))
     * )
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = Presence::query();

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }

        $stats = [
            'total' => $query->count(),
            'presents' => $query->where('statut', 'present')->count(),
            'absents' => $query->where('statut', 'absent')->count(),
            'retards' => $query->where('statut', 'retard')->count(),
            'excuses' => $query->where('statut', 'excuse')->count(),
        ];

        return response()->json($stats);
    }
}
