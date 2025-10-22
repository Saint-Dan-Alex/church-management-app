<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'post_nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'genre' => 'required|in:Masculin,Féminin',
            'etat_civil' => 'required|in:Célibataire,Marié(e),Veuf(ve),Divorcé(e)',
            'adresse' => 'required|string',
            'telephone' => 'required|string|max:255',
            'email' => 'required|email|unique:children,email',
            'photo' => 'nullable|string',
            
            // Informations familiales
            'nom_pere' => 'required|string|max:255',
            'nom_mere' => 'required|string|max:255',
            'telephone_parent1' => 'required|string|max:255',
            'telephone_parent2' => 'nullable|string|max:255',
            'email_parents' => 'required|email',
            'contact_urgence' => 'required|string|max:255',
            'lien_contact_urgence' => 'required|string|max:255',
            
            // Parcours spirituel
            'date_conversion' => 'nullable|date',
            'date_bapteme' => 'nullable|date',
            'baptise_saint_esprit' => 'required|in:Oui,Non,NSP',
            'vie_donnee_a_jesus' => 'required|in:Oui,Non,Je ne sais pas',
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
            'gagne_une_ame' => 'required|in:Oui,Non,Je ne sais pas',
            'encadreur' => 'required|in:Oui,Non,NSP',
            'qualite_enseignements' => 'nullable|in:Bonne,Moyenne,Faible',
            'sujet_souhaite' => 'nullable|string',
            'besoin_suggestion' => 'nullable|string',
        ];
    }
}
