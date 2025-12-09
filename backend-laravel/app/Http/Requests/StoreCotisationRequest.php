<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCotisationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'membre_id' => 'nullable|string|max:255',
            'membre_nom' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'devise' => 'required|in:CDF,USD',
            'mois' => 'nullable|string|max:50',
            'annee' => 'nullable|string|max:10',
            'date_cotisation' => 'nullable|date',
            'mode_paiement' => 'nullable|string|max:255',
            'numero_recu' => 'nullable|string|max:255',
            'remarque' => 'nullable|string',
            'type_cotisation' => 'nullable|string|max:255',
            'enregistre_par' => 'nullable|string|max:255',
            'enregistre_par_nom' => 'nullable|string|max:255',
        ];
    }
}
