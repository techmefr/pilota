<?php

namespace Functional\Pulse\Rest;

use Functional\Pulse\Models\Project;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Http\Resource;

class ProjectResource extends Resource
{
    public static $model = Project::class;

    public function isGatingEnabled(): bool { return false; }
    public function isAuthorizingEnabled(): bool { return false; }

    public function fields(RestRequest $request): array
    {
        return ['id', 'name', 'status', 'open_bugs', 'deployments', 'team', 'url', 'sentry_issues', 'sentry_criticals', 'updated_at'];
    }

    public function relations(RestRequest $request): array { return []; }
}
