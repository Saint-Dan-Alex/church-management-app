# 🧪 Guide de Test - Gestion de Présence des Moniteurs

## 📋 Prérequis
- Serveur de développement lancé : `npm run dev`
- Navigateur ouvert sur : `http://localhost:3000`

---

## 🚀 Étapes de Test

### 1️⃣ Accéder au Module Activités

1. Dans le menu latéral, cliquez sur **"Activités"**
2. Vous verrez la liste des activités disponibles
3. Vous pouvez utiliser deux modes d'affichage :
   - **📅 Calendrier** : Vue calendrier
   - **📋 Liste** : Vue liste détaillée

### 2️⃣ Accéder à la Gestion de Présence

**Méthode 1 : Clic sur la carte**
- Cliquez n'importe où sur une carte d'activité
- Vous serez redirigé vers la page de détails

**Méthode 2 : Menu déroulant** (⋮)
- Cliquez sur les 3 points verticaux
- Sélectionnez **"👁️ Voir Détails"** ou **"📱 Gérer Présence"**

### 3️⃣ Page de Détails de l'Activité

Une fois sur la page, vous verrez :

**📊 Colonne Gauche :**
- **Carte Informations**e 
  - Date de l'activité
  - Horaire (début - fin)
  - Lieu
  - Responsable
  
- **Carte Participants**
  - Liste des participants attendus
  - Avatars avec initiales

**📱 Colonne Droite (Onglets) :**
- **Onglet "Présence"** (par défaut)
- **Onglet "Détails"**

---

## 📱 Test de l'Onglet Présence

### A. Statistiques en Temps Réel

Vous verrez 4 cartes affichant :
1. **Total Moniteurs** : 10 (icône bleue 👥)
2. **Présents** : 7 (icône verte ✅)
3. **Retards** : 1 (icône orange 🕐)
4. **Taux de Présence** : 70% (chiffre bleu)

---

### B. Test du QR Code

#### 🔲 Générer un QR Code

1. Cliquez sur le bouton **"🔲 Générer QR Code"**
2. Une fenêtre modale s'ouvre avec :
   - **QR Code** (256x256px, au centre)
   - **Nom de l'activité** : "Réunion des moniteurs"
   - **Date** : Format long en français
   - **Badge d'expiration** : "Expire dans X minutes" (orange)

#### ✅ Vérifications à faire :

- [ ] Le QR code s'affiche correctement
- [ ] Le badge indique "Expire dans 120 minutes" (ou moins si régénéré)
- [ ] Le nom de l'activité est correct
- [ ] La date est formatée en français

#### 💾 Télécharger le QR Code

1. Cliquez sur **"⬇️ Télécharger le QR Code"**
2. Un fichier PNG sera téléchargé : `QR-Réunion-des-moniteurs-[DATE].png`

#### ✅ Vérifications :
- [ ] Le fichier PNG se télécharge
- [ ] Le QR code est lisible dans le fichier
- [ ] Le nom du fichier contient la date du jour

#### 📱 Scanner le QR Code (Simulation)

**Pour tester le scan (avec un téléphone réel) :**
1. Ouvrez une app de scan QR code sur votre smartphone
2. Scannez le QR code affiché à l'écran
3. Vous devriez voir les données JSON :
```json
{
  "activiteId": "1",
  "date": "2025-01-25T...",
  "token": "abc123"
}
```

---

### C. Test de la Saisie Manuelle

#### ✍️ Ouvrir le Formulaire

1. Cliquez sur **"➕ Saisie Manuelle"**
2. Une fenêtre modale s'ouvre avec le titre :
   **"Saisie Manuelle de la Présence"**
3. Sous-titre : *"Pour les moniteurs sans téléphone ou en cas de problème technique"*

#### 📝 Sélectionner les Moniteurs

Vous verrez une liste de 6 moniteurs :
- [ ] Marie LENGE
- [ ] Paul NGEA
- [ ] Jean NFEO
- [ ] Sarah JEMMA
- [ ] Marc CHRISTIAN
- [ ] David MUKEBA

**Actions à tester :**

