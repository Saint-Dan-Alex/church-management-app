<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        $query = Blog::with('category');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $cat = $request->category;
            // Si c'est un UUID
            if (Str::isUuid($cat)) {
                $query->where('blog_category_id', $cat);
            } else {
                // Sinon recherche par nom de catégorie
                $query->whereHas('category', function($q) use ($cat) {
                    $q->where('name', $cat)->orWhere('slug', $cat);
                });
            }
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
        $data = $request->validated();
        
        $data['blog_category_id'] = $this->handleCategory($request->category);
        unset($data['category']); // Ne pas passer ce champ brut au create

        $blog = Blog::create($data);

        return response()->json([
            'message' => 'Article créé avec succès',
            'data' => $blog->load('category')
        ], 201);
    }

    /** @OA\Get(path="/blogs/{id}", tags={"Blog"}, summary="Détails d'un article", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvé")) */
    public function show(Blog $blog): JsonResponse
    {
        $blog->increment('views');
        $blog->load('category');
        
        return response()->json($blog);
    }

    /** @OA\Put(path="/blogs/{id}", tags={"Blog"}, summary="Modifier un article", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreBlogRequest")), @OA\Response(response=200, description="Mis à jour"), @OA\Response(response=404, description="Non trouvé")) */
    public function update(StoreBlogRequest $request, Blog $blog): JsonResponse
    {
        $data = $request->validated();
        
        if (isset($data['category'])) {
            $data['blog_category_id'] = $this->handleCategory($data['category']);
            unset($data['category']);
        }

        $blog->update($data);

        return response()->json([
            'message' => 'Article mis à jour avec succès',
            'data' => $blog->load('category')
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
        $blogs = Blog::with('category')->published()->orderBy('published_at', 'desc')->paginate($perPage);

        return response()->json($blogs);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        return $this->published($request);
    }

    public function publicShow(Blog $blog): JsonResponse
    {
        // Increment views only if not viewed recently? 
        // For simplicity, just increment.
        $blog->increment('views');
        $blog->load('category');
        
        return response()->json($blog);
    }

    private function handleCategory($input)
    {
        // Si c'est un UUID valide et qu'il existe, on l'utilise
        if (Str::isUuid($input)) {
            if (BlogCategory::where('id', $input)->exists()) {
                return $input;
            }
        }
        
        // Sinon on cherche par nom ou on crée
        $category = BlogCategory::firstOrCreate(
            ['name' => $input],
            ['slug' => Str::slug($input)]
        );
        
        return $category->id;
    }
}
