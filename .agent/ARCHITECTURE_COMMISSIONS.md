# Architecture du Système de Commissions

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  AddChildDialog      │      │  EditChildDialog     │    │
│  │  ├─ CommissionCombobox│      │  ├─ CommissionCombobox│    │
│  └──────────────────────┘      └──────────────────────┘    │
│           │                              │                   │
│           └──────────────┬───────────────┘                   │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────────┐                    │
│              │ commissionsService.ts   │                    │
│              │ ├─ getAll()            │                    │
│              │ └─ create()            │                    │
│              └─────────────────────────┘                    │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ HTTP REST API
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          ▼                                   │
│                 BACKEND (Laravel)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              ┌─────────────────────────┐                    │
│              │   routes/api.php        │                    │
│              │   /api/v1/commissions   │                    │
│              └─────────────────────────┘                    │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────────┐                    │
│              │  CommissionController   │                    │
│              │  ├─ index()            │                    │
│              │  ├─ store()            │                    │
│              │  ├─ show()             │                    │
│              │  ├─ update()           │                    │
│              │  └─ destroy()          │                    │
│              └─────────────────────────┘                    │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────────┐                    │
│              │   Commission Model      │                    │
│              │   ├─ HasUuids          │                    │
│              │   └─ $fillable         │                    │
│              └─────────────────────────┘                    │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────────┐                    │
│              │   Database (MySQL)      │                    │
│              │   commissions table     │                    │
│              │   ├─ id (UUID)         │                    │
│              │   ├─ nom (unique)      │                    │
│              │   ├─ description       │                    │
│              │   └─ timestamps        │                    │
│              └─────────────────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Flux de données

### 1. Chargement des commissions

```
User opens form
    ↓
CommissionCombobox mounts
    ↓
useEffect() triggers
    ↓
commissionsService.getAll()
    ↓
GET /api/v1/commissions
    ↓
CommissionController::index()
    ↓
Commission::orderBy('nom')->get()
    ↓
JSON response with commissions array
    ↓
Update component state
    ↓
Display commissions in dropdown
```

### 2. Création d'une nouvelle commission

```
User types new commission name
    ↓
User clicks "Créer [nom]"
    ↓
handleCreateCommission()
    ↓
commissionsService.create({ nom, description })
    ↓
POST /api/v1/commissions
    ↓
CommissionController::store()
    ↓
Validate request (unique nom)
    ↓
Commission::create()
    ↓
Save to database
    ↓
Return created commission (JSON)
    ↓
Update local state with new commission
    ↓
Auto-select the new commission
    ↓
Show success toast
```

### 3. Sauvegarde d'un enfant avec commission

```
User fills form and selects commission
    ↓
User clicks "Ajouter" or "Enregistrer"
    ↓
handleSubmit()
    ↓
Prepare payload with commission_actuelle or commission_souhaitee
    ↓
childrenService.create() or update()
    ↓
POST /api/v1/children or PUT /api/v1/children/{id}
    ↓
ChildController::store() or update()
    ↓
Save child with commission name (string)
    ↓
Return saved child
    ↓
Show success message
```

---

## Structure des fichiers

### Backend

```
backend-laravel/
├── app/
│   ├── Models/
│   │   └── Commission.php              # Modèle Eloquent
│   └── Http/
│       └── Controllers/
│           └── API/
│               └── CommissionController.php  # API Controller
├── database/
│   ├── migrations/
│   │   └── 2025_12_06_184529_create_commissions_table.php
│   └── seeders/
│       └── CommissionSeeder.php        # Données par défaut
└── routes/
    └── api.php                         # Routes API
```

### Frontend

```
church-management-app VF/
├── components/
│   └── children/
│       ├── commission-combobox.tsx     # Composant réutilisable
│       ├── add-child-dialog.tsx        # Formulaire ajout (modifié)
│       └── edit-child-dialog.tsx       # Formulaire édition (modifié)
└── lib/
    └── services/
        └── commissions.service.ts      # Service API
```

---

## Modèle de données

### Table `commissions`

