<?php

namespace Functional\Pulse\Http\Controllers;

use Functional\Pulse\Rest\ProjectResource;
use Lomkit\Rest\Http\Controllers\Controller;

class ProjectController extends Controller
{
    public static $resource = ProjectResource::class;
}
