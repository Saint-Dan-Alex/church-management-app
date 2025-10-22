<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'required|url',
            'thumbnail' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'duration' => 'nullable|string',
            'date_enregistrement' => 'nullable|date',
            'predicateur' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'is_featured' => 'boolean',
        ];
    }
}
