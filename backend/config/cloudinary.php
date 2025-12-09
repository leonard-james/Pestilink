<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Cloudinary image and video management service.
    | Used for storing pest detection images and company logos.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME', 'dwovgqzsk'),
    'api_key' => env('CLOUDINARY_API_KEY', '772424885657761'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'secure' => true,
];






