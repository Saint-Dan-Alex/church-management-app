<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'author' => 'required|string|max:255',
            'category' => 'required', // Accepte UUID ou string (nom de nouvelle catégorie)
            'status' => 'required|in:draft,published',
            'views' => 'nullable|integer',
            'image' => 'nullable|string',
            'tags' => 'nullable|array',
            'published_at' => 'nullable|date',
        ];
    }
}
