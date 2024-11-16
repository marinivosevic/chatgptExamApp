<?php
// routes/api.php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuestionController;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/create-course', [CourseController::class, 'store']);
});

Route::post('/create-exam',[QuestionController::class,'createExamWithQuestions']);


Route::prefix('auth')->group(function () {
    Route::apiResource('users', UserController::class);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
    });

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
