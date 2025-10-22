<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Cotisation",
 *     type="object",
 *     title="Cotisation",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="type_cotisation", type="string"),
 *     @OA\Property(property="montant", type="number", format="float"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}),
 *     @OA\Property(property="date_cotisation", type="string", format="date"),
 *     @OA\Property(property="mois", type="string"),
 *     @OA\Property(property="annee", type="string"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreCotisationRequest",
 *     type="object",
 *     @OA\Property(property="type_cotisation", type="string"),
 *     @OA\Property(property="montant", type="number", format="float"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}),
 *     @OA\Property(property="date_cotisation", type="string", format="date"),
 *     @OA\Property(property="mois", type="string"),
 *     @OA\Property(property="annee", type="string")
 * )
 */
class CotisationSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
