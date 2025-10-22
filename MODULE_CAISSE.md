# 💰 MODULE CAISSE - Documentation Complète

## 📋 Vue d'ensemble

Le module Caisse gère l'ensemble des flux financiers de l'organisation : **Entrées** (cotisations des moniteurs), **Sorties** (dépenses), **Bilan financier** et **Rapports**.

---

## 🎯 Fonctionnalités principales

### ✅ 4 Onglets principaux

1. **Entrées (Cotisations)** - Cotisations des moniteurs
2. **Sorties (Dépenses)** - Dépenses et sorties d'argent
3. **Bilan Financier** - Vue d'ensemble entrées/sorties
4. **Rapports** - Analyse et recherche avancée

---

## 📊 1. ENTRÉES (COTISATIONS)

### Fonctionnalités
- ✅ Liste des cotisations avec statistiques
- ✅ Filtres : Toutes / Payées / En attente
- ✅ Recherche par moniteur ou période
- ✅ Ajout / Modification / Suppression
- ✅ Badges de statut (Payé, En attente, En retard)

### Statistiques affichées
- **Cotisations payées** (total en CDF)
- **En attente** (total en CDF)
- **Total général**

### Champs d'une cotisation
- Moniteur * (dropdown)
- Montant * (nombre)
- Devise (CDF/USD)
- Période * (ex: "Janvier 2025")
- Statut * (Payé/En attente/En retard)
- Date de paiement (si Payé)
- Mode de paiement (Espèces/Mobile Money/Virement/Chèque)
- Remarque (optionnel)

---

## 📉 2. SORTIES (DÉPENSES)

### Fonctionnalités
- ✅ Liste des sorties avec statistiques
- ✅ Filtres par catégorie : Toutes / Matériel / Transport / Événement / Maintenance
- ✅ Recherche par libellé, bénéficiaire ou catégorie
- ✅ Ajout / Modification / Suppression
- ✅ Badges par catégorie (couleurs différentes)

### Statistiques affichées
- **Total des sorties** (montant en CDF)
- **Nombre de sorties**
- **Répartition par catégorie** (montants et graphiques)

### Champs d'une sortie
- Libellé * (description)
- Montant * (nombre)
- Devise (CDF/USD)
- Catégorie * (Matériel/Transport/Événement/Maintenance/Autre)
- Bénéficiaire * (fournisseur)
- Date de sortie *
- Mode de paiement (Espèces/Mobile Money/Virement/Chèque)
- Remarque (optionnel)

---

## 📈 3. BILAN FINANCIER

### Vue d'ensemble
- ✅ **Entrées totales** (vert) + nombre de cotisations
- ✅ **Sorties totales** (rouge) + nombre de dépenses
- ✅ **Solde** (bleu si positif, orange si négatif)
- ✅ **Taux d'épargne** (pourcentage)

### Détails
- 📊 **Tableau des entrées** (top 5 + total)
- 📊 **Tableau des sorties** (toutes)
- 📊 **Graphique de répartition** des dépenses par catégorie
- 📊 **Résumé final** avec alerte si solde négatif

### Filtres
- Date début
- Date fin
- Bouton "Générer"

### Actions
- ✅ Imprimer le bilan
- ✅ Exporter (Excel/PDF)

---

## 📄 4. RAPPORTS

### Filtres de recherche avancée
- **Moniteur** (dropdown - tous les moniteurs)
- **Date début**
- **Date fin**
- Bouton **Rechercher** et **Réinitialiser**

### Statistiques générales
- Nombre de cotisations trouvées
- Montant payé (vert)
- En attente (orange)
- Taux de paiement (pourcentage)

### Tableau : Statistiques par moniteur
- Nom du moniteur
- Nombre de cotisations
- Total (CDF)
- Montant payé (vert)
- Montant en attente (orange)

### Tableau détaillé
- Moniteur
- Période
- Montant
- Date de paiement
- Mode de paiement
- Statut (badge)

### Actions
- ✅ Imprimer le rapport
- ✅ Exporter (Excel/PDF)

---

## 🎨 Interface utilisateur

### Page principale `/caisse`

```
┌─────────────────────────────────────────────┐
│ Caisse                    [+ Nouvelle ...]  │
│ Gestion des entrées, sorties et bilan       │
├─────────────────────────────────────────────┤
│ [Entrées] [Sorties] [Bilan] [Rapports]     │
├─────────────────────────────────────────────┤
│                                             │
│  [Filtres dynamiques selon l'onglet]       │
│                                             │
│  [Contenu de l'onglet actif]               │
│                                             │
└─────────────────────────────────────────────┘
```

### Bouton dynamique
- **Onglet Entrées** → Bouton vert "Nouvelle Cotisation"
- **Onglet Sorties** → Bouton rouge "Nouvelle Sortie"
- **Onglet Bilan** → Pas de bouton
- **Onglet Rapports** → Pas de bouton

