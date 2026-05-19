<?php

namespace Functional\Gearup\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrdersSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('orders')->truncate();

        $orders = [
            ['ref' => 'CMD-2025-042', 'type' => 'hardware',   'item' => 'HP ZBook Power G10 (Développeur)',      'quantity' => 5,  'reason' => 'Remplacement parc vieillissant Dev Backend',        'requested_by' => 'Marc Lefebvre', 'status' => 'ordered',   'created_date' => '2025-05-10'],
            ['ref' => 'CMD-2025-041', 'type' => 'hardware',   'item' => 'MacBook Pro 16" M3 Pro (Dev Mobile)',   'quantity' => 2,  'reason' => 'Nouvelles recrues équipe iOS',                       'requested_by' => 'Léa Girard',    'status' => 'approved',  'created_date' => '2025-05-08'],
            ['ref' => 'CMD-2025-040', 'type' => 'parts',      'item' => 'Batterie HP HS04 68Wh',                 'quantity' => 3,  'reason' => 'Stock pièces de remplacement REP-2025-017',          'requested_by' => 'Marc Lefebvre', 'status' => 'pending',   'created_date' => '2025-05-14'],
            ['ref' => 'CMD-2025-039', 'type' => 'hardware',   'item' => 'HP EliteBook 840 G10 (Commercial)',     'quantity' => 4,  'reason' => 'Extension équipe commerciale région Sud',            'requested_by' => 'Léa Girard',    'status' => 'delivered', 'created_date' => '2025-04-22'],
            ['ref' => 'CMD-2025-037', 'type' => 'parts',      'item' => 'Dalle LCD HP EliteBook 14" FHD',        'quantity' => 2,  'reason' => 'Stock pièces REP en cours',                          'requested_by' => 'Clara Henry',   'status' => 'ordered',   'created_date' => '2025-05-01'],
            ['ref' => 'CMD-2025-035', 'type' => 'consumable', 'item' => 'Câbles USB-C Thunderbolt 4 (2m)',        'quantity' => 20, 'reason' => 'Réapprovisionnement parc accessoires',               'requested_by' => 'Nicolas Petit', 'status' => 'delivered', 'created_date' => '2025-04-15'],
            ['ref' => 'CMD-2025-043', 'type' => 'hardware',   'item' => 'Écran Dell U2722D 27" QHD',             'quantity' => 8,  'reason' => 'Équipement nouvelles positions open space Toulouse', 'requested_by' => 'Marc Lefebvre', 'status' => 'pending',   'created_date' => '2025-05-17'],
        ];

        foreach ($orders as $order) {
            DB::table('orders')->insert(array_merge($order, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
