<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="WorshipReport",
 *     type="object",
 *     title="WorshipReport",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="date", type="string", format="date"),
 *     @OA\Property(property="salle", type="string"),
 *     @OA\Property(property="effectif", type="integer"),
 *     @OA\Property(property="offrande_cdf", type="number", format="float"),
 *     @OA\Property(property="offrande_usd", type="number", format="float"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreWorshipReportRequest",
 *     type="object",
 *     @OA\Property(property="date", type="string", format="date"),
 *     @OA\Property(property="salle", type="string"),
 *     @OA\Property(property="effectif", type="integer"),
 *     @OA\Property(property="offrande_cdf", type="number", format="float"),
 *     @OA\Property(property="offrande_usd", type="number", format="float"),
 *     @OA\Property(property="nouveaux_venus", type="array", @OA\Items(type="object"))
 * )
 */
class WorshipReportSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
