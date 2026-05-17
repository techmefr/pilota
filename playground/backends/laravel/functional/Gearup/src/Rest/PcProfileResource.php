<?php

namespace Functional\Gearup\Rest;

use Functional\Gearup\Models\PcProfile;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class PcProfileResource extends Resource
{
    public static $model = PcProfile::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return [
            'id', 'role', 'model_tier', 'model_name',
            'cpu', 'ram', 'storage', 'gpu',
            'screens', 'screen_spec', 'profile_ram',
            'total', 'stock',
            'created_at', 'updated_at',
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
