<?php

namespace Functional\Pulse\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PulseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedProjects();
        $this->seedDeliveries();
        $this->seedMissions();
        $this->seedAbsences();
        $this->seedDevOpsNeeds();
        $this->seedWeekInfo();
        $this->seedRevenue();
        $this->seedContracts();
    }

    private function seedProjects(): void
    {
        DB::table('projects')->truncate();
        DB::table('projects')->insert([
            ['name' => 'Gearup',   'status' => 'ok',       'open_bugs' => 0,  'deployments' => json_encode(['1.4.2']),          'team' => 'Gaetan, Alice',  'url' => 'http://localhost:3003', 'sentry_issues' => 1,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Vota',     'status' => 'ok',       'open_bugs' => 2,  'deployments' => json_encode(['0.9.1']),          'team' => 'Alice, Bob',     'url' => 'http://localhost:3002', 'sentry_issues' => 3,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Shoplab',  'status' => 'ok',       'open_bugs' => 1,  'deployments' => json_encode(['2.1.0']),          'team' => 'Bob, Clara',     'url' => 'http://localhost:3010', 'sentry_issues' => 2,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Grosdata', 'status' => 'warning',  'open_bugs' => 8,  'deployments' => json_encode(['3.4.0', '3.3.9']), 'team' => 'Gaetan, Clara',  'url' => null,                    'sentry_issues' => 12, 'sentry_criticals' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nexeren',  'status' => 'ok',       'open_bugs' => 0,  'deployments' => json_encode(['1.1.0']),          'team' => 'Alice, Damien',  'url' => null,                    'sentry_issues' => 0,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Skera',    'status' => 'critical', 'open_bugs' => 14, 'deployments' => json_encode(['0.4.3']),          'team' => 'Bob',            'url' => null,                    'sentry_issues' => 27, 'sentry_criticals' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nota',     'status' => 'ok',       'open_bugs' => 3,  'deployments' => json_encode(['1.2.1']),          'team' => 'Clara, Gaetan',  'url' => null,                    'sentry_issues' => 4,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Horizon',  'status' => 'warning',  'open_bugs' => 6,  'deployments' => json_encode(['2.0.0-rc1']),      'team' => 'Damien, Alice',  'url' => null,                    'sentry_issues' => 8,  'sentry_criticals' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Aelios',   'status' => 'ok',       'open_bugs' => 1,  'deployments' => json_encode(['0.3.0']),          'team' => 'Gaetan',         'url' => null,                    'sentry_issues' => 1,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Verano',   'status' => 'ok',       'open_bugs' => 0,  'deployments' => json_encode(['1.0.2']),          'team' => 'Clara, Bob',     'url' => null,                    'sentry_issues' => 0,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Krato',    'status' => 'warning',  'open_bugs' => 5,  'deployments' => json_encode(['0.2.1']),          'team' => 'Damien',         'url' => null,                    'sentry_issues' => 7,  'sentry_criticals' => 0, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function seedDeliveries(): void
    {
        DB::table('deliveries')->truncate();
        DB::table('deliveries')->insert([
            ['project' => 'Gearup',   'version' => 'v1.4.2',     'date' => '2026-05-22', 'tickets_resolved' => 8,  'tickets_total' => 10, 'notes' => 'Refonte configurateur profils, correction bug stock',            'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Vota',     'version' => 'v0.9.1',     'date' => '2026-05-21', 'tickets_resolved' => 5,  'tickets_total' => 6,  'notes' => 'Export Jira ajouté, fix synchronisation vote',                   'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Shoplab',  'version' => 'v2.1.0',     'date' => '2026-05-20', 'tickets_resolved' => 12, 'tickets_total' => 15, 'notes' => 'Driver Supabase Realtime stable, SEO optimisé',                  'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Nota',     'version' => 'v1.2.1',     'date' => '2026-05-19', 'tickets_resolved' => 4,  'tickets_total' => 4,  'notes' => null,                                                              'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Grosdata', 'version' => 'v3.4.0',     'date' => '2026-05-15', 'tickets_resolved' => 6,  'tickets_total' => 12, 'notes' => 'Migration Postgres 16 partielle, 6 tickets reportés en backlog', 'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Nexeren',  'version' => 'v1.1.0',     'date' => '2026-05-14', 'tickets_resolved' => 10, 'tickets_total' => 10, 'notes' => 'Release complète, NPS client 9.2/10',                            'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Aelios',   'version' => 'v0.3.0',     'date' => '2026-05-08', 'tickets_resolved' => 3,  'tickets_total' => 5,  'notes' => 'MVP phase 1, 2 tickets décalés au sprint suivant',               'created_at' => now(), 'updated_at' => now()],
            ['project' => 'Verano',   'version' => 'v1.0.2',     'date' => '2026-05-05', 'tickets_resolved' => 2,  'tickets_total' => 2,  'notes' => 'Hotfix performances dashboard',                                  'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function seedMissions(): void
    {
        DB::table('missions')->truncate();
        DB::table('missions')->insert([
            ['title' => 'Renouveler certificats SSL Skera',       'status' => 'todo',        'category' => 'compliance',         'owner' => 'Damien', 'due_date' => '2026-05-30', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Migrer Grosdata vers Postgres 16',       'status' => 'todo',        'category' => 'compliance',         'owner' => 'Gaetan', 'due_date' => '2026-06-15', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Implémenter OAuth2 sur Horizon',         'status' => 'todo',        'category' => 'features',           'owner' => 'Alice',  'due_date' => '2026-06-01', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Rotation secrets Vault',                 'status' => 'todo',        'category' => 'compliance',         'owner' => 'Gaetan', 'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Pipeline CI/CD Krato',                   'status' => 'todo',        'category' => 'project_management', 'owner' => 'Damien', 'due_date' => '2026-06-10', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Audit RGPD complet',                     'status' => 'in_progress', 'category' => 'compliance',         'owner' => 'Gaetan', 'due_date' => '2026-05-31', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Monitoring K8s Prometheus/Grafana',      'status' => 'in_progress', 'category' => 'project_management', 'owner' => 'Damien', 'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Formation OPCO devs juniors',            'status' => 'in_progress', 'category' => 'opco',               'owner' => 'Clara',  'due_date' => '2026-05-28', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Refactoriser API Skera v2',              'status' => 'in_progress', 'category' => 'features',           'owner' => 'Bob',    'due_date' => '2026-06-08', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Intégration Tolgee sur Pulse',           'status' => 'in_progress', 'category' => 'features',           'owner' => 'Alice',  'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Déployer Krato en prod',                 'status' => 'blocked',     'category' => 'project_management', 'owner' => 'Damien', 'due_date' => '2026-05-25', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Dossier OPCO incomplet — relance RH',   'status' => 'blocked',     'category' => 'opco',               'owner' => 'Clara',  'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Mise à jour Laravel 11.x tous projets', 'status' => 'done',        'category' => 'compliance',         'owner' => 'Bob',    'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Sprint review Gearup v1.4',             'status' => 'done',        'category' => 'project_management', 'owner' => 'Gaetan', 'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Documentation API Pilota SDK',          'status' => 'done',        'category' => 'features',           'owner' => 'Alice',  'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Onboarding Verano v1.0',                'status' => 'done',        'category' => 'project_management', 'owner' => 'Clara',  'due_date' => null,         'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function seedAbsences(): void
    {
        DB::table('absences')->truncate();
        DB::table('absences')->insert([
            ['person' => 'Alice',  'days' => json_encode(['lun', 'mar']), 'reason' => 'teletravail', 'note' => 'Télétravail domicile',      'created_at' => now(), 'updated_at' => now()],
            ['person' => 'Bob',    'days' => json_encode(['jeu', 'ven']), 'reason' => 'conge',       'note' => 'RTT posé',                  'created_at' => now(), 'updated_at' => now()],
            ['person' => 'Damien', 'days' => json_encode(['mer']),        'reason' => 'formation',   'note' => 'Formation Kubernetes',       'created_at' => now(), 'updated_at' => now()],
            ['person' => 'Clara',  'days' => json_encode(['lun']),        'reason' => 'client',      'note' => 'Réunion client Nexeren',    'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function seedDevOpsNeeds(): void
    {
        DB::table('devops_needs')->truncate();
        DB::table('devops_needs')->insert([
            ['title' => 'SSL Let\'s Encrypt auto-renew Skera',  'priority' => 'critical', 'status' => 'todo',        'owner' => 'Damien', 'project' => 'Skera',   'notes' => 'Certificat expire le 30/05',      'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Backup automatique Postgres quotidien', 'priority' => 'critical', 'status' => 'in_progress', 'owner' => 'Damien', 'project' => null,      'notes' => 'Skera prioritaire',               'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Configurer alerting PagerDuty',         'priority' => 'high',     'status' => 'in_progress', 'owner' => 'Damien', 'project' => null,      'notes' => null,                              'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Rotation des secrets Vault',            'priority' => 'high',     'status' => 'todo',        'owner' => 'Gaetan', 'project' => null,      'notes' => null,                              'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Upgrade Docker Compose v3 → v4',       'priority' => 'medium',   'status' => 'todo',        'owner' => 'Damien', 'project' => null,      'notes' => null,                              'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Pipeline CI/CD Krato',                  'priority' => 'medium',   'status' => 'todo',        'owner' => 'Damien', 'project' => 'Krato',  'notes' => null,                              'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Monitoring temps réel Supabase',        'priority' => 'low',      'status' => 'done',        'owner' => 'Damien', 'project' => 'Shoplab', 'notes' => null,                              'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Scaling Nhost Hasura',                  'priority' => 'low',      'status' => 'done',        'owner' => 'Damien', 'project' => 'Vota',   'notes' => null,                              'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function seedWeekInfo(): void
    {
        DB::table('week_infos')->truncate();
        $week = (int) date('W');
        DB::table('week_infos')->insert([
            ['type' => 'event',   'title' => 'Sprint Review Gearup v1.4',       'detail' => 'Revue de sprint avec le client — 45 min',       'date' => date('Y-m-d', strtotime('last thursday')), 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'devtalk', 'title' => 'Architecture CQRS microservices', 'detail' => 'Présenté par Gaetan — 30 min + Q&A',             'date' => date('Y-m-d', strtotime('last wednesday')), 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'score',   'title' => "Vélocité S{$week}: 42 pts",       'detail' => 'Best sprint de l\'année, +18% vs moyenne',       'date' => null,                                       'created_at' => now(), 'updated_at' => now()],
            ['type' => 'news',    'title' => 'Onboarding nouveau dev frontend',  'detail' => 'Arrivée de Lucas lundi prochain — stack Nuxt 4', 'date' => null,                                       'created_at' => now(), 'updated_at' => now()],
            ['type' => 'event',   'title' => 'Réunion direction Q2 review',      'detail' => 'Bilan OKR Q2 — présence obligatoire',            'date' => date('Y-m-d', strtotime('friday')),         'created_at' => now(), 'updated_at' => now()],
            ['type' => 'news',    'title' => 'Pilota SDK v0.4 released',         'detail' => 'Support subscriptions WebSocket Nhost/Supabase', 'date' => null,                                       'created_at' => now(), 'updated_at' => now()],
            ['type' => 'score',   'title' => 'NPS client Nexeren: 9.2/10',       'detail' => 'Record équipe, v1.1.0 très bien reçue',          'date' => null,                                       'created_at' => now(), 'updated_at' => now()],
            ['type' => 'devtalk', 'title' => 'Testing E2E avec Playwright',      'detail' => 'Présenté par Alice — 45 min atelier pratique',   'date' => date('Y-m-d', strtotime('next tuesday')),   'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function seedRevenue(): void
    {
        DB::table('revenues')->truncate();
        DB::table('revenues')->insert([
            [
                'period'        => date('F Y'),
                'amount'        => 48500,
                'target'        => 65000,
                'annual_cumul'  => 247800,
                'annual_target' => 780000,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }

    private function seedContracts(): void
    {
        DB::table('contracts')->truncate();
        DB::table('contracts')->insert([
            ['type' => 'franchise', 'count' => 7,  'target' => 12, 'value_k' => 340, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'propre',    'count' => 3,  'target' => 5,  'value_k' => 126, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
