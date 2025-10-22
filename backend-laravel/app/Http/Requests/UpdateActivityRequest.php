<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:gratuite,payante',
            'date' => 'sometimes|date',
            'heure_debut' => 'sometimes|date_format:H:i',
            'heure_fin' => 'sometimes|date_format:H:i|after:heure_debut',
            'lieu' => 'sometimes|string|max:255',
            'responsable' => 'sometimes|string|max:255',
            'responsable_id' => 'sometimes|uuid',
            'montant_requis' => 'nullable|numeric|min:0',
            'devise' => 'nullable|in:CDF,USD',
            'montant_alternatif' => 'nullable|numeric|min:0',
            'devise_alternative' => 'nullable|in:CDF,USD',
            'statut' => 'sometimes|in:planifiee,en_cours,terminee,annulee',
        ];
    }
}
