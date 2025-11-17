<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyer le cache de permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = 'web';

        // Permissions par module
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Enfants
            'enfants.create',
            'enfants.read',
            'enfants.update',
            'enfants.delete',

            // Moniteurs
            'moniteurs.create',
            'moniteurs.read',
            'moniteurs.update',
            'moniteurs.delete',

            // Activités
            'activites.create',
            'activites.read',
            'activites.update',
            'activites.delete',

            // Présences
            'presences.create',
            'presences.read',
            'presences.update',
            'presences.delete',

            // Salles
            'salles.create',
            'salles.read',
            'salles.update',
            'salles.delete',

            // Paiements
            'paiements.create',
            'paiements.read',
            'paiements.update',
            'paiements.delete',

            // Dépenses
            'depenses.create',
            'depenses.read',
            'depenses.update',
            'depenses.delete',

            // Blog
            'blog.create',
            'blog.read',
            'blog.update',
            'blog.delete',

            // Photos
            'photos.create',
            'photos.read',
            'photos.update',
            'photos.delete',

            // Vidéos
            'videos.create',
            'videos.read',
            'videos.update',
            'videos.delete',

            // Utilisateurs
            'users.create',
            'users.read',
            'users.update',
            'users.delete',

            // Administration
            'admin.roles',
            'admin.permissions',
            'admin.stats',
            'admin.reports',
        ];

        // Créer les permissions si elles n'existent pas
        foreach ($permissions as $name) {
            Permission::firstOrCreate([
                'name' => $name,
                'guard_name' => $guard,
            ]);
        }

        // Création des rôles
        $roles = [
            'admin',          // Admin
            'coordination',   // Coordination
            'chef_salle',     // Chef de Salle
            'moniteur',       // Moniteur
            'parent',         // Parent
            'enfant',         // Enfant
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => $guard,
            ]);
        }

        // Récupérer les rôles
        $admin       = Role::where('name', 'admin')->first();
        $coord       = Role::where('name', 'coordination')->first();
        $chefSalle   = Role::where('name', 'chef_salle')->first();
        $moniteur    = Role::where('name', 'moniteur')->first();
        $parent      = Role::where('name', 'parent')->first();
        $enfant      = Role::where('name', 'enfant')->first();

        // Helper pour récupérer rapidement des permissions
        $get = fn(array $names) => Permission::whereIn('name', $names)->get();

        // Admin : toutes les permissions
        if ($admin) {
            $admin->syncPermissions(Permission::all());
        }

        // Coordination : toutes sauf quelques permissions "admin" pures si besoin
        if ($coord) {
            $coordPermissions = Permission::whereNotIn('name', [
                'admin.reports',
            ])->get();
            $coord->syncPermissions($coordPermissions);
        }

        // Chef de Salle : gestion de sa salle et de ses équipes (selon matrice du module Users)
        if ($chefSalle) {
            $chefSalle->syncPermissions($get([
                'dashboard.view',
                // Enfants (lecture + update)
                'enfants.read',
                'enfants.update',
                // Moniteurs (lecture)
                'moniteurs.read',
                // Activités (read + update)
                'activites.read',
                'activites.update',
                // Présences (create + read + update)
                'presences.create',
                'presences.read',
                'presences.update',
                // Salles (read + update)
                'salles.read',
                'salles.update',
            ]));
        }

        // Moniteur : gestion de ses activités et présences (droits plus limités)
        if ($moniteur) {
            $moniteur->syncPermissions($get([
                'dashboard.view',
                'activites.read',
                'presences.create',
                'presences.read',
                'presences.update',
                'blog.read',
                'photos.read',
                'videos.read',
            ]));
        }

        // Parent : vue sur ses enfants et finances
        if ($parent) {
            $parent->syncPermissions($get([
                'dashboard.view',
                'enfants.read',
                'activites.read',
                'presences.read',
                'paiements.read',
                'blog.read',
                'photos.read',
                'videos.read',
            ]));
        }

        // Enfant : vue limitée
        if ($enfant) {
            $enfant->syncPermissions($get([
                'dashboard.view',
                'activites.read',
                'blog.read',
                'photos.read',
                'videos.read',
            ]));
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
