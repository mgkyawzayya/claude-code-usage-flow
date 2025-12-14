<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All repository bindings.
     */
    public array $repositories = [
        \App\Contracts\Repositories\ContactRepositoryInterface::class => \App\Repositories\ContactRepository::class,
        \App\Contracts\Repositories\CompanyRepositoryInterface::class => \App\Repositories\CompanyRepository::class,
        \App\Contracts\Repositories\DealRepositoryInterface::class => \App\Repositories\DealRepository::class,
        \App\Contracts\Repositories\ActivityRepositoryInterface::class => \App\Repositories\ActivityRepository::class,
    ];

    /**
     * All service bindings.
     */
    public array $services = [
        \App\Contracts\Services\ContactServiceInterface::class => \App\Services\ContactService::class,
        \App\Contracts\Services\CompanyServiceInterface::class => \App\Services\CompanyService::class,
        \App\Contracts\Services\DealServiceInterface::class => \App\Services\DealService::class,
        \App\Contracts\Services\ActivityServiceInterface::class => \App\Services\ActivityService::class,
    ];

    public function register(): void
    {
        foreach ($this->repositories as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }

        foreach ($this->services as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }

    public function boot(): void
    {
        //
    }
}
