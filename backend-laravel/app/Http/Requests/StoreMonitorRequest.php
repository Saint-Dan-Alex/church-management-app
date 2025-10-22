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
            'post_nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'email' => 'required|email|unique:monitors,email',
            'telephone' => 'required|string|max:255',
            'adresse' => 'required|string',
            'photo' => 'nullable|string',
            'date_conversion' => 'nullable|date',
            'date_bapteme' => 'nullable|date',
            'baptise_saint_esprit' => 'boolean',
            'etat_civil' => 'required|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
            'date_adhesion' => 'required|date',
            'salle_actuelle_id' => 'nullable|uuid|exists:salles,id',
            'salle_actuelle_nom' => 'nullable|string|max:255',
            'role_actuel' => 'nullable|in:responsable,adjoint,membre',
            'date_affectation_actuelle' => 'nullable|date',
        ];
    }
}
