<?php

namespace App\Providers;

use App\Models\Monitor;
use App\Models\Child;
use App\Observers\MonitorObserver;
use App\Observers\ChildObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix pour MySQL : longueur par défaut des index string
        Schema::defaultStringLength(191);
        
        // Enregistrer les observers pour créer automatiquement des Users
        Monitor::observe(MonitorObserver::class);
        Child::observe(ChildObserver::class);
    }
}
