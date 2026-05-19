<?php

namespace Functional\Gearup\Rest;

use Functional\Gearup\Models\Assignment;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class AssignmentResource extends Resource
{
    public static $model = Assignment::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return [
            'id', 'employee', 'email', 'team', 'department',
            'model', 'serial', 'assigned_at', 'status',
            'created_at', 'updated_at',
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
