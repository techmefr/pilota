<?php

namespace Database\Seeders;

use Functional\Gearup\Database\Seeders\GearupSeeder;
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
        ]);
    }
}
