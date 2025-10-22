# 🔐 Création Automatique des Utilisateurs

## 📋 Vue d'ensemble

Lorsqu'un **Monitor** ou un **Child** est créé dans le système, un compte **User** est automatiquement généré pour lui permettre de se connecter à l'application.

## ⚙️ Fonctionnement

### Architecture
- **Observers Laravel** : `MonitorObserver` et `ChildObserver`
- **Relation Polymorphique** : Un User peut être associé à un Monitor ou à un Child
- **Génération Automatique** : Mot de passe temporaire aléatoire

### Flux de Création

```
1. Créer un Monitor/Child
   ↓
2. Observer détecte la création
   ↓
3. Vérifier si email existe
   ↓
4. Générer mot de passe temporaire
   ↓
5. Créer User avec credentials
   ↓
6. [TODO] Envoyer email de bienvenue
```

## 🗂️ Structure de la Base de Données

### Table `users`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | bigint | ID du user |
| `name` | string | Nom complet |
| `email` | string | Email (unique) |
| `password` | string | Mot de passe hashé |
| `user_type` | string | `'monitor'` ou `'child'` |
| `user_id` | uuid | ID du Monitor ou Child |
| `temporary_password` | string | Mot de passe temporaire (pour email) |

## 📝 Utilisation

### Création d'un Monitor

```php
// Créer un moniteur
$monitor = Monitor::create([
    'nom' => 'KABAMBA',
    'prenom' => 'Jean',
    'email' => 'jean.kabamba@example.com',
    // ... autres champs
]);

// Un User est automatiquement créé !
$user = $monitor->user; // Accès au User
```

### Création d'un Child

```php
// Créer un enfant
$child = Child::create([
    'nom' => 'TSHISEKEDI',
    'prenom' => 'Marie',
    'email' => 'marie.tshisekedi@example.com',
    // ... autres champs
]);

// Un User est automatiquement créé !
$user = $child->user; // Accès au User
```

## 🔗 Relations

### Depuis User

```php
$user = User::find($id);

// Vérifier le type
if ($user->isMonitor()) {
    $monitor = $user->monitor();
}

if ($user->isChild()) {
    $child = $user->child();
}

// Relation polymorphique
$userable = $user->userable; // Monitor ou Child
```

### Depuis Monitor/Child

```php
$monitor = Monitor::find($id);
$user = $monitor->user; // Accès au User

$child = Child::find($id);
$user = $child->user; // Accès au User
```

## 🔄 Mise à Jour

Lorsque l'email d'un Monitor ou Child est modifié, le User associé est automatiquement mis à jour :

```php
$monitor->update(['email' => 'nouveau.email@example.com']);
// Le User.email est automatiquement mis à jour !
```

## 🗑️ Suppression

Lorsqu'un Monitor ou Child est supprimé, le User associé est également supprimé :

```php
$monitor->delete();
// Le User associé est supprimé automatiquement
```

## ⚠️ Conditions de Création

Un User n'est créé que si :
1. ✅ Le Monitor/Child a un **email**
2. ✅ Aucun User avec cet email n'existe déjà

## 🔐 Sécurité

### Mot de Passe Temporaire
- **Généré automatiquement** : 12 caractères aléatoires
- **Stocké** : Dans `temporary_password` (pour envoi email)
- **Hashé** : Dans `password` (sécurisé)

### Recommandations
1. **Envoyer un email** avec le mot de passe temporaire
2. **Forcer le changement** à la première connexion
3. **Supprimer** `temporary_password` après envoi

## 📧 Email de Bienvenue (TODO)

```php
// Dans MonitorObserver.php / ChildObserver.php
use App\Mail\WelcomeMonitorMail;
use Illuminate\Support\Facades\Mail;

public function created(Monitor $monitor): void
{
    // ... création du User ...
    
    Mail::to($monitor->email)->send(
        new WelcomeMonitorMail($monitor, $temporaryPassword)
    );
}
```

## 🚀 Migration

Pour appliquer les modifications à la base de données :

```bash
php artisan migrate
```

### Rollback

```bash
php artisan migrate:rollback
```

## 📂 Fichiers Modifiés

### Observers
- ✅ `app/Observers/MonitorObserver.php`
- ✅ `app/Observers/ChildObserver.php`

### Models
- ✅ `app/Models/User.php` - Ajout champs et méthodes
- ✅ `app/Models/Monitor.php` - Relation `user()`
- ✅ `app/Models/Child.php` - Relation `user()`

### Providers
- ✅ `app/Providers/AppServiceProvider.php` - Enregistrement observers

### Migrations
- ✅ `database/migrations/2025_01_22_140000_add_user_type_to_users_table.php`

## 🧪 Tests

### Tester la Création

```php
// Créer un moniteur avec email
$monitor = Monitor::create([
    'nom' => 'TEST',
    'prenom' => 'User',
    'email' => 'test@example.com',
    'telephone' => '+243900000000',
    'genre' => 'Masculin',
]);

// Vérifier que le User existe
$user = User::where('email', 'test@example.com')->first();
assert($user !== null);
assert($user->user_type === 'monitor');
assert($user->user_id === $monitor->id);
```

### Tester la Mise à Jour

```php
$monitor = Monitor::find($id);
$monitor->update(['email' => 'new@example.com']);

$user = $monitor->user;
assert($user->email === 'new@example.com');
```

### Tester la Suppression

```php
$monitor = Monitor::find($id);
$userId = $monitor->user->id;
$monitor->delete();

$user = User::find($userId);
assert($user === null); // User supprimé
```

## 🎯 Avantages

1. ✅ **Automatique** - Pas besoin de créer manuellement les Users
2. ✅ **Cohérent** - Toujours un User pour chaque Monitor/Child
3. ✅ **Synchronisé** - Email et nom mis à jour automatiquement
4. ✅ **Sécurisé** - Mots de passe générés aléatoirement
5. ✅ **Maintenable** - Logique centralisée dans les Observers

## 📌 Prochaines Étapes

- [ ] Créer les Mails de bienvenue
- [ ] Forcer changement de mot de passe à la première connexion
- [ ] Ajouter logs pour tracer les créations
- [ ] Ajouter des tests unitaires
- [ ] Interface pour renvoyer les credentials

## 🔍 Debug

Pour vérifier si les observers fonctionnent :

```php
// Dans tinker
php artisan tinker

>>> $monitor = Monitor::create(['nom' => 'TEST', 'email' => 'test@test.com', ...]);
>>> $monitor->user;
>>> User::where('user_type', 'monitor')->get();
```

---

**✨ Fonctionnalité implémentée le 22 Octobre 2025**
