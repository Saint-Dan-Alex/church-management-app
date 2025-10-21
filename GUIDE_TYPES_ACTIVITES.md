# 🎯 Guide - Types d'Activités et Participants

## 📋 Vue d'ensemble

Le système gère **2 types d'activités** avec des règles différentes pour les participants.

---

## 🎭 Types d'activités

### 1️⃣ **Activités GRATUITES**

**Caractéristiques :**
- ✅ Aucun paiement requis
- ✅ Les participants sont ceux qui sont **présents**
- ✅ Possibilité d'inscription préalable
- ✅ Accès libre

**Exemples :**
- Culte d'enfants hebdomadaire
- Réunion de prière
- Étude biblique
- Répétition de chorale

**Règle :** 
```
Participant = Personne marquée présente via QR Code
```

---

### 2️⃣ **Activités PAYANTES**

**Caractéristiques :**
- 💰 Paiement requis (montant défini)
- ✅ Les participants sont ceux qui ont **payé OU sont présents**
- ✅ Suivi des paiements
- ✅ Génération de reçus

**Exemples :**
- Sortie au zoo
- Camp de vacances
- Excursion
- Formation payante
- Conférence

**Règle :**
```
Participant = Personne qui a payé OU Personne marquée présente
```

---

## 👥 Gestion automatique des participants

### Pour activités GRATUITES

```
┌─────────────────────────────────────┐
│ ACTIVITÉ GRATUITE                   │
│ "Culte d'enfants"                   │
├─────────────────────────────────────┤
│                                     │
│ Méthode d'ajout :                   │
│ ✅ Présence (QR Code)               │
│ ✅ Inscription manuelle             │
│                                     │
│ Participant automatiquement ajouté: │
│ → Dès qu'il scanne le QR Code       │
└─────────────────────────────────────┘
```

**Flux :**
1. Enfant arrive à l'activité
2. Scanne le QR Code
3. ✅ Automatiquement ajouté aux participants
4. Marqué comme "Présent"

---

### Pour activités PAYANTES

```
┌─────────────────────────────────────┐
│ ACTIVITÉ PAYANTE                    │
│ "Sortie au Zoo - 10 000 CDF"        │
├─────────────────────────────────────┤
│                                     │
│ Méthodes d'ajout :                  │
│ ✅ Paiement (complet ou partiel)    │
│ ✅ Présence (QR Code)               │
│ ✅ Inscription manuelle             │
│                                     │
│ Participant automatiquement ajouté: │
│ → Dès qu'il paie (même partiel)     │
│ → OU dès qu'il scanne le QR Code    │
└─────────────────────────────────────┘
```

**Flux 1 - Paiement d'abord :**
1. Parent paie 10 000 CDF
2. ✅ Enfant automatiquement ajouté aux participants
3. Statut : "Inscrit - Payé"
4. Le jour J : Scanne le QR Code
5. Statut : "Présent"

**Flux 2 - Présence d'abord (sans paiement) :**
1. Enfant arrive sans avoir payé
2. Scanne le QR Code
3. ✅ Automatiquement ajouté aux participants
4. Statut : "Présent - Paiement en attente"
5. Peut payer sur place ou plus tard

---

## 📊 États des participants

### Pour activités GRATUITES

| Statut | Description | Icône |
|--------|-------------|-------|
| **Présent** | A scanné le QR Code | ✅ |
| **Absent** | Inscrit mais non présent | ❌ |
| **Retard** | Arrivé en retard | ⏰ |

---

### Pour activités PAYANTES

| Statut | Description | Icône |
|--------|-------------|-------|
| **Présent + Payé** | Présent ET paiement complet | ✅💰 |
| **Présent + Partiel** | Présent mais paiement partiel | ✅🟡 |
| **Présent + Non payé** | Présent mais pas encore payé | ✅⏳ |
| **Inscrit + Payé** | Payé mais pas encore présent | 📝💰 |
| **Inscrit + Partiel** | Paiement partiel, pas présent | 📝🟡 |
| **Inscrit + Non payé** | Inscrit mais pas payé | 📝⏳ |

---

## 🔄 Scénarios complets

