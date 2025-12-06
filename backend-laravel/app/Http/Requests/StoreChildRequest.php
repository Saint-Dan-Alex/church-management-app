<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'post_nom' => 'nullable|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'genre' => 'required|in:Masculin,Féminin',
            'etat_civil' => 'required|string',
            'adresse' => 'required|string',
            'telephone' => 'required|string',
            'email' => [
                'required',
                'email',
                Rule::unique('children')->whereNull('deleted_at')
            ],
            'photo' => 'nullable|string',
            'nom_pere' => 'required|string|max:255',
            'nom_mere' => 'required|string|max:255',
            'telephone_parent1' => 'required|string',
            'telephone_parent2' => 'nullable|string',
            'email_parents' => 'required|email',
            'contact_urgence' => 'required|string',
            'lien_contact_urgence' => 'required|string',
            'date_conversion' => 'nullable|date',
            'date_bapteme' => 'nullable|date',
            'baptise_saint_esprit' => 'nullable|in:Oui,Non,NSP',
            'vie_donnee_a_jesus' => 'nullable|in:Oui,Non,Je ne sais pas',
            'est_ouvrier' => 'boolean',
            'commission_actuelle' => 'nullable|string',
            'commission_souhaitee' => 'nullable|string',
            'date_adhesion' => 'nullable|date',
            'allergies_connues' => 'boolean',
            'allergies_details' => 'nullable|string',
            'maladies' => 'nullable|string',
            'traitement' => 'nullable|string',
            'autorisation_soins' => 'boolean',
            'vie_chretienne' => 'nullable|string',
            'vie_priere' => 'nullable|string',
            'comprehension_bible' => 'nullable|string',
            'gagne_une_ame' => 'nullable|in:Oui,Non,Je ne sais pas',
            'encadreur' => 'nullable|in:Oui,Non,NSP',
            'qualite_enseignements' => 'nullable|string',
            'sujet_souhaite' => 'nullable|string',
            'besoin_suggestion' => 'nullable|string',
        ];
    }
}
