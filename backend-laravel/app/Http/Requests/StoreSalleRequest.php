<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'capacite' => 'required|integer|min:1',
            'responsableId' => 'nullable|uuid|exists:monitors,id',
            'responsableNom' => 'nullable|string|max:255',
            'adjointId' => 'nullable|uuid|exists:monitors,id',
            'adjointNom' => 'nullable|string|max:255',
            'actif' => 'required|boolean',
        ];
    }
}
