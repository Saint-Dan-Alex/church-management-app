<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * @OA\Get(path="/blogs", tags={"Blog"}, summary="Liste tous les articles",
     *     @OA\Parameter(name="status", in="query", required=false, @OA\Schema(type="string", enum={"draft", "published"})),
     *     @OA\Parameter(name="category", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Liste récupérée"))
     */
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

    /** @OA\Post(path="/blogs", tags={"Blog"}, summary="Créer un article", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreBlogRequest")), @OA\Response(response=201, description="Article créé"), @OA\Response(response=422, description="Erreur de validation")) */
    public function store(StoreBlogRequest $request): JsonResponse
    {
        $blog = Blog::create($request->validated());

        return response()->json([
            'message' => 'Article créé avec succès',
            'data' => $blog
        ], 201);
    }

    /** @OA\Get(path="/blogs/{id}", tags={"Blog"}, summary="Détails d'un article", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvé")) */
    public function show(Blog $blog): JsonResponse
    {
        $blog->increment('views');
        
        return response()->json($blog);
    }

    /** @OA\Put(path="/blogs/{id}", tags={"Blog"}, summary="Modifier un article", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreBlogRequest")), @OA\Response(response=200, description="Mis à jour"), @OA\Response(response=404, description="Non trouvé")) */
    public function update(StoreBlogRequest $request, Blog $blog): JsonResponse
    {
        $blog->update($request->validated());

        return response()->json([
            'message' => 'Article mis à jour avec succès',
            'data' => $blog
        ]);
    }

    /** @OA\Delete(path="/blogs/{id}", tags={"Blog"}, summary="Supprimer un article", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimé"), @OA\Response(response=404, description="Non trouvé")) */
    public function destroy(Blog $blog): JsonResponse
    {
        $blog->delete();

        return response()->json([
            'message' => 'Article supprimé avec succès'
        ]);
    }

    /** @OA\Get(path="/blogs-published", tags={"Blog"}, summary="Articles publiés", @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)), @OA\Response(response=200, description="Liste des articles publiés")) */
    public function published(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $blogs = Blog::published()->orderBy('published_at', 'desc')->paginate($perPage);

        return response()->json($blogs);
    }
}
