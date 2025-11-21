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
            'moniteur' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'devise' => 'required|in:CDF,USD',
            'periode' => 'required|string|max:255',
            'datePaiement' => 'nullable|date',
            'statut' => 'required|in:Payé,En attente,Annulé',
            'modePaiement' => 'required|string|max:255',
            'remarque' => 'nullable|string',
        ];
    }
}
