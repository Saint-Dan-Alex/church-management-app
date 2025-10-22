# 🌱 Guide des Seeders

## 📋 Vue d'ensemble

Les seeders permettent de remplir la base de données avec des données de test réalistes pour le développement et les tests.

## 🗂️ Seeders Créés (14 fichiers)

| # | Seeder | Modèle | Nombre de Records | Dépendances |
|---|--------|--------|-------------------|-------------|
| 1 | **SalleSeeder** | Salle | 5 salles | Aucune |
| 2 | **MonitorSeeder** | Monitor | 5 moniteurs | Salle |
| 3 | **ChildSeeder** | Child | 5 enfants | Aucune |
| 4 | **ActivitySeeder** | Activity | 5 activités | Monitor |
| 5 | **PaymentSeeder** | Payment | 5 paiements | Activity |
| 6 | **ExpenseSeeder** | Expense | 5 dépenses | Activity |
| 7 | **PresenceSeeder** | Presence | 3 présences | Activity, Monitor |
| 8 | **CotisationSeeder** | Cotisation | 5 cotisations | Aucune |
| 9 | **SortieSeeder** | Sortie | 5 sorties | Aucune |
| 10 | **BlogSeeder** | Blog | 4 articles | Aucune |
| 11 | **VideoSeeder** | Video | 4 vidéos | Aucune |
| 12 | **PhotoSeeder** | Photo | 5 photos | Aucune |
| 13 | **TeachingSeeder** | Teaching | 4 enseignements | Aucune |
| 14 | **WorshipReportSeeder** | WorshipReport | 4 rapports | Aucune |

**Total : 63 enregistrements de test**

---

## 🚀 Utilisation

### 1. Exécuter Tous les Seeders

```bash
php artisan db:seed
```

### 2. Exécuter un Seeder Spécifique

```bash
php artisan db:seed --class=SalleSeeder
php artisan db:seed --class=MonitorSeeder
php artisan db:seed --class=ChildSeeder
```

### 3. Réinitialiser et Peupler

```bash
# Option 1 : Rafraîchir + migrer + seed
php artisan migrate:fresh --seed

# Option 2 : Rollback + migrer + seed
php artisan migrate:refresh --seed
```

---

## 📊 Ordre d'Exécution

L'ordre est **CRITIQUE** car certains seeders dépendent d'autres :

```
1. SalleSeeder        ← Pas de dépendances
   ↓
2. MonitorSeeder      ← Dépend de Salle
   ↓
3. ChildSeeder        ← Indépendant
   ↓
4. ActivitySeeder     ← Dépend de Monitor
   ↓
5. Tous les autres    ← Certains dépendent d'Activity
```

---

## 📝 Détails des Données Créées

### 1️⃣ Salles (5)

- **Jardin** - 30 places (3-5 ans)
- **Primaire** - 50 places (6-12 ans)
- **Adolescents** - 40 places (13-17 ans)
- **Jeunes** - 60 places (18-25 ans)
- **Adultes** - 100 places

### 2️⃣ Moniteurs (5 + 5 Users)

- **Jean KABAMBA** - Responsable Jardin
- **Marie TSHISEKEDI** - Responsable Primaire
- **Paul MUKENDI** - Adjoint Adolescents
- **Grace MULAMBA** - Membre Jeunes
- **David KASONGO** - Responsable Adultes

✅ Chaque moniteur a un **User** créé automatiquement via Observer

### 3️⃣ Enfants (5 + 5 Users)

- **Emmanuel MWANZA** - 9 ans
- **Sarah LUBOYA** - 10 ans
- **Daniel NKULU** - 8 ans
- **Ruth KALALA** - 11 ans
- **Samuel MUJINGA** - 7 ans

✅ Chaque enfant avec email a un **User** créé automatiquement

### 4️⃣ Activités (5)

- Camp de Vacances 2025
- Sortie Piscine
- Journée de Prière
- Fête de Noël
- Séminaire Jeunesse

### 5️⃣ Paiements (5)

- Statuts variés : paid, partial, pending
- Devises : CDF et USD

### 6️⃣ Dépenses (5)

- Transport, Alimentation, Matériel, etc.

### 7️⃣ Présences (3)

- Statuts : present, absent, retard

### 8️⃣ Cotisations (5)

- Types : Mensuelle, Spéciale, Annuelle

### 9️⃣ Sorties Financières (5)

- Loyer, Salaires, Entretien, etc.

### 🔟 Blog (4 articles)

