# 📦 TOUS LES MODELS - Code complet à copier

## Room.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom',
        'code',
        'capacite',
        'localisation',
        'description',
        'equipements',
        'statut',
        'responsable_id',
        'photo',
    ];

    protected $casts = [
        'capacite' => 'integer',
    ];

    public function responsable()
    {
        return $this->belongsTo(Monitor::class, 'responsable_id');
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }

    public function worshipSessions()
    {
        return $this->hasMany(WorshipSession::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('statut', 'disponible');
    }
}
```

## WorshipSession.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorshipSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titre',
        'date',
        'heure_debut',
        'heure_fin',
        'room_id',
        'predicateur_id',
        'theme',
        'verset_cle',
        'notes',
        'nombre_presents',
        'nombre_absents',
        'statut',
    ];

    protected $casts = [
        'date' => 'date',
        'nombre_presents' => 'integer',
        'nombre_absents' => 'integer',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function predicateur()
    {
        return $this->belongsTo(Monitor::class, 'predicateur_id');
    }

    public function attendances()
    {
        return $this->hasMany(WorshipAttendance::class);
    }

    public function scopePlanifie($query)
    {
        return $query->where('statut', 'planifie');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('date', today());
    }
}
```

## WorshipAttendance.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorshipAttendance extends Model
{
    protected $fillable = [
        'worship_session_id',
        'child_id',
        'present',
        'remarque',
    ];

    protected $casts = [
        'present' => 'boolean',
    ];

    public function worshipSession()
    {
        return $this->belongsTo(WorshipSession::class);
    }

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
```

## Activity.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'date_debut',
        'date_fin',
        'heure_debut',
        'heure_fin',
        'room_id',
        'lieu_externe',
        'responsable_id',
        'nombre_places',
        'cout',
        'statut',
        'materiel_necessaire',
        'image',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'nombre_places' => 'integer',
        'cout' => 'decimal:2',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function responsable()
    {
        return $this->belongsTo(Monitor::class, 'responsable_id');
    }

    public function participants()
    {
        return $this->hasMany(ActivityParticipant::class);
    }

    public function scopePlanifie($query)
    {
        return $query->where('statut', 'planifie');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date_debut', '>=', today());
    }
}
```

## ActivityParticipant.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityParticipant extends Model
{
    protected $fillable = [
        'activity_id',
        'child_id',
        'confirmed',
        'attended',
        'remarque',
    ];

    protected $casts = [
        'confirmed' => 'boolean',
        'attended' => 'boolean',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
```

## Teaching.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teaching extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'contenu',
        'categorie',
        'niveau',
        'auteur_id',
        'verset_reference',
        'objectifs',
        'materiel',
        'duree_minutes',
        'fichier_pdf',
        'image_couverture',
        'is_published',
        'vues',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'vues' => 'integer',
        'duree_minutes' => 'integer',
    ];

    public function auteur()
    {
        return $this->belongsTo(Monitor::class, 'auteur_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCategorie($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeByNiveau($query, $niveau)
    {
        return $query->where('niveau', $niveau);
    }
}
```

## BlogPost.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titre',
        'slug',
        'extrait',
        'contenu',
        'auteur_id',
        'categorie',
        'image_principale',
        'is_published',
        'published_at',
        'vues',
        'tags',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'vues' => 'integer',
        'tags' => 'array',
    ];

    public function auteur()
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($post) {
            if (!$post->slug) {
                $post->slug = Str::slug($post->titre);
            }
        });
    }
}
```

## Video.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'url_video',
        'thumbnail',
        'type',
        'uploaded_by',
        'duree_secondes',
        'date_enregistrement',
        'vues',
        'is_published',
        'tags',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'vues' => 'integer',
        'duree_secondes' => 'integer',
        'date_enregistrement' => 'date',
        'tags' => 'array',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
```

## PhotoAlbum.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhotoAlbum extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom',
        'description',
        'date_evenement',
        'couverture',
        'created_by',
        'is_public',
    ];

    protected $casts = [
        'date_evenement' => 'date',
        'is_public' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class, 'album_id');
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}
```

## Photo.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'fichier',
        'thumbnail',
        'album_id',
        'uploaded_by',
        'ordre',
        'largeur',
        'hauteur',
        'taille',
        'tags',
    ];

    protected $casts = [
        'ordre' => 'integer',
        'largeur' => 'integer',
        'hauteur' => 'integer',
        'tags' => 'array',
    ];

    public function album()
    {
        return $this->belongsTo(PhotoAlbum::class, 'album_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('ordre');
    }
}
```

---

## Instructions

Copier chaque Model dans le dossier `app/Models/` de votre projet Laravel.

Tous les Models utilisent :
- ✅ `HasFactory` pour les factories
- ✅ `SoftDeletes` pour la suppression douce
- ✅ Relations Eloquent définies
- ✅ Scopes pour les requêtes courantes
- ✅ Casts pour les types de données
- ✅ Accessors pour les attributs calculés
