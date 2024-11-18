<?php
// routes/api.php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ExamSessionController;
use App\Http\Middleware\IsSuperadmin;


Route::post('/create-course', [CourseController::class, 'store'])->middleware('auth:sanctum');


Route::post('/create-exam', [QuestionController::class, 'createExamWithQuestions']);
Route::get('/courses/{course}/exams', [QuestionController::class, 'getExamsForCourse']);
Route::get('/users/profesors', [UserController::class, 'getAllProfesors']);

Route::post('/courses/addUserToCourse', [CourseController::class, 'addUserToCourse']);
Route::get('/courses/{user_id}', [CourseController::class, 'getAllUsersCourses']);

Route::post('/exam/saveAnswers', [QuestionController::class, 'saveAnswers']);
Route::get('/exam/{exam_id}/getQuestions', [QuestionController::class, 'getQuestionsForExam']);

Route::post('/start-session', [ExamSessionController::class, 'startSession']);
Route::post('/end-session', [ExamSessionController::class, 'endSession']);

Route::prefix('auth')->group(function () {
    Route::apiResource('users', UserController::class);


    Route::post('/register', [AuthController::class, 'register'])->middleware('auth:sanctum');


    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
