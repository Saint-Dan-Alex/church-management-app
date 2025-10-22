<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Child",
 *     type="object",
 *     title="Child",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="prenom", type="string"),
 *     @OA\Property(property="genre", type="string", enum={"Masculin", "Féminin"}),
 *     @OA\Property(property="date_naissance", type="string", format="date"),
 *     @OA\Property(property="email", type="string", nullable=true),
 *     @OA\Property(property="telephone", type="string", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreChildRequest",
 *     type="object",
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="prenom", type="string"),
 *     @OA\Property(property="genre", type="string", enum={"Masculin", "Féminin"}),
 *     @OA\Property(property="date_naissance", type="string", format="date"),
 *     @OA\Property(property="email", type="string", nullable=true),
 *     @OA\Property(property="telephone", type="string", nullable=true)
 * )
 *
 * @OA\Schema(
 *     schema="UpdateChildRequest",
 *     type="object",
 *     description="Tous les champs sont optionnels pour la mise à jour",
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="prenom", type="string"),
 *     @OA\Property(property="genre", type="string", enum={"Masculin", "Féminin"}),
 *     @OA\Property(property="date_naissance", type="string", format="date"),
 *     @OA\Property(property="email", type="string", nullable=true),
 *     @OA\Property(property="telephone", type="string", nullable=true)
 * )
 */
class ChildSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
