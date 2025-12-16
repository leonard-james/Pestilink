<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login and return API token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Load relationships based on user role
        if ($user->role === 'company') {
            $user->load('company');
        } elseif ($user->role === 'farmer') {
            $user->load('farmer');
        }

        $token = $user->createToken('api-token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:farmer,company'],
            
            // Company-specific fields
            'company_name' => ['required_if:role,company', 'string', 'max:255'],
            'address' => ['required_if:role,company', 'string'],
            'contact_number' => ['required_if:role,company', 'string'],
            'logo_url' => ['nullable', 'string', 'url'],
            
            // Farmer-specific fields
            'phone' => ['required_if:role,farmer', 'string', 'max:20'],
            'location' => ['required_if:role,farmer', 'string', 'max:255'],
        ]);

        // Prevent admin registration
        if (isset($validated['role']) && $validated['role'] === 'admin') {
            throw ValidationException::withMessages([
                'role' => ['Admin accounts cannot be created through registration.'],
            ]);
        }

        // Use database transaction for ACID compliance
        return \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'], // Will be automatically hashed by the 'hashed' cast in User model
                'role' => $validated['role'] ?? 'farmer',
            ]);

            // Create company or farmer record based on role
            if ($user->role === 'company') {
                \App\Models\Company::create([
                    'user_id' => $user->id,
                    'company_name' => $validated['company_name'],
                    'address' => $validated['address'] ?? null,
                    'phone' => $validated['contact_number'] ?? null,
                    'logo_url' => $validated['logo_url'] ?? null,
                ]);
                $user->load('company');
            } elseif ($user->role === 'farmer') {
                \App\Models\Farmer::create([
                    'user_id' => $user->id,
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'location' => $validated['location'],
                ]);
                $user->load('farmer');
            }

            $token = $user->createToken('api-token', ['*'], now()->addDays(30))->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
            ], 201);
        });
    }

    /**
     * Handle user logout by revoking the API token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }

    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ], 200);
    }
}
