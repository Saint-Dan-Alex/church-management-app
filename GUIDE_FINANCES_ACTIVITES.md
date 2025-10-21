# 💰 Guide de Gestion Financière des Activités

## 🎯 Nouvelles fonctionnalités

### 1️⃣ **Reçus pour paiements partiels**
✅ Maintenant, **tout paiement génère un reçu**, même s'il est partiel

### 2️⃣ **Gestion des dépenses**
✅ Nouvel onglet "Finances" pour enregistrer toutes les dépenses de l'activité

### 3️⃣ **Bilan financier automatique**
✅ Calcul automatique : **Entrées - Dépenses = Bilan**

---

## 📋 1. Reçus pour paiements partiels

### Avant :
❌ Le bouton "Voir Reçu" n'apparaissait que pour les paiements complets

### Maintenant :
✅ **Tous les paiements ont un bouton de reçu**
- Paiement complet → "Voir Reçu"
- Paiement partiel → "Générer Reçu"

### Le reçu affiche :
- ✅ Montant payé
- ✅ Reste à payer (si paiement partiel)
- ✅ Statut : Payé / Partiel
- ✅ Badge orange pour paiement partiel
- ✅ Toutes les informations de l'église

### Exemple de reçu partiel :

```
┌─────────────────────────────────────┐
│          [LOGO ARCHE]               │
│ Centre Evangélique Arche de         │
│        l'Alliance                   │
│                                     │
│     REÇU DE PAIEMENT                │
│                                     │
│ N° : REC-2025-002                   │
│ Date : 21 janvier 2025              │
│                                     │
│ Payeur : Paul NGEA                  │
│ Activité : Réunion des moniteurs    │
│                                     │
│ Montant requis : 5 000 CDF          │
│ Montant payé : 3 000 CDF            │
│ Reste à payer : 2 000 CDF           │
│                                     │
│ Statut : 🟡 Paiement Partiel        │
└─────────────────────────────────────┘
```

---

## 💵 2. Gestion des dépenses

### Nouvel onglet "Finances"

Accès : Page activité → Onglet **"💵 Finances"**

### 📊 Résumé en 3 cartes :

**Carte 1 : Total Entrées** (Vert)
```
🟢 Total Entrées
   13 000 CDF
   Paiements collectés
```

**Carte 2 : Total Dépenses** (Rouge)
```
🔴 Total Dépenses
   23 000 CDF
   2 dépenses
```

**Carte 3 : Bilan** (Bleu ou Orange)
```
🔵 Bilan
   -10 000 CDF
   Déficit
```
Ou si positif :
```
🔵 Bilan
   +5 000 CDF
   Excédent
```

---

### 📝 Enregistrer une dépense

#### Bouton : "Ajouter Dépense"

**Catégories disponibles :**
1. 🚗 **Transport** - Frais de déplacement
2. 🍽️ **Repas & Rafraîchissements** - Nourriture, boissons
3. 📦 **Matériel & Fournitures** - Cahiers, stylos, etc.
4. 🏢 **Location** - Salle, équipement
5. 🎨 **Décoration** - Ballons, banderoles
6. 🔊 **Sonorisation** - Sono, micros
7. 💼 **Honoraires** - Frais d'intervenants
8. 🎁 **Cadeaux & Prix** - Récompenses
9. 📝 **Autre** - Divers

#### Formulaire :
```
Catégorie * : [🍽️ Repas & Rafraîchissements ▾]
Description * : [Rafraîchissements pour les participants]
Montant * : [15000] CDF
Date * : [20/01/2025]
Bénéficiaire : [Restaurant La Paix]
Référence facture : [FACT-2025-001]
Remarque : [Pour 30 personnes]

[Annuler]  [Enregistrer]
```

---

### 📋 Liste des dépenses

Chaque dépense affiche :

```
┌─────────────────────────────────────────────┐
│ [🍽️ Repas] Rafraîchissements               │
│ → Restaurant La Paix                        │
│ 20/01/2025  FACT-2025-001                  │
│                                    15 000 CDF│
│                              [✏️] [🗑️]      │
└─────────────────────────────────────────────┘
```

**Actions :**
- ✏️ Modifier
- 🗑️ Supprimer

**Recherche :**
```
[🔍 Rechercher une dépense...]
```

---

## 📊 3. Bilan dans le rapport

### Accès : Onglet "📄 Rapport"

Le rapport inclut maintenant :

### Section "Bilan Financier"

```
┌──────────────────────────────────────┐
│ 💰 Bilan Financier                   │
├──────────────────────────────────────┤
│                                      │
│ ENTRÉES                              │
│ Paiements participants : 13 000 CDF  │
│ Total entrées : 13 000 CDF           │
│                                      │
│ DÉPENSES                             │
│ 🍽️ Repas : 15 000 CDF                │
│ 📦 Matériel : 8 000 CDF               │
│ Total dépenses : 23 000 CDF          │
│                                      │
│ ────────────────────────────────────│
│ BILAN : -10 000 CDF                  │
│ Statut : Déficit                     │
└──────────────────────────────────────┘
```

### Interprétation :

**✅ Bilan positif (Excédent)**
```
Bilan : +5 000 CDF
→ Les entrées couvrent les dépenses
→ Il reste de l'argent
```

**⚠️ Bilan négatif (Déficit)**
```
Bilan : -10 000 CDF
→ Les dépenses dépassent les entrées
→ Il manque 10 000 CDF
```

