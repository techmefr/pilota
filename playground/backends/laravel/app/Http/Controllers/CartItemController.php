<?php

namespace App\Http\Controllers;

use App\Rest\CartItemResource;
use Lomkit\Rest\Http\Controllers\Controller;

class CartItemController extends Controller
{
    public static $resource = CartItemResource::class;
}
