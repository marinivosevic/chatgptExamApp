<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Check if the authenticated user is a superAdmin
         $authenticatedUser = Auth::user();
        if ($authenticatedUser->role === 'student' ) {
            return response()->json(['message' => 'Unauthorized'], 403);
        } 

        // Validate the request
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string',
            'role' => 'required|string'
        ]);

        // Create the new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role
        ]);

        // Create a token for the new user
        $token = $user->createToken($request->email);

        // Return the response
        return response()->json([
            'token' => $token->plainTextToken,
            'user' => $user
        ], 201);
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