### Scénario 1 : Activité gratuite

**Activité :** Culte d'enfants du dimanche

**Participants :**
```
10h00 : Marie scanne le QR Code → Ajoutée automatiquement ✅
10h05 : Paul scanne le QR Code → Ajouté automatiquement ✅
10h15 : Jean scanne le QR Code → Ajouté automatiquement ✅
```

**Liste des participants :**
- Marie - Présent ✅
- Paul - Présent ✅
- Jean - Présent (Retard) ⏰

**Total : 3 participants**

---

### Scénario 2 : Activité payante - Paiement d'abord

**Activité :** Sortie au Zoo - 10 000 CDF

**Phase 1 - Inscriptions :**
```
Lundi : Marie paie 10 000 CDF → Inscrite automatiquement 📝💰
Mardi : Paul paie 5 000 CDF (partiel) → Inscrit automatiquement 📝🟡
Mercredi : Jean s'inscrit (pas payé) → Inscrit manuellement 📝⏳
```

**Phase 2 - Jour J :**
```
08h00 : Marie scanne QR Code → Présent + Payé ✅💰
08h05 : Paul scanne QR Code → Présent + Partiel ✅🟡
08h10 : Sarah scanne QR Code (pas inscrite) → Présent + Non payé ✅⏳
```

**Liste finale :**
1. Marie - Présent + Payé ✅💰
2. Paul - Présent + Partiel (reste 5 000 CDF) ✅🟡
3. Sarah - Présent + Non payé (doit 10 000 CDF) ✅⏳
4. Jean - Inscrit + Non payé (absent) ❌⏳

**Total : 4 participants (3 présents)**

---

### Scénario 3 : Activité payante - Présence d'abord

**Activité :** Formation moniteurs - 5 000 CDF

**Jour J - Sans paiement préalable :**
```
14h00 : Marie scanne QR Code → Présent + Non payé ✅⏳
14h05 : Paul scanne QR Code → Présent + Non payé ✅⏳
14h10 : Marie paie 5 000 CDF → Présent + Payé ✅💰
```

**Liste finale :**
1. Marie - Présent + Payé ✅💰
2. Paul - Présent + Non payé (reste 5 000 CDF) ✅⏳

---

## 🎛️ Configuration d'une activité

### Lors de la création :

```
┌────────────────────────────────────┐
│ Créer une activité                 │
├────────────────────────────────────┤
│                                    │
│ Titre : [Sortie au Zoo]            │
│                                    │
│ Type d'activité : *                │
│ ○ Gratuite                         │
│ ● Payante                          │
│                                    │
│ ┌─ Si PAYANTE ─────────────────┐  │
│ │                              │  │
│ │ Montant requis : [10000] CDF │  │
│ │ Alternative : [6] USD        │  │
│ │                              │  │
│ │ Paiement obligatoire avant ? │  │
│ │ ☐ Oui (interdit sans payer)  │  │
│ │ ☑ Non (peut payer sur place) │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ Date : [25/01/2025]                │
│ Heure : [08:00] - [17:00]          │
│                                    │
│      [Annuler] [Créer]             │
└────────────────────────────────────┘
```

---

## 📊 Interface - Onglet Participants

### Vue pour activité GRATUITE

```
┌──────────────────────────────────────────┐
│ 👥 Participants (12)                     │
│ Type : Activité gratuite                 │
├──────────────────────────────────────────┤
│                                          │
│ [🔍 Rechercher...]                       │
│                                          │
│ ✅ Marie LENGE        Présent            │
│ ✅ Paul NGEA         Présent             │
│ ⏰ Jean NFEO         Retard (10:15)      │
│ ❌ Sarah JEMMA       Absent              │
│                                          │
│ Total présents : 3 / 4                   │
└──────────────────────────────────────────┘
```

---

### Vue pour activité PAYANTE

