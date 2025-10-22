<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Payment",
 *     type="object",
 *     title="Payment",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="activity_id", type="string", format="uuid"),
 *     @OA\Property(property="montant_paye", type="number", format="float"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}),
 *     @OA\Property(property="statut", type="string", enum={"pending", "paid", "partial", "overdue", "cancelled"}),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StorePaymentRequest",
 *     type="object",
 *     @OA\Property(property="activity_id", type="string", format="uuid"),
 *     @OA\Property(property="montant_paye", type="number", format="float"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}),
 *     @OA\Property(property="statut", type="string", enum={"pending", "paid", "partial", "overdue", "cancelled"})
 * )
 */
class PaymentSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
