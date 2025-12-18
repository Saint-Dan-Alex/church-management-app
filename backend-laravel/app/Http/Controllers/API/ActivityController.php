<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/activities",
     *     tags={"Activities"},
     *     summary="Liste toutes les activités",
     *     description="Retourne la liste paginée des activités avec filtres",
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Filtrer par type",
     *         required=false,
     *         @OA\Schema(type="string", enum={"gratuite", "payante"})
     *     ),
     *     @OA\Parameter(
     *         name="statut",
     *         in="query",
     *         description="Filtrer par statut",
     *         required=false,
     *         @OA\Schema(type="string", enum={"planifiee", "en_cours", "terminee", "annulee"})
     *     ),
     *     @OA\Parameter(
     *         name="date_debut",
     *         in="query",
     *         description="Date de début de la période",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="date_fin",
     *         in="query",
     *         description="Date de fin de la période",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Nombre d'éléments par page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des activités récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Activity")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $activities = Activity::where('date', '>=', now())
            ->where('statut', '!=', 'annulee')
            ->orderBy('date', 'asc')
            ->take(6)
            ->get();

        return response()->json($activities);
    }

    public function publicShow(Activity $activity): JsonResponse
    {
        return response()->json($activity);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Activity::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $perPage = $request->get('per_page', 15);
        $activities = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($activities);
    }

    /**
     * @OA\Post(
     *     path="/activities",
     *     tags={"Activities"},
     *     summary="Créer une nouvelle activité",
     *     description="Crée une nouvelle activité/événement",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreActivityRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Activité créée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Activity")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StoreActivityRequest $request): JsonResponse
    {
        $activity = Activity::create($request->validated());

        // Créer une notification
        NotificationService::notifyActivity(
            auth()->id() ?? 1,
            [
                'id' => $activity->id,
                'nom' => $activity->nom,
                'date_debut' => $activity->date_debut,
                'type' => $activity->type,
            ]
        );

        return response()->json([
            'message' => 'Activité créée avec succès',
            'data' => $activity
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/activities/{id}",
     *     tags={"Activities"},
     *     summary="Détails d'une activité",
     *     description="Retourne les détails avec participants, dépenses et paiements",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'activité",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de l'activité",
     *         @OA\JsonContent(ref="#/components/schemas/Activity")
     *     ),
     *     @OA\Response(response=404, description="Activité non trouvée")
     * )
     */
    public function show(Activity $activity): JsonResponse
    {
        $activity->load(['participants', 'expenses', 'payments', 'presences']);
        
        return response()->json($activity);
    }

    /**
     * @OA\Put(
     *     path="/activities/{id}",
     *     tags={"Activities"},
     *     summary="Modifier une activité",
     *     description="Met à jour les informations d'une activité",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'activité",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateActivityRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Activité mise à jour avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Activity")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Activité non trouvée"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $activity->update($request->validated());

        return response()->json([
            'message' => 'Activité mise à jour avec succès',
            'data' => $activity
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/activities/{id}",
     *     tags={"Activities"},
     *     summary="Supprimer une activité",
     *     description="Supprime (soft delete) une activité",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'activité",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Activité supprimée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Activité non trouvée")
     * )
     */
    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([
            'message' => 'Activité supprimée avec succès'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/activities/{id}/statistics",
     *     tags={"Activities"},
     *     summary="Statistiques d'une activité",
     *     description="Retourne les statistiques de participation et paiement",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'activité",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques récupérées",
     *         @OA\JsonContent(
     *             @OA\Property(property="total_participants", type="integer"),
     *             @OA\Property(property="presents", type="integer"),
     *             @OA\Property(property="absents", type="integer"),
     *             @OA\Property(property="paye", type="integer"),
     *             @OA\Property(property="non_paye", type="integer")
     *         )
     *     )
     * )
     */
    public function statistics(Activity $activity): JsonResponse
    {
        $stats = [
            'total_participants' => $activity->participants()->count(),
            'presents' => $activity->participants()->where('est_present', true)->count(),
            'absents' => $activity->participants()->where('est_present', false)->count(),
            'paye' => $activity->participants()->where('a_paye', true)->count(),
            'non_paye' => $activity->participants()->where('a_paye', false)->count(),
        ];

        return response()->json($stats);
    }

    /**
     * @OA\Get(
     *     path="/activities/categories",
     *     tags={"Activities"},
     *     summary="Liste des catégories d'activités",
     *     description="Retourne la liste des catégories avec leurs couleurs",
     *     @OA\Response(
     *         response=200,
     *         description="Liste des catégories",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="color", type="string")
     *             )
     *         )
     *     )
     * )
     */
    public function categories(): JsonResponse
    {
        $categories = \App\Models\ActivityCategory::orderBy('order')->get();
        return response()->json($categories);
    }

    /**
     * @OA\Post(
     *     path="/activities/{id}/participants",
     *     tags={"Activities"},
     *     summary="Ajouter un participant",
     *     description="Ajoute un participant à l'activité",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'activité",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="participant_id", type="string", nullable=true),
     *             @OA\Property(property="participant_type", type="string", enum={"enfant", "moniteur", "visiteur"}),
     *             @OA\Property(property="participant_nom", type="string"),
     *             @OA\Property(property="participant_prenom", type="string", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Participant ajouté"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function addParticipant(\Illuminate\Http\Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'participant_id' => 'nullable|string',
            'participant_type' => 'required|string|in:enfant,moniteur,visiteur',
            'participant_nom' => 'required_without:participant_id|string',
            'participant_prenom' => 'nullable|string',
        ]);

        // Vérifier si déjà inscrit
        $exists = $activity->participants()
            ->where(function($q) use ($validated) {
                if (!empty($validated['participant_id'])) {
                    $q->where('participant_id', $validated['participant_id']);
                } else {
                     $q->where('participant_nom', $validated['participant_nom'])
                       ->where('participant_prenom', $validated['participant_prenom'] ?? null); 
                }
            })->exists();
            
        if ($exists) {
            return response()->json(['message' => 'Ce participant est déjà inscrit à cette activité'], 422);
        }

        // Si ID fourni, récupérer nom complet si manquant (Optionnel, ici on suppose que le front envoie tout ou que c'est géré)
        $nomComplet = trim(($validated['participant_prenom'] ?? '') . ' ' . ($validated['participant_nom'] ?? ''));
        
        // Création
        $participant = $activity->participants()->create([
            'participant_id' => $validated['participant_id'] ?? null,
            'participant_type' => $validated['participant_type'],
            'participant_nom' => $validated['participant_nom'] ?? 'Inconnu',
            'participant_prenom' => $validated['participant_prenom'] ?? '',
            'participant_nom_complet' => $nomComplet,
            'ajoute_via' => 'manuel',
            'date_ajout' => now(),
            'est_present' => false,
            'statut_presence' => 'absent',
            'a_paye' => false,
            'statut_paiement' => 'pending',
        ]);
        
        if (is_numeric($activity->participants)) {
             $activity->increment('participants');
        }

        return response()->json($participant, 201);
    }
}
