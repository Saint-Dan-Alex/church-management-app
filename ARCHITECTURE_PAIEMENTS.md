# 🏗️ Architecture du Système de Paiements

## 📋 Vue d'ensemble

Le système de paiement combine les **enfants** et **moniteurs** pour créer une liste unifiée de participants pouvant effectuer des paiements pour les activités.

---

## 📁 Structure des fichiers

```
types/
├── payment.ts          # Types pour paiements, reçus, configurations
├── child.ts            # Type Child (enfants)
└── monitor.ts          # Type Monitor (moniteurs)

lib/utils/
└── payment-helpers.ts  # Fonctions utilitaires pour combiner enfants + moniteurs

components/activities/
├── payment-manager.tsx         # Gestionnaire principal
├── add-payment-dialog.tsx      # Dialog d'ajout de paiement
├── receipt-generator.tsx       # Générateur de reçus
└── payment-config-dialog.tsx   # Configuration des paiements
```

---

## 🔄 Flux de données

### 1️⃣ Récupération des participants

```typescript
// Dans PaymentManager.tsx
const mockChildren: Child[] = [...] // Enfants de la base de données
const mockMonitors: Monitor[] = [...] // Moniteurs de la base de données

// Combinaison en une seule liste
const participants = combineParticipants(mockChildren, mockMonitors)
```

### 2️⃣ Interface Participant unifiée

```typescript
interface Participant {
  id: string
  nom: string
  prenom: string
  nomComplet: string
  type: "enfant" | "moniteur"  // ← Distinction
  email?: string
  telephone?: string
}
```

### 3️⃣ Conversion automatique

**Enfant → Participant**
```typescript
{
  id: "c1",
  nom: "MUKEBA",
  prenom: "David",
  nomComplet: "David MUKEBA",
  type: "enfant",  // ← Automatiquement marqué
  email: "david.mukeba@example.com",
  telephone: "+243 900 000 001"
}
```

**Moniteur → Participant**
```typescript
{
  id: "m1",
  nom: "LENGE",
  prenom: "Marie",
  nomComplet: "Marie LENGE",
  type: "moniteur",  // ← Automatiquement marqué
  email: "marie.lenge@example.com",
  telephone: "+243 900 000 010"
}
```

---

## 🛠️ Fonctions utilitaires

### `combineParticipants()`
Combine les enfants et moniteurs en une seule liste triée

```typescript
const participants = combineParticipants(children, monitors)
// Résultat: Liste triée par ordre alphabétique
// Moniteurs ET enfants mélangés
```

### `childToParticipant()`
Convertit un enfant en participant

```typescript
const participant = childToParticipant(child)
// Ajoute automatiquement type: "enfant"
```

### `monitorToParticipant()`
Convertit un moniteur en participant

```typescript
const participant = monitorToParticipant(monitor)
// Ajoute automatiquement type: "moniteur"
```

### `filterParticipantsByType()`
Filtre par type (enfant/moniteur/tous)

```typescript
const enfantsOnly = filterParticipantsByType(participants, "enfant")
const moniteursOnly = filterParticipantsByType(participants, "moniteur")
const tous = filterParticipantsByType(participants, "tous")
```

### `searchParticipants()`
Recherche dans la liste

```typescript
const results = searchParticipants(participants, "Marie")
// Cherche dans nom, prénom, nomComplet
```

---

## 🎨 Interface utilisateur

### Sélection d'un participant

```tsx
<Select>
  <SelectContent>
    {participants.map((participant) => (
      <SelectItem key={participant.id} value={participant.id}>
        <div className="flex items-center gap-2">
          <span>{participant.nomComplet}</span>
          <span className="text-xs text-gray-500">
            ({participant.type === "enfant" ? "Enfant" : "Moniteur"})
          </span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Affichage:**
- David MUKEBA (Enfant)
- Grace NZITA (Enfant)
- Jean NFEO (Moniteur)
- Marie LENGE (Moniteur)
- Paul NGEA (Moniteur)

---

## 💾 Enregistrement d'un paiement

### Données sauvegardées

```typescript
{
  id: "pay-123",
  activiteId: "1",
  participantId: "c1",  // ← ID de l'enfant ou moniteur
  participantNom: "MUKEBA",
  participantPrenom: "David",
  participantNomComplet: "David MUKEBA",
  montant: 5000,
  devise: "CDF",
  montantPaye: 5000,
  statut: "paid",
  // ... autres champs
}
```

---

## 🔌 Intégration avec la base de données

### TODO: Remplacer les données mockées

**Actuellement (Mock):**
```typescript
const mockChildren: Child[] = [...]
const mockMonitors: Monitor[] = [...]
```

**Futur (Base de données):**
```typescript
// Dans PaymentManager.tsx
const { data: children } = useQuery(['children'], fetchChildren)
const { data: monitors } = useQuery(['monitors'], fetchMonitors)
const participants = combineParticipants(children, monitors)
```

---

## 📊 Cas d'usage

### Paiement d'un enfant
```
Activité: Sortie au Zoo
Participant: David MUKEBA (Enfant)
Montant: 10 000 CDF
Parent notifié: +243 900 000 002
```

### Paiement d'un moniteur
```
Activité: Formation des moniteurs
Participant: Marie LENGE (Moniteur)
Montant: 5 000 CDF
Email: marie.lenge@example.com
```

---

## 🎯 Avantages de cette architecture

✅ **Unification:** Une seule interface pour enfants et moniteurs  
✅ **Flexibilité:** Facile d'ajouter d'autres types (adultes, visiteurs...)  
✅ **Type-safe:** TypeScript garantit la cohérence  
✅ **Réutilisable:** Les fonctions peuvent être utilisées ailleurs  
✅ **Maintenable:** Code centralisé dans `payment-helpers.ts`  

---

## 🚀 Extensions futures possibles

### Ajouter des adultes
```typescript
interface Participant {
  type: "enfant" | "moniteur" | "adulte"  // ← Nouveau type
}

function adulteToParticipant(adulte: Adulte): Participant {
  // Conversion...
}
```

### Filtrage avancé
```typescript
// Par salle
const participantsSalle1 = filterBySalle(participants, "1")

// Par âge
const participantsAdolescents = filterByAge(participants, 13, 17)
```

### Gestion des familles
```typescript
// Regrouper par famille
const familles = groupByFamily(participants)

// Paiement groupé
const paiementFamilial = createFamilyPayment(famille)
```

---

## 📝 Notes importantes

1. Les IDs des enfants commencent par `c` (ex: `c1`, `c2`)
2. Les IDs des moniteurs commencent par `m` (ex: `m1`, `m2`)
3. La liste est **toujours triée** par ordre alphabétique
4. Le champ `type` permet de distinguer facilement enfants/moniteurs
5. Les fonctions sont **pures** (pas d'effets de bord)

---

**📄 Document créé le :** 21 janvier 2025  
**🔄 Version :** 1.0  
**✍️ Auteur :** Système de gestion d'église
