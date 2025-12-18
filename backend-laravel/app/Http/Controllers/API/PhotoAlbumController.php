<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PhotoAlbum;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PhotoAlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $albums = PhotoAlbum::orderBy('name')->get();
        return response()->json($albums);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $album = PhotoAlbum::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json($album, 201);
    }
    public function publicIndex(): JsonResponse
    {
        $albums = PhotoAlbum::with('photos')->orderBy('created_at', 'desc')->get();
        
        $albums->transform(function ($album) {
            $album->photo_count = $album->photos->count();
            $album->cover_image = $album->photos->first() ? $album->photos->first()->url : null;
            $album->unsetRelation('photos');
            return $album;
        });

        return response()->json($albums);
    }

    public function publicShow(PhotoAlbum $photoAlbum): JsonResponse
    {
        $photoAlbum->load('photos');
        return response()->json($photoAlbum);
    }
}
