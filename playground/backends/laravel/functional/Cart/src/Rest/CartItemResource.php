<?php

namespace Functional\Cart\Rest;

use Functional\Cart\Models\CartItem;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class CartItemResource extends Resource
{
    public static $model = CartItem::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'product_id', 'product_name', 'unit_price', 'quantity', 'created_at', 'updated_at'];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
