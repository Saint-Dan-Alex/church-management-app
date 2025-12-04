# 🎯 Migration API - Guide Complet
## Church Management Application

---

## ✅ CE QUI A ÉTÉ FAIT

### 1. Services API créés
✅ Tous les services API sont déjà en place dans `lib/services/` :
- `expensesService` - Dépenses
- `paymentsService` - Paiements
- `presencesService` - Présences
- `cotisationsService` - Cotisations
- `teachingsService` - Enseignements
- `worshipReportsService` - Rapports de culte
- `sortiesService` - Sorties/Caisse
- Et tous les autres modules...

### 2. Premier composant migré
✅ **expense-list.tsx** - Migré avec succès
- Utilise `expensesService.getAll()` pour charger les données
- Utilise `expensesService.delete()` pour supprimer
- Gestion du chargement avec spinner
- Gestion des erreurs avec message et bouton réessayer

---

## 📋 CE QU'IL RESTE À FAIRE

### 13 composants à migrer

#### Priorité 1 : Nouveaux modules (3 composants)
1. ✅ `components/expenses/expense-list.tsx` - **FAIT**
2. ⏳ `components/payments/payment-list.tsx`
3. ⏳ `components/presences/presence-list.tsx`
4. ⏳ `components/cotisations/cotisation-list.tsx`

#### Priorité 2 : Modules existants (2 composants)
5. ⏳ `components/teachings/teaching-list.tsx`
6. ⏳ `components/worship/worship-report-list.tsx`

#### Priorité 3 : Modules Caisse (3 composants)
7. ⏳ `components/caisse/sorties-list.tsx`
8. ⏳ `components/caisse/rapport-cotisations.tsx`
9. ⏳ `components/caisse/bilan-financier.tsx`

#### Priorité 4 : Sous-modules Activités (4 composants)
10. ⏳ `components/activities/unified-participants-view.tsx`
11. ⏳ `components/activities/presence-manager.tsx`
12. ⏳ `components/activities/payment-manager.tsx`
13. ⏳ `components/activities/expense-manager.tsx`

---

## 🛠️ GUIDE DE MIGRATION

### Pour chaque composant, suivre ces étapes :

#### Étape 1 : Imports
```typescript
// Ajouter ces imports
import { useEffect } from "react"  // Si pas déjà présent
import { Loader2 } from "lucide-react"
import { [serviceName]Service } from "@/lib/services"
```

#### Étape 2 : États
```typescript
// Remplacer
const [items, setItems] = useState<Type[]>(mockData)

// Par
const [items, setItems] = useState<Type[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

#### Étape 3 : Fonction de chargement
```typescript
useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await serviceNameService.getAll()
    setItems(Array.isArray(data) ? data : [])
  } catch (err: any) {
    const errorMessage = err.message || 'Erreur de chargement'
    setError(errorMessage)
    toast({
      title: "Erreur",
      description: errorMessage,
      variant: "destructive"
    })
  } finally {
    setLoading(false)
  }
}
```

#### Étape 4 : Mettre à jour handleDelete
```typescript
const handleDelete = async (item: Type) => {
  if (confirm(`Êtes-vous sûr ?`)) {
    try {
      await serviceNameService.delete(item.id)
      toast({
        title: "Supprimé",
        description: "L'élément a été supprimé avec succès.",
      })
      loadData() // Recharger les données
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de supprimer",
        variant: "destructive"
      })
    }
  }
}
```

#### Étape 5 : UI de chargement et d'erreur
```typescript
// Ajouter avant le return principal
if (loading) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Chargement...</span>
    </div>
  )
}

