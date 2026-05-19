<?php

namespace Functional\Gearup\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $table = 'assignments';

    protected $fillable = [
        'employee', 'email', 'team', 'department',
        'model', 'serial', 'assigned_at', 'status',
    ];

    protected $casts = [
        'assigned_at' => 'date',
    ];
}
