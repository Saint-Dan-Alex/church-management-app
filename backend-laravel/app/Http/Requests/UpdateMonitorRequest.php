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
            'postNom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'dateNaissance' => 'sometimes|date',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('monitors')->ignore($this->monitor)
            ],
            'telephone' => 'sometimes|string|max:255',
            'adresse' => 'sometimes|string',
            'photo' => 'nullable|string',
            'dateConversion' => 'nullable|date',
            'dateBapteme' => 'nullable|date',
            'baptiseSaintEsprit' => 'boolean',
            'etatCivil' => 'sometimes|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
            'dateAdhesion' => 'sometimes|date',
            'salleActuelleId' => 'nullable|uuid|exists:salles,id',
            'salleActuelleNom' => 'nullable|string|max:255',
            'roleActuel' => 'nullable|string|max:255',
            'dateAffectationActuelle' => 'nullable|date',
        ];
    }
}
