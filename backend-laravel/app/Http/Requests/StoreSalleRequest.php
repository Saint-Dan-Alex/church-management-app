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
            'responsable_id' => 'nullable|uuid|exists:monitors,id',
            'responsable_nom' => 'nullable|string|max:255',
            'adjoint_id' => 'nullable|uuid|exists:monitors,id',
            'adjoint_nom' => 'nullable|string|max:255',
            'actif' => 'boolean',
        ];
    }
}
