<?php

namespace Functional\Products\Http\Controllers;

use Functional\Products\Rest\ProductResource;
use Lomkit\Rest\Http\Controllers\Controller;

class ProductController extends Controller
{
    public static $resource = ProductResource::class;
}
