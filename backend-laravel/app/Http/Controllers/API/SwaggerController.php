<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Church Management API",
 *     description="API REST complète pour la gestion d'église - 12 modules avec CRUD complet",
 *     @OA\Contact(
 *         email="admin@eglise.com"
 *     ),
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api/v1",
 *     description="API Server Local"
 * )
 * 
 * @OA\Tag(
 *     name="Monitors",
 *     description="Gestion des moniteurs/encadrants"
 * )
 * 
 * @OA\Tag(
 *     name="Children",
 *     description="Gestion des enfants"
 * )
 * 
 * @OA\Tag(
 *     name="Salles",
 *     description="Gestion des salles"
 * )
 * 
 * @OA\Tag(
 *     name="Activities",
 *     description="Gestion des activités et événements"
 * )
 * 
 * @OA\Tag(
 *     name="Teachings",
 *     description="Gestion des enseignements"
 * )
 * 
 * @OA\Tag(
 *     name="Worship Reports",
 *     description="Rapports de culte"
 * )
 * 
 * @OA\Tag(
 *     name="Blog",
 *     description="Articles et témoignages"
 * )
 * 
 * @OA\Tag(
 *     name="Videos",
 *     description="Gestion de la vidéothèque"
 * )
 * 
 * @OA\Tag(
 *     name="Photos",
 *     description="Gestion de la photothèque"
 * )
 * 
 * @OA\Tag(
 *     name="Expenses",
 *     description="Gestion des dépenses"
 * )
 * 
 * @OA\Tag(
 *     name="Payments",
 *     description="Gestion des paiements"
 * )
 * 
 * @OA\Tag(
 *     name="Presences",
 *     description="Gestion des présences"
 * )
 * 
 * @OA\Tag(
 *     name="Cotisations",
 *     description="Gestion des cotisations"
 * )
 * 
 * @OA\Tag(
 *     name="Sorties",
 *     description="Gestion des sorties financières"
 * )
 */
class SwaggerController extends Controller
{
    // Ce contrôleur sert uniquement pour les annotations Swagger
}
