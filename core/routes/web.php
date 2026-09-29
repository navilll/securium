<?php

use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\CourseCategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/admin', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('admin.login');
});

Route::get('admin/login', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('admin.login');

Route::prefix('admin')->middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Courses and course categories
    Route::get('courses/categories', [CourseCategoryController::class, 'index'])->name('courses.categories.index');
    Route::post('courses/categories', [CourseCategoryController::class, 'store'])->name('courses.categories.store');
    Route::put('courses/categories/{courseCategory}', [CourseCategoryController::class, 'update'])->name('courses.categories.update');
    Route::delete('courses/categories/{courseCategory}', [CourseCategoryController::class, 'destroy'])->name('courses.categories.destroy');
    Route::resource('courses', CourseController::class)->except(['show']);
    
    //Contact Form
    Route::get('/contact-forms', [ContactFormController::class, 'index'])->name('contact-forms.index');
    Route::get('contact-forms/{contactForm}/destroy', [ContactFormController::class, 'destroy'])->name('contact-forms.destroy');
    
    //Profile  
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Users
    Route::resource('users', UserController::class)->except(['show']);
});

require __DIR__ . '/auth.php';
