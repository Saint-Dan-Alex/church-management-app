# 🔄 Migration des Données Mockées vers API
## Church Management Application

---

## 📊 ÉTAT DES LIEUX

### Composants utilisant des données mockées (18 fichiers)

1. ✅ `components/expenses/expense-list.tsx` - À migrer
2. ✅ `components/payments/payment-list.tsx` - À migrer
3. ✅ `components/presences/presence-list.tsx` - À migrer
4. ✅ `components/cotisations/cotisation-list.tsx` - À migrer
5. ✅ `components/teachings/teaching-list.tsx` - À migrer
6. ✅ `components/worship/worship-report-list.tsx` - À migrer
7. ✅ `components/caisse/sorties-list.tsx` - À migrer
8. ✅ `components/caisse/rapport-cotisations.tsx` - À migrer
9. ✅ `components/caisse/bilan-financier.tsx` - À migrer
10. ✅ `components/activities/unified-participants-view.tsx` - À migrer
11. ✅ `components/activities/presence-manager.tsx` - À migrer
12. ✅ `components/activities/payment-manager.tsx` - À migrer
13. ✅ `components/activities/expense-manager.tsx` - À migrer

---

## 🎯 PLAN D'ACTION

### Phase 1 : Nouveaux modules (4 composants)
1. **Dépenses** - `expense-list.tsx`
2. **Paiements** - `payment-list.tsx`
3. **Présences** - `presence-list.tsx`
4. **Cotisations** - `cotisation-list.tsx`

### Phase 2 : Modules existants (9 composants)
5. **Enseignements** - `teaching-list.tsx`
6. **Rapports de Culte** - `worship-report-list.tsx`
7. **Caisse - Sorties** - `sorties-list.tsx`
8. **Caisse - Cotisations** - `rapport-cotisations.tsx`
9. **Caisse - Bilan** - `bilan-financier.tsx`
10. **Activités - Participants** - `unified-participants-view.tsx`
11. **Activités - Présences** - `presence-manager.tsx`
12. **Activités - Paiements** - `payment-manager.tsx`
13. **Activités - Dépenses** - `expense-manager.tsx`

---

## 🛠️ MODIFICATIONS À EFFECTUER

### Pour chaque composant :

1. **Importer le service API**
   ```typescript
   import { expensesService } from '@/lib/services'
   ```

2. **Ajouter les états de chargement et d'erreur**
   ```typescript
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   ```

3. **Remplacer les données mockées par useEffect**
   ```typescript
   useEffect(() => {
     loadData()
   }, [])
   
   const loadData = async () => {
     try {
       setLoading(true)
       const data = await expensesService.getAll()
       setExpenses(data)
     } catch (err) {
       setError('Erreur de chargement')
     } finally {
       setLoading(false)
     }
   }
   ```

4. **Mettre à jour les actions CRUD**
   - Create : Appeler `service.create()` puis recharger
   - Update : Appeler `service.update()` puis recharger
   - Delete : Appeler `service.delete()` puis recharger

5. **Ajouter les états de chargement dans l'UI**
   ```typescript
   if (loading) return <div>Chargement...</div>
   if (error) return <div>Erreur: {error}</div>
   ```

---

## 📝 SERVICES API DISPONIBLES

### Services existants :
- ✅ `expensesService` - Dépenses
- ✅ `paymentsService` - Paiements
- ✅ `presencesService` - Présences
- ✅ `cotisationsService` - Cotisations
- ✅ `teachingsService` - Enseignements
- ✅ `worshipReportsService` - Rapports de culte
- ✅ `sortiesService` - Sorties/Caisse
- ✅ `activitiesService` - Activités
- ✅ `monitorsService` - Moniteurs
- ✅ `childrenService` - Enfants
- ✅ `sallesService` - Salles
- ✅ `blogsService` - Blog
- ✅ `videosService` - Vidéos
- ✅ `photosService` - Photos

---

## 🔄 ORDRE DE MIGRATION

### Priorité 1 : Nouveaux modules (Critiques)
1. ✅ Dépenses
2. ✅ Paiements
3. ✅ Présences
4. ✅ Cotisations

### Priorité 2 : Modules principaux
5. ✅ Enseignements
6. ✅ Rapports de Culte

### Priorité 3 : Modules Caisse
7. ✅ Sorties
8. ✅ Rapport Cotisations
9. ✅ Bilan Financier

### Priorité 4 : Sous-modules Activités
10. ✅ Participants
11. ✅ Présences (activités)
12. ✅ Paiements (activités)
13. ✅ Dépenses (activités)

---

## ⚙️ PATTERN DE MIGRATION

### Avant (Données mockées)
```typescript
const mockExpenses: Expense[] = [...]
const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
```

### Après (API)
```typescript
const [expenses, setExpenses] = useState<Expense[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  loadExpenses()
}, [])

const loadExpenses = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await expensesService.getAll()
    setExpenses(data)
  } catch (err: any) {
    setError(err.message || 'Erreur de chargement')
    toast({
      title: "Erreur",
      description: "Impossible de charger les données",
      variant: "destructive"
    })
  } finally {
    setLoading(false)
  }
}
```

---

## 🎯 CHECKLIST PAR COMPOSANT

### Pour chaque migration :
- [ ] Supprimer les données mockées
- [ ] Importer le service API
- [ ] Ajouter les états (loading, error)
- [ ] Créer la fonction loadData()
- [ ] Ajouter useEffect pour charger au montage
- [ ] Mettre à jour handleCreate pour appeler l'API
- [ ] Mettre à jour handleUpdate pour appeler l'API
- [ ] Mettre à jour handleDelete pour appeler l'API
- [ ] Ajouter les indicateurs de chargement dans l'UI
- [ ] Ajouter la gestion d'erreur dans l'UI
- [ ] Tester toutes les fonctionnalités

---

## 📊 PROGRESSION

| Composant | Statut | Priorité |
|-----------|--------|----------|
| expense-list.tsx | 🔄 En cours | P1 |
| payment-list.tsx | ⏳ À faire | P1 |
| presence-list.tsx | ⏳ À faire | P1 |
| cotisation-list.tsx | ⏳ À faire | P1 |
| teaching-list.tsx | ⏳ À faire | P2 |
| worship-report-list.tsx | ⏳ À faire | P2 |
| sorties-list.tsx | ⏳ À faire | P3 |
| rapport-cotisations.tsx | ⏳ À faire | P3 |
| bilan-financier.tsx | ⏳ À faire | P3 |
| unified-participants-view.tsx | ⏳ À faire | P4 |
| presence-manager.tsx | ⏳ À faire | P4 |
| payment-manager.tsx | ⏳ À faire | P4 |
| expense-manager.tsx | ⏳ À faire | P4 |

**Total : 0/13 complétés**

---

**📄 Document créé le :** 4 décembre 2025  
**✍️ Pour :** Church Management Application  
**🎯 Objectif :** Migrer toutes les données mockées vers API  
**🔄 Version :** 1.0
