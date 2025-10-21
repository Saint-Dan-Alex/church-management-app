# 📋 Guide de Test - Système de Paiements et Facturation

## 🎯 Vue d'ensemble

Le système de facturation permet de gérer les cotisations et paiements pour les activités de l'église, avec support de **deux devises** (Francs Congolais et Dollars US) et génération automatique de **reçus imprimables**.

---

## 🚀 Accéder au système de paiements

### 1️⃣ Depuis la liste des activités
1. Ouvrir **http://localhost:3000/activities**
2. Cliquer sur une activité

### 2️⃣ Accéder à l'onglet Paiements
1. Dans la page de détails de l'activité
2. Cliquer sur l'onglet **"💵 Paiements"**

---

## 💰 Fonctionnalités disponibles

### ✅ Configuration du paiement d'une activité

**Paramètres configurables :**
- ✓ Montant requis (CDF ou USD)
- ✓ Devise alternative optionnelle (pour permettre 2 devises)
- ✓ Description du paiement
- ✓ Date d'échéance
- ✓ Paiement obligatoire ou optionnel

**Exemple de configuration :**
```
Description: Cotisation mensuelle pour les moniteurs
Montant: 5000 CDF (ou 3 USD)
Échéance: 31 janvier 2025
Obligatoire: Oui
```

---

## 📝 Enregistrer un paiement

### Étape 1 : Cliquer sur "Enregistrer un paiement"

### Étape 2 : Remplir le formulaire
1. **Participant** : Sélectionner dans la liste combinée des **enfants et moniteurs**
   - Les participants sont marqués avec leur type (Enfant/Moniteur)
   - La liste est triée par ordre alphabétique
2. **Devise** : Choisir CDF ou USD
3. **Montant payé** : Entrer le montant
   - Le système calcule automatiquement le reste à payer
   - Indique si le paiement est complet ou partiel
4. **Méthode de paiement** :
   - Espèces
   - Mobile Money (M-Pesa, Airtel Money...)
   - Virement bancaire
   - Carte bancaire
   - Autre
5. **Remarque** : Note optionnelle

### Étape 3 : Enregistrer
- Un **numéro de paiement** est généré automatiquement (ex: PAY-2025-001)
- Un **numéro de reçu** est créé pour les paiements complets/partiels (ex: REC-2025-001)

---

## 🧾 Générer et imprimer un reçu

### 1️⃣ Depuis la liste des paiements
1. Trouver le paiement dans la liste
2. Cliquer sur **"Voir Reçu"**

### 2️⃣ Le reçu contient :
- ✓ Numéro de reçu unique
- ✓ Date d'émission
- ✓ Nom complet du participant
- ✓ Détails du paiement
- ✓ **Montant en chiffres ET en toutes lettres**
- ✓ Méthode de paiement
- ✓ Espaces pour signatures (payeur + responsable)

### 3️⃣ Actions disponibles :
- 🖨️ **Imprimer** : Lance l'impression directe
- 📥 **Télécharger PDF** : (à venir)

---

## 📊 Statistiques de paiement

L'onglet Paiements affiche automatiquement :

### 💳 Total Payé
Montant total collecté pour cette activité

### ⏰ Restant
Montant total encore à percevoir

### 📈 Taux de Paiement
Pourcentage de participants ayant payé (complet ou partiel)

### ⚠️ En Retard
Nombre de participants n'ayant pas payé avant l'échéance

---

## 🎨 Statuts des paiements

| Statut | Badge | Description |
|--------|-------|-------------|
| **Payé** | 🟢 Vert | Paiement complet |
| **Partiel** | 🟠 Orange | Paiement incomplet |
| **En attente** | 🟡 Jaune | Pas encore payé |
| **En retard** | 🔴 Rouge | Échéance dépassée |
| **Annulé** | ⚫ Gris | Paiement annulé |

---

## 💱 Support multi-devises

### Configuration
Une activité peut accepter **2 devises simultanément** :
- **Devise principale** : CDF ou USD
- **Devise alternative** : optionnelle

### Exemple
```
Activité: Sortie des jeunes
Option 1: 10 000 CDF
Option 2: 6 USD
```

Le participant choisit sa devise lors du paiement.

---

## 🔍 Recherche de paiements

Le champ de recherche permet de filtrer par :
- Nom du participant
- Numéro de paiement
- Numéro de reçu

---

## 📱 Cas d'usage typiques

### Scénario 1 : Cotisation obligatoire
```
Activité: École du dimanche - Sortie annuelle
Montant: 15 000 CDF ou 9 USD
Échéance: 15 février 2025
Obligatoire: Oui
```

### Scénario 2 : Participation volontaire
```
Activité: Réunion de prière
Montant: 2 000 CDF
Échéance: Jour de l'activité
Obligatoire: Non
```

### Scénario 3 : Paiement échelonné
1. Jean paie **3000 CDF** le 10 janvier → Statut: Partiel
2. Jean paie **2000 CDF** le 20 janvier → Statut: Payé ✓
3. Deux reçus sont générés

---

## 🧪 Données de test mockées

### Participants disponibles :

**Moniteurs :**
- Marie LENGE (Moniteur)
- Paul NGEA (Moniteur)
- Jean NFEO (Moniteur)

**Enfants :**
- David MUKEBA (Enfant)
- Grace NZITA (Enfant)

### Paiements d'exemple dans le système :

**Marie LENGE (Moniteur)**
- Montant: 5000 CDF
- Statut: Payé ✓
- Méthode: Mobile Money
- Reçu: REC-2025-001

**Paul NGEA**
- Montant: 3000 CDF sur 5000 CDF
- Statut: Partiel
- Reste: 2000 CDF
- Méthode: Espèces

**Jean NFEO**
- Montant: 3 USD
- Statut: Payé ✓
- Méthode: Espèces
- Reçu: REC-2025-003

---

## 🚨 Points importants

### ✅ À faire
- Les montants sont toujours positifs
- Un reçu n'est généré que pour les paiements effectifs
- Le numéro de reçu est unique et incrémenté
- La conversion entre devises n'est pas automatique

### ⚠️ À venir (TODO)
- [ ] Génération PDF des reçus
- [ ] Export Excel des paiements
- [ ] Envoi automatique de rappels avant échéance
- [ ] Intégration avec Mobile Money APIs
- [ ] Historique des modifications de paiements

---

## 📞 Test complet recommandé

1. ✅ Configurer une activité avec paiement
2. ✅ Enregistrer un paiement complet
3. ✅ Enregistrer un paiement partiel
4. ✅ Générer et imprimer un reçu
5. ✅ Rechercher un paiement
6. ✅ Vérifier les statistiques
7. ✅ Tester les deux devises (CDF et USD)

---

## 💡 Conseils d'utilisation

### Pour les trésoriers
- Toujours générer un reçu après chaque paiement
- Noter le numéro de reçu sur le cahier de caisse
- Vérifier régulièrement le taux de paiement

### Pour les responsables
- Configurer les échéances avant l'activité
- Envoyer des rappels aux retardataires
- Consulter les statistiques pour la planification

### Pour les participants
- Conserver précieusement le reçu
- Le reçu fait foi de paiement
- Demander un reçu même pour paiement partiel

---

## 🎯 Prochaines étapes

Après avoir testé le système de paiements, vous pouvez :
1. Intégrer avec une vraie base de données
2. Ajouter l'export PDF des reçus
3. Configurer les rappels automatiques
4. Personnaliser l'en-tête des reçus avec logo de l'église

---

**📄 Document créé le :** 21 janvier 2025  
**✍️ Auteur :** Système de gestion d'église  
**🔄 Version :** 1.0
