<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $fillable = ['title', 'status', 'category', 'owner', 'due_date'];
}
