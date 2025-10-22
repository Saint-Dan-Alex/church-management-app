<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Presence",
 *     type="object",
 *     title="Presence",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="activity_id", type="string", format="uuid"),
 *     @OA\Property(property="moniteur_id", type="string", format="uuid"),
 *     @OA\Property(property="date_presence", type="string", format="date"),
 *     @OA\Property(property="statut", type="string", enum={"present", "absent", "retard", "excuse"}),
 *     @OA\Property(property="commentaire", type="string", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StorePresenceRequest",
 *     type="object",
 *     @OA\Property(property="activity_id", type="string", format="uuid"),
 *     @OA\Property(property="moniteur_id", type="string", format="uuid"),
 *     @OA\Property(property="date_presence", type="string", format="date"),
 *     @OA\Property(property="statut", type="string", enum={"present", "absent", "retard", "excuse"}),
 *     @OA\Property(property="commentaire", type="string", nullable=true)
 * )
 */
class PresenceSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
