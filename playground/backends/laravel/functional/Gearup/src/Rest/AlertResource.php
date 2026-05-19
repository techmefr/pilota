<?php

namespace Functional\Gearup\Rest;

use Functional\Gearup\Models\Alert;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class AlertResource extends Resource
{
    public static $model = Alert::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return [
            'id', 'type', 'severity', 'device', 'serial',
            'employee', 'description', 'due_date', 'status',
            'created_at', 'updated_at',
        ];
    }

    public function relations(RestRequest $request): array
    {
        return [];
    }
}
