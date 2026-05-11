<?php

namespace App\Http\Controllers;

use App\Rest\PostResource;
use Lomkit\Rest\Http\Controllers\Controller;

class PostController extends Controller
{
    public static $resource = PostResource::class;
}
