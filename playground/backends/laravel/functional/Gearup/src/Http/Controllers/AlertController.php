<?php

namespace Functional\Gearup\Http\Controllers;

use Functional\Gearup\Rest\AlertResource;
use Lomkit\Rest\Http\Controllers\Controller;

class AlertController extends Controller
{
    public static $resource = AlertResource::class;
}
