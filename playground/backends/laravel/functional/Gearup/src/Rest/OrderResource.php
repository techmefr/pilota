<?php

namespace Functional\Gearup\Rest;

use Functional\Gearup\Models\Order;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class OrderResource extends Resource
{
    public static $model = Order::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return [
            'id', 'ref', 'type', 'item', 'quantity', 'reason',
            'requested_by', 'status', 'created_date',
            'created_at', 'updated_at',
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
