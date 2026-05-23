<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class WeekInfo extends Model
{
    protected $table    = 'week_infos';
    protected $fillable = ['type', 'title', 'detail', 'date'];
}
