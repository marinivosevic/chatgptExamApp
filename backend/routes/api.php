<?php
// routes/api.php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ExamSessionController;



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

Route::get('/exam-sessions/{exam_id}', [ExamSessionController::class, 'getExamSessions']);

Route::prefix('auth')->group(function () {
    Route::apiResource('users', UserController::class);


    Route::post('/register', [AuthController::class, 'register'])->middleware('auth:sanctum');


    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/studentRegister', [AuthController::class, 'registerStudent']);
});


    
    // Get all students for a specific exam
    Route::get('/exams/{exam}/students', [ExamSessionController::class, 'getStudentsForExam'])->middleware('auth:sanctum');;

    // Get a specific student's answers and points for an exam
    Route::get('/exams/{exam}/students/{user}', [ExamSessionController::class, 'getStudentDetails'])->middleware('auth:sanctum');;

    // Update a student's points for an exam
    Route::put('/exams/{exam}/students/{user}/points', [ExamSessionController::class, 'updateStudentPoints'])->middleware('auth:sanctum');;
