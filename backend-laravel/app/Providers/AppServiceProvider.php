<?php

namespace App\Providers;

use App\Models\Monitor;
use App\Models\Child;
use App\Observers\MonitorObserver;
use App\Observers\ChildObserver;
use Illuminate\Support\ServiceProvider;

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
        // Enregistrer les observers pour créer automatiquement des Users
        Monitor::observe(MonitorObserver::class);
        Child::observe(ChildObserver::class);
    }
}
