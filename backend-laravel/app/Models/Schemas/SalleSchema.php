<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Salle",
 *     type="object",
 *     title="Salle",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="capacite", type="integer"),
 *     @OA\Property(property="actif", type="boolean"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreSalleRequest",
 *     type="object",
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="capacite", type="integer"),
 *     @OA\Property(property="actif", type="boolean")
 * )
 *
 * @OA\Schema(
 *     schema="UpdateSalleRequest",
 *     type="object",
 *     description="Tous les champs sont optionnels pour la mise à jour",
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="capacite", type="integer"),
 *     @OA\Property(property="actif", type="boolean")
 * )
 */
class SalleSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
