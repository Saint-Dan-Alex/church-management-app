<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
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
            'url' => 'required|string',
            'thumbnail' => 'nullable|string',
            'album' => 'nullable|string|max:255',
            'date_prise' => 'nullable|date',
            'photographe' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'width' => 'nullable|integer',
            'height' => 'nullable|integer',
            'format' => 'nullable|string|max:50',
            'size' => 'nullable|integer',
        ];
    }
}
