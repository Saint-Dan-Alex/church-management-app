# 🖼️ Installation du Logo de l'Église

## 📋 Instructions

Pour que le logo de l'église s'affiche correctement dans l'application, suivez ces étapes :

---

## 1️⃣ Créer le dossier public (si nécessaire)

Si le dossier `public` n'existe pas encore à la racine du projet :

```bash
# Ouvrir le terminal dans le dossier du projet
cd "c:\Users\joelo\Documents\church-management-app VF"

# Créer le dossier public
mkdir public
```

---

## 2️⃣ Ajouter le logo

1. **Sauvegarder l'image du logo** que vous avez fournie sous le nom : **`logo-arche.png`**

2. **Copier le fichier** dans le dossier `public` :
   ```
   c:\Users\joelo\Documents\church-management-app VF\public\logo-arche.png
   ```

3. **Structure attendue :**
   ```
   church-management-app VF/
   ├── public/
   │   └── logo-arche.png  ← Votre logo ici
   ├── app/
   ├── components/
   ├── lib/
   └── ...
   ```

---

## 3️⃣ Vérifier l'installation

### Option A : Via l'explorateur de fichiers

1. Ouvrir l'explorateur Windows
2. Naviguer vers : `c:\Users\joelo\Documents\church-management-app VF\public\`
3. Vérifier que le fichier `logo-arche.png` est présent

### Option B : Via le terminal

```bash
# Vérifier si le fichier existe
dir public\logo-arche.png
```

---

## 4️⃣ Redémarrer le serveur

Après avoir ajouté le logo, redémarrer le serveur de développement :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

---

## 📍 Où le logo apparaît

Le logo sera affiché dans les endroits suivants :

### ✅ Reçus de paiement
- En haut du reçu
- Avec le nom de l'église et du ministère
- Format : Logo + Texte centré

### ✅ Rapports d'activités
- En-tête du rapport
- À côté des informations de l'église
- Format : Logo + Informations alignées

### ✅ Documents PDF exportés
- Inclus automatiquement dans les exports
- Qualité optimale pour l'impression

---

## 🎨 Format du logo

### Recommandations :

| Propriété | Recommandation |
|-----------|----------------|
| **Format** | PNG (avec transparence) |
| **Dimensions** | 500x500 px minimum |
| **Résolution** | 300 DPI pour l'impression |
| **Taille fichier** | < 500 KB idéalement |
| **Fond** | Transparent (recommandé) |

### Votre logo actuel :
- ✅ Format PNG
- ✅ Bonnes dimensions
- ✅ Couleurs : Bleu (#1E40AF) et Jaune/Or (#F59E0B)

---

## 🔧 Configuration du logo

Le logo est configuré dans : **`lib/config/church-info.ts`**

```typescript
export const CHURCH_INFO = {
  // Logo
  logo: "/logo-arche.png",  // ← Chemin du logo
  logoAlt: "Logo Centre Evangélique Arche de l'Alliance",
  
  // Informations de l'église
  name: "Centre Evangélique Arche de l'Alliance",
  ministry: "Ministère auprès des Enfants et Adolescents",
  
  // ...
}
```

### Pour changer le logo :

1. Remplacer le fichier `public/logo-arche.png`
2. Ou modifier le chemin dans `church-info.ts`

---

## 🐛 Dépannage

### Le logo ne s'affiche pas

**Vérifications :**

1. ✅ Le fichier est bien nommé `logo-arche.png` (minuscules)
2. ✅ Le fichier est dans le dossier `public/` (pas dans un sous-dossier)
3. ✅ Le serveur a été redémarré après l'ajout du fichier
4. ✅ Le chemin dans `church-info.ts` est correct (`/logo-arche.png`)

**Console du navigateur :**
Ouvrir la console (F12) et vérifier s'il y a des erreurs 404

---

### Image floue ou pixelisée

**Solution :**
Utiliser une image de meilleure résolution (au moins 1000x1000 px)

---

### Logo trop grand/petit

**Ajuster la taille :**

Dans les composants, modifier les dimensions :

```tsx
{/* Reçu : 32x32 (128px) */}
<div className="relative w-32 h-32">

{/* Rapport : 20x20 (80px) */}
<div className="relative w-20 h-20">
```

---

## 📝 Informations de l'église

Les informations suivantes sont configurées :

### Nom officiel :
```
Centre Evangélique Arche de l'Alliance
```

### Ministère :
```
Ministère auprès des Enfants et Adolescents
```

### Devise :
```
"Former la nouvelle génération pour Christ"
```

### Couleurs officielles :
- **Bleu primaire :** #1E40AF
- **Jaune/Or secondaire :** #F59E0B
- **Bleu accent :** #3B82F6

---

## 🎯 Prochaines étapes

Après avoir installé le logo :

1. ✅ Tester la génération d'un reçu
2. ✅ Vérifier le rapport d'activité
3. ✅ Exporter un PDF pour voir le rendu final
4. ✅ Ajuster les informations dans `church-info.ts` si nécessaire

---

## 📞 Informations à compléter

Dans `lib/config/church-info.ts`, pensez à compléter :

```typescript
{
  // Coordonnées
  address: "Kinshasa, République Démocratique du Congo",  // ← Adresse complète
  phone: "+243 XXX XXX XXX",  // ← Numéro de téléphone
  email: "contact@arche-alliance.org",  // ← Email
  website: "www.arche-alliance.org",  // ← Site web
  
  // Informations bancaires
  banking: {
    accountNumber: "",  // ← Numéro de compte
    bank: "",  // ← Nom de la banque
    mobileMoney: {
      mpesa: "",  // ← Numéro M-Pesa
      airtelMoney: "",  // ← Numéro Airtel Money
    },
  },
  
  // Signature
  signature: {
    name: "",  // ← Nom du responsable
  },
}
```

---

## ✅ Checklist finale

- [ ] Dossier `public/` créé
- [ ] Fichier `logo-arche.png` copié dans `public/`
- [ ] Serveur redémarré
- [ ] Logo visible dans les reçus
- [ ] Logo visible dans les rapports
- [ ] Informations de l'église complétées dans `church-info.ts`

---

**📄 Document créé le :** 21 janvier 2025  
**✍️ Pour :** Centre Evangélique Arche de l'Alliance  
**🎯 Ministère :** Ministère auprès des Enfants et Adolescents
