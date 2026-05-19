<?php

namespace Functional\Gearup\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignmentsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('assignments')->truncate();

        $assignments = [
            ['employee' => 'Lucas Martin',   'email' => 'l.martin@xefi.fr',   'team' => 'Dev Backend',    'department' => 'Technique', 'model' => 'HP ZBook Power G10',     'serial' => 'ZBP-2024-001', 'assigned_at' => '2024-03-15', 'status' => 'active'],
            ['employee' => 'Camille Dubois',  'email' => 'c.dubois@xefi.fr',   'team' => 'Dev Frontend',   'department' => 'Technique', 'model' => 'HP ZBook Power G10',     'serial' => 'ZBP-2024-002', 'assigned_at' => '2024-03-15', 'status' => 'active'],
            ['employee' => 'Thomas Bernard',  'email' => 't.bernard@xefi.fr',  'team' => 'Mobile iOS',     'department' => 'Technique', 'model' => 'MacBook Pro 16" M3 Pro', 'serial' => 'MBP-2024-001', 'assigned_at' => '2024-04-01', 'status' => 'active'],
            ['employee' => 'Sophie Laurent',  'email' => 's.laurent@xefi.fr',  'team' => 'UX/UI',          'department' => 'Technique', 'model' => 'MacBook Pro 14" M3',     'serial' => 'MBP-2024-002', 'assigned_at' => '2024-04-01', 'status' => 'active'],
            ['employee' => 'Nicolas Petit',   'email' => 'n.petit@xefi.fr',    'team' => 'Support N1',     'department' => 'Technique', 'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2024-001', 'assigned_at' => '2024-02-10', 'status' => 'repair'],
            ['employee' => 'Emma Rousseau',   'email' => 'e.rousseau@xefi.fr', 'team' => 'Commercial Est', 'department' => 'Commerce',  'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2024-002', 'assigned_at' => '2024-01-20', 'status' => 'active'],
            ['employee' => 'Antoine Moreau',  'email' => 'a.moreau@xefi.fr',   'team' => 'Commercial Sud', 'department' => 'Commerce',  'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2024-003', 'assigned_at' => '2024-01-20', 'status' => 'active'],
            ['employee' => 'Julie Simon',     'email' => 'j.simon@xefi.fr',    'team' => 'Gestion',        'department' => 'Finance',   'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2022-015', 'assigned_at' => '2022-09-01', 'status' => 'active'],
            ['employee' => 'Marc Lefebvre',   'email' => 'm.lefebvre@xefi.fr', 'team' => 'Infra',          'department' => 'Technique', 'model' => 'HP ZBook Fury G10',      'serial' => 'ZBF-2024-001', 'assigned_at' => '2024-05-10', 'status' => 'active'],
            ['employee' => 'Léa Girard',      'email' => 'l.girard@xefi.fr',   'team' => 'PMO',            'department' => 'Direction', 'model' => 'HP EliteBook 1040 G10',  'serial' => 'EBM-2024-001', 'assigned_at' => '2024-03-01', 'status' => 'active'],
            ['employee' => 'Pierre Bonnet',   'email' => 'p.bonnet@xefi.fr',   'team' => 'Dev Backend',    'department' => 'Technique', 'model' => 'HP ZBook Power G10',     'serial' => 'ZBP-2024-003', 'assigned_at' => '2024-03-15', 'status' => 'active'],
            ['employee' => 'Clara Henry',     'email' => 'c.henry@xefi.fr',    'team' => 'Support N2',     'department' => 'Technique', 'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2024-004', 'assigned_at' => '2024-02-10', 'status' => 'active'],
            ['employee' => 'Hugo Blanc',      'email' => 'h.blanc@xefi.fr',    'team' => 'Commercial Nord','department' => 'Commerce',  'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2021-007', 'assigned_at' => '2021-06-15', 'status' => 'active'],
            ['employee' => 'Manon Garnier',   'email' => 'm.garnier@xefi.fr',  'team' => 'Finance',        'department' => 'Finance',   'model' => 'HP EliteBook 840 G10',   'serial' => 'EBK-2023-011', 'assigned_at' => '2023-04-01', 'status' => 'active'],
            ['employee' => 'Kevin Faure',     'email' => 'k.faure@xefi.fr',    'team' => 'Mobile iOS',     'department' => 'Technique', 'model' => 'MacBook Pro 16" M3 Pro', 'serial' => 'MBP-2024-003', 'assigned_at' => '2024-04-01', 'status' => 'returned'],
        ];

        foreach ($assignments as $assignment) {
            DB::table('assignments')->insert(array_merge($assignment, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
