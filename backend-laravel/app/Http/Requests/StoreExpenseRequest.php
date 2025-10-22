<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'activity_id' => 'required|uuid|exists:activities,id',
            'activity_nom' => 'required|string|max:255',
            'categorie' => 'required|in:transport,repas,materiel,location,decoration,sonorisation,honoraires,cadeaux,autre',
            'description' => 'required|string',
            'montant' => 'required|numeric|min:0',
            'devise' => 'required|in:CDF,USD',
            'date' => 'required|date',
            'beneficiaire' => 'nullable|string|max:255',
            'reference_facture' => 'nullable|string|max:255',
            'remarque' => 'nullable|string',
            'ajoute_par' => 'required|uuid',
            'ajoute_par_nom' => 'required|string|max:255',
        ];
    }
}
