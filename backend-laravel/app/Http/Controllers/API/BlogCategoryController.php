<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogCategoryController extends Controller
{
    /**
     * Liste toutes les catégories.
     */
    public function index()
    {
        return response()->json(BlogCategory::orderBy('name')->get());
    }

    /**
     * Crée une nouvelle catégorie.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:blog_categories,name|max:255',
            'description' => 'nullable|string'
        ]);

        $category = BlogCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description
        ]);

        return response()->json($category, 201);
    }
}
