<?php

namespace App\Http\Controllers;

use App\Rest\UserResource;
use Lomkit\Rest\Http\Controllers\Controller;

class UserController extends Controller
{
    public static $resource = UserResource::class;
}
