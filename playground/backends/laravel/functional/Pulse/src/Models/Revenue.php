<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class Revenue extends Model
{
    protected $fillable = ['period', 'amount', 'target', 'annual_cumul', 'annual_target'];
}
