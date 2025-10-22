<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVideoRequest;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    /** @OA\Get(path="/videos", tags={"Videos"}, summary="Liste toutes les vidéos", @OA\Parameter(name="category", in="query", required=false, @OA\Schema(type="string")), @OA\Parameter(name="is_featured", in="query", required=false, @OA\Schema(type="boolean")), @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)), @OA\Response(response=200, description="Liste récupérée")) */
    public function index(Request $request): JsonResponse
    {
        $query = Video::query();

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        $perPage = $request->get('per_page', 15);
        $videos = $query->orderBy('date_enregistrement', 'desc')->paginate($perPage);

        return response()->json($videos);
    }

    /** @OA\Post(path="/videos", tags={"Videos"}, summary="Créer une vidéo", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreVideoRequest")), @OA\Response(response=201, description="Vidéo créée"), @OA\Response(response=422, description="Erreur de validation")) */
    public function store(StoreVideoRequest $request): JsonResponse
    {
        $video = Video::create($request->validated());

        return response()->json([
            'message' => 'Vidéo créée avec succès',
            'data' => $video
        ], 201);
    }

    /** @OA\Get(path="/videos/{id}", tags={"Videos"}, summary="Détails d'une vidéo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvée")) */
    public function show(Video $video): JsonResponse
    {
        $video->increment('views');
        
        return response()->json($video);
    }

    /** @OA\Put(path="/videos/{id}", tags={"Videos"}, summary="Modifier une vidéo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StoreVideoRequest")), @OA\Response(response=200, description="Mise à jour"), @OA\Response(response=404, description="Non trouvée")) */
    public function update(StoreVideoRequest $request, Video $video): JsonResponse
    {
        $video->update($request->validated());

        return response()->json([
            'message' => 'Vidéo mise à jour avec succès',
            'data' => $video
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
        $videos = Video::featured()->orderBy('date_enregistrement', 'desc')->paginate($perPage);

        return response()->json($videos);
    }
}
