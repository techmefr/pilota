<?php

namespace Database\Seeders;

use Functional\Gearup\Database\Seeders\AlertsSeeder;
use Functional\Gearup\Database\Seeders\AssignmentsSeeder;
use Functional\Gearup\Database\Seeders\GearupSeeder;
use Functional\Gearup\Database\Seeders\OrdersSeeder;
use Functional\Products\Database\Seeders\ProductsSeeder;
use Functional\Users\Database\Seeders\UsersSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            ProductsSeeder::class,
            GearupSeeder::class,
            AssignmentsSeeder::class,
            OrdersSeeder::class,
            AlertsSeeder::class,
        ]);
    }
}
