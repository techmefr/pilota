<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\Mission;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class MissionResource extends Resource
{
    public static $model = Mission::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'title', 'status', 'category', 'owner', 'due_date'];
    }

    public function relations(RestRequest $request): array { return []; }
}
