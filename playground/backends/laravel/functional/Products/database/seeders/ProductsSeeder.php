<?php

namespace Functional\Products\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::table('products')->truncate();

        $products = [
            ['name' => 'MacBook Pro 14"', 'description' => 'Apple M3 Pro, 18GB RAM', 'price' => 2199.00, 'image' => '', 'category' => 'Laptops', 'stock' => 12],
            ['name' => 'Dell XPS 15', 'description' => 'Intel Core i9, 32GB RAM', 'price' => 1899.00, 'image' => '', 'category' => 'Laptops', 'stock' => 8],
            ['name' => 'iPhone 16 Pro', 'description' => '256GB, Titanium', 'price' => 1299.00, 'image' => '', 'category' => 'Phones', 'stock' => 25],
            ['name' => 'Samsung S25 Ultra', 'description' => '512GB, Phantom Black', 'price' => 1349.00, 'image' => '', 'category' => 'Phones', 'stock' => 18],
            ['name' => 'Sony WH-1000XM5', 'description' => 'Noise cancelling, 30h battery', 'price' => 349.00, 'image' => '', 'category' => 'Audio', 'stock' => 42],
            ['name' => 'AirPods Pro 2', 'description' => 'Active noise cancellation', 'price' => 279.00, 'image' => '', 'category' => 'Audio', 'stock' => 0],
            ['name' => 'iPad Pro 13"', 'description' => 'M4 chip, 256GB', 'price' => 1299.00, 'image' => '', 'category' => 'Tablets', 'stock' => 15],
            ['name' => 'Logitech MX Master 3S', 'description' => 'Ergonomic wireless mouse', 'price' => 99.00, 'image' => '', 'category' => 'Accessories', 'stock' => 67],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert(array_merge($product, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
