<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\QuestionController;
Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/token', function () {
    return csrf_token(); 
});

Route::get('/db-test', function () {
    
       return Auth::user();

     
});



/* require __DIR__.'/auth.php'; */
