<?php

namespace Functional\Pulse\Http\Controllers;

use Functional\Pulse\Rest\DeliveryResource;
use Lomkit\Rest\Http\Controllers\Controller;

class DeliveryController extends Controller
{
    public static $resource = DeliveryResource::class;
}
