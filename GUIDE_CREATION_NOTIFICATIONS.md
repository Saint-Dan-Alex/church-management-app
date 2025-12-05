# 🔔 Guide Pratique - Créer des Notifications
## Church Management Application

---

## 📝 MÉTHODES POUR CRÉER DES NOTIFICATIONS

### 1. 🎯 Utiliser le NotificationService (RECOMMANDÉ)

J'ai créé un service `NotificationService` pour simplifier la création de notifications.

#### Exemple 1: Notification de Paiement

```php
use App\Services\NotificationService;

// Dans PaymentController::store()
public function store(Request $request)
{
    // ... validation et création du paiement
    $payment = Payment::create($validated);

    // Créer une notification
    NotificationService::notifyPayment(
        auth()->id(), // ID de l'utilisateur à notifier
        [
            'id' => $payment->id,
            'participant_nom' => $payment->participant_nom_complet,
            'montant' => $payment->montant,
            'devise' => $payment->devise,
        ]
    );

    return response()->json($payment, 201);
}
```

#### Exemple 2: Notification de Présence

```php
use App\Services\NotificationService;

// Dans PresenceController::store()
public function store(Request $request)
{
    $presence = Presence::create($validated);

    // Notifier
    NotificationService::notifyPresence(
        auth()->id(),
        [
            'id' => $presence->id,
            'moniteur_nom' => $presence->moniteur_nom,
            'activity_nom' => $presence->activity_nom,
            'activity_id' => $presence->activity_id,
            'statut' => $presence->statut,
        ]
    );

    return response()->json($presence, 201);
}
```

#### Exemple 3: Notification d'Activité

```php
use App\Services\NotificationService;

// Dans ActivityController::store()
public function store(Request $request)
{
    $activity = Activity::create($validated);

    // Notifier
    NotificationService::notifyActivity(
        auth()->id(),
        [
            'id' => $activity->id,
            'nom' => $activity->nom,
            'date_debut' => $activity->date_debut,
            'type' => $activity->type,
        ]
    );

    return response()->json($activity, 201);
}
```

#### Exemple 4: Notification de Dépense

```php
use App\Services\NotificationService;

// Dans ExpenseController::store()
public function store(Request $request)
{
    $expense = Expense::create($validated);

    // Notifier
    NotificationService::notifyExpense(
        auth()->id(),
        [
            'id' => $expense->id,
            'description' => $expense->description,
            'montant' => $expense->montant,
            'devise' => $expense->devise,
            'categorie' => $expense->categorie,
        ]
    );

    return response()->json($expense, 201);
}
```

#### Exemple 5: Notification de Cotisation

```php
use App\Services\NotificationService;

// Dans CotisationController::store()
public function store(Request $request)
{
    $cotisation = Cotisation::create($validated);

    // Notifier
    NotificationService::notifyCotisation(
        auth()->id(),
        [
            'id' => $cotisation->id,
            'membre_nom' => $cotisation->membre_nom,
            'montant' => $cotisation->montant,
            'devise' => $cotisation->devise,
            'mois' => $cotisation->mois,
            'annee' => $cotisation->annee,
        ]
    );

    return response()->json($cotisation, 201);
}
```

---

### 2. 📢 Notifier Tous les Administrateurs

```php
use App\Services\NotificationService;

// Notifier tous les admins d'un événement important
NotificationService::notifyAdmins(
    'warning',
    'Budget dépassé',
    'Le budget mensuel a été dépassé de 50,000 CDF',
    ['budget_exceeded' => 50000],
    '/caisse/bilan-financier'
);
```

---

### 3. 💡 Notifications Génériques

#### Succès
```php
NotificationService::notifySuccess(
    auth()->id(),
    'Opération réussie',
    'Les données ont été sauvegardées avec succès',
    '/dashboard'
);
```

#### Information
```php
NotificationService::notifyInfo(
    auth()->id(),
    'Rappel',
    'N\'oubliez pas la réunion de demain à 10h',
    '/activities/123'
);
```

#### Erreur
```php
NotificationService::notifyError(
    auth()->id(),
    'Erreur de synchronisation',
    'Impossible de synchroniser les données',
    ['error_code' => 'SYNC_001']
);
```

---

### 4. 🔧 Méthode Directe (Sans Service)

Si vous préférez créer directement :

```php
use App\Models\Notification;

Notification::create([
    'user_id' => auth()->id(),
    'type' => 'payment',
    'title' => 'Nouveau paiement',
    'message' => 'Un paiement de 10,000 CDF a été reçu',
    'data' => [
        'payment_id' => 123,
        'amount' => 10000,
        'currency' => 'CDF',
    ],
    'action_url' => '/payments/123',
]);
```

---

### 5. 🌐 Depuis l'API (Frontend)

Vous pouvez aussi créer des notifications depuis le frontend :

```typescript
import { notificationsService } from "@/lib/services"

// Créer une notification
await notificationsService.create({
  user_id: '1',
  type: 'info',
  title: 'Test de notification',
  message: 'Ceci est un test depuis le frontend',
  action_url: '/dashboard'
})
```

---

