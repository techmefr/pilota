<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    protected $fillable = ['person', 'days', 'reason', 'note'];
    protected $casts    = ['days' => 'array'];
}
