<?php

namespace Functional\Gearup\Models;

use Illuminate\Database\Eloquent\Model;

class PcProfile extends Model
{
    protected $table = 'pc_profiles';

    protected $fillable = [
        'role', 'model_tier', 'model_name', 'cpu', 'ram', 'storage', 'gpu',
        'screens', 'screen_spec', 'profile_ram', 'total', 'stock',
    ];

    protected $casts = [
        'screens' => 'integer',
        'total'   => 'integer',
        'stock'   => 'integer',
    ];
}
