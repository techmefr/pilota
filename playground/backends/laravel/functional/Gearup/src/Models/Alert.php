<?php

namespace Functional\Gearup\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $table = 'alerts';

    protected $fillable = [
        'type', 'severity', 'device', 'serial',
        'employee', 'description', 'due_date', 'status',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];
}
