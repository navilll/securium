<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactFormController;
use App\Http\Controllers\Api\CourseController;


//Contact Form
Route::post('contact-form', [ContactFormController::class, 'store']);

Route::get('courses', [CourseController::class, 'index']);
Route::get('courses/{slug}', [CourseController::class, 'show']);
Route::get('course-categories', [CourseController::class, 'categories']);
