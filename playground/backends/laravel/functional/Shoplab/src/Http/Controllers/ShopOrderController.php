<?php

namespace Functional\Shoplab\Http\Controllers;

use Functional\Shoplab\Rest\ShopOrderResource;
use Lomkit\Rest\Http\Controllers\Controller;

class ShopOrderController extends Controller
{
    public static $resource = ShopOrderResource::class;
}
