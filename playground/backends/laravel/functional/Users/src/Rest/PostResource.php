<?php

namespace Functional\Users\Rest;

use Functional\Users\Models\Post;
use Lomkit\Rest\Fields\Field;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resources\Resource;
use Lomkit\Rest\Relations\BelongsTo;

class PostResource extends Resource
{
    public static $model = Post::class;

    public function fields(RestRequest $request): array
    {
        return [
            Field::make('id'),
            Field::make('user_id'),
            Field::make('title'),
            Field::make('content'),
            Field::make('created_at'),
            Field::make('updated_at'),
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [
            BelongsTo::make('user', UserResource::class),
        ];
    }
}
