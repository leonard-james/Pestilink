<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Get all users
     *
     * @return JsonResponse
     */
    public function index()
    {
        try {
            $users = User::all(['id', 'name', 'email', 'role', 'status', 'last_login', 'created_at', 'updated_at']);
            
            return response()->json([
                'success' => true,
                'data' => $users
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Delete a user
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deleting the current admin user
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account'
                ], 403);
            }
            
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
            
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
