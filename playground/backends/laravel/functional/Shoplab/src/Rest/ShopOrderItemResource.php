<?php

namespace Functional\Shoplab\Rest;

use Functional\Shoplab\Models\ShopOrderItem;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class ShopOrderItemResource extends Resource
{
    public static $model = ShopOrderItem::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'shop_order_id', 'product_id', 'product_name', 'unit_price', 'quantity'];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
