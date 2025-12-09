<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PestService extends Model
{
    use HasFactory;

    protected $fillable = [
        'pest_name',
        'service_id',
    ];

    /**
     * Get the service that owns the pest service mapping.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
