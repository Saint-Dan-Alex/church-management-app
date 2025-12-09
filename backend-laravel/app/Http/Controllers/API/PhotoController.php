<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePhotoRequest;
use App\Models\Photo;
use App\Models\PhotoAlbum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    /**
     * Liste toutes les photos
     */
    public function index(Request $request): JsonResponse
    {
        $query = Photo::with('album');

        if ($request->has('album')) {
            $query->byAlbum($request->album);
        }

        $perPage = $request->get('per_page', 20);
        $photos = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($photos);
    }

    /**
     * Créer une photo
     */
    public function store(StorePhotoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['album'])) {
            $data['photo_album_id'] = $this->handleAlbum($data['album']);
            unset($data['album']);
        }

        $photo = Photo::create($data);
        $photo->load('album');

        return response()->json([
            'message' => 'Photo créée avec succès',
            'data' => $photo
        ], 201);
    }

    /**
     * Détails d'une photo
     */
    public function show(Photo $photo): JsonResponse
    {
        $photo->load('album');
        return response()->json($photo);
    }

    /**
     * Modifier une photo
     */
    public function update(StorePhotoRequest $request, Photo $photo): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['album'])) {
            $data['photo_album_id'] = $this->handleAlbum($data['album']);
            unset($data['album']);
        }

        $photo->update($data);
        $photo->load('album');

        return response()->json([
            'message' => 'Photo mise à jour avec succès',
            'data' => $photo
        ]);
    }

    /**
     * Supprimer une photo
     */
    public function destroy(Photo $photo): JsonResponse
    {
        $photo->delete();

        return response()->json([
            'message' => 'Photo supprimée avec succès'
        ]);
    }

    /**
     * Gérer la création ou récupération de l'album
     */
    private function handleAlbum($albumInput)
    {
        if (!$albumInput) {
            return null;
        }

        // Si c'est un UUID valide et qu'il existe
        if (Str::isUuid($albumInput)) {
            if (PhotoAlbum::where('id', $albumInput)->exists()) {
                return $albumInput;
            }
        }

        // Sinon chercher par slug ou nom, ou créer
        $slug = Str::slug($albumInput);
        $album = PhotoAlbum::where('slug', $slug)
                          ->orWhere('name', $albumInput)
                          ->first();

        if (!$album) {
            $album = PhotoAlbum::create([
                'name' => $albumInput,
                'slug' => $slug,
            ]);
        }

        return $album->id;
    }
}
