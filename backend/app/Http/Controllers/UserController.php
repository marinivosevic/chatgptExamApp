<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function getAllProfesors()
    {
        $profesors = User::where('role', ['profesor', 'assistant'])->get();
        return response()->json($profesors);
    }
    public function getAllStudents()
    {
        $students = User::where('role', 'student')->get();
        return response()->json($students);
    }
    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }
    public function getUserById($user_id)
    {
        $user = User::find($user_id);
        return response()->json($user);
    }
    public function getAllCoursesForUser($user_id)
    {
        $user = User::find($user_id);
        $courses = $user->courses;
        return response()->json($courses);
    }
}
