<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Video",
 *     type="object",
 *     title="Video",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="titre", type="string"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="url", type="string"),
 *     @OA\Property(property="category", type="string"),
 *     @OA\Property(property="date_enregistrement", type="string", format="date"),
 *     @OA\Property(property="is_featured", type="boolean"),
 *     @OA\Property(property="views", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreVideoRequest",
 *     type="object",
 *     @OA\Property(property="titre", type="string"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="url", type="string"),
 *     @OA\Property(property="category", type="string"),
 *     @OA\Property(property="date_enregistrement", type="string", format="date"),
 *     @OA\Property(property="is_featured", type="boolean")
 * )
 */
class VideoSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
