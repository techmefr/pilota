<?php

namespace Functional\Pulse\Http\Controllers;

use Functional\Pulse\Rest\DevOpsNeedResource;
use Lomkit\Rest\Http\Controllers\Controller;

class DevOpsNeedController extends Controller
{
    public static $resource = DevOpsNeedResource::class;
}
