<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
       $request->validate([
           'name' => 'required|string',
           'email' => 'required|email|unique:users,email',
           'password' => 'required|string|confirmed',
           'role' => 'required|string'
       ]);

        $user = User::create([
           'name' => $request->name,
           'email' => $request->email,
           'password' => bcrypt($request->password),
           'role' => $request->role
       ]);
       
       $token = $user->createToken($request->email); 
       
        return [
            'token' => $token->plainTextToken,
            'user' => $user
       ]; 
      
    }
    public function login(Request $request)
    {
        $request->validate([
           
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string',
            
        ]);

        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken($request->email);

        return [
            'token' => $token->plainTextToken,
            'user' => $user
        ];
 
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
