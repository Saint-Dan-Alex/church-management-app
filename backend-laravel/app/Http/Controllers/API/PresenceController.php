<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePresenceRequest;
use App\Models\Presence;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Presence::query();

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->activity_id);
        }

        if ($request->has('moniteur_id')) {
            $query->where('moniteur_id', $request->moniteur_id);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $perPage = $request->get('per_page', 15);
        $presences = $query->orderBy('date_presence', 'desc')->paginate($perPage);

        return response()->json($presences);
    }

    public function store(StorePresenceRequest $request): JsonResponse
    {
        $presence = Presence::create($request->validated());

        return response()->json([
            'message' => 'Présence enregistrée avec succès',
            'data' => $presence
        ], 201);
    }

    public function show(Presence $presence): JsonResponse
    {
        $presence->load(['activity', 'moniteur']);
        
        return response()->json($presence);
    }

    public function update(StorePresenceRequest $request, Presence $presence): JsonResponse
    {
        $presence->update($request->validated());

        return response()->json([
            'message' => 'Présence mise à jour avec succès',
            'data' => $presence
        ]);
    }

    public function destroy(Presence $presence): JsonResponse
    {
        $presence->delete();

        return response()->json([
            'message' => 'Présence supprimée avec succès'
        ]);
    }

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
