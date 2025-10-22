<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Activity",
 *     type="object",
 *     title="Activity",
 *     description="Modèle d'activité/événement",
 *     @OA\Property(property="id", type="string", format="uuid"),
 *     @OA\Property(property="titre", type="string", example="Camp de vacances 2025"),
 *     @OA\Property(property="description", type="string", example="Camp pour les enfants pendant les vacances"),
 *     @OA\Property(property="type", type="string", enum={"gratuite", "payante"}, example="payante"),
 *     @OA\Property(property="date", type="string", format="date", example="2025-07-15"),
 *     @OA\Property(property="heure_debut", type="string", format="time", example="09:00"),
 *     @OA\Property(property="heure_fin", type="string", format="time", example="17:00"),
 *     @OA\Property(property="lieu", type="string", example="Centre Kivuli"),
 *     @OA\Property(property="responsable", type="string", example="Pastor John"),
 *     @OA\Property(property="responsable_id", type="string", format="uuid"),
 *     @OA\Property(property="montant_requis", type="number", format="float", nullable=true, example=50000),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}, nullable=true, example="CDF"),
 *     @OA\Property(property="montant_alternatif", type="number", format="float", nullable=true, example=50),
 *     @OA\Property(property="devise_alternative", type="string", enum={"CDF", "USD"}, nullable=true, example="USD"),
 *     @OA\Property(property="statut", type="string", enum={"planifiee", "en_cours", "terminee", "annulee"}, example="planifiee"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreActivityRequest",
 *     type="object",
 *     required={"titre", "description", "type", "date", "heure_debut", "heure_fin", "lieu", "responsable", "responsable_id"},
 *     @OA\Property(property="titre", type="string", example="Camp de vacances 2025"),
 *     @OA\Property(property="description", type="string", example="Camp pour les enfants"),
 *     @OA\Property(property="type", type="string", enum={"gratuite", "payante"}, example="payante"),
 *     @OA\Property(property="date", type="string", format="date", example="2025-07-15"),
 *     @OA\Property(property="heure_debut", type="string", format="time", example="09:00"),
 *     @OA\Property(property="heure_fin", type="string", format="time", example="17:00"),
 *     @OA\Property(property="lieu", type="string", example="Centre Kivuli"),
 *     @OA\Property(property="responsable", type="string", example="Pastor John"),
 *     @OA\Property(property="responsable_id", type="string", format="uuid"),
 *     @OA\Property(property="montant_requis", type="number", format="float", nullable=true, description="Requis si type=payante"),
 *     @OA\Property(property="devise", type="string", enum={"CDF", "USD"}, nullable=true),
 *     @OA\Property(property="montant_alternatif", type="number", format="float", nullable=true),
 *     @OA\Property(property="devise_alternative", type="string", enum={"CDF", "USD"}, nullable=true),
 *     @OA\Property(property="statut", type="string", enum={"planifiee", "en_cours", "terminee", "annulee"}, example="planifiee")
 * )
 */
class ActivitySchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
