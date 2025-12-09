<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanyService extends Model
{
    use HasFactory;

    protected $table = 'company_services';

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'price',
        'service_type',
        'pest_types',
        'image',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'pest_types' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the service.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the pest service mappings for this service.
     */
    public function pestServices(): HasMany
    {
        return $this->hasMany(PestService::class, 'service_id');
    }

    /**
     * Get bookings for this service.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(ServiceBooking::class, 'service_id');
    }
}






