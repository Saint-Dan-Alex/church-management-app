<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:gratuite,payante',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'lieu' => 'required|string|max:255',
            'responsable' => 'required|string|max:255',
            'responsable_id' => 'required|uuid',
            'montant_requis' => 'nullable|required_if:type,payante|numeric|min:0',
            'devise' => 'nullable|required_if:type,payante|in:CDF,USD',
            'montant_alternatif' => 'nullable|numeric|min:0',
            'devise_alternative' => 'nullable|in:CDF,USD',
            'statut' => 'sometimes|in:planifiee,en_cours,terminee,annulee',
        ];
    }
}