```sql
CREATE TABLE commissions (
    id CHAR(36) PRIMARY KEY,           -- UUID
    nom VARCHAR(255) UNIQUE NOT NULL,  -- Nom de la commission
    description TEXT NULL,             -- Description optionnelle
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Table `children` (champs liés)

```sql
-- Champs existants dans la table children
commission_actuelle VARCHAR(255) NULL,    -- Pour les ouvriers
commission_souhaitee VARCHAR(255) NULL,   -- Pour les non-ouvriers
```

**Note:** Les commissions sont stockées comme **strings** dans la table `children`, pas comme foreign keys. Cela permet une flexibilité maximale et évite les problèmes de suppression en cascade.

---

## API Endpoints

### GET /api/v1/commissions

**Description:** Récupère toutes les commissions triées par nom

**Response:**
```json
[
  {
    "id": "9d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
    "nom": "Accueil",
    "description": "Commission d'accueil et hospitalité",
    "created_at": "2025-12-07T18:45:00.000000Z",
    "updated_at": "2025-12-07T18:45:00.000000Z"
  },
  {
    "id": "8c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
    "nom": "Louange",
    "description": "Commission de louange et adoration",
    "created_at": "2025-12-07T18:45:00.000000Z",
    "updated_at": "2025-12-07T18:45:00.000000Z"
  }
]
```

### POST /api/v1/commissions

**Description:** Crée une nouvelle commission

**Request Body:**
```json
{
  "nom": "Média et Communication",
  "description": "Commission de gestion des médias" // optionnel
}
```

**Response (201 Created):**
```json
{
  "id": "7b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
  "nom": "Média et Communication",
  "description": "Commission de gestion des médias",
  "created_at": "2025-12-07T19:30:00.000000Z",
  "updated_at": "2025-12-07T19:30:00.000000Z"
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "message": "The nom has already been taken.",
  "errors": {
    "nom": ["The nom has already been taken."]
  }
}
```

---

## Composant CommissionCombobox

### Props

```typescript
interface CommissionComboboxProps {
  value?: string;              // Valeur actuelle (nom de la commission)
  onValueChange: (value: string) => void;  // Callback lors du changement
  placeholder?: string;        // Texte du placeholder
}
```

### État interne

```typescript
const [open, setOpen] = useState(false);              // Popover ouvert/fermé
const [commissions, setCommissions] = useState<Commission[]>([]);  // Liste
const [isLoading, setIsLoading] = useState(true);     // État de chargement
const [searchValue, setSearchValue] = useState("");   // Valeur de recherche
```

### Méthodes principales

- `loadCommissions()` - Charge les commissions depuis l'API
- `handleCreateCommission()` - Crée une nouvelle commission
- Recherche en temps réel via `CommandInput`
- Affichage conditionnel du bouton "Créer"

---

## Sécurité et Validation

### Backend

1. **Validation unique:**
   ```php
   'nom' => 'required|string|unique:commissions,nom|max:255'
   ```

2. **Mass assignment protection:**
   ```php
   protected $fillable = ['nom', 'description'];
   ```

3. **UUID auto-généré:**
   ```php
   use HasUuids;
   ```

### Frontend

1. **Trim des espaces:**
   ```typescript
   searchValue.trim()
   ```

2. **Gestion des erreurs:**
   ```typescript
   try { ... } catch (error) { toast.error(...) }
   ```

3. **Validation avant création:**
   ```typescript
   if (!searchValue.trim()) return;
   ```

---

## Performance

### Optimisations

1. **Chargement unique:** Les commissions sont chargées une seule fois au montage du composant
2. **Recherche côté client:** Pas de requête API à chaque frappe (utilise Command de shadcn/ui)
3. **Index sur `nom`:** La colonne `nom` est indexée (unique) pour des recherches rapides
4. **Tri en base:** `orderBy('nom')` utilise l'index MySQL

### Scalabilité

- ✅ Jusqu'à **1000 commissions** : Performance excellente
- ⚠️ Au-delà de **1000** : Envisager la pagination ou la recherche serveur
- 💡 Solution future : Ajouter un endpoint de recherche avec pagination

---

## Extensions futures possibles

1. **Gestion avancée:**
   - Page d'administration des commissions
   - Modification/suppression de commissions
   - Statistiques par commission

2. **Fonctionnalités:**
   - Description enrichie (markdown)
   - Responsable de commission
   - Couleur/icône par commission
   - Hiérarchie de commissions (sous-commissions)

3. **Intégration:**
   - Utiliser les commissions pour d'autres entités (moniteurs, etc.)
   - Rapports par commission
   - Planning des commissions

---

## Maintenance

### Ajouter une commission par défaut

Éditer `database/seeders/CommissionSeeder.php` :

```php
$commissions = [
    // ... commissions existantes
    ['nom' => 'Nouvelle Commission', 'description' => 'Description'],
];
```

Puis exécuter :
```bash
php artisan db:seed --class=CommissionSeeder
```

### Supprimer toutes les commissions

```bash
php artisan tinker
>>> App\Models\Commission::truncate();
```

### Réinitialiser avec les commissions par défaut

```bash
php artisan db:seed --class=CommissionSeeder
```

---

## Dépannage

### Problème: Les commissions ne s'affichent pas

**Solution:**
1. Vérifier que le backend est lancé (`php artisan serve`)
2. Vérifier la console du navigateur pour les erreurs API
3. Tester l'endpoint directement : `http://localhost:8000/api/v1/commissions`

### Problème: Impossible de créer une commission

**Solution:**
1. Vérifier que le nom n'existe pas déjà
2. Vérifier les logs Laravel : `storage/logs/laravel.log`
3. Vérifier la validation côté backend

### Problème: Commission créée mais ne s'affiche pas

**Solution:**
1. Vérifier que `loadCommissions()` est appelé après création
2. Vérifier l'état du composant dans React DevTools
3. Rafraîchir la page

---

**Documentation créée le:** 2025-12-07  
**Version:** 1.0  
**Auteur:** Antigravity AI
