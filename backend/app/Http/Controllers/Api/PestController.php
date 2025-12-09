<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class PestController extends Controller
{
    /**
     * Classify pest from uploaded image using Roboflow.
     */
    public function classify(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:10240'], // Max 10MB
        ]);

        try {
            // Get Roboflow configuration from .env
            $roboflowApiKey = env('ROBOFLOW_API_KEY');
            $roboflowWorkflowId = env('ROBOFLOW_WORKFLOW_ID', 'detect-and-classify-4');
            $roboflowWorkspace = env('ROBOFLOW_WORKSPACE', 'markjohn');
            $roboflowVersion = env('ROBOFLOW_VERSION', 1);

            if (!$roboflowApiKey) {
                return response()->json([
                    'error' => 'Roboflow API key not configured',
                ], 500);
            }

            // Upload image to Cloudinary in pest_detection folder
            $uploadedFile = $request->file('image');
            
            try {
                // Use Cloudinary SDK directly with configuration
                $cloudinary = new \Cloudinary\Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME', 'dwovgqzsk'),
                        'api_key' => env('CLOUDINARY_API_KEY', '772424885657761'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ],
                ]);
                
                $cloudinaryUpload = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'pest_detection',
                    'resource_type' => 'image',
                    'use_filename' => true,
                    'unique_filename' => true,
                ]);
                $cloudinaryUrl = $cloudinaryUpload['secure_url'];
            } catch (\Exception $cloudinaryError) {
                \Log::error('Cloudinary upload failed', [
                    'error' => $cloudinaryError->getMessage(),
                    'trace' => $cloudinaryError->getTraceAsString(),
                ]);
                return response()->json([
                    'error' => 'Failed to upload image to Cloudinary',
                    'message' => $cloudinaryError->getMessage(),
                ], 500);
            }
            
            // Read image as base64 for Roboflow (from Cloudinary URL or local file)
            // We'll use the Cloudinary URL directly or fetch and encode
            $imageData = base64_encode(file_get_contents($uploadedFile->getRealPath()));
            
            // Prepare Roboflow Workflow API request
            // Roboflow workflow API: https://infer.roboflow.com/workflow/{workflow_id}
            // API key can be in URL or header
            $roboflowUrl = "https://infer.roboflow.com/workflow/{$roboflowWorkflowId}";
            
            // Try format 1: Base64 image with api_key in body
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($roboflowUrl . "?api_key={$roboflowApiKey}", [
                'image' => $imageData, // Base64 string
            ]);

            // If that fails, try format 2: Base64 with api_key in body
            if (!$response->successful()) {
                \Log::warning('Roboflow API call failed with format 1, trying format 2', [
                    'status' => $response->status(),
                    'body' => substr($response->body(), 0, 500), // Limit log size
                ]);
                
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post($roboflowUrl, [
                    'api_key' => $roboflowApiKey,
                    'image' => $imageData,
                ]);
            }

            // If that fails, try format 3: Image URL (Cloudinary)
            if (!$response->successful()) {
                \Log::warning('Roboflow API call failed with format 2, trying format 3 (image_url)', [
                    'status' => $response->status(),
                    'body' => substr($response->body(), 0, 500),
                ]);
                
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post($roboflowUrl . "?api_key={$roboflowApiKey}", [
                    'image_url' => $cloudinaryUrl,
                ]);
            }

            if (!$response->successful()) {
                \Log::error('Roboflow API call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'url' => $roboflowUrl,
                ]);
                
                return response()->json([
                    'error' => 'Failed to classify pest image',
                    'message' => 'Roboflow API returned an error',
                    'status' => $response->status(),
                    'details' => $response->body(),
                ], 500);
            }

            $result = $response->json();
            
            // Extract pest name from Roboflow response
            // Adjust this based on your actual Roboflow model response structure
            $pestName = $this->extractPestName($result);
            $confidence = $this->extractConfidence($result);
            $details = $this->extractDetails($result);

            return response()->json([
                'pest_name' => $pestName,
                'confidence' => $confidence,
                'details' => $details,
                'image_url' => $cloudinaryUrl, // Return Cloudinary URL
                'raw_response' => $result, // For debugging
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Pest classification exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'error' => 'An error occurred during pest classification',
                'message' => $e->getMessage(),
                'type' => get_class($e),
            ], 500);
        }
    }

    /**
     * Extract pest name from Roboflow workflow response.
     */
    private function extractPestName(array $response): string
    {
        // Handle different response formats from Roboflow workflow
        // Format 1: Standard predictions array
        if (isset($response['predictions']) && count($response['predictions']) > 0) {
            return $response['predictions'][0]['class'] ?? 'Unknown Pest';
        }
        
        // Format 2: Workflow output format
        if (isset($response['output']) && isset($response['output']['class'])) {
            return $response['output']['class'];
        }
        
        // Format 3: Direct class in response
        if (isset($response['class'])) {
            return $response['class'];
        }
        
        // Format 4: Top prediction
        if (isset($response['top_prediction']) && isset($response['top_prediction']['class'])) {
            return $response['top_prediction']['class'];
        }
        
        return 'Unknown Pest';
    }

    /**
     * Extract confidence score from Roboflow workflow response.
     */
    private function extractConfidence(array $response): float
    {
        // Handle different response formats
        // Format 1: Standard predictions array
        if (isset($response['predictions']) && count($response['predictions']) > 0) {
            return (float) ($response['predictions'][0]['confidence'] ?? 0.0);
        }
        
        // Format 2: Workflow output format
        if (isset($response['output']) && isset($response['output']['confidence'])) {
            return (float) $response['output']['confidence'];
        }
        
        // Format 3: Direct confidence in response
        if (isset($response['confidence'])) {
            return (float) $response['confidence'];
        }
        
        // Format 4: Top prediction
        if (isset($response['top_prediction']) && isset($response['top_prediction']['confidence'])) {
            return (float) $response['top_prediction']['confidence'];
        }
        
        return 0.0;
    }

    /**
     * Extract additional details from Roboflow workflow response.
     */
    private function extractDetails(array $response): array
    {
        $details = [];
        
        // Handle predictions array format
        if (isset($response['predictions']) && is_array($response['predictions'])) {
            foreach ($response['predictions'] as $prediction) {
                $details[] = [
                    'class' => $prediction['class'] ?? 'Unknown',
                    'confidence' => (float) ($prediction['confidence'] ?? 0.0),
                    'description' => $prediction['class'] ?? 'Unknown pest detected',
                ];
            }
        }
        // Handle workflow output format
        elseif (isset($response['output'])) {
            $output = $response['output'];
            if (is_array($output)) {
                $details[] = [
                    'class' => $output['class'] ?? 'Unknown',
                    'confidence' => (float) ($output['confidence'] ?? 0.0),
                    'description' => $output['class'] ?? 'Unknown pest detected',
                ];
            }
        }
        // Handle single prediction format
        elseif (isset($response['class'])) {
            $details[] = [
                'class' => $response['class'],
                'confidence' => (float) ($response['confidence'] ?? 0.0),
                'description' => $response['class'] ?? 'Unknown pest detected',
            ];
        }
        
        return $details;
    }
}
