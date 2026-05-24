<?php

namespace Functional\Shoplab\Rest;

use Functional\Shoplab\Models\ShopOrder;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;
use Lomkit\Rest\Relations\HasMany;

class ShopOrderResource extends Resource
{
    public static $model = ShopOrder::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return [
            'id', 'stripe_session_id', 'stripe_payment_intent_id', 'status',
            'full_name', 'email', 'address', 'city', 'zip_code', 'phone', 'notes',
            'total_amount', 'created_at', 'updated_at',
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [
            HasMany::make('items', ShopOrderItemResource::class),
        ];
    }
}
