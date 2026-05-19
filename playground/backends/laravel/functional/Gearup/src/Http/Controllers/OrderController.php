<?php

namespace Functional\Gearup\Http\Controllers;

use Functional\Gearup\Rest\OrderResource;
use Lomkit\Rest\Http\Controllers\Controller;

class OrderController extends Controller
{
    public static $resource = OrderResource::class;
}
