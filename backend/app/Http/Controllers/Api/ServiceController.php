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
                    'pest_types' => $service->pest_types ?? [],
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
        
        // First, try exact match
        $services = Service::where('is_active', true)
            ->whereJsonContains('pest_types', $request->input('pest'))
            ->with('company')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'pest_types' => $service->pest_types ?? [],
                    'company_name' => $service->company->company_name ?? 'Unknown',
                    'location' => $service->company->location ?? '',
                    'phone' => $service->company->phone ?? '',
                    'email' => $service->company->email ?? '',
                    'image' => $service->image ? Storage::url($service->image) : null,
                ];
            });

        // If no exact matches found, try case-insensitive search
        if ($services->isEmpty()) {
            $allServices = Service::where('is_active', true)
                ->with('company')
                ->get();

            $services = $allServices->filter(function ($service) use ($pestName) {
                $pests = collect($service->pest_types ?? [])->map(fn($p) => strtolower($p));
                return $pests->contains($pestName);
            })->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'pest_types' => $service->pest_types ?? [],
                    'company_name' => $service->company->company_name ?? 'Unknown',
                    'location' => $service->company->location ?? '',
                    'phone' => $service->company->phone ?? '',
                    'email' => $service->company->email ?? '',
                    'image' => $service->image ? Storage::url($service->image) : null,
                ];
            });
        }

        return response()->json($services->values(), 200);
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
            'pest_types' => ['nullable'],
            'image' => ['nullable', 'image', 'max:5120'], // Max 5MB
        ]);

        $pestTypes = $this->parsePestTypes($validated['pest_types'] ?? []);

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
        $this->storePestMappings($service, $pestTypes);

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service,
        ], 201);
    }

    /**
     * Update a service (authenticated company user).
     */
    public function update(Request $request, $id): JsonResponse
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

        $service = Service::where('id', $id)
            ->where('company_id', $company->id)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'service_type' => ['nullable', 'string'],
            'pest_types' => ['nullable'],
            'image' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $pestTypes = isset($validated['pest_types'])
            ? $this->parsePestTypes($validated['pest_types'])
            : null;

        // Update service fields
        $updateData = [];
        if (isset($validated['title'])) $updateData['title'] = $validated['title'];
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['price'])) $updateData['price'] = $validated['price'];
        if (isset($validated['service_type'])) $updateData['service_type'] = $validated['service_type'];
        if (isset($validated['is_active'])) $updateData['is_active'] = $validated['is_active'];
        if (is_array($pestTypes)) {
            $updateData['pest_types'] = $pestTypes;
        }

        $service->update($updateData);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $imagePath = $request->file('image')->store('services', 'public');
            $service->update(['image' => $imagePath]);
        }

        // Update pest service mappings if pest_types was provided
        if (is_array($pestTypes)) {
            $this->storePestMappings($service, $pestTypes);
        }

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service->fresh(),
        ], 200);
    }

    /**
     * Delete a service (authenticated company user).
     */
    public function destroy(Request $request, $id): JsonResponse
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

        $service = Service::where('id', $id)
            ->where('company_id', $company->id)
            ->firstOrFail();

        // Delete associated image
        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        // Delete pest service mappings (cascade should handle this, but being explicit)
        PestService::where('service_id', $service->id)->delete();

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully',
        ], 200);
    }

    /**
     * Normalize pest types input from array or comma-separated string.
     */
    private function parsePestTypes($raw): array
    {
        if (is_array($raw)) {
            $pests = $raw;
        } elseif (is_string($raw)) {
            $pests = explode(',', $raw);
        } else {
            $pests = [];
        }

        $cleaned = array_filter(array_map(function ($item) {
            if (!is_string($item)) {
                return null;
            }
            $normalized = preg_replace('/\s+/', ' ', trim($item));
            return $normalized !== '' ? $normalized : null;
        }, $pests));

        return array_values($cleaned);
    }

    /**
     * Persist pest mappings in pivot table for a service.
     */
    private function storePestMappings(Service $service, array $pestTypes): void
    {
        // Always reset mappings to reflect the latest selection
        PestService::where('service_id', $service->id)->delete();

        foreach ($pestTypes as $pestName) {
            PestService::create([
                'pest_name' => strtolower($pestName),
                'service_id' => $service->id,
            ]);
        }
    }
}
