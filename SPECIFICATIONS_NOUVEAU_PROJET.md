# 📘 SPÉCIFICATIONS TECHNIQUES : PROJET V2 (MULTI-ENTITÉS)

Ce document est le **MASTER PLAN** pour le développement de la nouvelle version de l'application. Il reprend **l'intégralité des 15 modules** de la version actuelle et définit leur transformation pour une architecture multi-entités (Église / Ministères / Cellules).

---

## 1. 🏗️ ARCHITECTURE FONDAMENTALE (LE "CORE")

### 1.1. Hiérarchie à 3 Niveaux
Contrairement à la V1 (plate), la V2 est arborescente :
1.  **L'Église Principale (Root)** : Entité mère, supervise tout.
2.  **Les Ministères (Grands Départements)** : Jeunesse, Femmes, ECODIM, Chorale...
3.  **Les Cellules (Proximité)** : Cellules de maison, Groupes de prière.

### 1.2. Le "Context System" (Mécanique Clé)
L'application fonctionne comme des "Espaces de Travail" isolés.
*   **Context Switcher** : Un menu déroulant permet de changer de casquette (ex: passer de "Administrateur Global" à "Responsable Jeunesse").
*   **Cloisonnement** : Quand on est dans le contexte "Jeunesse", on ne voit QUE les données Jeunesse.

---

## 2. 🔄 ADAPTATION DES 15 MODULES FONCTIONNELS

Nous reprenons chaque module existant pour le rendre "Multi-Entités Compatible".

### 👥 GESTION DES PERSONNES (MEMBRES)

#### 1️⃣ MODULE MEMBRES (Remplaçant "Moniteurs")
*   **V1 :** "Moniteurs" (Spécifique ECODIM).
*   **V2 Multi-Entités :**
    *   **Généralisation :** Le module devient **"Gestion des Membres"**.
    *   Chaque entité gère sa propre liste de membres.
    *   *Cas ECODIM :* Les "Moniteurs" sont simplement des membres du ministère ECODIM avec un rôle "Enseignant".
    *   *Cas Chorale :* Les "Choristes" sont les membres du ministère Chorale.

#### 2️⃣ MODULE ENFANTS (Membres Juniors)
*   **V1 :** Liste globale des enfants.
*   **V2 Multi-Entités :**
    *   Les enfants sont rattachés principalement au ministère **ECODIM**.
    *   Possibilité de créer des sous-groupes par tranches d'âge (ex: 3-5 ans, 6-9 ans).

