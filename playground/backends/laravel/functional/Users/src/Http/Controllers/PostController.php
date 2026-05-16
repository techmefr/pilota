<?php

namespace Functional\Users\Http\Controllers;

use Functional\Users\Rest\PostResource;
use Lomkit\Rest\Http\Controllers\Controller;

class PostController extends Controller
{
    public static $resource = PostResource::class;
}
