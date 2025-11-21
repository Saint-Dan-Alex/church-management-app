<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telephone' => 'required|string|max:255',
            'role' => 'required|in:ADMIN,COORDINATION,CHEF_SALLE,MONITEUR,FINANCIER,ENFANT,PARENT',
            'avatar' => 'nullable|string',
            'actif' => 'required|boolean',
            'dateCreation' => 'required|date',
            'password' => 'required|string|min:8',
        ];
    }
}
