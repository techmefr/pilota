<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\WeekInfo;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class WeekInfoResource extends Resource
{
    public static $model = WeekInfo::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'type', 'title', 'detail', 'date'];
    }

    public function relations(RestRequest $request): array { return []; }
}
