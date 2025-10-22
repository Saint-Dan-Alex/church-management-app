<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Photo",
 *     type="object",
 *     title="Photo",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="titre", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="url", type="string"),
 *     @OA\Property(property="album", type="string", nullable=true),
 *     @OA\Property(property="date_prise", type="string", format="date"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StorePhotoRequest",
 *     type="object",
 *     @OA\Property(property="titre", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="url", type="string"),
 *     @OA\Property(property="album", type="string", nullable=true),
 *     @OA\Property(property="date_prise", type="string", format="date")
 * )
 */
class PhotoSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
