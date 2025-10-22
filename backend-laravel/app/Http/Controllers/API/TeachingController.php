<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeachingRequest;
use App\Models\Teaching;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeachingController extends Controller
{
    /** @OA\Get(path="/teachings", tags={"Teachings"}, summary="Liste tous les enseignements", @OA\Parameter(name="theme", in="query", required=false, @OA\Schema(type="string")), @OA\Parameter(name="date_debut", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="date_fin", in="query", required=false, @OA\Schema(type="string", format="date")), @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)), @OA\Response(response=200, description="Liste récupérée")) */
    public function index(Request $request): JsonResponse
    {
        $query = Teaching::with(['chants', 'points.sousPoints', 'evenements.enseignements']);

        if ($request->has('theme')) {
            $query->where('theme', 'like', "%{$request->theme}%");
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date_seance', [$request->date_debut, $request->date_fin]);
        }

        $perPage = $request->get('per_page', 15);
        $teachings = $query->orderBy('date_seance', 'desc')->paginate($perPage);

        return response()->json($teachings);
    }

    /** @OA\Post(path="/teachings", tags={"Teachings"}, summary="Créer un enseignement", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreTeachingRequest")), @OA\Response(response=201, description="Enseignement créé"), @OA\Response(response=422, description="Erreur de validation"), @OA\Response(response=500, description="Erreur serveur")) */
    public function store(StoreTeachingRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $teaching = Teaching::create($request->except(['chants', 'points', 'evenements']));

            // Sauvegarder les chants
            if ($request->has('chants')) {
                foreach ($request->chants as $index => $chantData) {
                    $teaching->chants()->create([
                        ...$chantData,
                        'ordre' => $index
                    ]);
                }
            }

            // Sauvegarder les points et sous-points
            if ($request->has('points')) {
                foreach ($request->points as $pointIndex => $pointData) {
                    $point = $teaching->points()->create([
                        'titre' => $pointData['titre'],
                        'ordre' => $pointIndex
                    ]);

                    if (isset($pointData['sous_points'])) {
                        foreach ($pointData['sous_points'] as $spIndex => $sousPoint) {
                            $point->sousPoints()->create([
                                'contenu' => $sousPoint['contenu'],
                                'ordre' => $spIndex
                            ]);
                        }
                    }
                }
            }

            // Sauvegarder les événements et enseignements
            if ($request->has('evenements')) {
                foreach ($request->evenements as $evtIndex => $eventData) {
                    $evenement = $teaching->evenements()->create([
                        'titre' => $eventData['titre'],
                        'ordre' => $evtIndex
                    ]);

                    if (isset($eventData['enseignements'])) {
                        foreach ($eventData['enseignements'] as $ensIndex => $ensData) {
                            $evenement->enseignements()->create([
                                'contenu' => $ensData['contenu'],
                                'ordre' => $ensIndex
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Enseignement créé avec succès',
                'data' => $teaching->load(['chants', 'points.sousPoints', 'evenements.enseignements'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /** @OA\Get(path="/teachings/{id}", tags={"Teachings"}, summary="Détails d'un enseignement", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails avec chants, points et événements"), @OA\Response(response=404, description="Non trouvé")) */
    public function show(Teaching $teaching): JsonResponse
    {
        $teaching->load(['chants', 'points.sousPoints', 'evenements.enseignements', 'createdBy']);
        
        return response()->json($teaching);
    }

    /** @OA\Delete(path="/teachings/{id}", tags={"Teachings"}, summary="Supprimer un enseignement", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimé"), @OA\Response(response=404, description="Non trouvé")) */
    public function destroy(Teaching $teaching): JsonResponse
    {
        $teaching->delete();

        return response()->json([
            'message' => 'Enseignement supprimé avec succès'
        ]);
    }
}
