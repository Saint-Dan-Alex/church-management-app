# 🔌 Connexion Backend ↔️ Frontend

## ✅ Configuration terminée

### Fichiers créés/modifiés :

**Backend (Laravel)**
- ✅ `backend-laravel/config/cors.php` - Configuration CORS
- ✅ `backend-laravel/bootstrap/app.php` - Routes API activées
- ✅ Routes API disponibles dans `backend-laravel/routes/api.php`

**Frontend (Next.js)**
- ✅ `lib/utils/api.ts` - Client HTTP pour l'API
- ✅ `lib/types/api.ts` - Types TypeScript
- ✅ `components/test/ApiTestComponent.tsx` - Composant de test
- ✅ `app/api-test/page.tsx` - Page de test

## 🚀 Démarrage

### 1. Backend Laravel (déjà démarré ✅)
```bash
cd backend-laravel
php artisan serve --host=127.0.0.1 --port=8000
```
✅ Votre backend tourne sur : http://127.0.0.1:8000

### 2. Créer `.env.local` (Frontend)

**IMPORTANT** : Créez manuellement le fichier `.env.local` à la racine du projet :

```bash
# À la racine du projet (pas dans backend-laravel)
# Créez le fichier .env.local avec ce contenu :

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 3. Démarrer le Frontend

```bash
# À la racine du projet
npm run dev
# ou
yarn dev
```

Le frontend sera accessible sur : http://localhost:3000

## 🧪 Tester la connexion

### Option 1 : Page de test visuelle
Ouvrez votre navigateur et allez sur :
```
http://localhost:3000/api-test
```

Cette page affichera :
- ✅ Status de connexion à l'API
- ✅ Liste des moniteurs
- ✅ Statistiques des enfants

### Option 2 : Test manuel avec curl

```bash
# Health check
curl http://127.0.0.1:8000/api/health

# Liste des moniteurs
curl http://127.0.0.1:8000/api/v1/monitors

# Statistiques des enfants
curl http://127.0.0.1:8000/api/v1/children-statistics

# Liste des salles
curl http://127.0.0.1:8000/api/v1/salles

# Liste des activités
curl http://127.0.0.1:8000/api/v1/activities
```

## 📚 Utilisation dans vos composants

### Exemple : Récupérer des données (Server Component)

```tsx
// app/monitors/page.tsx
import { api } from '@/lib/utils/api';
import { Monitor } from '@/lib/types/api';

export default async function MonitorsPage() {
  const monitors = await api.get<Monitor[]>('/monitors');
  
  return (
    <div>
      <h1>Moniteurs ({monitors.length})</h1>
      <ul>
        {monitors.map(m => (
          <li key={m.id}>{m.nom_complet} - {m.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Exemple : Récupérer des données (Client Component)

```tsx
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/utils/api';
import { Child } from '@/lib/types/api';

export function ChildrenList() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Child[]>('/children')
      .then(setChildren)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Enfants ({children.length})</h2>
      {children.map(child => (
        <div key={child.id}>
          {child.nom_complet} - {child.salle_nom || 'Non affecté'}
        </div>
      ))}
    </div>
  );
}
```

### Exemple : Créer/Modifier des données

```tsx
'use client';
import { api } from '@/lib/utils/api';

async function createMonitor(data: any) {
  try {
    const newMonitor = await api.post('/monitors', data);
    console.log('Moniteur créé:', newMonitor);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

async function updateMonitor(id: string, data: any) {
  try {
    const updated = await api.put(`/monitors/${id}`, data);
    console.log('Moniteur mis à jour:', updated);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

async function deleteMonitor(id: string) {
  try {
    await api.delete(`/monitors/${id}`);
    console.log('Moniteur supprimé');
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

## 🔗 Endpoints disponibles

Tous les endpoints sont préfixés par `/api/v1/` :

### Moniteurs
- `GET /monitors` - Liste
- `POST /monitors` - Créer
- `GET /monitors/{id}` - Détails
- `PUT /monitors/{id}` - Modifier
- `DELETE /monitors/{id}` - Supprimer
- `GET /monitors-statistics` - Statistiques

### Enfants
- `GET /children` - Liste
- `POST /children` - Créer
- `GET /children/{id}` - Détails
- `PUT /children/{id}` - Modifier
- `DELETE /children/{id}` - Supprimer
- `GET /children-statistics` - Statistiques

### Salles
- `GET /salles` - Liste
- `POST /salles` - Créer
- `GET /salles/{id}` - Détails
- `PUT /salles/{id}` - Modifier
- `DELETE /salles/{id}` - Supprimer

### Activités
- `GET /activities` - Liste
- `POST /activities` - Créer
- `GET /activities/{id}` - Détails
- `PUT /activities/{id}` - Modifier
- `DELETE /activities/{id}` - Supprimer
- `GET /activities/{id}/statistics` - Statistiques

### Autres modules
- Blogs : `/blogs`
- Vidéos : `/videos`
- Photos : `/photos`
- Dépenses : `/expenses`
- Paiements : `/payments`
- Présences : `/presences`
- Cotisations : `/cotisations`
- Sorties : `/sorties`
- Enseignements : `/teachings`
- Rapports de culte : `/worship-reports`

## ⚠️ Troubleshooting

### Erreur CORS
Si vous voyez des erreurs CORS dans la console :
1. Vérifiez que `backend-laravel/config/cors.php` contient `http://localhost:3000`
2. Redémarrez le serveur Laravel

### Erreur 404 sur les routes API
1. Vérifiez que `backend-laravel/bootstrap/app.php` contient la ligne `api: __DIR__.'/../routes/api.php'`
2. Redémarrez le serveur Laravel

### Variables d'environnement non reconnues
1. Assurez-vous que `.env.local` est à la racine (pas dans `backend-laravel`)
2. Redémarrez le serveur Next.js après avoir créé/modifié `.env.local`

## 📊 Données de test

Le backend contient déjà des données de test grâce au seeding :
- ✅ 100 moniteurs répartis dans 5 salles
- ✅ 2000 enfants affectés par âge (Jardin, Ainés, Juniors, Cadets, Adolescents, ADO PARTI)
- ✅ 21 activités planifiées
- ✅ Blogs, vidéos, photos, etc.

## 🎉 C'est prêt !

Votre application est maintenant connectée. Vous pouvez :
1. Tester sur http://localhost:3000/api-test
2. Commencer à intégrer les composants dans votre dashboard
3. Utiliser le client `api` dans tous vos composants

Bon développement ! 🚀
