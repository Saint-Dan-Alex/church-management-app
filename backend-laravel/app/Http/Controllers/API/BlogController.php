<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Blog::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $blogs = $query->orderBy('published_at', 'desc')->paginate($perPage);

        return response()->json($blogs);
    }

    public function store(StoreBlogRequest $request): JsonResponse
    {
        $blog = Blog::create($request->validated());

        return response()->json([
            'message' => 'Article créé avec succès',
            'data' => $blog
        ], 201);
    }

    public function show(Blog $blog): JsonResponse
    {
        $blog->increment('views');
        
        return response()->json($blog);
    }

    public function update(StoreBlogRequest $request, Blog $blog): JsonResponse
    {
        $blog->update($request->validated());

        return response()->json([
            'message' => 'Article mis à jour avec succès',
            'data' => $blog
        ]);
    }

    public function destroy(Blog $blog): JsonResponse
    {
        $blog->delete();

        return response()->json([
            'message' => 'Article supprimé avec succès'
        ]);
    }

    public function published(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $blogs = Blog::published()->orderBy('published_at', 'desc')->paginate($perPage);

        return response()->json($blogs);
    }
}
