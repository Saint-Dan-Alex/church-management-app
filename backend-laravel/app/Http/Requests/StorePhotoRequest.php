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
            'album' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'auteur' => 'nullable|string|max:255',
        ];
    }
}
