<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSortieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'required|string|max:255', // Accepte UUID ou nom de catégorie
            'montant' => 'required|numeric|min:0',
            'devise' => 'required|in:CDF,USD',
            'date_sortie' => 'required|date',
            'beneficiaire' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:255',
            'remarque' => 'nullable|string',
            'enregistre_par' => 'nullable|string|max:255', // Accepte "1" ou UUID
            'enregistre_par_nom' => 'required|string|max:255',
        ];
    }
}
