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
            'membre_nom' => 'required|string|max:255',
            'type_cotisation' => 'required|in:mensuelle,annuelle,speciale,autre',
            'montant' => 'required|numeric|min:0',
            'devise' => 'required|in:CDF,USD',
            'date_cotisation' => 'required|date',
            'mois' => 'nullable|string|max:255',
            'annee' => 'nullable|string|max:4',
            'mode_paiement' => 'required|in:cash,mobile_money,bank_transfer,card,other',
            'numero_recu' => 'nullable|string|max:255|unique:cotisations,numero_recu',
            'remarque' => 'nullable|string',
            'enregistre_par' => 'required|uuid',
            'enregistre_par_nom' => 'required|string|max:255',
        ];
    }
}
