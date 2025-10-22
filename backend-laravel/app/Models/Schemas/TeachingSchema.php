<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Teaching",
 *     type="object",
 *     title="Teaching",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="theme", type="string"),
 *     @OA\Property(property="date_seance", type="string", format="date"),
 *     @OA\Property(property="lieu", type="string"),
 *     @OA\Property(property="orateur", type="string"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreTeachingRequest",
 *     type="object",
 *     @OA\Property(property="theme", type="string"),
 *     @OA\Property(property="date_seance", type="string", format="date"),
 *     @OA\Property(property="lieu", type="string"),
 *     @OA\Property(property="orateur", type="string"),
 *     @OA\Property(property="chants", type="array", @OA\Items(type="object")),
 *     @OA\Property(property="points", type="array", @OA\Items(type="object")),
 *     @OA\Property(property="evenements", type="array", @OA\Items(type="object"))
 * )
 */
class TeachingSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
