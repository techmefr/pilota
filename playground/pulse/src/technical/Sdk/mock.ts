import type { Project, Objective, Delivery, Mission, Absence, DevOpsNeed, WeekInfo, Revenue, Contract } from './resources'

function _cw(): { week: number; year: number } {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return { week, year: d.getFullYear() }
}

const CW = _cw()
const PW = {
    week: CW.week === 1 ? 52 : CW.week - 1,
    year: CW.week === 1 ? CW.year - 1 : CW.year,
}

function _wd(dayOffset: number): string {
    const d = new Date()
    const dow = d.getDay() || 7
    d.setDate(d.getDate() - dow + 1 + dayOffset)
    return d.toISOString().split('T')[0]
}

export const mockProjects: Project[] = [
    {
        id: 1,
        name: 'Gearup',
        status: 'ok',
        open_bugs: 0,
        deployments: ['v1.0.0 — en prod'],
        team: 'Frontend',
        url: 'http://localhost:3003',
        sentry_issues: 2,
        sentry_criticals: 0,
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        name: 'Vota',
        status: 'ok',
        open_bugs: 1,
        deployments: ['v1.0.0 — en prod'],
        team: 'Frontend',
        url: 'http://localhost:3002',
        sentry_issues: 0,
        sentry_criticals: 0,
        updated_at: new Date().toISOString(),
    },
    {
        id: 3,
        name: 'Shoplab',
        status: 'warning',
        open_bugs: 3,
        deployments: ['v1.0.0 — en prod'],
        team: 'Frontend',
        url: 'http://localhost:3010',
        sentry_issues: 7,
        sentry_criticals: 0,
        updated_at: new Date().toISOString(),
    },
    {
        id: 4,
        name: 'Grosdata',
        status: 'warning',
        open_bugs: 4,
        deployments: ['v2.4.1 — jeudi'],
        team: 'Backend',
        url: null,
        sentry_issues: 14,
        sentry_criticals: 1,
        updated_at: new Date().toISOString(),
    },
    {
        id: 5,
        name: 'Nexeren',
        status: 'ok',
        open_bugs: 0,
        deployments: [],
        team: 'Fullstack',
        url: null,
        sentry_issues: 3,
        sentry_criticals: 0,
        updated_at: new Date().toISOString(),
    },
    {
        id: 6,
        name: 'Skera',
        status: 'critical',
        open_bugs: 9,
        deployments: ['v1.9.0 — ce soir'],
        team: 'Fullstack',
        url: null,
        sentry_issues: 41,
        sentry_criticals: 3,
        updated_at: new Date().toISOString(),
    },
    {
        id: 7,
        name: 'Nota',
        status: 'ok',
        open_bugs: 1,
        deployments: ['v3.2.0'],
        team: 'Mobile',
        url: null,
        sentry_issues: 5,
        sentry_criticals: 0,
        updated_at: new Date().toISOString(),
    },
    {
        id: 8,
        name: 'Horizon',
        status: 'inactive',
        open_bugs: 0,
        deployments: [],
        team: 'Backend',
        url: null,
        sentry_issues: 0,
        sentry_criticals: 0,
        updated_at: new Date().toISOString(),
    },
]

export const mockObjectives: Objective[] = [
    {
        id: 1,
        person: 'Gaetan',
        avatar: null,
        week: CW.week,
        year: CW.year,
        focus: 'Finaliser le dashboard Pulse — sections complètes avec vraies données',
        blockers: ['API Laravel en attente de déploiement'],
        wins: ['OSDD validé sur Gearup', 'Sentry intégré sur 4 frontends', 'Pilota SDK v1 stable'],
    },
    {
        id: 2,
        person: 'Alice',
        avatar: null,
        week: CW.week,
        year: CW.year,
        focus: 'Refonte module commandes Grosdata — migration v2.4',
        blockers: [],
        wins: ['Migration BDD terminée sans downtime', 'Tests de charge OK'],
    },
    {
        id: 3,
        person: 'Bob',
        avatar: null,
        week: CW.week,
        year: CW.year,
        focus: 'Audit sécurité Nexeren — livrables ANSSI',
        blockers: ['Accès prod en attente validation DSI'],
        wins: [],
    },
    {
        id: 4,
        person: 'Clara',
        avatar: null,
        week: CW.week,
        year: CW.year,
        focus: 'Hotfix Skera v1.9.0 — résoudre les 3 critiques Sentry',
        blockers: ['Reproduction du bug en local impossible'],
        wins: ['2 critiques sur 3 résolus'],
    },
    {
        id: 5,
        person: 'Damien',
        avatar: null,
        week: CW.week,
        year: CW.year,
        focus: 'Formation React avancé — OPCO',
        blockers: [],
        wins: ['Module hooks terminé', 'Exercices pratiques validés'],
    },
    {
        id: 6,
        person: 'Gaetan',
        avatar: null,
        week: PW.week,
        year: PW.year,
        focus: 'OSDD compliance Gearup + intégration Sentry sur tous les frontends',
        blockers: [],
        wins: ['Structure OSDD validée', 'Widget Sentry déployé (4 frontends)', 'README mis à jour'],
    },
    {
        id: 7,
        person: 'Alice',
        avatar: null,
        week: PW.week,
        year: PW.year,
        focus: 'Migration base de données Grosdata — préparation v2.4',
        blockers: ['Downtime prévu — coordination DevOps nécessaire'],
        wins: ['Script de migration rédigé et reviewé'],
    },
    {
        id: 8,
        person: 'Bob',
        avatar: null,
        week: PW.week,
        year: PW.year,
        focus: 'Mise à jour dépendances Nexeren — patch sécurité',
        blockers: [],
        wins: ['0 breaking change', 'Tests e2e au vert'],
    },
    {
        id: 9,
        person: 'Clara',
        avatar: null,
        week: PW.week,
        year: PW.year,
        focus: 'Skera — analyse des anomalies de perf signalées par le client',
        blockers: [],
        wins: ['Root cause identifiée : requête N+1 sur /dashboard'],
    },
    {
        id: 10,
        person: 'Damien',
        avatar: null,
        week: PW.week,
        year: PW.year,
        focus: 'Setup CI/CD Nota — pipeline de déploiement automatique',
        blockers: [],
        wins: ['Pipeline opérationnel en staging', 'Déploiement prod en 4 min'],
    },
]

