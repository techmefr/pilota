<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = ['type', 'count', 'target', 'value_k'];
}