```
┌──────────────────────────────────────────┐
│ 👥 Participants (15)                     │
│ Type : Activité payante (10 000 CDF)    │
├──────────────────────────────────────────┤
│                                          │
│ [🔍 Rechercher...]                       │
│                                          │
│ ✅💰 Marie LENGE                         │
│     Présent • Payé (10 000 CDF)         │
│                                          │
│ ✅🟡 Paul NGEA                           │
│     Présent • Partiel (5 000 CDF payés) │
│                                          │
│ ✅⏳ Jean NFEO                            │
│     Présent • Non payé (0 CDF)          │
│                                          │
│ 📝💰 Sarah JEMMA                         │
│     Inscrit • Payé (10 000 CDF)         │
│                                          │
│ Présents : 3 / 15                        │
│ Payé complet : 2                         │
│ Payé partiel : 1                         │
│ Non payé : 1                             │
└──────────────────────────────────────────┘
```

---

## 🔄 Synchronisation automatique

### Ajout automatique par PRÉSENCE

```typescript
// Quand quelqu'un scanne le QR Code
function onQRCodeScanned(personneId: string) {
  // Vérifier si déjà participant
  if (!estParticipant(personneId)) {
    // Ajouter automatiquement
    ajouterParticipant({
      participantId: personneId,
      ajouteVia: "presence",
      estPresent: true,
      aPaye: false, // Si activité payante
    })
  }
  
  // Marquer comme présent
  marquerPresent(personneId)
}
```

---

### Ajout automatique par PAIEMENT

```typescript
// Quand quelqu'un paie
function onPaiementEnregistre(personneId: string, montant: number) {
  // Vérifier si déjà participant
  if (!estParticipant(personneId)) {
    // Ajouter automatiquement
    ajouterParticipant({
      participantId: personneId,
      ajouteVia: "paiement",
      estPresent: false,
      aPaye: montant >= montantRequis,
      montantPaye: montant,
    })
  }
  
  // Mettre à jour le statut de paiement
  mettreAJourPaiement(personneId, montant)
}
```

---

## 📋 Règles de gestion

### Activité GRATUITE

| Action | Résultat |
|--------|----------|
| Scan QR Code | ✅ Ajouté + Présent |
| Inscription manuelle | ✅ Ajouté + En attente |
| Suppression | ⚠️ Confirmation requise |

### Activité PAYANTE

| Action | Résultat |
|--------|----------|
| Paiement | ✅ Ajouté + Inscrit + Badge paiement |
| Scan QR Code | ✅ Ajouté + Présent (paiement en attente si 0) |
| Inscription manuelle | ✅ Ajouté + En attente (doit payer) |
| Suppression | ⚠️ Si payé → Rembourser ? |

---

## 🎯 Avantages du système

### ✅ Flexibilité
- Supporte les 2 types d'activités
- Règles adaptées à chaque type

### ✅ Automatisation
- Ajout automatique des participants
- Pas besoin de gérer manuellement

### ✅ Traçabilité
- On sait comment chaque personne a été ajoutée
- Historique complet

### ✅ Simplicité
- Une seule liste de participants
- Tous les statuts visibles d'un coup

---

## 📊 Rapport final

### Pour activité GRATUITE

```
Activité : Culte d'enfants
Type : Gratuite
Date : 21/01/2025

Participants : 15
- Présents : 12 ✅
- Retards : 2 ⏰
- Absents : 1 ❌

Taux de présence : 93%
```

---

### Pour activité PAYANTE

```
Activité : Sortie au Zoo
Type : Payante (10 000 CDF)
Date : 25/01/2025

Participants : 20

PRÉSENCE :
- Présents : 18 ✅
- Absents : 2 ❌
- Taux : 90%

PAIEMENTS :
- Payé complet : 15 💰 (150 000 CDF)
- Payé partiel : 3 🟡 (20 000 CDF)
- Non payé : 2 ⏳ (0 CDF)
- Total collecté : 170 000 CDF / 200 000 CDF

BILAN :
Entrées : 170 000 CDF
Dépenses : 180 000 CDF
Solde : -10 000 CDF (Déficit)
```

---

**📄 Document créé le :** 21 janvier 2025  
**✍️ Pour :** Centre Evangélique Arche de l'Alliance  
**🎯 Système :** Gestion complète des activités

---

**Le système gère maintenant intelligemment les 2 types d'activités avec ajout automatique des participants ! 🎯✨**
