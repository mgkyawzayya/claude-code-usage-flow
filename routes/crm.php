<?php

use App\Http\Controllers\CRM\ActivityController;
use App\Http\Controllers\CRM\CompanyController;
use App\Http\Controllers\CRM\ContactController;
use App\Http\Controllers\CRM\DashboardController;
use App\Http\Controllers\CRM\DealController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('crm')->name('crm.')->group(function () {
    // Dashboard
    Route::get('/', DashboardController::class)->name('dashboard');

    // Contacts
    Route::resource('contacts', ContactController::class);

    // Companies
    Route::resource('companies', CompanyController::class);

    // Deals
    Route::get('deals/pipeline', [DealController::class, 'pipeline'])->name('deals.pipeline');
    Route::post('deals/{deal}/move-stage', [DealController::class, 'moveStage'])->name('deals.move-stage');
    Route::post('deals/{deal}/close-won', [DealController::class, 'closeWon'])->name('deals.close-won');
    Route::post('deals/{deal}/close-lost', [DealController::class, 'closeLost'])->name('deals.close-lost');
    Route::resource('deals', DealController::class);

    // Activities
    Route::post('activities/{activity}/complete', [ActivityController::class, 'complete'])->name('activities.complete');
    Route::post('activities/{activity}/cancel', [ActivityController::class, 'cancel'])->name('activities.cancel');
    Route::resource('activities', ActivityController::class)->except(['create', 'show', 'edit']);
});