1. **Cochez 3 moniteurs** (par exemple : Marie, Paul, Jean)
   - ✅ Des cartes individuelles apparaissent en bas pour chacun

2. **Décochez un moniteur**
   - ✅ Sa carte disparaît immédiatement

#### 📋 Remplir les Détails pour Chaque Moniteur

Pour **chaque moniteur sélectionné**, vous verrez une **carte bleue** avec :

**Champs disponibles :**

1. **Heure d'arrivée*** (obligatoire)
   - Input de type `time`
   - Pré-rempli avec l'heure actuelle

2. **Heure de départ** (optionnel)
   - Input de type `time`
   - Vide par défaut

3. **Statut*** (obligatoire - Radio buttons)
   - ⚪ Présent (sélectionné par défaut)
   - ⚪ En retard
   - ⚪ Excusé

4. **Remarque** (optionnel)
   - Textarea pour commentaires
   - Placeholder : "Commentaires ou observations..."

#### ✅ Tests à effectuer :

**Test 1 : Présence simple**
- Sélectionnez "Marie LENGE"
- Laissez l'heure d'arrivée par défaut
- Statut : "Présent"
- Cliquez "Enregistrer (1)"

**Test 2 : Retard avec remarque**
- Sélectionnez "Paul NGEA"
- Heure d'arrivée : 14:15
- Statut : "En retard"
- Remarque : "Problème de transport"
- Cliquez "Enregistrer (1)"

**Test 3 : Multiple avec détails**
- Sélectionnez 3 moniteurs
- Pour le 1er : Présent, 14:00, départ 16:00
- Pour le 2ème : Retard, 14:20
- Pour le 3ème : Excusé, remarque "Maladie"
- Bouton doit afficher "Enregistrer (3)"
- Cliquez sur "Enregistrer (3)"

**Test 4 : Validation**
- Sélectionnez 0 moniteur
- ✅ Le bouton "Enregistrer" doit être **désactivé**

**Test 5 : Annulation**
- Sélectionnez des moniteurs et remplissez les détails
- Cliquez "Annuler"
- ✅ La fenêtre se ferme sans enregistrer

---

### D. Test de la Liste des Présences

Après avoir "enregistré" des présences (mockées), vous verrez la **liste des présences** :

#### 🎯 Éléments à vérifier :

Pour chaque entrée de présence :

1. **Avatar avec initiales**
   - Cercle bleu avec initiales blanches (ex: ML pour Marie LENGE)

2. **Nom complet**
   - En gras, couleur foncée

3. **Informations horaires**
   - Format : "Arrivée: 14:00" ou "Arrivée: 14:00 - Départ: 16:00"
   - Texte gris, plus petit

4. **Badge Mode d'enregistrement**
   - "QR Code" (si scanné)
   - "Manuel" (si saisi manuellement)

5. **Badge Statut** (coloré avec icône)
   - 🟢 **Présent** : Fond vert clair, texte vert foncé, icône ✅
   - 🟠 **Retard** : Fond orange clair, texte orange foncé, icône 🕐
   - 🔵 **Excusé** : Fond bleu clair, texte bleu foncé
   - 🔴 **Absent** : Fond rouge clair, texte rouge foncé, icône ❌

6. **Remarque** (si présente)
   - Texte italique, gris, plus petit
   - Ex: "Problème de transport"

#### ✅ Présences mockées à vérifier :

**Entrée 1 :**
- Moniteur : Marie LENGE
- Arrivée : 14:00
- Statut : Présent (vert)
- Mode : QR Code

**Entrée 2 :**
- Moniteur : Paul NGEA
- Arrivée : 14:15
- Statut : Retard (orange)
- Mode : QR Code
- Remarque : "Arrivé 15 min en retard"

---

## 🎨 Vérifications Visuelles

### Cartes de Statistiques
- [ ] Les icônes sont bien visibles
- [ ] Les chiffres sont gros et lisibles
- [ ] Les couleurs correspondent (bleu, vert, orange)
- [ ] L'alignement est correct

### Boutons d'Action
- [ ] "Générer QR Code" : Fond bleu, icône QR code
- [ ] "Saisie Manuelle" : Fond blanc avec bordure, icône UserPlus
- [ ] Les boutons sont bien espacés