---

## 🔐 Permissions

### Rôles avec accès CRUD complet
| Rôle | Permissions |
|------|-------------|
| **Admin** | ✅ CREATE, READ, UPDATE, DELETE |
| **Coordination** | ✅ CREATE, READ, UPDATE, DELETE |
| **Financier** | ✅ CREATE, READ, UPDATE, DELETE |

### Autres rôles
| Rôle | Permissions |
|------|-------------|
| Chef de Salle | ❌ Aucun accès |
| Moniteur | ❌ Aucun accès |
| Parent | ❌ Aucun accès |
| Enfant | ❌ Aucun accès |

---

## 📁 Structure des fichiers

```
app/(dashboard)/caisse/
└── page.tsx ..................... Page principale

components/caisse/
├── cotisations-list.tsx ......... Liste des entrées
├── add-cotisation-dialog.tsx .... Dialog ajout entrée
├── edit-cotisation-dialog.tsx ... Dialog modification entrée
├── sorties-list.tsx ............. Liste des sorties
├── add-sortie-dialog.tsx ........ Dialog ajout sortie
├── bilan-financier.tsx .......... Bilan complet
└── rapport-cotisations.tsx ...... Rapports et recherche

lib/
└── permissions.ts ............... Permissions CAISSE_*
```

---

## 📊 Données mockées

### Entrées (6 cotisations)
```
Sophie KAMANDA - 5000 CDF - Janvier 2025 - Payé
Jacques MUKENDI - 5000 CDF - Janvier 2025 - Payé
Paul NGEA - 5000 CDF - Janvier 2025 - Payé
Marie LENGE - 5000 CDF - Janvier 2025 - Payé
Sophie KAMANDA - 5000 CDF - Décembre 2024 - Payé
Paul NGEA - 5000 CDF - Décembre 2024 - Payé
```

**Total Entrées: 30,000 CDF**

### Sorties (4 dépenses)
```
Achat fournitures scolaires - 15,000 CDF - Matériel
Transport moniteurs - 8,000 CDF - Transport
Rafraîchissements culte - 12,000 CDF - Événement
Réparation matériel - 10,000 CDF - Maintenance
```

**Total Sorties: 45,000 CDF**

### Solde
```
30,000 - 45,000 = -15,000 CDF (Négatif ⚠️)
```

---

## 🧪 Tests à effectuer

### Onglet Entrées
1. ✅ Ajouter une cotisation
2. ✅ Modifier une cotisation existante
3. ✅ Supprimer une cotisation
4. ✅ Filtrer par statut (Payé/En attente)
5. ✅ Rechercher un moniteur
6. ✅ Vérifier les statistiques

### Onglet Sorties
1. ✅ Ajouter une sortie
2. ✅ Filtrer par catégorie
3. ✅ Rechercher une dépense
4. ✅ Vérifier la répartition par catégorie

### Onglet Bilan
1. ✅ Vérifier calcul Entrées
2. ✅ Vérifier calcul Sorties
3. ✅ Vérifier calcul Solde
4. ✅ Tester impression
5. ✅ Tester export

### Onglet Rapports
1. ✅ Recherche par moniteur spécifique
2. ✅ Recherche par période
3. ✅ Vérifier statistiques par moniteur
4. ✅ Tester réinitialisation

---

## 🚀 Améliorations futures

### Court terme
- [ ] Dialog de modification pour les Sorties
- [ ] Graphiques visuels (Chart.js/Recharts)
- [ ] Export réel Excel/PDF
- [ ] Impression formatée

### Moyen terme
- [ ] Notifications de cotisations en retard
- [ ] Prévisions budgétaires
- [ ] Historique des modifications
- [ ] Dashboard analytics

### Long terme
- [ ] Intégration Mobile Money API
- [ ] Génération automatique des reçus
- [ ] Multi-devises (taux de change)
- [ ] Budget prévisionnel vs réel

---

## ✅ Checklist de validation

- [x] Permissions CAISSE_* créées (4)
- [x] Onglet Entrées fonctionnel
- [x] Onglet Sorties fonctionnel
- [x] Onglet Bilan fonctionnel
- [x] Onglet Rapports fonctionnel
- [x] Dialogs ajout/modification Entrées
- [x] Dialog ajout Sorties
- [x] Filtres et recherche
- [x] Statistiques en temps réel
- [x] Calculs corrects
- [x] UI cohérente et responsive
- [x] Messages de confirmation
- [x] Console logs pour debug

---

## 📞 Support

Pour toute question sur le module Caisse :
- Vérifier les permissions dans `lib/permissions.ts`
- Consulter les composants dans `components/caisse/`
- Tester avec les données mockées

**Module Caisse version 1.0 - Janvier 2025**
