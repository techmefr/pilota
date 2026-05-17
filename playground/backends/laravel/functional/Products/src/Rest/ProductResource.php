<?php

namespace Functional\Products\Rest;

use Functional\Products\Models\Product;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class ProductResource extends Resource
{
    public static $model = Product::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'name', 'description', 'price', 'image', 'category', 'stock', 'created_at', 'updated_at'];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