export const mockDeliveries: Delivery[] = [
    {
        id: 1,
        project: 'Grosdata',
        version: 'v2.4.1',
        date: _wd(3),
        tickets_resolved: 8,
        tickets_total: 11,
        notes: 'Refonte module rapports + correctif export CSV',
    },
    {
        id: 2,
        project: 'Nota',
        version: 'v3.2.0',
        date: _wd(1),
        tickets_resolved: 12,
        tickets_total: 12,
        notes: null,
    },
    {
        id: 3,
        project: 'Skera',
        version: 'v1.9.0',
        date: _wd(0),
        tickets_resolved: 3,
        tickets_total: 9,
        notes: "Hotfix critique — déploiement d'urgence (3 issues Sentry critiques)",
    },
    {
        id: 4,
        project: 'Pilota POC',
        version: 'v1.0.0',
        date: _wd(0),
        tickets_resolved: 16,
        tickets_total: 16,
        notes: 'SDK unifié + 4 frontends (Shoplab, Vota, Gearup, Pulse) + Sentry self-hosted',
    },
    {
        id: 5,
        project: 'Nexeren',
        version: 'v4.1.2',
        date: _wd(-1),
        tickets_resolved: 5,
        tickets_total: 5,
        notes: 'Patch sécurité + mise à jour dépendances',
    },
]

export const mockMissions: Mission[] = [
    { id: 1,  title: 'Formation OPCO React avancé — Damien',        status: 'in_progress', category: 'opco',               owner: 'Damien', due_date: _wd(11)  },
    { id: 2,  title: 'Formation OPCO TypeScript — Alice',           status: 'todo',        category: 'opco',               owner: 'Alice',  due_date: _wd(25)  },
    { id: 3,  title: 'Formation OPCO Vue.js 3 — Bob',               status: 'todo',        category: 'opco',               owner: 'Bob',    due_date: _wd(32)  },
    { id: 4,  title: 'Audit RGPD Grosdata — livrables DPO',         status: 'in_progress', category: 'compliance',         owner: 'Bob',    due_date: _wd(9)   },
    { id: 5,  title: 'Mise en conformité cookies Skera',            status: 'todo',        category: 'compliance',         owner: 'Clara',  due_date: _wd(20)  },
    { id: 6,  title: 'Mentions légales Horizon v2',                 status: 'todo',        category: 'compliance',         owner: null,     due_date: null      },
    { id: 7,  title: 'Chefferie Skera v2 — roadmap Q3',             status: 'in_progress', category: 'project_management', owner: 'Gaetan', due_date: null      },
    { id: 8,  title: 'Chefferie Grosdata — suivi client',           status: 'in_progress', category: 'project_management', owner: 'Alice',  due_date: null      },
    { id: 9,  title: 'Chefferie Horizon v2 — cadrage initial',      status: 'todo',        category: 'project_management', owner: 'Gaetan', due_date: _wd(18)  },
    { id: 10, title: 'Module export CSV Grosdata',                  status: 'done',        category: 'features',           owner: 'Alice',  due_date: _wd(-5)  },
    { id: 11, title: 'SSO interne — Keycloak',                      status: 'blocked',     category: 'features',           owner: null,     due_date: null      },
    { id: 12, title: 'Dashboard Pulse — v1',                        status: 'in_progress', category: 'features',           owner: 'Gaetan', due_date: _wd(11)  },
    { id: 13, title: 'API unifiée Pilota SDK',                      status: 'done',        category: 'features',           owner: 'Gaetan', due_date: _wd(0)   },
    { id: 14, title: 'Notifications push Nota',                     status: 'todo',        category: 'features',           owner: 'Damien', due_date: _wd(25)  },
]

