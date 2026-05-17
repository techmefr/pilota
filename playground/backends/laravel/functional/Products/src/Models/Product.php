<?php

namespace Functional\Products\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image', 'category', 'stock'];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];
}
