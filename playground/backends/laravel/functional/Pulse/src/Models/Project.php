<?php

namespace Functional\Pulse\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'status', 'open_bugs', 'deployments', 'team', 'url', 'sentry_issues', 'sentry_criticals'];
    protected $casts    = ['deployments' => 'array'];
}
