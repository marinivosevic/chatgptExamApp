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

     public function getAllProfesors(){
        $profesors = User::where('role', ['profesor', 'assistant'])->get();
        return response()->json($profesors);
     }
     public function getAllStudents(){
        $students = User::where('role','student')->get();
        return response()->json($students);
     }
     public function getAllUsers(){
        $users = User::all();
        return response()->json($users);
     }
    public function index()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