if (error) {
  return (
    <div className="text-center py-12">
      <p className="text-destructive mb-4">{error}</p>
      <Button onClick={loadData} variant="outline">
        Réessayer
      </Button>
    </div>
  )
}
```

#### Étape 6 : Supprimer les données mockées
```typescript
// Supprimer complètement
const mockData = [...]
```

---

## 📊 CORRESPONDANCE SERVICE ↔ COMPOSANT

| Composant | Service à utiliser |
|-----------|-------------------|
| expense-list.tsx | `expensesService` |
| payment-list.tsx | `paymentsService` |
| presence-list.tsx | `presencesService` |
| cotisation-list.tsx | `cotisationsService` |
| teaching-list.tsx | `teachingsService` |
| worship-report-list.tsx | `worshipReportsService` |
| sorties-list.tsx | `sortiesService` |
| rapport-cotisations.tsx | `cotisationsService` |
| bilan-financier.tsx | `expensesService` + `paymentsService` |
| unified-participants-view.tsx | `activitiesService` |
| presence-manager.tsx | `presencesService` |
| payment-manager.tsx | `paymentsService` |
| expense-manager.tsx | `expensesService` |

---

## ⚙️ CONFIGURATION REQUISE

### 1. Variables d'environnement
Vérifier que `.env.local` contient :
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 2. Backend Laravel
```bash
cd backend-laravel
php artisan serve
```
Le backend doit être accessible sur `http://127.0.0.1:8000`

### 3. Frontend Next.js
```bash
npm run dev
```
Le frontend doit être accessible sur `http://localhost:3000`

---

## 🧪 TESTS APRÈS MIGRATION

Pour chaque composant migré :

1. ✅ **Chargement initial**
   - Vérifier que les données se chargent
   - Vérifier l'indicateur de chargement

2. ✅ **Recherche**
   - Taper dans la barre de recherche
   - Vérifier que le filtrage fonctionne

3. ✅ **Filtres**
   - Cliquer sur chaque onglet
   - Vérifier que les données sont filtrées

4. ✅ **Suppression**
   - Supprimer un élément
   - Vérifier que la liste se recharge
   - Vérifier le message de succès

5. ✅ **Gestion d'erreur**
   - Arrêter le backend
   - Recharger la page
   - Vérifier le message d'erreur
   - Cliquer sur "Réessayer"
   - Redémarrer le backend
   - Vérifier que les données se chargent

---

## 📈 PROGRESSION

**1/13 composants migrés (8%)**

- ✅ expense-list.tsx
- ⏳ 12 composants restants

---

## 🚀 PROCHAINES ACTIONS RECOMMANDÉES

### Option 1 : Migration manuelle
Migrer chaque composant un par un en suivant le guide ci-dessus.

**Avantages :**
- Contrôle total
- Possibilité d'adapter chaque composant

**Inconvénients :**
- Temps : ~30 min par composant = 6h pour tout migrer

### Option 2 : Migration par lot
Migrer tous les composants de Priorité 1 d'abord, puis tester.

**Avantages :**
- Plus rapide
- Permet de tester un groupe à la fois

**Inconvénients :**
- Risque d'erreurs multiples

### Option 3 : Migration progressive
Migrer 1-2 composants par jour, tester en production.

**Avantages :**
- Sécurisé
- Permet de détecter les problèmes tôt

**Inconvénients :**
- Plus long (1-2 semaines)

---

## 💡 CONSEILS

1. **Toujours tester après chaque migration**
2. **Vérifier la console pour les erreurs**
3. **Vérifier les Network requests dans DevTools**
4. **Garder une copie des fichiers originaux**
5. **Commiter après chaque composant migré**

---

## 🔗 RESSOURCES

### Fichiers importants
- `lib/services/` - Tous les services API
- `lib/utils/api.ts` - Client HTTP
- `types/` - Types TypeScript

### Documentation
- `MIGRATION_API_PLAN.md` - Plan détaillé
- `MIGRATION_API_PROGRESSION.md` - Suivi de progression
- Ce fichier - Guide complet

---

**📄 Document créé le :** 4 décembre 2025  
**✍️ Pour :** Church Management Application  
**🎯 Objectif :** Guide complet pour migrer toutes les données mockées vers API  
**📊 Progression :** 1/13 (8%)  
**🔄 Version :** 1.0
