<?php

namespace Functional\Cart\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['product_id', 'product_name', 'unit_price', 'quantity'];
}
