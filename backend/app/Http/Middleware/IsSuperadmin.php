<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsSuperadmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Adjust based on your implementation
        if ($user && ($user->role === 'superAdmin')) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
