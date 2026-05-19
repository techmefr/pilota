<?php

namespace Functional\Gearup\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlertsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('alerts')->truncate();

        $alerts = [
            ['type' => 'warranty',    'severity' => 'critical', 'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2021-007', 'employee' => 'Hugo Blanc',    'description' => 'Garantie expirée depuis 3 mois',                          'due_date' => '2025-02-15', 'status' => 'active'],
            ['type' => 'warranty',    'severity' => 'critical', 'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2022-015', 'employee' => 'Julie Simon',   'description' => 'Garantie expire dans 12 jours',                           'due_date' => '2025-05-31', 'status' => 'active'],
            ['type' => 'age',         'severity' => 'warning',  'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2021-007', 'employee' => 'Hugo Blanc',    'description' => 'Appareil en service depuis 4 ans · remplacement conseillé','due_date' => '2025-06-15', 'status' => 'active'],
            ['type' => 'age',         'severity' => 'warning',  'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2022-015', 'employee' => 'Julie Simon',   'description' => 'Appareil en service depuis 3 ans · préparer le remplacement','due_date' => '2025-09-01', 'status' => 'active'],
            ['type' => 'performance', 'severity' => 'warning',  'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2023-011', 'employee' => 'Manon Garnier', 'description' => 'Disque dur à 87% de capacité · nettoyage recommandé',     'due_date' => '2025-05-30', 'status' => 'active'],
            ['type' => 'warranty',    'severity' => 'info',     'device' => 'HP ZBook Power G10',   'serial' => 'ZBP-2024-001', 'employee' => 'Lucas Martin',  'description' => 'Garantie expire dans 10 mois',                            'due_date' => '2026-03-15', 'status' => 'active'],
            ['type' => 'security',    'severity' => 'critical', 'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2021-007', 'employee' => 'Hugo Blanc',    'description' => 'Dernière mise à jour sécurité : 142 jours',               'due_date' => '2025-05-19', 'status' => 'active'],
            ['type' => 'age',         'severity' => 'info',     'device' => 'HP EliteBook 840 G10', 'serial' => 'EBK-2023-011', 'employee' => 'Manon Garnier', 'description' => 'Appareil en service depuis 2 ans',                        'due_date' => '2026-04-01', 'status' => 'acknowledged'],
        ];

        foreach ($alerts as $alert) {
            DB::table('alerts')->insert(array_merge($alert, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
