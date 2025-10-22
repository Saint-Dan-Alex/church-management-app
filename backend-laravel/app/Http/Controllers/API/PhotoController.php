<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePhotoRequest;
use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    /** @OA\Get(path="/photos", tags={"Photos"}, summary="Liste toutes les photos", @OA\Parameter(name="album", in="query", required=false, @OA\Schema(type="string")), @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=20)), @OA\Response(response=200, description="Liste récupérée")) */
    public function index(Request $request): JsonResponse
    {
        $query = Photo::query();

        if ($request->has('album')) {
            $query->byAlbum($request->album);
        }

        $perPage = $request->get('per_page', 20);
        $photos = $query->recent()->paginate($perPage);

        return response()->json($photos);
    }

    /** @OA\Post(path="/photos", tags={"Photos"}, summary="Créer une photo", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StorePhotoRequest")), @OA\Response(response=201, description="Photo créée"), @OA\Response(response=422, description="Erreur de validation")) */
    public function store(StorePhotoRequest $request): JsonResponse
    {
        $photo = Photo::create($request->validated());

        return response()->json([
            'message' => 'Photo créée avec succès',
            'data' => $photo
        ], 201);
    }

    /** @OA\Get(path="/photos/{id}", tags={"Photos"}, summary="Détails d'une photo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Détails"), @OA\Response(response=404, description="Non trouvée")) */
    public function show(Photo $photo): JsonResponse
    {
        return response()->json($photo);
    }

    /** @OA\Put(path="/photos/{id}", tags={"Photos"}, summary="Modifier une photo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/StorePhotoRequest")), @OA\Response(response=200, description="Mise à jour"), @OA\Response(response=404, description="Non trouvée")) */
    public function update(StorePhotoRequest $request, Photo $photo): JsonResponse
    {
        $photo->update($request->validated());

        return response()->json([
            'message' => 'Photo mise à jour avec succès',
            'data' => $photo
        ]);
    }

    /** @OA\Delete(path="/photos/{id}", tags={"Photos"}, summary="Supprimer une photo", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string", format="uuid")), @OA\Response(response=200, description="Supprimée"), @OA\Response(response=404, description="Non trouvée")) */
    public function destroy(Photo $photo): JsonResponse
    {
        $photo->delete();

        return response()->json([
            'message' => 'Photo supprimée avec succès'
        ]);
    }

    /** @OA\Get(path="/photos-albums", tags={"Photos"}, summary="Liste des albums", @OA\Response(response=200, description="Liste des albums disponibles")) */
    public function albums(): JsonResponse
    {
        $albums = Photo::select('album')
            ->whereNotNull('album')
            ->distinct()
            ->get()
            ->pluck('album');

        return response()->json($albums);
    }
}
