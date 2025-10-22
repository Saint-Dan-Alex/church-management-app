<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Sortie",
 *     type="object",
 *     title="Sortie",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="categorie", type="string"),
 *     @OA\Property(property="montant", type="number", format="float"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}),
 *     @OA\Property(property="date_sortie", type="string", format="date"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreSortieRequest",
 *     type="object",
 *     @OA\Property(property="categorie", type="string"),
 *     @OA\Property(property="montant", type="number", format="float"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}),
 *     @OA\Property(property="date_sortie", type="string", format="date"),
 *     @OA\Property(property="description", type="string")
 * )
 */
class SortieSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
