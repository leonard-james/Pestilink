<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceBooking;
use App\Models\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    /**
     * Create a new booking (Farmer only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:company_services,id'],
            'booking_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Use transaction for ACID compliance
        return DB::transaction(function () use ($validated, $request) {
            $service = CompanyService::findOrFail($validated['service_id']);
            
            // Verify service is active
            if (!$service->is_active) {
                throw ValidationException::withMessages([
                    'service_id' => ['This service is not available.'],
                ]);
            }

            $booking = ServiceBooking::create([
                'service_id' => $validated['service_id'],
                'company_id' => $service->company_id,
                'user_id' => $request->user()->id,
                'booking_notes' => $validated['booking_notes'] ?? null,
                'status' => 'pending',
            ]);

            $booking->load(['service', 'company', 'user']);

            return response()->json([
                'message' => 'Booking created successfully',
                'booking' => $booking,
            ], 201);
        });
    }

    /**
     * Get current user's bookings (Farmer).
     */
    public function myBookings(Request $request): JsonResponse
    {
        $bookings = ServiceBooking::where('user_id', $request->user()->id)
            ->with(['service', 'company'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['bookings' => $bookings]);
    }

    /**
     * Get company's bookings (Company owner).
     */
    public function companyBookings(Request $request): JsonResponse
    {
        $company = $request->user()->company;
        
        if (!$company) {
            return response()->json([
                'message' => 'User is not associated with a company.',
            ], 403);
        }

        $bookings = ServiceBooking::where('company_id', $company->id)
            ->with(['service', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['bookings' => $bookings]);
    }

    /**
     * Get all bookings (Admin only).
     */
    public function allBookings(Request $request): JsonResponse
    {
        $bookings = ServiceBooking::with(['service', 'company', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['bookings' => $bookings]);
    }

    /**
     * Update booking status (Company or Admin).
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,cancelled'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $booking = ServiceBooking::findOrFail($id);
        $user = $request->user();

        // Check permissions: Company can only update their own bookings, Admin can update any
        if ($user->role === 'company') {
            $company = $user->company;
            if (!$company || $booking->company_id !== $company->id) {
                return response()->json([
                    'message' => 'You can only update bookings for your own company.',
                ], 403);
            }
        } elseif ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        // Use transaction for ACID compliance
        return DB::transaction(function () use ($booking, $validated, $user) {
            $oldStatus = $booking->status;
            $booking->update(['status' => $validated['status']]);

            // Log to booking_audit if reason provided
            if (isset($validated['reason'])) {
                DB::table('booking_audit')->insert([
                    'booking_id' => $booking->id,
                    'old_status' => $oldStatus,
                    'new_status' => $validated['status'],
                    'changed_by' => $user->name,
                    'reason' => $validated['reason'],
                    'created_at' => now(),
                ]);
            }

            $booking->load(['service', 'company', 'user']);

            return response()->json([
                'message' => 'Booking status updated successfully',
                'booking' => $booking,
            ]);
        });
    }

    /**
     * Get booking audit trail (Admin only).
     */
    public function auditTrail(Request $request, int $id): JsonResponse
    {
        $auditTrail = DB::table('booking_audit')
            ->where('booking_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['audit_trail' => $auditTrail]);
    }
}