#### 3️⃣ MODULE SALLES (Spécifique ECODIM)
*   **V1 :** Gestion des classes physiques.
*   **V2 Multi-Entités :**
    *   **Module conditionnel :** Activé UNIQUEMENT pour le ministère **ECODIM** (Gestion des classes d'âge).
    *   Pour les autres ministères/cellules, la notion de "Salle" disparaît au profit d'un simple champ "Lieu" dans les activités.

#### 1️⃣5️⃣ MODULE UTILISATEURS (Système & Accès)
*   **V1 :** Rôles simples (Admin, User).
*   **V2 Multi-Entités :**
    *   **Système d'Appartenance (Memberships)** : Un utilisateur peut avoir plusieurs rôles.
    *   *Exemple :* Jean est `Admin` (Cellule A) ET `Trésorier` (Ministère Hommes).

---

### 📅 GESTION DES ACTIVITÉS & CULTE

#### 4️⃣ MODULE ACTIVITÉS (Calendriers)
*   **V1 :** Un seul calendrier pour tout le monde.
*   **V2 Multi-Entités :**
    *   **Activités Globales** (ex: Culte Dimanche) : Visibles par TOUS.
    *   **Activités Locales** (ex: Répétition) : Visibles uniquement par les membres du ministère.
    *   **Conflits :** Alerte si une activité locale chevauche une activité globale obligatoire.

#### 5️⃣ MODULE ENSEIGNEMENTS (Contenu)
*   **V1 :** Prédications du dimanche.
*   **V2 Multi-Entités :**
    *   Bibliothèque partagée : Les ministères peuvent publier des enseignements spécifiques (ex: "Formation des Leaders Jeunesses").
    *   Accès restreint possible (Contenu réservé aux leaders).

#### 6️⃣ MODULE RAPPORTS DE CULTE (Statistiques)
*   **V1 :** Rapport unique du dimanche.
*   **V2 Multi-Entités :**
    *   **Consolidation :** Le Dashboard Global agrège les rapports.
    *   *Formule :* `Total Présences Semaine = (Présences Culte Dimanche) + (Somme Présences Cellules)`.
    *   Permet d'analyser la santé des cellules vs l'attractivité du culte principal.

#### 1️⃣2️⃣ MODULE PRÉSENCES (Tracking)
*   **V1 :** Présence binaire (Là / Pas là).
*   **V2 Multi-Entités :**
    *   Tracking par contexte.
    *   Indicateurs de **"Santé Spirituelle"** : *Membre qui vient au culte mais plus en cellule = Danger d'isolement.*

---

### 💰 GESTION FINANCIÈRE (MULTI-WALLETS)

#### 1️⃣0️⃣, 1️⃣1️⃣, 1️⃣4️⃣ MODULES DÉPENSES / PAIEMENTS / CAISSE
*   **V1 :** Une caisse unique.
*   **V2 Multi-Entités :**
    *   **Architecture "Banque Interne"** : Chaque Entité (Ministère/Cellule) a son **Wallet** (Portefeuille virtuel).
    *   **Autonomie :** La Jeunesse gère ses propres Dépenses/Recettes.
    *   **Supervision :** Le Trésorier Général peut auditer tous les Wallets.
    *   **Transferts :** Possibilité de virement interne (L'Église subventionne la Chorale).

#### 1️⃣3️⃣ MODULE COTISATIONS (Campagnes)
*   **V1 :** Liste de paiements.
*   **V2 Multi-Entités :**
    *   **Campagnes Ciblées :**
        *   "Construction Temple" (Global -> Wallet Église).
        *   "Achat Uniformes" (Local -> Wallet Chorale).

---

### �️ GESTION LOGISTIQUE & INTENDANCE (NOUVEAU)

#### 1️⃣6️⃣ MODULE INTENDANCE (Stocks & Équipements)
*   **V1 :** Inexistant.
*   **V2 Multi-Entités :**
    *   **Inventaire Multi-Niveaux :**
        *   **Église (Global) :** Gestion du patrimoine immobilier, chaises, sono principale, véhicules.
        *   **Ministères (Local) :** Gestion des actifs propres (ex: La Chorale gère ses micros et robes, la Jeunesse gère ses ballons de foot).
    *   **Réservations :** Lien avec le *Module Activités*. Quand on crée une activité, on peut réserver du matériel (ex: "Besoin de 50 chaises et 2 micros").

### ❤️ SUIVI PASTORAL & VISION (NOUVEAU)

#### 1️⃣7️⃣ MODULE SOCIAL (Bien-Être & Cas Sociaux)
*   **V1 :** Inexistant.
*   **V2 Multi-Entités :**
    *   **Remontée d'Infos :** Le Chef de Cellule signale un événement (Maladie, Deuil, Naissance, Sollicitation).
    *   **Tracking :** L'équipe pastorale suit l'évolution (Visite effectuée ? Aide versée ?).
    *   **Confidentialité :** Accès très restreint (Uniquement Pasteur + Diacres concernés).

#### 1️⃣8️⃣ MODULE PLANIFICATION (Objectifs & Stratégie)
*   **V1 :** Inexistant.
*   **V2 Multi-Entités :**
    *   **OKRs / Objectifs :** Chaque Ministère définit ses objectifs annuels (ex: "Atteindre 500 membres", "Lancer 3 nouvelles cellules").
    *   **Jauges de Progression :** Le Dashboard compare *Réalisé vs Prévu*.
    *   **Bilan :** Facilite les rapports trimestriels et annuels.

### �📢 COMMUNICATION & MÉDIA

#### 7️⃣, 8️⃣, 9️⃣ MODULES BLOG / VIDÉO / PHOTO
*   **V1 :** Contenu global.
*   **V2 Multi-Entités :**
    *   **Auteur Entité :** Un article est publié "Par la Jeunesse" ou "Par l'Église".
    *   **Fil d'actualité personnalisé :** Un membre voit en priorité les news de ses groupes.

---

## 3. 👤 SCÉNARIOS & RÔLES UTILISATEURS

### 3.1. TYPOLOGIE DES UTILISATEURS (5 Catégories)

1.  **👑 Les Administrateurs (Niveau Global)**
    *   **Super-Admin (Pasteur Principal) :** Vue totale, accès à tous les dashboards.
    *   **Secrétaire Central :** Gestion opérationnelle globale.

2.  **🏗️ Les Gestionnaires de Ministère (Niveau Département)**
    *   **Président de Ministère :** Gère uniquement SON ministère (Membres, Activités, Budget).
    *   **Trésorier Local :** Accès limité au Wallet du ministère pour saisir les dépenses.
    *   **Intendant Local :** Gère le stock spécifique (ex: Robes de la Chorale).

3.  **🕸️ Les Leaders de Terrain (Niveau Cellule)**
    *   **Chef de Cellule :** Rôle opérationnel (Appel, Offrandes, Remontée besoins sociaux).
    *   **Noteur :** Assistant administratif de la cellule.

4.  **🚑 Les Rôles de Soutien (Transverses)**
    *   **Intendant Général :** Gère le patrimoine global de l'église.
    *   **Responsable Social :** Reçoit les alertes "Maladie/Deuil".
    *   **Responsable Planification :** Suit les indicateurs de performance (OKRs).

5.  **👤 Les Membres Standards**
    *   Accès simple : Profil personnel, Historique de ses cotisations, Agenda de ses groupes.

### 3.2. SCÉNARIOS D'USAGE TYPIQUES

#### Scénario A : Le Pasteur Principal (Super-Admin)
Il a la vue **"Hélicoptère"**. Il ne micro-manage pas.
*   Regarde le **Dashboard Global** : "La fréquentation globale augmente, mais les finances de l'ECODIM sont dans le rouge."
*   Utilise le **Sélecteur** pour auditer un ministère spécifique en cas de problème.

### 3.2. Le Responsable de Ministère (ex: Président des Femmes)
Elle a la vue **"Gestionnaire"**.
*   Gère son **Budget Autonome**.
*   Organise ses propres **Activités**.
*   Suit ses propres **Membres**.
*   *Elle n'a pas accès aux données des Hommes ou de la Jeunesse.*

### 3.3. Le Chef de Cellule (Leader Local)
Il a la vue **"Terrain"** (souvent sur Mobile).
*   Fait l'appel (Présences) le mercredi soir.
*   Remonte les offrandes de cellule.
*   Signale les besoins pastoraux (Maladie, Visites).

---

## 4. 🚀 ROADMAP TECHNIQUE

Pour réussir cette transformation, nous devons procéder par étapes :

**PHASE 1 : LE NOYAU (Squelette)**
1.  Création du projet Laravel/Next.js.
2.  Implémentation des tables `ministries`, `cells` et `memberships`.
3.  Design du "Context Switcher" en Frontend.

**PHASE 2 : LES MIGRATIONS DE MODULES (Muscles)**
1.  Portage du module **Activités** (Ajout `entity_id`).
2.  Portage du module **Finances** (Création système Wallets).
3.  Portage du module **Utilisateurs** (Système multi-rôles).

**PHASE 3 : LES DASHBOARDS (Cerveau)**
1.  Création du Dashboard Global (Agrégation).
2.  Création des Dashboards Locaux (Vues filtrées).

---

## 5. 💾 NOUVELLE STRUCTURE DE BASE DE DONNÉES

### Table `entities` (Polymorphe ou Tables Séparées)
Pour simplifier, nous garderons `ministries` et `cells`, mais elles partageront une logique commune (Wallet, Activités).

*   `ministries` : id, name, type, parent_id, wallet_id
*   `cells` : id, name, ministry_id, leader_id, wallet_id
*   `memberships` : user_id, entity_type, entity_id, role

### Tables Métier (Toutes gagnent `entity_id`)
*   `activities` : ..., `entity_type`, `entity_id`
*   `expenses` : ..., `wallet_id`
*   `payments` : ..., `wallet_id`
*   `worship_reports` : ..., `entity_type`, `entity_id`
