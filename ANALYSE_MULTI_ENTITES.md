# 🏗️ Architecture Multi-Entités (Ministères & Cellules)

Ce document décrit le plan technique pour transformer l'application d'une gestion mono-ministère vers une gestion multi-entités pour toute l'église.

## 🎯 Objectif
Permettre à l'application de gérer plusieurs entités distinctes :
1. **L'Église Globale** (Niveau supérieur)
2. **Les Ministères/Départements** (Jeunesse, Hommes, Femmes, École du Dimanche, Chorale, etc.)
3. **Les Cellules/Groupes de Vie** (Cellules de maison, groupes de prière)

Chaque entité aura ses propres :
- Membres/Utilisateurs
- Activités
- Finances (Budget, Dépenses, Collectes)
- Rapports

---

## 💾 Modifications Base de Données

### 1. Nouvelles Tables

#### `ministries` (Ministères/Départements)
Représente les grands départements de l'église.
- `id` (UUID)
- `name` (ex: "Département de la Jeunesse")
- `slug` (ex: "jeunesse")
- `description`
- `leader_id` (User ID du responsable)
- `parent_id` (Pour sous-départements optionnels)
- `timestamps`

#### `cells` (Cellules/Groupes)
Représente les petits groupes, souvent rattachés à un ministère ou à l'église.
- `id` (UUID)
- `name` (ex: "Cellule Binza")
- `code` (ex: "CELL-01")
- `location` (Adresse/Lieu)
- `ministry_id` (Optionnel - si rattaché à un ministère)
- `leader_id` (User ID du responsable)
- `meeting_day` (Jour de rencontre)
- `timestamps`

### 2. Tables de Liaison (Membres)

Pour gérer qui appartient à quoi, avec quel rôle.

#### `ministry_user`
- `ministry_id`
- `user_id`
- `role` (ex: 'admin', 'member', 'treasurer')
- `joined_at`

#### `cell_user`
- `cell_id`
- `user_id`
- `role` (ex: 'leader', 'host', 'member')
- `joined_at`

### 3. Modification des Tables Existantes

Nous devons ajouter des colonnes pour lier les données existantes aux nouvelles entités.

**Colonnes à ajouter (nullable) :**
- `ministry_id`
- `cell_id`

**Tables concernées :**
1. **`activities`** : Une activité appartient à un ministère (ex: Retraite Jeunes) ou une cellule.
2. **`worship_reports`** : Rapports de culte par ministère (ex: Culte des jeunes).
3. **`expenses` / `payments` / `sorties`** : Pour séparer les budgets.
4. **`blogs` / `videos` / `photos`** : Contenu spécifique à une entité.
5. **`presences`** : Suivi des présences par entité.

---

## 🔄 Logique Applicative

### 1. Gestion des Utilisateurs
- Un utilisateur peut être "Admin Global" (voit tout).
- Un utilisateur peut être "Responsable Ministère" (voit son ministère).
- Un utilisateur peut être simple membre de plusieurs entités.

### 2. Le Dashboard
Le Dashboard devra avoir un **Sélecteur de Contexte** :
- "Vue Globale" (Pour l'admin principal)
- "Vue Ministère X"
- "Vue Cellule Y"

### 3. Adaptation du Frontend
- Ajouter un menu déroulant dans la barre latérale pour changer d'entité.
- Filtrer toutes les listes (activités, membres, finances) selon l'entité sélectionnée.

---

## 📅 Plan de Migration

1. **Créer les migrations** pour `ministries` et `cells`.
2. **Créer les migrations pivot** pour les utilisateurs.
3. **Ajouter les clés étrangères** aux tables principales (`activities`, `finances`, etc.).
4. **Mettre à jour les Modèles Laravel** (Relations `belongsTo`, `hasMany`).
5. **Créer un Seeder** pour générer les ministères par défaut (Jeunesse, Hommes, Femmes, ECODIM).
6. **Mettre à jour le Frontend** pour supporter la navigation multi-entités.

---

## 🛡️ Sécurité (Permissions)

Utilisation de Spatie Permissions avec des scopes :
- `create activities` -> global vs `create activities` sur `ministry_id=1`.
- Nous utiliserons probablement des **Policies** Laravel pour vérifier :
  ```php
  public function view(User $user, Activity $activity) {
      return $user->belongsToMinistry($activity->ministry_id);
  }
  ```
