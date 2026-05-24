<?php

namespace Functional\Shoplab\Models;

use Illuminate\Database\Eloquent\Model;

class ShopOrderItem extends Model
{
    protected $fillable = ['shop_order_id', 'product_id', 'product_name', 'unit_price', 'quantity'];

    protected $casts = [
        'unit_price' => 'float',
    ];
}
