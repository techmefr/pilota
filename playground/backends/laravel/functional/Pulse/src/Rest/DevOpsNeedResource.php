<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\DevOpsNeed;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class DevOpsNeedResource extends Resource
{
    public static $model = DevOpsNeed::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'title', 'priority', 'status', 'owner', 'project', 'notes'];
    }

    public function relations(RestRequest $request): array { return []; }
}
