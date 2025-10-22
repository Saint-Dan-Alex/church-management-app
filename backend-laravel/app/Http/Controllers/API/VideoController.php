<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVideoRequest;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VideoController extends Controller
{
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

    public function store(StoreVideoRequest $request): JsonResponse
    {
        $video = Video::create($request->validated());

        return response()->json([
            'message' => 'Vidéo créée avec succès',
            'data' => $video
        ], 201);
    }

    public function show(Video $video): JsonResponse
    {
        $video->increment('views');
        
        return response()->json($video);
    }

    public function update(StoreVideoRequest $request, Video $video): JsonResponse
    {
        $video->update($request->validated());

        return response()->json([
            'message' => 'Vidéo mise à jour avec succès',
            'data' => $video
        ]);
    }

    public function destroy(Video $video): JsonResponse
    {
        $video->delete();

        return response()->json([
            'message' => 'Vidéo supprimée avec succès'
        ]);
    }

    public function featured(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $videos = Video::featured()->orderBy('date_enregistrement', 'desc')->paginate($perPage);

        return response()->json($videos);
    }
}
