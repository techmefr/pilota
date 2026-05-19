<?php

namespace Functional\Gearup\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'ref', 'type', 'item', 'quantity', 'reason',
        'requested_by', 'status', 'created_date',
    ];

    protected $casts = [
        'quantity'     => 'integer',
        'created_date' => 'date',
    ];
}
