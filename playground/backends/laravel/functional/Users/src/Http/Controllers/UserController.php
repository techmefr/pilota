<?php

namespace Functional\Users\Http\Controllers;

use Functional\Users\Rest\UserResource;
use Lomkit\Rest\Http\Controllers\Controller;

class UserController extends Controller
{
    public static $resource = UserResource::class;
}
