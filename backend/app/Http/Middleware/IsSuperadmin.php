<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsSuperadmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
       
        // Check if the user exists and has either 'superAdmin' or 'profesor' role
        if ($user && ($user->role === 'superAdmin' )) {
            Log::info("User is superAdmin");
            return $next($request);
        }
        

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}