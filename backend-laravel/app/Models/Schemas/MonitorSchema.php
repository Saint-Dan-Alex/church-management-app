<?php

namespace App\Models\Schemas;

/**
 * @OA\Schema(
 *     schema="Monitor",
 *     type="object",
 *     title="Monitor",
 *     description="Modèle de moniteur/encadrant",
 *     @OA\Property(property="id", type="string", format="uuid", example="550e8400-e29b-41d4-a716-446655440000"),
 *     @OA\Property(property="nom", type="string", example="KABAMBA"),
 *     @OA\Property(property="post_nom", type="string", example="MBUYU"),
 *     @OA\Property(property="prenom", type="string", example="Jean"),
 *     @OA\Property(property="nom_complet", type="string", example="KABAMBA MBUYU Jean"),
 *     @OA\Property(property="date_naissance", type="string", format="date", example="1990-05-15"),
 *     @OA\Property(property="email", type="string", format="email", example="jean.kabamba@example.com"),
 *     @OA\Property(property="telephone", type="string", example="+243900000000"),
 *     @OA\Property(property="adresse", type="string", example="Lubumbashi, Congo"),
 *     @OA\Property(property="photo", type="string", nullable=true, example="https://example.com/photo.jpg"),
 *     @OA\Property(property="date_conversion", type="string", format="date", nullable=true, example="2015-03-20"),
 *     @OA\Property(property="date_bapteme", type="string", format="date", nullable=true, example="2015-06-15"),
 *     @OA\Property(property="baptise_saint_esprit", type="boolean", example=true),
 *     @OA\Property(property="etat_civil", type="string", enum={"Célibataire", "Marié(e)", "Veuf(ve)", "Divorcé(e)"}, example="Marié(e)"),
 *     @OA\Property(property="date_adhesion", type="string", format="date", example="2020-01-15"),
 *     @OA\Property(property="salle_actuelle_id", type="string", format="uuid", nullable=true),
 *     @OA\Property(property="salle_actuelle_nom", type="string", nullable=true, example="Jardin"),
 *     @OA\Property(property="role_actuel", type="string", enum={"responsable", "adjoint", "membre"}, nullable=true, example="responsable"),
 *     @OA\Property(property="date_affectation_actuelle", type="string", format="date", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *     schema="StoreMonitorRequest",
 *     type="object",
 *     required={"nom", "prenom", "genre", "email", "telephone", "role", "salle_id"},
 *     @OA\Property(property="nom", type="string", maxLength=255, example="Doe"),
 *     @OA\Property(property="prenom", type="string", maxLength=255, example="John"),
 *     @OA\Property(property="genre", type="string", enum={"Masculin", "Féminin"}, example="Masculin"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *     @OA\Property(property="telephone", type="string", maxLength=20, example="+243 800 000 000"),
 *     @OA\Property(property="role", type="string", enum={"responsable", "adjoint", "membre"}, example="membre"),
 *     @OA\Property(property="salle_id", type="string", format="uuid", description="ID de la salle assignée"),
 *     @OA\Property(property="role_actuel", type="string", enum={"responsable", "adjoint", "membre"}, nullable=true),
 *     @OA\Property(property="date_affectation_actuelle", type="string", format="date", nullable=true)
 * )
 *
 * @OA\Schema(
 *     schema="UpdateMonitorRequest",
 *     type="object",
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="post_nom", type="string"),
 *     @OA\Property(property="prenom", type="string"),
 *     @OA\Property(property="date_naissance", type="string", format="date"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="telephone", type="string"),
 *     @OA\Property(property="adresse", type="string"),
 *     @OA\Property(property="photo", type="string", nullable=true),
 *     @OA\Property(property="date_conversion", type="string", format="date", nullable=true),
 *     @OA\Property(property="date_bapteme", type="string", format="date", nullable=true),
 *     @OA\Property(property="baptise_saint_esprit", type="boolean"),
 *     @OA\Property(property="etat_civil", type="string", enum={"Célibataire", "Marié(e)", "Veuf(ve)", "Divorcé(e)"}),
 *     @OA\Property(property="date_adhesion", type="string", format="date"),
 *     @OA\Property(property="salle_actuelle_id", type="string", format="uuid", nullable=true),
 *     @OA\Property(property="salle_actuelle_nom", type="string", nullable=true),
 *     @OA\Property(property="role_actuel", type="string", enum={"responsable", "adjoint", "membre"}, nullable=true),
 *     @OA\Property(property="date_affectation_actuelle", type="string", format="date", nullable=true)
 * )
 */
class MonitorSchema
{
    // Cette classe sert uniquement pour les annotations Swagger
}
