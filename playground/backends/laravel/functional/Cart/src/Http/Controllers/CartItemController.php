<?php

namespace Functional\Cart\Http\Controllers;

use Functional\Cart\Rest\CartItemResource;
use Lomkit\Rest\Http\Controllers\Controller;

class CartItemController extends Controller
{
    public static $resource = CartItemResource::class;
}
