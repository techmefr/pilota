<?php

namespace Functional\Shoplab\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopOrder extends Model
{
    protected $fillable = [
        'stripe_session_id', 'stripe_payment_intent_id', 'status',
        'full_name', 'email', 'address', 'city', 'zip_code', 'phone', 'notes',
        'total_amount',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(ShopOrderItem::class);
    }
}
