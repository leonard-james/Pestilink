<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CloudinaryService
{
    public function uploadImage($file, $folder = 'pestilink/pests')
    {
        try {
            $uploadedFileUrl = Cloudinary::upload($file->getRealPath(), [
                'folder' => $folder,
                'resource_type' => 'image',
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ]);

            return [
                'success' => true,
                'url' => $uploadedFileUrl->getSecurePath(),
                'public_id' => $uploadedFileUrl->getPublicId(),
                'format' => $uploadedFileUrl->getExtension(),
                'bytes' => $uploadedFileUrl->getSize(),
                'width' => $uploadedFileUrl->getWidth(),
                'height' => $uploadedFileUrl->getHeight(),
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary upload failed: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ];
        }
    }

    public function deleteImage($publicId)
    {
        try {
            $result = Cloudinary::destroy($publicId);
            return ['success' => true, 'result' => $result];
        } catch (\Exception $e) {
            Log::error('Cloudinary delete failed: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage()
            ];
        }
    }
}
