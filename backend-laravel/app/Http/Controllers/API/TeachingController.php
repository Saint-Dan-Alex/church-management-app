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

    public function show(Teaching $teaching): JsonResponse
    {
        $teaching->load(['chants', 'points.sousPoints', 'evenements.enseignements', 'createdBy']);
        
        return response()->json($teaching);
    }

    public function destroy(Teaching $teaching): JsonResponse
    {
        $teaching->delete();

        return response()->json([
            'message' => 'Enseignement supprimé avec succès'
        ]);
    }
}
