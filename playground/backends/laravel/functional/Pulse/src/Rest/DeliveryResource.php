<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\Delivery;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class DeliveryResource extends Resource
{
    public static $model = Delivery::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'project', 'version', 'date', 'tickets_resolved', 'tickets_total', 'notes'];
    }

    public function relations(RestRequest $request): array { return []; }
}
