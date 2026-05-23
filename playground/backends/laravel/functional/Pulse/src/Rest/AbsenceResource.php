<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\Absence;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class AbsenceResource extends Resource
{
    public static $model = Absence::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'person', 'days', 'reason', 'note'];
    }

    public function relations(RestRequest $request): array { return []; }
}
