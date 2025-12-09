<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Get all settings, optionally filtered by group.
     */
    public function index(Request $request)
    {
        $query = Setting::query();

        if ($request->has('group')) {
            $query->where('group', $request->group);
        }

        if ($request->boolean('public_only')) {
            $query->where('is_public', true);
        }

        // Return as key-value pairs for easier frontend usage
        $settings = $query->get();
        
        // Transform to key => value object if requested, otherwise list
        if ($request->boolean('key_value')) {
            return response()->json($settings->pluck('value', 'key'));
        }

        return response()->json($settings);
    }

    /**
     * Update multiple settings.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value']]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Upload a file for a specific setting key (logo, hero_image, etc).
     */
    public function upload(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'file' => 'required|image|max:10240', // 10MB max
            'group' => 'nullable|string'
        ]);

        $key = $request->input('key');
        
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('settings', 'public');
            $url = Storage::url($path);

            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $url,
                    'type' => 'image',
                    'group' => $request->input('group', 'general'),
                    'is_public' => true
                ]
            );

            return response()->json(['url' => $url]);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
