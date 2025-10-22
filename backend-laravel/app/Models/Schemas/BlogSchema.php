<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Blog",
 *     type="object",
 *     title="Blog",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="content", type="string"),
 *     @OA\Property(property="status", type="string", enum={"draft", "published"}),
 *     @OA\Property(property="category", type="string"),
 *     @OA\Property(property="views", type="integer"),
 *     @OA\Property(property="published_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreBlogRequest",
 *     type="object",
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="content", type="string"),
 *     @OA\Property(property="status", type="string", enum={"draft", "published"}),
 *     @OA\Property(property="category", type="string"),
 *     @OA\Property(property="published_at", type="string", format="date-time", nullable=true)
 * )
 */
class BlogSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
