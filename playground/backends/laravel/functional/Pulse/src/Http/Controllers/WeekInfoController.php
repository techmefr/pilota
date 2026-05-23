<?php

namespace Functional\Pulse\Http\Controllers;

use Functional\Pulse\Rest\WeekInfoResource;
use Lomkit\Rest\Http\Controllers\Controller;

class WeekInfoController extends Controller
{
    public static $resource = WeekInfoResource::class;
}
