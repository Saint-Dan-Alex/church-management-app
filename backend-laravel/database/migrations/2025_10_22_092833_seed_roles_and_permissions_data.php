<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Nettoyer le cache de permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = 'web';

        // Liste des permissions
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Enfants
            'enfants.create', 'enfants.read', 'enfants.update', 'enfants.delete',

            // Moniteurs
            'moniteurs.create', 'moniteurs.read', 'moniteurs.update', 'moniteurs.delete',

            // Activités
            'activites.create', 'activites.read', 'activites.update', 'activites.delete',

            // Présences
            'presences.create', 'presences.read', 'presences.update', 'presences.delete',

            // Salles
            'salles.create', 'salles.read', 'salles.update', 'salles.delete',

            // Paiements
            'paiements.create', 'paiements.read', 'paiements.update', 'paiements.delete',

            // Dépenses
            'depenses.create', 'depenses.read', 'depenses.update', 'depenses.delete',

            // Caisse (Cotisations)
            'caisse.create', 'caisse.read', 'caisse.update', 'caisse.delete',

            // Blog
            'blog.create', 'blog.read', 'blog.update', 'blog.delete',

            // Photos
            'photos.create', 'photos.read', 'photos.update', 'photos.delete',

            // Vidéos
            'videos.create', 'videos.read', 'videos.update', 'videos.delete',

            // Utilisateurs
            'users.create', 'users.read', 'users.update', 'users.delete',

            // Rôles et permissions
            'roles.manage',
            'permissions.manage',

            // Statistiques
            'stats.view',
            'reports.view',
        ];

        // Créer les permissions
        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => $guard]);
        }

        // Définition des Rôles et de leurs permissions
        $rolePermissions = [
            'ADMIN' => $permissions,

            'COORDINATION' => [
                'dashboard.view',
                'enfants.create', 'enfants.read', 'enfants.update', 'enfants.delete',
                'moniteurs.create', 'moniteurs.read', 'moniteurs.update', 'moniteurs.delete',
                'activites.create', 'activites.read', 'activites.update', 'activites.delete',
                'presences.create', 'presences.read', 'presences.update', 'presences.delete',
                'salles.create', 'salles.read', 'salles.update', 'salles.delete',
                'paiements.create', 'paiements.read', 'paiements.update',
                'depenses.create', 'depenses.read', 'depenses.update',
                'caisse.create', 'caisse.read', 'caisse.update', 'caisse.delete',
                'blog.create', 'blog.read', 'blog.update',
                'photos.create', 'photos.read', 'photos.update',
                'videos.create', 'videos.read', 'videos.update',
                'stats.view', 'reports.view',
            ],

            'CHEF_SALLE' => [
                'dashboard.view',
                'enfants.read', 'enfants.update',
                'moniteurs.read',
                'activites.read', 'activites.update',
                'presences.create', 'presences.read', 'presences.update',
                'salles.read', 'salles.update',
                'paiements.read',
                'depenses.create', 'depenses.read',
                'blog.read',
                'photos.create', 'photos.read',
                'videos.read',
            ],

            'MONITEUR' => [
                'dashboard.view',
                'enfants.read',
                'moniteurs.read',
                'activites.read',
                'presences.create', 'presences.read', 'presences.update',
                'salles.read',
                'blog.read',
                'photos.read',
                'videos.read',
            ],

            'FINANCIER' => [
                'dashboard.view',
                'enfants.read',
                'moniteurs.read',
                'activites.read',
                'presences.create', 'presences.read', 'presences.update',
                'salles.read',
                'paiements.create', 'paiements.read', 'paiements.update', 'paiements.delete',
                'depenses.create', 'depenses.read', 'depenses.update',
                'blog.read',
                'photos.read',
                'videos.read',
            ],

            'PARENT' => [
                'dashboard.view',
                'enfants.read',
                'activites.read',
                'presences.read',
                'paiements.read',
                'blog.read',
                'photos.read',
                'videos.read',
            ],

            'ENFANT' => [
                'dashboard.view',
                'activites.read',
                'blog.read',
                'photos.read',
                'videos.read',
            ]
        ];

        // Création des rôles et assignation des permissions
        foreach ($rolePermissions as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => $guard]);
            
            // On s'assure que toutes les permissions listées existent
            $validPerms = Permission::whereIn('name', $perms)->get();
            $role->syncPermissions($validPerms);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // On ne souhaite pas forcément supprimer les rôles et permissions lors d'un rollback standard
        // Mais pour être propre :
        $roles = [
            'ADMIN', 'COORDINATION', 'CHEF_SALLE', 
            'MONITEUR', 'FINANCIER', 'PARENT', 'ENFANT'
        ];
        Role::whereIn('name', $roles)->delete();
        // Les permissions seraient trop nombreuses à lister ici, on peut faire un delete global ou laisser
    }
};
