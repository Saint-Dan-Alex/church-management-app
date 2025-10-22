<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePhotoRequest;
use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
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

    public function store(StorePhotoRequest $request): JsonResponse
    {
        $photo = Photo::create($request->validated());

        return response()->json([
            'message' => 'Photo créée avec succès',
            'data' => $photo
        ], 201);
    }

    public function show(Photo $photo): JsonResponse
    {
        return response()->json($photo);
    }

    public function update(StorePhotoRequest $request, Photo $photo): JsonResponse
    {
        $photo->update($request->validated());

        return response()->json([
            'message' => 'Photo mise à jour avec succès',
            'data' => $photo
        ]);
    }

    public function destroy(Photo $photo): JsonResponse
    {
        $photo->delete();

        return response()->json([
            'message' => 'Photo supprimée avec succès'
        ]);
    }

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