export const mockAbsences: Absence[] = [
    { id: 1, person: 'Bob',    days: ['lun', 'mar'],                          reason: 'client',      note: 'Déplacement chez Nexeren (Lyon)' },
    { id: 2, person: 'Clara',  days: ['mer'],                                 reason: 'teletravail', note: null },
    { id: 3, person: 'Damien', days: ['lun', 'mar', 'mer', 'jeu', 'ven'],     reason: 'formation',   note: 'OPCO React — Paris' },
    { id: 4, person: 'Alice',  days: ['ven'],                                 reason: 'conge',       note: null },
]

export const mockDevOpsNeeds: DevOpsNeed[] = [
    { id: 1, title: 'Renouvellement cert SSL Skera',                    priority: 'critical', status: 'in_progress', owner: 'DevOps',  project: 'Skera',      notes: `Expire le ${_wd(7)} — action urgente` },
    { id: 2, title: 'Upgrade PostgreSQL 15 → 16 (Grosdata)',            priority: 'high',     status: 'todo',        owner: 'Damien',  project: 'Grosdata',   notes: `Prévu fenêtre maintenance samedi ${_wd(5)}` },
    { id: 3, title: 'Monitoring alerting Nota prod',                    priority: 'medium',   status: 'in_progress', owner: 'Damien',  project: 'Nota',       notes: 'Grafana + Alertmanager configurés, tests en cours' },
    { id: 4, title: 'Backup vérification mensuelle',                    priority: 'low',      status: 'done',        owner: 'DevOps',  project: null,         notes: 'Tous les projets vérifiés OK' },
    { id: 5, title: 'Sentry self-hosted — config production',           priority: 'medium',   status: 'todo',        owner: 'Gaetan',  project: 'Pilota POC', notes: 'Installer getsentry/self-hosted sur le serveur XEFI' },
    { id: 6, title: 'CI/CD Pilota SDK — publication packages',          priority: 'medium',   status: 'todo',        owner: 'Gaetan',  project: 'Pilota POC', notes: 'Pipeline pnpm publish → npm registry interne' },
    { id: 7, title: 'Migration serveur Shoplab vers Hetzner',           priority: 'high',     status: 'todo',        owner: null,      project: 'Shoplab',    notes: 'Contrat OVH expire fin de mois' },
    { id: 8, title: 'Redis cache Nexeren — optimisation perf',          priority: 'low',      status: 'todo',        owner: 'Bob',     project: 'Nexeren',    notes: 'Temps de réponse API > 800ms sur /search' },
]

export const mockWeekInfos: WeekInfo[] = [
    { id: 1, type: 'event',   title: 'Réunion équipe hebdo',                          detail: 'Mercredi 9h00 — présentiel + visio',                                                    date: _wd(2) },
    { id: 2, type: 'devtalk', title: "DevTalk — Pilota SDK : retour d'expérience",    detail: 'Gaetan présente l\'architecture driver-based et les apprentissages du POC',             date: _wd(1) },
    { id: 3, type: 'event',   title: 'Demo Skera v1.9 chez le client',                detail: 'Vendredi 14h00 — Clara + équipe client',                                                date: _wd(4) },
    { id: 4, type: 'event',   title: 'Point chefferie Horizon v2',                    detail: 'Lundi 11h00 — cadrage initial avec le client',                                          date: _wd(0) },
    { id: 5, type: 'score',   title: 'Satisfaction client Nota',                      detail: '4.8/5 — meilleur score du trimestre',                                                   date: null   },
    { id: 6, type: 'score',   title: `Vélocité équipe S${CW.week}`,                   detail: `43 points — +12% vs S${PW.week}`,                                                       date: null   },
    { id: 7, type: 'news',    title: 'Nouveau contrat signé — Horizon v2',            detail: 'Reprise du projet Horizon, démarrage Q3',                                               date: null   },
    { id: 8, type: 'news',    title: 'Skera : escalade client niveau 2',              detail: '3 critiques Sentry non résolus — réunion de crise jeudi avec le compte',                date: null   },
]

export const mockRevenue: Revenue = {
    id: 1,
    period: 'Mai 2026',
    amount: 87400,
    target: 95000,
    annual_cumul: 412600,
    annual_target: 550000,
}

export const mockContracts: Contract[] = [
    { id: 1, type: 'franchise', count: 8,  target: 10, value_k: 340 },
    { id: 2, type: 'propre',    count: 5,  target: 8,  value_k: 215 },
]
