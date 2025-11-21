<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMonitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'postNom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'dateNaissance' => 'required|date',
            'email' => 'required|email|unique:monitors,email',
            'telephone' => 'required|string|max:255',
            'adresse' => 'required|string',
            'photo' => 'nullable|string',
            'dateConversion' => 'nullable|date',
            'dateBapteme' => 'nullable|date',
            'baptiseSaintEsprit' => 'required|boolean',
            'etatCivil' => 'required|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
            'dateAdhesion' => 'required|date',
            'salleActuelleId' => 'nullable|uuid|exists:salles,id',
            'salleActuelleNom' => 'nullable|string|max:255',
            'roleActuel' => 'nullable|in:responsable,adjoint,membre',
            'dateAffectationActuelle' => 'nullable|date',
        ];
    }
}
