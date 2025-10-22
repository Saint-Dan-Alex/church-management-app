<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChildRequest;
use App\Http\Requests\UpdateChildRequest;
use App\Models\Child;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChildController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Child::query();

        if ($request->has('genre')) {
            $query->where('genre', $request->genre);
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
        $children = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($children);
    }

    public function store(StoreChildRequest $request): JsonResponse
    {
        $child = Child::create($request->validated());

        return response()->json([
            'message' => 'Enfant créé avec succès',
            'data' => $child
        ], 201);
    }

    public function show(Child $child): JsonResponse
    {
        return response()->json($child);
    }

    public function update(UpdateChildRequest $request, Child $child): JsonResponse
    {
        $child->update($request->validated());

        return response()->json([
            'message' => 'Enfant mis à jour avec succès',
            'data' => $child
        ]);
    }

    public function destroy(Child $child): JsonResponse
    {
        $child->delete();

        return response()->json([
            'message' => 'Enfant supprimé avec succès'
        ]);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Child::count(),
            'garcons' => Child::where('genre', 'Masculin')->count(),
            'filles' => Child::where('genre', 'Féminin')->count(),
            'ouvriers' => Child::where('est_ouvrier', true)->count(),
        ];

        return response()->json($stats);
    }
}
