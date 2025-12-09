<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CotisationType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class CotisationTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $types = CotisationType::orderBy('name')->get();
        return response()->json($types);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $type = CotisationType::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json($type, 201);
    }
}