## 🎨 TYPES DE NOTIFICATIONS DISPONIBLES

| Type | Icône | Couleur | Utilisation |
|------|-------|---------|-------------|
| `info` | ℹ️ | Gris | Information générale |
| `success` | ✅ | Vert | Opération réussie |
| `warning` | ⚠️ | Jaune | Avertissement |
| `error` | ❌ | Rouge | Erreur |
| `payment` | 💰 | Bleu | Paiements |
| `presence` | 👥 | Violet | Présences |
| `activity` | 📅 | Indigo | Activités |
| `general` | 📢 | Gris | Général |

---

## 📋 EXEMPLES COMPLETS PAR CONTRÔLEUR

### PaymentController.php

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'participant_nom_complet' => 'required|string',
            'montant' => 'required|numeric',
            'devise' => 'required|in:CDF,USD',
            // ... autres champs
        ]);

        $payment = Payment::create($validated);

        // ✅ CRÉER LA NOTIFICATION
        NotificationService::notifyPayment(auth()->id(), [
            'id' => $payment->id,
            'participant_nom' => $payment->participant_nom_complet,
            'montant' => $payment->montant,
            'devise' => $payment->devise,
        ]);

        return response()->json($payment, 201);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update($request->all());

        // Notification de mise à jour
        NotificationService::notifyInfo(
            auth()->id(),
            'Paiement mis à jour',
            "Le paiement de {$payment->participant_nom_complet} a été modifié",
            "/payments/{$payment->id}"
        );

        return response()->json($payment);
    }
}
```

### PresenceController.php

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'moniteur_nom' => 'required|string',
        'activity_nom' => 'required|string',
        'statut' => 'required|in:present,absent,retard',
        // ...
    ]);

    $presence = Presence::create($validated);

    // ✅ NOTIFICATION
    NotificationService::notifyPresence(auth()->id(), [
        'id' => $presence->id,
        'moniteur_nom' => $presence->moniteur_nom,
        'activity_nom' => $presence->activity_nom,
        'activity_id' => $presence->activity_id,
        'statut' => $presence->statut,
    ]);

    return response()->json($presence, 201);
}
```

### ExpenseController.php

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'description' => 'required|string',
        'montant' => 'required|numeric',
        'devise' => 'required|in:CDF,USD',
        'categorie' => 'required|string',
        // ...
    ]);

    $expense = Expense::create($validated);

    // ✅ NOTIFICATION
    NotificationService::notifyExpense(auth()->id(), [
        'id' => $expense->id,
        'description' => $expense->description,
        'montant' => $expense->montant,
        'devise' => $expense->devise,
        'categorie' => $expense->categorie,
    ]);

    return response()->json($expense, 201);
}
```

---

## 🚀 MISE EN PLACE RAPIDE

### Étape 1: Ajouter dans vos contrôleurs

Ouvrez vos contrôleurs et ajoutez :

```php
use App\Services\NotificationService;
```

### Étape 2: Appeler dans les méthodes store()

Après la création d'une ressource, ajoutez :

```php
NotificationService::notify[Type](auth()->id(), $data);
```

### Étape 3: Tester

Créez une ressource via l'API et vérifiez que la notification apparaît !

---

## 🧪 TESTER LES NOTIFICATIONS

### Via Tinker (Laravel)

```bash
php artisan tinker
```

```php
// Créer une notification de test
App\Models\Notification::create([
    'user_id' => 1,
    'type' => 'info',
    'title' => 'Test',
    'message' => 'Ceci est un test',
]);

// Vérifier
App\Models\Notification::count();
```

### Via API (Postman/curl)

```bash
POST http://localhost:8000/api/v1/notifications
Content-Type: application/json

{
  "user_id": 1,
  "type": "success",
  "title": "Test réussi",
  "message": "La notification fonctionne !"
}
```

---

## 💡 CONSEILS

### 1. Notifier au bon moment
- ✅ Après la création réussie
- ✅ Après la mise à jour importante
- ✅ En cas d'erreur critique
- ❌ Pas pour chaque petite action

### 2. Messages clairs
- ✅ "Marie LENGE a payé 10,000 CDF"
- ❌ "Paiement créé"

### 3. Utiliser action_url
Toujours fournir un lien pour que l'utilisateur puisse voir les détails :
```php
'action_url' => "/payments/{$payment->id}"
```

### 4. Données supplémentaires
Utilisez le champ `data` pour stocker des infos utiles :
```php
'data' => [
    'payment_id' => $payment->id,
    'amount' => $payment->montant,
    'status' => $payment->statut,
]
```

---

## 📊 RÉSUMÉ

| Méthode | Avantages | Quand l'utiliser |
|---------|-----------|------------------|
| **NotificationService** | Simple, réutilisable | ✅ Recommandé pour tout |
| **Directe (Notification::create)** | Flexible | Pour cas spéciaux |
| **API Frontend** | Accessible partout | Tests, actions frontend |

---

**🎉 Vous êtes prêt à créer des notifications !**

**📄 Document créé le :** 4 décembre 2025  
**✍️ Pour :** Church Management Application  
**🎯 Objectif :** Guide pratique de création de notifications
