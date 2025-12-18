<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVideoRequest;
use App\Models\Video;
use App\Models\VideoCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VideoController extends Controller
{
    /** @OA\Get(path="/videos", tags={"Videos"}, summary="Liste toutes les vidéos", @OA\Parameter(name="category", in="query", required=false, @OA\Schema(type="string")), @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)), @OA\Response(response=200, description="Liste récupérée")) */
    public function index(Request $request): JsonResponse
    {
        $query = Video::with('category');

        if ($request->has('category')) {
            $cat = $request->category;
            if (Str::isUuid($cat)) {
                $query->where('video_category_id', $cat);
            } else {
                $query->whereHas('category', function($q) use ($cat) {
                    $q->where('name', $cat)->orWhere('slug', $cat);
                });
            }
        }

        $perPage = $request->get('per_page', 15);
        $videos = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($videos);
    }

    /** @OA\Post(path="/videos", tags={"Videos"}, summary="Créer une vidéo", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreVideoRequest")), @OA\Response(response=201, description="Vidéo créée"), @OA\Response(response=422, description="Erreur de validation")) */
    public function store(StoreVideoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['categorie'])) {
            $data['video_category_id'] = $this->handleCategory($data['categorie']);
            unset($data['categorie']);
        }

        $video = Video::create($data);

        return response()->json([
            'message' => 'Vidéo créée avec succès',
            'data' => $video->load('category')
        ], 201);
    }

    /** @OA\Get(path="/videos/{id}", tags={"Videos"}, summary="Détails d'une vidéo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvée")) */
    public function show(Video $video): JsonResponse
    {
        $video->increment('vues');
        
        return response()->json($video->load('category'));
    }

    /** @OA\Put(path="/videos/{id}", tags={"Videos"}, summary="Modifier une vidéo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreVideoRequest")), @OA\Response(response=200, description="Mise à jour"), @OA\Response(response=404, description="Non trouvée")) */
    public function update(StoreVideoRequest $request, Video $video): JsonResponse
    {
        $data = $request->validated();
        
        if (isset($data['categorie'])) {
            $data['video_category_id'] = $this->handleCategory($data['categorie']);
            unset($data['categorie']);
        }

        $video->update($data);

        return response()->json([
            'message' => 'Vidéo mise à jour avec succès',
            'data' => $video->load('category')
        ]);
    }

    /** @OA\Delete(path="/videos/{id}", tags={"Videos"}, summary="Supprimer une vidéo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimée"), @OA\Response(response=404, description="Non trouvée")) */
    public function destroy(Video $video): JsonResponse
    {
        $video->delete();

        return response()->json([
            'message' => 'Vidéo supprimée avec succès'
        ]);
    }

    /** @OA\Get(path="/videos-featured", tags={"Videos"}, summary="Vidéos en vedette", @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=10)), @OA\Response(response=200, description="Vidéos en vedette")) */
    public function featured(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        // Pas de scope featured, on retourne les récents
        $videos = Video::with('category')->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($videos);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        return $this->index($request);
    }

    public function publicShow(Video $video): JsonResponse
    {
        $video->increment('vues');
        return response()->json($video->load('category'));
    }

    private function handleCategory($input)
    {
        if (!$input) return null;

        if (Str::isUuid($input)) {
            if (VideoCategory::where('id', $input)->exists()) {
                return $input;
            }
        }
        
        $category = VideoCategory::firstOrCreate(
            ['name' => $input],
            ['slug' => Str::slug($input)]
        );
        
        return $category->id;
    }
}
