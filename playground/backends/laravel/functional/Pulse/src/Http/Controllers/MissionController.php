<?php

namespace Functional\Pulse\Http\Controllers;

use Functional\Pulse\Rest\MissionResource;
use Lomkit\Rest\Http\Controllers\Controller;

class MissionController extends Controller
{
    public static $resource = MissionResource::class;
}
