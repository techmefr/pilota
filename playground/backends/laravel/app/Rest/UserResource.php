<?php

namespace App\Rest;

use App\Models\User;
use Lomkit\Rest\Fields\Field;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resources\Resource;
use Lomkit\Rest\Relations\HasMany;

class UserResource extends Resource
{
    public static $model = User::class;

    public function fields(RestRequest $request): array
    {
        return [
            Field::make('id'),
            Field::make('name'),
            Field::make('email'),
            Field::make('created_at'),
            Field::make('updated_at'),
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [
            HasMany::make('posts', PostResource::class),
        ];
    }
}
