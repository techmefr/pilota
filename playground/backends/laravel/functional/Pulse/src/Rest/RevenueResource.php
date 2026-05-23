<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\Revenue;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class RevenueResource extends Resource
{
    public static $model = Revenue::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'period', 'amount', 'target', 'annual_cumul', 'annual_target'];
    }

    public function relations(RestRequest $request): array { return []; }
}
