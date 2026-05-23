<?php

use Functional\Cart\Http\Controllers\CartItemController;
use Functional\Gearup\Http\Controllers\AlertController;
use Functional\Gearup\Http\Controllers\AssignmentController;
use Functional\Gearup\Http\Controllers\OrderController;
use Functional\Gearup\Http\Controllers\PcProfileController;
use Functional\Products\Http\Controllers\ProductController;
use Functional\Users\Http\Controllers\PostController;
use Functional\Users\Http\Controllers\UserController;
use Functional\Pulse\Http\Controllers\ProjectController;
use Functional\Pulse\Http\Controllers\DeliveryController;
use Functional\Pulse\Http\Controllers\MissionController;
use Functional\Pulse\Http\Controllers\AbsenceController;
use Functional\Pulse\Http\Controllers\DevOpsNeedController;
use Functional\Pulse\Http\Controllers\WeekInfoController;
use Functional\Pulse\Http\Controllers\RevenueController;
use Functional\Pulse\Http\Controllers\ContractController;
use Lomkit\Rest\Facades\Rest;

Rest::resource('users', UserController::class);
Rest::resource('posts', PostController::class);
Rest::resource('cartItems', CartItemController::class);
Rest::resource('products', ProductController::class);
Rest::resource('pcProfiles', PcProfileController::class);
Rest::resource('assignments', AssignmentController::class);
Rest::resource('orders', OrderController::class);
Rest::resource('alerts', AlertController::class);

Rest::resource('projects', ProjectController::class);
Rest::resource('deliveries', DeliveryController::class);
Rest::resource('missions', MissionController::class);
Rest::resource('absences', AbsenceController::class);
Rest::resource('devops_needs', DevOpsNeedController::class);
Rest::resource('week_info', WeekInfoController::class);
Rest::resource('revenue', RevenueController::class);
Rest::resource('contracts', ContractController::class);
