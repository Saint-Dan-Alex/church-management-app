<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
            'participant_id' => 'nullable|uuid',
            'participant_nom' => 'required|string|max:255',
            'participant_prenom' => 'required|string|max:255',
            'participant_nom_complet' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'devise' => 'required|in:CDF,USD',
            'montant_paye' => 'nullable|numeric|min:0',
            'statut' => 'sometimes|in:pending,paid,partial,overdue,cancelled',
            'methode_paiement' => 'nullable|in:cash,mobile_money,bank_transfer,card,other',
            'date_echeance' => 'required|date',
            'date_paiement' => 'nullable|date',
            'numero_paiement' => 'required|string|max:255|unique:payments,numero_paiement',
            'numero_recu' => 'nullable|string|max:255',
            'remarque' => 'nullable|string',
        ];
    }
}
