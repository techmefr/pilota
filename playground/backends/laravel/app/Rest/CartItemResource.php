<?php

namespace App\Rest;

use App\Models\CartItem;
use Lomkit\Rest\Fields\Field;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resources\Resource;

class CartItemResource extends Resource
{
    public static $model = CartItem::class;

    public function fields(RestRequest $request): array
    {
        return [
            Field::make('id'),
            Field::make('product_id'),
            Field::make('product_name'),
            Field::make('unit_price'),
            Field::make('quantity'),
            Field::make('created_at'),
            Field::make('updated_at'),
        ];
    }
}
