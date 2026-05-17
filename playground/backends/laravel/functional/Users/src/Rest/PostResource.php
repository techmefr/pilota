<?php

namespace Functional\Users\Rest;

use Functional\Users\Models\Post;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class PostResource extends Resource
{
    public static $model = Post::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'user_id', 'title', 'content', 'created_at', 'updated_at'];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
