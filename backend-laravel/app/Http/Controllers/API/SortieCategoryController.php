<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SortieCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class SortieCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = SortieCategory::orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = SortieCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }
}
