# Changelog - Système de Commissions Dynamiques

## Date: 2025-12-07

### Modifications apportées

#### 1. Suppression de l'option "NSP" et "Je ne sais pas"

**Fichiers modifiés:**
- `components/children/add-child-dialog.tsx`
- `components/children/edit-child-dialog.tsx`

**Changements:**
- ✅ Supprimé l'option "NSP" pour le champ "Es-tu baptisé du Saint-Esprit ?"
- ✅ Supprimé l'option "Je ne sais pas" pour le champ "As-tu donné ta vie à Jésus ?"
- ✅ Supprimé l'option "Je ne sais pas" pour le champ "As-tu déjà gagné une âme ?"
- ✅ Supprimé l'option "NSP" pour le champ "As-tu un encadreur ?"
- ✅ Valeurs par défaut changées de "NSP"/"Je ne sais pas" à "Non"

**Résultat:** Les formulaires n'affichent maintenant que les options "Oui" et "Non" pour ces champs.

---

#### 2. Système de Commissions Dynamiques

**A. Backend (Laravel)**

**Nouvelle table `commissions`:**
```sql
- id (UUID, primary key)
- nom (string, unique)
- description (text, nullable)
- timestamps
```

**Fichiers créés:**
- `database/migrations/2025_12_06_184529_create_commissions_table.php`
- `app/Models/Commission.php`
- `app/Http/Controllers/API/CommissionController.php`
- `database/seeders/CommissionSeeder.php`

**Fichiers modifiés:**
- `routes/api.php` - Ajout de la route API `/api/v1/commissions`

**Endpoints API créés:**
- `GET /api/v1/commissions` - Liste toutes les commissions (triées par nom)
- `POST /api/v1/commissions` - Crée une nouvelle commission

**Commissions par défaut créées:**
1. Louange
2. Accueil
3. Technique
4. Intercession
5. Enseignement

---

**B. Frontend (Next.js/React)**

**Fichiers créés:**
- `lib/services/commissions.service.ts` - Service API pour les commissions
- `components/children/commission-combobox.tsx` - Composant de sélection avec autocomplétion

**Fichiers modifiés:**
- `components/children/add-child-dialog.tsx`
- `components/children/edit-child-dialog.tsx`

**Fonctionnalités du nouveau composant CommissionCombobox:**
- ✅ Recherche en temps réel parmi les commissions existantes
- ✅ Création instantanée de nouvelles commissions en tapant un nom
- ✅ Interface utilisateur intuitive avec icônes
- ✅ Validation automatique (nom unique)
- ✅ Notifications toast pour les succès/erreurs
- ✅ Chargement dynamique des commissions depuis l'API

**Utilisation:**
- Pour les **ouvriers** : champ "Commission actuelle"
- Pour les **non-ouvriers** : champ "Commission souhaitée"

---

### Comment utiliser le nouveau système

#### Pour l'utilisateur final:

1. **Sélectionner une commission existante:**
   - Cliquer sur le champ de commission
   - Taper pour rechercher
   - Cliquer sur la commission désirée

2. **Créer une nouvelle commission:**
   - Cliquer sur le champ de commission
   - Taper le nom de la nouvelle commission
   - Cliquer sur "Créer [nom]"
   - La commission est immédiatement disponible pour tous les utilisateurs

#### Pour les développeurs:

**Ajouter des commissions par défaut:**
```bash
php artisan db:seed --class=CommissionSeeder
```

**Créer une commission via l'API:**
```bash
curl -X POST http://localhost:8000/api/v1/commissions \
  -H "Content-Type: application/json" \
  -d '{"nom":"Nouvelle Commission","description":"Description optionnelle"}'
```

---

### Avantages du nouveau système

1. **Flexibilité:** Les utilisateurs peuvent créer leurs propres commissions sans intervention technique
2. **Cohérence:** Les noms de commissions sont standardisés dans toute l'application
3. **Évolutivité:** Facile d'ajouter de nouvelles commissions selon les besoins
4. **UX améliorée:** Autocomplétion et recherche rapide
5. **Maintenance:** Plus besoin de modifier le code pour ajouter/supprimer des commissions

---

### Tests recommandés

- [ ] Créer un enfant avec une commission existante
- [ ] Créer un enfant avec une nouvelle commission
- [ ] Modifier un enfant et changer sa commission
- [ ] Vérifier que les commissions créées apparaissent dans les deux formulaires
- [ ] Tester la recherche/filtrage des commissions
- [ ] Vérifier que les doublons sont évités (validation unique)

---

### Notes techniques

- Les commissions utilisent des UUIDs comme clés primaires (cohérent avec le reste de l'app)
- La validation côté backend empêche les doublons
- Le composant frontend gère automatiquement le rechargement après création
- Les commissions sont triées alphabétiquement par défaut
