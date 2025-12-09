<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload un fichier (image)
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|image|max:5120', // Max 5MB
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads', 'public');
            $url = url('storage/' . $path);
            
            return response()->json([
                'path' => $path,
                'url' => $url,
            ]);
        }

        return response()->json(['message' => 'Aucun fichier fourni'], 400);
    }
}
