<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class DevOpsNeed extends Model
{
    protected $table    = 'devops_needs';
    protected $fillable = ['title', 'priority', 'status', 'owner', 'project', 'notes'];
}
