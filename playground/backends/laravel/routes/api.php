<?php

use Functional\Cart\Http\Controllers\CartItemController;
use Functional\Gearup\Http\Controllers\PcProfileController;
use Functional\Products\Http\Controllers\ProductController;
use Functional\Users\Http\Controllers\PostController;
use Functional\Users\Http\Controllers\UserController;
use Lomkit\Rest\Facades\Rest;

Rest::resource('users', UserController::class);
Rest::resource('posts', PostController::class);
Rest::resource('cartItems', CartItemController::class);
Rest::resource('products', ProductController::class);
Rest::resource('pcProfiles', PcProfileController::class);
