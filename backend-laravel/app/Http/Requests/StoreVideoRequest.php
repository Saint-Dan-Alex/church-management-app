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
            'miniature' => 'nullable|string',
            'url' => 'required|string',
            'type' => 'nullable|string|max:255',
            'categorie' => 'nullable|string|max:255',
            'duree' => 'nullable|string|max:50',
            'date' => 'nullable|date',
            'auteur' => 'nullable|string|max:255',
            'vues' => 'nullable|integer',
        ];
    }
}
