<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\Contract;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class ContractResource extends Resource
{
    public static $model = Contract::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'type', 'count', 'target', 'value_k'];
    }

    public function relations(RestRequest $request): array { return []; }
}
