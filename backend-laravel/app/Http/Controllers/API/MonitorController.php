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

    public function store(StoreMonitorRequest $request): JsonResponse
    {
        $monitor = Monitor::create($request->validated());

        return response()->json([
            'message' => 'Moniteur créé avec succès',
            'data' => $monitor
        ], 201);
    }

    public function show(Monitor $monitor): JsonResponse
    {
        $monitor->load(['salleActuelle', 'presences', 'historiqueSalles']);
        
        return response()->json($monitor);
    }

    public function update(UpdateMonitorRequest $request, Monitor $monitor): JsonResponse
    {
        $monitor->update($request->validated());

        return response()->json([
            'message' => 'Moniteur mis à jour avec succès',
            'data' => $monitor
        ]);
    }

    public function destroy(Monitor $monitor): JsonResponse
    {
        $monitor->delete();

        return response()->json([
            'message' => 'Moniteur supprimé avec succès'
        ]);
    }

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
