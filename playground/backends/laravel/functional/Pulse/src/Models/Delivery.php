<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = ['project', 'version', 'date', 'tickets_resolved', 'tickets_total', 'notes'];
}
