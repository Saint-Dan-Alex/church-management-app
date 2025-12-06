<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|string|max:255',
            'post_nom' => 'sometimes|nullable|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'nom_complet' => 'sometimes|nullable|string|max:255',
            'date_naissance' => 'sometimes|nullable|date',
            'genre' => 'sometimes|nullable|in:Masculin,Féminin',
            'etat_civil' => 'sometimes|nullable|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
            'adresse' => 'sometimes|nullable|string',
            'telephone' => 'sometimes|nullable|string|max:255',
            'email' => [
                'sometimes',
                'nullable',
                'email',
                Rule::unique('children')
                    ->ignore($this->route('child') instanceof \App\Models\Child ? $this->route('child')->id : $this->route('child'))
                    ->whereNull('deleted_at')
            ],
            'photo' => 'nullable|string',
            
            // Informations familiales
            'nom_pere' => 'sometimes|string|max:255',
            'nom_mere' => 'sometimes|string|max:255',
            'telephone_parent1' => 'sometimes|string|max:255',
            'telephone_parent2' => 'nullable|string|max:255',
            'email_parents' => 'sometimes|email',
            'contact_urgence' => 'sometimes|string|max:255',
            'lien_contact_urgence' => 'sometimes|string|max:255',
            
            // Parcours spirituel
            'date_conversion' => 'nullable|date',
            'date_bapteme' => 'nullable|date',
            'baptise_saint_esprit' => 'sometimes|nullable|in:Oui,Non,NSP',
            'vie_donnee_a_jesus' => 'sometimes|nullable|in:Oui,Non,Je ne sais pas',
            'est_ouvrier' => 'boolean',
            'commission_actuelle' => 'nullable|string|max:255',
            'commission_souhaitee' => 'nullable|string|max:255',
            'date_adhesion' => 'nullable|date',
            
            // Santé
            'allergies_connues' => 'boolean',
            'allergies_details' => 'nullable|string',
            'maladies' => 'nullable|string',
            'traitement' => 'nullable|string',
            'autorisation_soins' => 'boolean',
            
            // Évaluation
            'vie_chretienne' => 'nullable|in:Très bonne,Bonne,Moyenne,Faible,Très mauvaise',
            'vie_priere' => 'nullable|in:Excellente,Bonne,Moyenne,Faible,Très faible',
            'comprehension_bible' => 'nullable|in:Excellente,Bonne,Moyenne,Faible,Très faible',
            'gagne_une_ame' => 'sometimes|nullable|in:Oui,Non,Je ne sais pas',
            'encadreur' => 'sometimes|nullable|in:Oui,Non,NSP',
            'qualite_enseignements' => 'nullable|in:Bonne,Moyenne,Faible',
            'sujet_souhaite' => 'nullable|string',
            'besoin_suggestion' => 'nullable|string',
        ];
    }
}