**🟢 Bilan équilibré**
```
Bilan : 0 CDF
→ Les entrées égalent les dépenses
→ Budget parfaitement équilibré
```

---

## 📈 Exemple complet

### Activité : "Sortie au Zoo"

**Configuration paiement :**
- Montant par personne : 10 000 CDF
- 15 participants inscrits

**Paiements collectés :**
1. Marie : 10 000 CDF → Reçu complet ✅
2. Paul : 5 000 CDF → Reçu partiel 🟡 (reste 5 000 CDF)
3. Jean : 10 000 CDF → Reçu complet ✅
4. Sarah : 3 000 CDF → Reçu partiel 🟡 (reste 7 000 CDF)

**Total entrées : 28 000 CDF**

**Dépenses :**
1. Transport (bus) : 20 000 CDF
2. Entrées zoo : 15 000 CDF
3. Rafraîchissements : 8 000 CDF
4. Photos souvenir : 5 000 CDF

**Total dépenses : 48 000 CDF**

**BILAN : -20 000 CDF** ⚠️ Déficit

### Actions possibles :
1. Relancer les paiements en retard
2. Trouver un sponsor
3. Réduire les dépenses
4. Reporter l'activité

---

## 🎯 Cas d'usage

### 📝 Cas 1 : Paiement partiel avec reçu

**Situation :**
Paul paie 3 000 CDF sur 5 000 CDF requis

**Action :**
1. Enregistrer le paiement de 3 000 CDF
2. Cliquer sur "Générer Reçu"
3. Le reçu indique : "Paiement Partiel - Reste 2 000 CDF"
4. Imprimer et remettre à Paul

**Avantage :**
- Paul a une preuve de paiement
- Trace écrite du montant payé
- Facilite le suivi des paiements

---

### 💰 Cas 2 : Gestion complète des finances

**Situation :**
Organiser une fête de Noël pour les enfants

**Étapes :**

1. **Définir le budget**
   - 50 enfants × 5 000 CDF = 250 000 CDF à collecter

2. **Enregistrer les paiements**
   - Au fur et à mesure, enregistrer les paiements
   - Générer les reçus (complets ou partiels)
   - Total collecté : 180 000 CDF

3. **Enregistrer les dépenses**
   - Cadeaux : 100 000 CDF
   - Repas : 50 000 CDF
   - Décoration : 20 000 CDF
   - Sonorisation : 30 000 CDF
   - **Total : 200 000 CDF**

4. **Vérifier le bilan**
   ```
   Entrées : 180 000 CDF
   Dépenses : 200 000 CDF
   Bilan : -20 000 CDF (Déficit)
   ```

5. **Ajuster**
   - Relancer les paiements
   - Ou réduire certaines dépenses
   - Objectif : Bilan équilibré

---

## 🖨️ Impression du rapport financier

### Le rapport inclut automatiquement :

1. **Statistiques de présence**
2. **Statistiques de paiement**
3. **Liste des dépenses**
4. **Bilan financier complet**
5. **Recommandations** (si déficit)

### Boutons disponibles :
- 🖨️ **Imprimer** - Aperçu avant impression
- 📥 **Exporter PDF** - Télécharger le rapport

---

## 📊 Tableau récapitulatif

| Fonctionnalité | Avant | Maintenant |
|----------------|-------|------------|
| **Reçu partiel** | ❌ Non disponible | ✅ Disponible |
| **Gestion dépenses** | ❌ Absent | ✅ Onglet Finances |
| **Bilan automatique** | ❌ Calcul manuel | ✅ Automatique |
| **Rapport complet** | ⚠️ Partiel | ✅ Avec bilan |
| **Catégories dépenses** | ❌ Aucune | ✅ 9 catégories |
| **Recherche dépenses** | ❌ Non | ✅ Oui |

---

## ✅ Checklist d'utilisation

### Pour chaque activité :

- [ ] Configurer le montant du paiement
- [ ] Enregistrer les paiements (complets ou partiels)
- [ ] Générer les reçus pour tous les paiements
- [ ] Enregistrer toutes les dépenses
- [ ] Vérifier le bilan financier
- [ ] Générer le rapport complet
- [ ] Imprimer ou exporter le rapport

---

## 🎓 Formation des responsables

### Points clés à retenir :

1. **Tout paiement = Un reçu**
   - Même partiel, toujours donner un reçu

2. **Enregistrer toutes les dépenses**
   - Même les petites
   - Garder les factures

3. **Vérifier le bilan régulièrement**
   - Avant l'activité : Budget prévisionnel
   - Pendant : Suivi en temps réel
   - Après : Bilan définitif

4. **Transparence financière**
   - Rapport accessible
   - Chiffres clairs
   - Traçabilité complète

---

## 🚀 Prochaines étapes

### Améliorations possibles :

- [ ] Budget prévisionnel vs réel
- [ ] Comparaison avec activités précédentes
- [ ] Alertes en cas de dépassement
- [ ] Export Excel des dépenses
- [ ] Graphiques de répartition
- [ ] Historique des bilans
- [ ] Validation hiérarchique des dépenses

---

**📄 Document créé le :** 21 janvier 2025  
**✍️ Pour :** Centre Evangélique Arche de l'Alliance  
**🎯 Ministère :** Ministère auprès des Enfants et Adolescents

---

## 📞 Support

Pour toute question sur la gestion financière :
- Consulter ce guide
- Vérifier les exemples
- Tester avec des données fictives d'abord

**Principe clé : Transparence et traçabilité ! 💰✨**