### Dialog QR Code
- [ ] Le QR code est centré
- [ ] Il est entouré d'une bordure grise
- [ ] Le badge d'expiration est visible et orange
- [ ] Le bouton de téléchargement est en bas

### Dialog Saisie Manuelle
- [ ] La liste des moniteurs est scrollable si nécessaire
- [ ] Les cartes bleues des moniteurs sélectionnés sont bien visibles
- [ ] Les champs sont bien alignés
- [ ] Les boutons Annuler/Enregistrer sont en bas

### Liste des Présences
- [ ] Les avatars sont ronds et bleus
- [ ] Les badges de statut ont les bonnes couleurs
- [ ] L'espacement entre les entrées est correct
- [ ] Le fond des cartes est gris clair

---

## 🐛 Bugs Potentiels à Vérifier

### QR Code
- [ ] Le QR code ne s'affiche pas → Vérifier la console
- [ ] Le téléchargement ne fonctionne pas → Tester sur différents navigateurs
- [ ] Le timer d'expiration ne se met pas à jour

### Saisie Manuelle
- [ ] Les cartes ne disparaissent pas quand on décoche
- [ ] Le compteur sur le bouton ne se met pas à jour
- [ ] Les champs ne se remplissent pas correctement
- [ ] Le scroll ne fonctionne pas avec beaucoup de moniteurs

### Statistiques
- [ ] Les chiffres ne correspondent pas
- [ ] Le taux de présence est incorrect
- [ ] Les icônes manquent

---

## 📊 Données de Test Mockées

### Activité
- ID: "1"
- Nom: "Réunion des moniteurs"
- Date: Aujourd'hui
- Total moniteurs: 10

### Statistiques
- Présents: 7
- Retards: 1
- Absents: 2
- Taux: 70%

### Moniteurs Disponibles
1. Marie LENGE
2. Paul NGEA
3. Jean NFEO
4. Sarah JEMMA
5. Marc CHRISTIAN
6. David MUKEBA

---

## 🔗 Navigation

### URLs à tester :
- Liste des activités : `http://localhost:3000/activities`
- Détails activité 1 : `http://localhost:3000/activities/1`
- Détails avec onglet présence : `http://localhost:3000/activities/1?tab=presence`

### Retour en arrière :
- Bouton ← en haut à gauche
- Doit ramener à `/activities`

---

## ✅ Checklist Complète de Test

### Fonctionnalités QR Code
- [ ] Génération du QR code
- [ ] Affichage correct du QR code
- [ ] Timer d'expiration fonctionnel
- [ ] Téléchargement en PNG
- [ ] Fermeture du dialog

### Fonctionnalités Saisie Manuelle
- [ ] Ouverture du dialog
- [ ] Sélection/désélection de moniteurs
- [ ] Apparition/disparition des cartes
- [ ] Remplissage des champs
- [ ] Validation du formulaire
- [ ] Compteur sur le bouton
- [ ] Enregistrement
- [ ] Annulation

### Affichage des Données
- [ ] Statistiques correctes
- [ ] Liste des présences
- [ ] Badges colorés
- [ ] Avatars avec initiales
- [ ] Remarques affichées

### Responsive Design
- [ ] Affichage sur grand écran (desktop)
- [ ] Affichage sur tablette
- [ ] Affichage sur mobile
- [ ] Dialogs adaptés

### Performance
- [ ] Chargement rapide de la page
- [ ] Pas de lag lors du clic
- [ ] Génération QR instantanée
- [ ] Scroll fluide

---

## 🎯 Résultat Attendu

Après tous ces tests, vous devriez pouvoir :

✅ Générer un QR code pour une activité
✅ Le télécharger en PNG
✅ Saisir manuellement la présence de plusieurs moniteurs
✅ Voir les statistiques en temps réel
✅ Consulter la liste complète des présences
✅ Identifier visuellement les différents statuts (couleurs)

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que le serveur tourne bien
3. Essayez de rafraîchir la page (Ctrl+R)
4. Vérifiez les données mockées dans le code

---

**Bon test ! 🚀**
