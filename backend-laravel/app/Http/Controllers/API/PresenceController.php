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

        if ($request->has('date_presence')) {
            $query->whereDate('date_presence', $request->date_presence);
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

        // Map simple types to full class names
        $typeMap = [
            'child' => \App\Models\Child::class,
            'enfant' => \App\Models\Child::class, 
            'monitor' => \App\Models\Monitor::class,
            'moniteur' => \App\Models\Monitor::class,
            // 'visiteur' => NO MODEL
        ];

        $isVisitor = false;
        if (isset($data['participant_type']) && isset($typeMap[strtolower($data['participant_type'])])) {
            $data['participant_type'] = $typeMap[strtolower($data['participant_type'])];
        } elseif (isset($data['participant_type']) && strtolower($data['participant_type']) === 'visiteur') {
            $isVisitor = true;
        }

        // Populate legacy fields if missing to satisfy DB constraints
        if (empty($data['moniteur_nom']) || empty($data['moniteur_prenom']) || empty($data['moniteur_nom_complet'])) {
             $nom = 'Inconnu';
             $prenom = '';
             $nomComplet = 'Inconnu';

             if (!empty($data['participant_id'])) {
                 // 1. Try to find via ActivityParticipant (Source of truth for current activity)
                 // This handles Visitors who exist in activity_participants but have no own table
                 $accPart = \App\Models\ActivityParticipant::where('activity_id', $data['activity_id'])
                     ->where('participant_id', $data['participant_id'])
                     ->first();
                 
                 if ($accPart) {
                     $nom = $accPart->participant_nom;
                     $prenom = $accPart->participant_prenom;
                     $nomComplet = $accPart->participant_nom_complet;
                 } 
                 // 2. If not found or if we want standard Model data (for Child/Monitor)
                 elseif (!empty($data['participant_type']) && !$isVisitor) {
                     try {
                         $participantClass = $data['participant_type'];
                         if (class_exists($participantClass)) {
                             $participant = $participantClass::find($data['participant_id']);
                             if ($participant) {
                                 $nom = $participant->nom ?? 'Inconnu';
                                 $prenom = $participant->prenom ?? $participant->postnom ?? ''; 
                                 $nomComplet = $participant->nom_complet ?? trim("$nom $prenom");
                             }
                         }
                     } catch (\Exception $e) {}
                 }
             }
             
             $data['moniteur_nom'] = $data['moniteur_nom'] ?? $nom;
             $data['moniteur_prenom'] = $data['moniteur_prenom'] ?? $prenom;
             $data['moniteur_nom_complet'] = $data['moniteur_nom_complet'] ?? $nomComplet;
        }

        // Handle Visitor / Invalid Type Case:
        // If it's a visitor or the class doesn't exist, we CANNOT store the polymorphic relation
        // because it would break $presence->participant access or validation.
        // We just store the name (done above) and NULL the polymorphic fields.
        if ($isVisitor || (isset($data['participant_type']) && !class_exists($data['participant_type']))) {
            $data['participant_id'] = null;
            $data['participant_type'] = null;
        }

        // Normalisation pour le polymorphisme (Legacy fallback)
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
        
        // Map simple types to full class names
        $typeMap = [
            'child' => \App\Models\Child::class,
            'enfant' => \App\Models\Child::class, 
            'monitor' => \App\Models\Monitor::class,
            'moniteur' => \App\Models\Monitor::class,
        ];

        if (isset($data['participant_type']) && isset($typeMap[strtolower($data['participant_type'])])) {
            $data['participant_type'] = $typeMap[strtolower($data['participant_type'])];
        }

        // Normalisation pour le polymorphisme (Legacy fallback)
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
