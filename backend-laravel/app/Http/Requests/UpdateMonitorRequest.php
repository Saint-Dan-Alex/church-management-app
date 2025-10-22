<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMonitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|string|max:255',
            'post_nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'date_naissance' => 'sometimes|date',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('monitors')->ignore($this->monitor)
            ],
            'telephone' => 'sometimes|string|max:255',
            'adresse' => 'sometimes|string',
            'photo' => 'nullable|string',
            'date_conversion' => 'nullable|date',
            'date_bapteme' => 'nullable|date',
            'baptise_saint_esprit' => 'boolean',
            'etat_civil' => 'sometimes|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
            'date_adhesion' => 'sometimes|date',
            'salle_actuelle_id' => 'nullable|uuid|exists:salles,id',
            'salle_actuelle_nom' => 'nullable|string|max:255',
            'role_actuel' => 'nullable|in:responsable,adjoint,membre',
            'date_affectation_actuelle' => 'nullable|date',
        ];
    }
}
