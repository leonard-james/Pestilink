<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\CompanyService;
use App\Models\Company;
use App\Models\PestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Get all active services (public).
     */
    public function index(Request $request): JsonResponse
    {
        $services = Service::where('is_active', true)
            ->with('company')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'company_name' => $service->company->company_name ?? 'Unknown',
                    'location' => $service->company->location ?? '',
                    'phone' => $service->company->phone ?? '',
                    'email' => $service->company->email ?? '',
                    'image' => $service->image ? Storage::url($service->image) : null,
                ];
            });

        return response()->json($services, 200);
    }

    /**
     * Get services suggested for a specific pest.
     */
    public function suggest(Request $request): JsonResponse
    {
        $request->validate([
            'pest' => ['required', 'string'],
        ]);

        $pestName = strtolower(trim($request->input('pest')));

        // Find services that target this pest
        $serviceIds = PestService::where('pest_name', 'like', "%{$pestName}%")
            ->pluck('service_id')
            ->toArray();

        // Also find services with pest types matching
        $additionalServices = Service::where('is_active', true)
            ->whereJsonContains('pest_types', $pestName)
            ->pluck('id')
            ->toArray();

        $allServiceIds = array_unique(array_merge($serviceIds, $additionalServices));

        $services = Service::whereIn('id', $allServiceIds)
            ->where('is_active', true)
            ->with('company')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'company_name' => $service->company->company_name ?? 'Unknown',
                    'location' => $service->company->location ?? '',
                    'phone' => $service->company->phone ?? '',
                    'email' => $service->company->email ?? '',
                    'image' => $service->image ? Storage::url($service->image) : null,
                ];
            });

        return response()->json([
            'services' => $services,
            'pest' => $pestName,
        ], 200);
    }

    /**
     * Get company's services (authenticated company user).
     */
    public function companyServices(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->isCompany()) {
            return response()->json([
                'error' => 'Unauthorized. Company access required.',
            ], 403);
        }

        $company = $user->company;
        
        if (!$company) {
            return response()->json([
                'error' => 'Company profile not found',
            ], 404);
        }

        $services = Service::where('company_id', $company->id)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'service_type' => $service->service_type,
                    'pest_types' => $service->pest_types ?? [],
                    'image' => $service->image ? Storage::url($service->image) : null,
                    'is_active' => $service->is_active,
                ];
            });

        return response()->json($services, 200);
    }

    /**
     * Create a new service (authenticated company user).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->isCompany()) {
            return response()->json([
                'error' => 'Unauthorized. Company access required.',
            ], 403);
        }

        $company = $user->company;
        
        if (!$company) {
            return response()->json([
                'error' => 'Company profile not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'service_type' => ['nullable', 'string'],
            'pest_types' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'], // Max 5MB
        ]);

        $pestTypes = [];
        if (!empty($validated['pest_types'])) {
            $pestTypes = array_map('trim', explode(',', $validated['pest_types']));
        }

        $service = Service::create([
            'company_id' => $company->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'] ?? null,
            'service_type' => $validated['service_type'] ?? null,
            'pest_types' => $pestTypes,
            'is_active' => true,
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
            $service->update(['image' => $imagePath]);
        }

        // Create pest service mappings
        foreach ($pestTypes as $pestName) {
            PestService::create([
                'pest_name' => strtolower(trim($pestName)),
                'service_id' => $service->id,
            ]);
        }

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service,
        ], 201);
    }
}
