<?php

use App\Http\Controllers\CartItemController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Lomkit\Rest\Facades\Rest;

Rest::resource('users', UserController::class);
Rest::resource('posts', PostController::class);
Rest::resource('cartItems', CartItemController::class);
