<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMonitorRequest;
use App\Http\Requests\UpdateMonitorRequest;
use App\Models\Monitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonitorController extends Controller
{
    /**
     * @OA\Get(
     *     path="/monitors",
     *     tags={"Monitors"},
     *     summary="Liste tous les moniteurs",
     *     description="Retourne la liste paginée des moniteurs avec filtres optionnels",
     *     @OA\Parameter(
     *         name="salle_id",
     *         in="query",
     *         description="Filtrer par ID de salle",
     *         required=false,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Parameter(
     *         name="role",
     *         in="query",
     *         description="Filtrer par rôle",
     *         required=false,
     *         @OA\Schema(type="string", enum={"responsable", "adjoint", "membre"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Recherche par nom, prénom ou email",
     *         required=false,
     *         @OA\Schema(type="string")
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
     *         description="Liste des moniteurs récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Monitor")),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Monitor::query();

        // Filtres
        if ($request->has('salle_id')) {
            $query->where('salle_actuelle_id', $request->salle_id);
        }

        if ($request->has('role')) {
            $query->where('role_actuel', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $monitors = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($monitors);
    }

    /**
     * @OA\Post(
     *     path="/monitors",
     *     tags={"Monitors"},
     *     summary="Créer un nouveau moniteur",
     *     description="Crée un nouveau moniteur avec les données fournies",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreMonitorRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Moniteur créé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Moniteur créé avec succès"),
     *             @OA\Property(property="data", ref="#/components/schemas/Monitor")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(StoreMonitorRequest $request): JsonResponse
    {
        $monitor = Monitor::create($request->validated());

        return response()->json([
            'message' => 'Moniteur créé avec succès',
            'data' => $monitor
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/monitors/{id}",
     *     tags={"Monitors"},
     *     summary="Détails d'un moniteur",
     *     description="Retourne les détails d'un moniteur avec ses relations",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID du moniteur",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails du moniteur",
     *         @OA\JsonContent(ref="#/components/schemas/Monitor")
     *     ),
     *     @OA\Response(response=404, description="Moniteur non trouvé")
     * )
     */
    public function show(Monitor $monitor): JsonResponse
    {
        $monitor->load(['salleActuelle', 'presences', 'historiqueSalles']);
        
        return response()->json($monitor);
    }

    /**
     * @OA\Put(
     *     path="/monitors/{id}",
     *     tags={"Monitors"},
     *     summary="Modifier un moniteur",
     *     description="Met à jour les informations d'un moniteur",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID du moniteur",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateMonitorRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Moniteur mis à jour avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Monitor")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Moniteur non trouvé"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(UpdateMonitorRequest $request, Monitor $monitor): JsonResponse
    {
        $monitor->update($request->validated());

        return response()->json([
            'message' => 'Moniteur mis à jour avec succès',
            'data' => $monitor
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/monitors/{id}",
     *     tags={"Monitors"},
     *     summary="Supprimer un moniteur",
     *     description="Supprime (soft delete) un moniteur",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID du moniteur",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Moniteur supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Moniteur supprimé avec succès")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Moniteur non trouvé")
     * )
     */
    public function destroy(Monitor $monitor): JsonResponse
    {
        $monitor->delete();

        return response()->json([
            'message' => 'Moniteur supprimé avec succès'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/monitors-statistics",
     *     tags={"Monitors"},
     *     summary="Statistiques des moniteurs",
     *     description="Retourne les statistiques globales des moniteurs",
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques récupérées avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="actifs", type="integer"),
     *             @OA\Property(property="responsables", type="integer"),
     *             @OA\Property(property="adjoints", type="integer"),
     *             @OA\Property(property="membres", type="integer")
     *         )
     *     )
     * )
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Monitor::count(),
            'actifs' => Monitor::whereNotNull('salle_actuelle_id')->count(),
            'responsables' => Monitor::where('role_actuel', 'responsable')->count(),
            'adjoints' => Monitor::where('role_actuel', 'adjoint')->count(),
            'membres' => Monitor::where('role_actuel', 'membre')->count(),
        ];

        return response()->json($stats);
    }
}