- 3 publiés, 1 brouillon

### 1️⃣1️⃣ Vidéos (4)

- 2 en vedette, 2 normales

### 1️⃣2️⃣ Photos (5)

- Albums : Camp 2024, Noël 2024, etc.

### 1️⃣3️⃣ Enseignements (4)

- Thèmes spirituels variés

### 1️⃣4️⃣ Rapports de Culte (4)

- Statistiques de fréquentation

---

## ⚙️ Personnalisation

### Modifier les Données

Éditez le fichier seeder correspondant :

```php
// database/seeders/SalleSeeder.php
$salles = [
    [
        'nom' => 'Votre Salle',
        'description' => 'Description',
        'capacite' => 50,
        'actif' => true,
    ],
    // Ajoutez plus...
];
```

### Ajouter Plus de Données

Dupliquez et modifiez les tableaux de données dans chaque seeder.

---

## 🧪 Testing

### Vérifier les Données

```bash
php artisan tinker
```

```php
>>> \App\Models\Salle::count();
=> 5

>>> \App\Models\Monitor::count();
=> 5

>>> \App\Models\User::where('user_type', 'monitor')->count();
=> 5

>>> \App\Models\Child::count();
=> 5

>>> \App\Models\Activity::count();
=> 5
```

---

## 🔄 Réinitialisation

### Nettoyer la Base de Données

```bash
# Supprimer toutes les tables et recréer
php artisan migrate:fresh

# Supprimer ET repeupler
php artisan migrate:fresh --seed
```

### Attention ⚠️

Ces commandes **SUPPRIMENT TOUTES LES DONNÉES** !

---

## 💡 Bonnes Pratiques

### 1. Ordre d'Exécution

Toujours respecter l'ordre des dépendances :
```php
$this->call([
    SalleSeeder::class,      // D'abord
    MonitorSeeder::class,    // Ensuite
    // ...
]);
```

### 2. Vérifier l'Existence

```php
if (Activity::where('type', 'payante')->exists()) {
    // Créer les paiements
}
```

### 3. Données Réalistes

Utilisez des données qui ressemblent à la réalité pour faciliter les tests.

### 4. Environment

Les seeders sont pour le **développement**. Ne jamais les exécuter en **production** !

---

## 🎯 Commandes Utiles

```bash
# Voir la liste des seeders
php artisan db:seed --help

# Exécuter avec force (sans confirmation)
php artisan db:seed --force

# Exécuter en mode verbose
php artisan db:seed -v

# Migrer et seed en une commande
php artisan migrate:fresh --seed

# Seed uniquement (sans migration)
php artisan db:seed
```

---

## 📚 Fichiers Créés

```
database/seeders/
├── DatabaseSeeder.php          ← Seeder principal (modifié)
├── SalleSeeder.php             ← ✅ Nouveau
├── MonitorSeeder.php           ← ✅ Nouveau
├── ChildSeeder.php             ← ✅ Nouveau
├── ActivitySeeder.php          ← ✅ Nouveau
├── PaymentSeeder.php           ← ✅ Nouveau
├── ExpenseSeeder.php           ← ✅ Nouveau
├── PresenceSeeder.php          ← ✅ Nouveau
├── CotisationSeeder.php        ← ✅ Nouveau
├── SortieSeeder.php            ← ✅ Nouveau
├── BlogSeeder.php              ← ✅ Nouveau
├── VideoSeeder.php             ← ✅ Nouveau
├── PhotoSeeder.php             ← ✅ Nouveau
├── TeachingSeeder.php          ← ✅ Nouveau
└── WorshipReportSeeder.php     ← ✅ Nouveau
```

---

## ✅ Vérification Finale

Après avoir exécuté `php artisan db:seed`, vérifiez :

```bash
# Compter les enregistrements
php artisan tinker

>>> DB::table('salles')->count();
=> 5

>>> DB::table('monitors')->count();
=> 5

>>> DB::table('users')->count();
=> 10  # 5 monitors + 5 children

>>> DB::table('children')->count();
=> 5

>>> DB::table('activities')->count();
=> 5
```

---

## 🎉 Résultat Final

Après l'exécution :
- ✅ **63 enregistrements** créés
- ✅ **10 Users** auto-créés (via Observers)
- ✅ **Toutes les tables** peuplées
- ✅ **Relations** correctement établies
- ✅ **Données réalistes** pour les tests

---

**📅 Créé le : 22 Octobre 2025**  
**🎯 Objectif : Faciliter le développement et les tests**
