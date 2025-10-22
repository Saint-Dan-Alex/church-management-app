# 🔌 Guide d'intégration des API dans les composants

## ✅ Services API créés

Tous les services sont disponibles dans `lib/services/` :

- ✅ `monitors.service.ts` - Gestion des moniteurs
- ✅ `children.service.ts` - Gestion des enfants
- ✅ `salles.service.ts` - Gestion des salles
- ✅ `activities.service.ts` - Gestion des activités
- ✅ `blogs.service.ts` - Gestion des blogs
- ✅ `videos.service.ts` - Gestion des vidéos
- ✅ `photos.service.ts` - Gestion des photos
- ✅ `teachings.service.ts` - Gestion des enseignements
- ✅ `worship-reports.service.ts` - Rapports de culte
- ✅ `expenses.service.ts` - Gestion des dépenses
- ✅ `payments.service.ts` - Gestion des paiements
- ✅ `presences.service.ts` - Gestion des présences
- ✅ `cotisations.service.ts` - Gestion des cotisations
- ✅ `sorties.service.ts` - Gestion des sorties

## 📝 Remplacement des données mockées

### Étapes pour chaque composant :

1. **Importer le service approprié**
2. **Remplacer les données mockées par un appel API**
3. **Gérer le loading et les erreurs**
4. **Adapter les types si nécessaire**

## 🔄 Exemples de migration

### Avant (avec mock) :
```tsx
const mockMonitors = [
  { id: "1", nom: "KABAMBA", prenom: "Jean", ... },
  ...
];

export function MonitorsList() {
  return (
    <div>
      {mockMonitors.map(monitor => (
        <div key={monitor.id}>{monitor.nom}</div>
      ))}
    </div>
  );
}
```

### Après (avec API) - Server Component :
```tsx
import { monitorsService } from '@/lib/services';

export default async function MonitorsPage() {
  const monitors = await monitorsService.getAll();
  
  return (
    <div>
      {monitors.map(monitor => (
        <div key={monitor.id}>{monitor.nom}</div>
      ))}
    </div>
  );
}
```

### Après (avec API) - Client Component :
```tsx
'use client';
import { useEffect, useState } from 'react';
import { monitorsService } from '@/lib/services';
import type { Monitor } from '@/lib/types/api';

export function MonitorsList() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    monitorsService.getAll()
      .then(setMonitors)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {monitors.map(monitor => (
        <div key={monitor.id}>{monitor.nom}</div>
      ))}
    </div>
  );
}
```

## 📋 Liste des composants à migrer

### Moniteurs
- ✅ Service créé
- ⏳ `components/monitors/monitors-list.tsx`
- ⏳ `components/monitors/add-monitor-dialog.tsx`
- ⏳ `components/monitors/edit-monitor-dialog.tsx`

### Enfants
- ✅ Service créé
- ⏳ `components/children/children-list.tsx`
- ⏳ `components/children/add-child-dialog.tsx`
- ⏳ `components/children/edit-child-dialog.tsx`

### Salles
- ✅ Service créé
- ⏳ `components/salles/salle-list.tsx`
- ⏳ `components/salles/add-salle-dialog.tsx`
- ⏳ `components/salles/edit-salle-dialog.tsx`

### Activités
- ✅ Service créé
- ⏳ `components/activities/activities-list.tsx`
- ⏳ `components/activities/add-activity-dialog.tsx`
- ⏳ `components/activities/edit-activity-dialog.tsx`

### Blogs
- ✅ Service créé
- ⏳ `components/blog/blog-list.tsx`
- ⏳ `components/blog/add-blog-dialog.tsx`
- ⏳ `components/blog/edit-blog-dialog.tsx`

### Vidéos
- ✅ Service créé
- ⏳ `components/videos/video-gallery.tsx`
- ⏳ `components/videos/add-video-dialog.tsx`

### Photos
- ✅ Service créé
- ⏳ `components/photos/photo-gallery.tsx`
- ⏳ `components/photos/add-photo-dialog.tsx`

### Enseignements
- ✅ Service créé
- ⏳ `components/teachings/teaching-list.tsx`
- ⏳ `components/teachings/add-teaching-dialog.tsx`
- ⏳ `components/teachings/edit-teaching-dialog.tsx`

### Rapports de culte
- ✅ Service créé
- ⏳ `components/worship/worship-report-list.tsx`
- ⏳ `components/worship/add-worship-report-dialog.tsx`

### Caisse
- ✅ Services créés (expenses, payments, cotisations, sorties)
- ⏳ `components/caisse/depenses-list.tsx`
- ⏳ `components/caisse/paiements-list.tsx`
- ⏳ `components/caisse/cotisations-list.tsx`
- ⏳ `components/caisse/sorties-list.tsx`

### Utilisateurs
- ⏳ `components/users/users-list.tsx` (à connecter avec monitors/children)

## 🎯 Pattern recommandé pour les hooks personnalisés

Créez des hooks réutilisables pour chaque entité :

```tsx
// hooks/use-monitors.ts
'use client';
import { useEffect, useState } from 'react';
import { monitorsService } from '@/lib/services';
import type { Monitor } from '@/lib/types/api';

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const data = await monitorsService.getAll();
      setMonitors(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const createMonitor = async (data: Partial<Monitor>) => {
    const newMonitor = await monitorsService.create(data);
    setMonitors(prev => [...prev, newMonitor]);
    return newMonitor;
  };

  const updateMonitor = async (id: string, data: Partial<Monitor>) => {
    const updated = await monitorsService.update(id, data);
    setMonitors(prev => prev.map(m => m.id === id ? updated : m));
    return updated;
  };

  const deleteMonitor = async (id: string) => {
    await monitorsService.delete(id);
    setMonitors(prev => prev.filter(m => m.id !== id));
  };

  return {
    monitors,
    loading,
    error,
    refetch: fetchMonitors,
    createMonitor,
    updateMonitor,
    deleteMonitor,
  };
}
```

## 🚀 Prochaines étapes

1. ✅ Services API créés
2. ⏳ Créer les hooks personnalisés (optionnel mais recommandé)
3. ⏳ Migrer chaque composant un par un
4. ⏳ Tester chaque module après migration
5. ⏳ Supprimer les données mockées

## 📚 Ressources

- Documentation API : `backend-laravel/API_DOCUMENTATION.md`
- Types TypeScript : `lib/types/api.ts`
- Client HTTP : `lib/utils/api.ts`
- Services : `lib/services/*.service.ts`

## ⚠️ Points d'attention

1. **Gestion des erreurs** : Toujours gérer les cas d'erreur
2. **Loading states** : Afficher un indicateur de chargement
3. **Types** : Utiliser les types TypeScript fournis
4. **Cache** : Pour les Server Components, utiliser `cache: 'no-store'` si données dynamiques
5. **Revalidation** : Après create/update/delete, rafraîchir les données

## 🎉 Avantages de cette architecture

- ✅ Séparation des préoccupations (UI / Logic / Data)
- ✅ Réutilisabilité du code
- ✅ Type-safety avec TypeScript
- ✅ Facilité de maintenance
- ✅ Testabilité améliorée
