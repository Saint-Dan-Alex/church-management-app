<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Créer une notification de paiement
     */
    public static function notifyPayment($userId, $paymentData)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'payment',
            'title' => 'Nouveau paiement reçu',
            'message' => "{$paymentData['participant_nom']} a effectué un paiement de {$paymentData['montant']} {$paymentData['devise']}",
            'data' => [
                'payment_id' => $paymentData['id'],
                'amount' => $paymentData['montant'],
                'currency' => $paymentData['devise'],
            ],
            'action_url' => "/payments/{$paymentData['id']}",
        ]);
    }

    /**
     * Créer une notification de présence
     */
    public static function notifyPresence($userId, $presenceData)
    {
        $nom_complet = $presenceData['moniteur_nom'] ?? $presenceData['participant_nom'] ?? 'Un participant';

        return Notification::create([
            'user_id' => $userId,
            'type' => 'presence',
            'title' => 'Nouvelle présence enregistrée',
            'message' => "{$nom_complet} est présent à l'activité {$presenceData['activity_nom']}",
            'data' => [
                'presence_id' => $presenceData['id'],
                'activity_id' => $presenceData['activity_id'],
                'status' => $presenceData['statut'],
            ],
            'action_url' => "/presences",
        ]);
    }

    /**
     * Créer une notification d'activité
     */
    public static function notifyActivity($userId, $activityData)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'activity',
            'title' => 'Nouvelle activité créée',
            'message' => "L'activité \"{$activityData['nom']}\" a été créée pour le {$activityData['date_debut']}",
            'data' => [
                'activity_id' => $activityData['id'],
                'type' => $activityData['type'],
            ],
            'action_url' => "/activities/{$activityData['id']}",
        ]);
    }

    /**
     * Créer une notification de dépense
     */
    public static function notifyExpense($userId, $expenseData)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'warning',
            'title' => 'Nouvelle dépense enregistrée',
            'message' => "Dépense de {$expenseData['montant']} {$expenseData['devise']} pour {$expenseData['description']}",
            'data' => [
                'expense_id' => $expenseData['id'],
                'category' => $expenseData['categorie'],
                'amount' => $expenseData['montant'],
            ],
            'action_url' => "/expenses/{$expenseData['id']}",
        ]);
    }

    /**
     * Créer une notification de cotisation
     */
    public static function notifyCotisation($userId, $cotisationData)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'success',
            'title' => 'Cotisation reçue',
            'message' => "{$cotisationData['membre_nom']} a payé sa cotisation de {$cotisationData['montant']} {$cotisationData['devise']}",
            'data' => [
                'cotisation_id' => $cotisationData['id'],
                'month' => $cotisationData['mois'],
                'year' => $cotisationData['annee'],
            ],
            'action_url' => "/cotisations",
        ]);
    }

    /**
     * Créer une notification d'erreur
     */
    public static function notifyError($userId, $title, $message, $data = [])
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'error',
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * Créer une notification de succès
     */
    public static function notifySuccess($userId, $title, $message, $actionUrl = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'success',
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
        ]);
    }

    /**
     * Créer une notification d'information
     */
    public static function notifyInfo($userId, $title, $message, $actionUrl = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => 'info',
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
        ]);
    }

    /**
     * Notifier tous les administrateurs
     */
    public static function notifyAdmins($type, $title, $message, $data = [], $actionUrl = null)
    {
        // Récupérer tous les utilisateurs avec le rôle admin
        $admins = \App\Models\User::role('admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => $data,
                'action_url' => $actionUrl,
            ]);
        }
    }
}
