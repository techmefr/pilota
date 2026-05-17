<?php

namespace Functional\Gearup\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GearupSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pc_profiles')->truncate();

        $z2 = [
            'model_tier' => 'performance',
            'model_name' => 'HP Z2 Tower G9',
            'cpu'        => 'Intel Core i7-13700K',
            'ram'        => '32 Go DDR5',
            'storage'    => 'SSD 512 Go NVMe',
            'gpu'        => 'NVIDIA RTX A2000',
        ];

        $elite = [
            'model_tier' => 'standard',
            'model_name' => 'HP EliteDesk 800 G9',
            'cpu'        => 'Intel Core i5-13500',
            'ram'        => '16 Go DDR5',
            'storage'    => 'SSD 256 Go NVMe',
            'gpu'        => 'Intel UHD 770',
        ];

        $profiles = [
            array_merge($z2,    ['role' => 'Développeur',    'screens' => 3, 'screen_spec' => '3 × 27" QHD', 'profile_ram' => '32 Go', 'total' => 15, 'stock' => 10]),
            array_merge($z2,    ['role' => 'Chef de projet', 'screens' => 2, 'screen_spec' => '2 × 27" QHD', 'profile_ram' => '32 Go', 'total' => 8,  'stock' => 6]),
            array_merge($elite, ['role' => 'Commercial',     'screens' => 2, 'screen_spec' => '2 × 24" FHD', 'profile_ram' => '16 Go', 'total' => 25, 'stock' => 18]),
            array_merge($elite, ['role' => 'Manager',        'screens' => 2, 'screen_spec' => '2 × 24" FHD', 'profile_ram' => '16 Go', 'total' => 10, 'stock' => 9]),
            array_merge($elite, ['role' => 'Technicien',     'screens' => 1, 'screen_spec' => '1 × 24" FHD', 'profile_ram' => '16 Go', 'total' => 12, 'stock' => 12]),
        ];

        foreach ($profiles as $profile) {
            DB::table('pc_profiles')->insert(array_merge($profile, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
