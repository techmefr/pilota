<?php

namespace Functional\Pulse\Http\Controllers;

use Functional\Pulse\Rest\ContractResource;
use Lomkit\Rest\Http\Controllers\Controller;

class ContractController extends Controller
{
    public static $resource = ContractResource::class;
}
