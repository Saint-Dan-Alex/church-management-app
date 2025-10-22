<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
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

    public function store(StoreActivityRequest $request): JsonResponse
    {
        $activity = Activity::create($request->validated());

        return response()->json([
            'message' => 'Activité créée avec succès',
            'data' => $activity
        ], 201);
    }

    public function show(Activity $activity): JsonResponse
    {
        $activity->load(['participants', 'expenses', 'payments', 'presences']);
        
        return response()->json($activity);
    }

    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $activity->update($request->validated());

        return response()->json([
            'message' => 'Activité mise à jour avec succès',
            'data' => $activity
        ]);
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([
            'message' => 'Activité supprimée avec succès'
        ]);
    }

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
}
