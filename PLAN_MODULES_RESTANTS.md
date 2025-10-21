# 📋 Plan d'Action - Modules Restants

## 🎯 Modules à compléter

1. **BLOG** - Articles et communications
2. **PHOTOTHÈQUE** - Gestion des photos
3. **VIDÉOTHÈQUE** - Gestion des vidéos

---

## ✅ Actions à implémenter

### Pour chaque module :

#### 1. **Créer/Ajouter**
- ✅ Formulaire complet
- ✅ Validation des données
- ✅ Upload de fichiers (photos/vidéos)
- ✅ Sauvegarde fonctionnelle
- ✅ Message de confirmation

#### 2. **Lire/Afficher**
- ✅ Liste avec données mockées
- ✅ Cartes visuelles
- ✅ Recherche en temps réel
- ✅ Filtres fonctionnels
- ✅ Pagination

#### 3. **Modifier/Éditer**
- ✅ Formulaire pré-rempli
- ✅ Sauvegarde des modifications
- ✅ Message de confirmation

#### 4. **Supprimer**
- ✅ Confirmation avant suppression
- ✅ Suppression effective
- ✅ Message de confirmation

---

## 📊 État actuel

### BLOG (/blog)
- ✅ Page existe
- ✅ Composants existent
- ⚠️ À vérifier : Actions CRUD

### PHOTOTHÈQUE (/photos)
- ✅ Dossier existe
- ⚠️ À créer/compléter

### VIDÉOTHÈQUE (/videos)
- ✅ Dossier existe
- ⚠️ À créer/compléter

---

## 🚀 Plan d'action

### Phase 1 : BLOG ✅
1. Vérifier add-blog-dialog.tsx
2. Vérifier blog-list.tsx
3. Implémenter toutes les actions CRUD
4. Tester toutes les fonctionnalités

### Phase 2 : PHOTOTHÈQUE 📸
1. Créer types/photo.ts
2. Créer components/photos/photo-gallery.tsx
3. Créer components/photos/upload-photo-dialog.tsx
4. Implémenter upload d'images
5. Implémenter CRUD complet
6. Créer page photos/page.tsx

### Phase 3 : VIDÉOTHÈQUE 🎥
1. Créer types/video.ts
2. Créer components/videos/video-gallery.tsx
3. Créer components/videos/upload-video-dialog.tsx
4. Implémenter upload de vidéos
5. Implémenter CRUD complet
6. Créer page videos/page.tsx

---

## 🎨 Fonctionnalités détaillées

### BLOG
- Titre, contenu, auteur
- Catégories (Annonces, Témoignages, Enseignements)
- Statut (Publié, Brouillon)
- Image de couverture
- Date de publication
- Nombre de vues

### PHOTOTHÈQUE
- Upload multiple d'images
- Titre, description
- Albums/Catégories
- Tags
- Date de prise
- Téléchargement
- Galerie avec aperçu

### VIDÉOTHÈQUE
- Upload de vidéos
- Ou lien YouTube/Vimeo
- Titre, description
- Miniature
- Catégories (Cultes, Témoignages, Formations)
- Durée
- Lecteur intégré

---

## 📦 Structure des fichiers à créer

```
types/
├── photo.ts
└── video.ts

components/
├── blog/
│   ├── add-blog-dialog.tsx ✅
│   ├── blog-list.tsx ✅
│   └── edit-blog-dialog.tsx [À créer]
├── photos/
│   ├── photo-gallery.tsx [À créer]
│   ├── upload-photo-dialog.tsx [À créer]
│   ├── photo-card.tsx [À créer]
│   └── edit-photo-dialog.tsx [À créer]
└── videos/
    ├── video-gallery.tsx [À créer]
    ├── upload-video-dialog.tsx [À créer]
    ├── video-card.tsx [À créer]
    └── edit-video-dialog.tsx [À créer]

app/(dashboard)/
├── blog/page.tsx ✅
├── photos/page.tsx [À créer]
└── videos/page.tsx [À créer]
```

---

## ⏱️ Estimation

- BLOG : 30 min
- PHOTOTHÈQUE : 1h
- VIDÉOTHÈQUE : 1h

**Total : ~2h30**

---

**Document créé le :** 21 janvier 2025  
**Objectif :** Compléter tous les modules avec actions fonctionnelles
