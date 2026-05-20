# Gearup — Tasks

## Backend Laravel (OSDD)

- [ ] `functional/Assignments/` — migration
- [ ] `functional/Assignments/` — seeder (15 records)
- [ ] `functional/Assignments/` — Model
- [ ] `functional/Assignments/` — Rest Resource
- [ ] `functional/Assignments/` — Controller
- [ ] `functional/Orders/` — migration
- [ ] `functional/Orders/` — seeder (7 records)
- [ ] `functional/Orders/` — Model
- [ ] `functional/Orders/` — Rest Resource
- [ ] `functional/Orders/` — Controller
- [ ] `functional/Alerts/` — migration
- [ ] `functional/Alerts/` — seeder (8 records)
- [ ] `functional/Alerts/` — Model
- [ ] `functional/Alerts/` — Rest Resource
- [ ] `functional/Alerts/` — Controller
- [ ] `routes/api.php` — ajouter assignments, orders, alerts
- [ ] `DatabaseSeeder.php` — ajouter les 3 nouveaux seeders
- [ ] `setup-autoload.php` — ajouter les 3 nouveaux namespaces

## Gearup SDK (OSDD — technical/Sdk/)

- [ ] `resources.ts` — convertir Assignment, Order, Alert en defineResource + zod
- [ ] `index.ts` — binder et typer les 3 nouvelles ressources

## Gearup Functional (OSDD — functional/Gearup/)

- [ ] `fetchInventory.ts` — utiliser sdk.lomkit.assignments.get() + fallback mock
- [ ] `fetchOrders.ts` — utiliser sdk.lomkit.orders.get() + fallback mock
- [ ] `fetchAlerts.ts` — utiliser sdk.lomkit.alerts.get() + fallback mock
- [ ] `fetchRepairs.ts` — reste mock (décision utilisateur)

## Tests Vitest

- [ ] `vitest.config.ts` — config
- [ ] `package.json` — ajouter vitest en devDependencies
- [ ] `src/functional/Gearup/fetchPcProfiles.test.ts`
- [ ] `src/functional/Gearup/fetchInventory.test.ts`
- [ ] `src/functional/Gearup/fetchOrders.test.ts`
- [ ] `src/functional/Gearup/fetchAlerts.test.ts`
- [ ] `src/functional/Gearup/fetchRepairs.test.ts`

## Fix pages Firefox

- [ ] Vérifier build / dev server
- [ ] Identifier pourquoi les pages ne s'affichent pas

---

## Sentry self-hosted — Setup

- [ ] `git clone https://github.com/getsentry/self-hosted` + `./install.sh`
- [ ] Créer 4 projets Sentry (Gearup, Pulse, Vota, Shoplab)
- [ ] Récupérer les 4 DSNs et les ajouter dans `.env` à la racine
- [ ] Créer un **Auth Token** Sentry (Settings → Auth Tokens) pour l'API Pulse
- [ ] Rebuild containers (`make down && make up`) et vérifier le widget feedback sur chaque app

## Pulse — Dashboard hebdomadaire équipe (Next.js 15 + Shadcn UI)

Remplace les slides Canva manuelles (18–35 slides/semaine). Dix sections alimentées automatiquement depuis Laravel, Sentry, et Supabase.

### Infrastructure

- [ ] Installer Shadcn UI (`npx shadcn@latest init`)
- [ ] OSDD : créer `src/technical/Sdk/` (createPilota + LomkitDriver + SupabaseDriver)
- [ ] OSDD : créer `src/technical/Layout/` (shell, navigation latérale entre sections)
- [ ] Supprimer `src/lib/pilota.ts` (remplacé par `src/technical/Sdk/`)
- [ ] Définir les resources Zod pour toutes les entités métier

### Section 1 — Santé des projets

- [ ] `src/functional/ProjectHealth/fetchProjects.ts` — projets + nb bugs ouverts (Laravel)
- [ ] `src/functional/ProjectHealth/fetchSentryIssues.ts` — bugs Sentry par projet (Auth Token)
- [ ] Composant `ProjectHealthCard` — nom projet, badge MEP, compteur bugs, couleur par seuil
- [ ] Page `/` ou `/health`

### Section 2 — Objectifs de la semaine

- [ ] `src/functional/Objectives/fetchObjectives.ts` — par personne (Laravel)
- [ ] Composant `ObjectiveRow` — avatar, focus, blocages (🔴), victoires (🟢)
- [ ] Page `/objectives`

### Section 3 — Objectifs N-1

- [ ] `src/functional/Objectives/fetchPreviousObjectives.ts` — semaine passée
- [ ] Réutiliser `ObjectiveRow`, filtre semaine N-1

### Section 4 — Congés / Présence équipe

- [ ] `src/functional/Absences/subscribePresence.ts` — Supabase Realtime (`'use client'`)
- [ ] Composant `TeamCalendar` — vue semaine, qui est absent quel jour
- [ ] Page `/team`

### Section 5 — Livraisons

- [ ] `src/functional/Deliveries/fetchDeliveries.ts` — releases prévues (Laravel)
- [ ] Composant `DeliveryRow` — projet, version, date, barre `tickets résolus / total`
- [ ] Page `/deliveries`

### Section 6 — Besoins DevOps

- [ ] `src/functional/DevOps/fetchDevOpsNeeds.ts` — sujets + incidents (Laravel)
- [ ] Composant `DevOpsItem` — titre, statut, responsable
- [ ] Page `/devops`

### Section 7 — Infos semaine

- [ ] `src/functional/WeekInfo/fetchWeekInfo.ts` — events, DevTalk, scores (Laravel)
- [ ] Composant `WeekInfoCard`
- [ ] Page `/week`

### Section 8 — Money Maker

- [ ] `src/functional/Revenue/fetchRevenue.ts` — CA mois + cumul annuel (Laravel)
- [ ] Composant `RevenueBoard` — gros chiffres, progression vs objectif
- [ ] Page `/revenue`

### Section 9 — Quête des contrats

- [ ] `src/functional/Contracts/fetchContractProgress.ts` — franchise vs propre (Laravel)
- [ ] Composant `ContractQuestBar` — barre de progression visuelle
- [ ] Page `/contracts`

### Section 10 — Missions

- [ ] `src/functional/Missions/fetchMissions.ts` — kanban par statut (Laravel)
- [ ] Composant `MissionKanban` — colonnes OPCO / conformité / chefferie / features
- [ ] Page `/missions`

### Intégrations transversales

- [ ] Lien Vota : clic sur un ticket → ouvre session planning poker (http://localhost:3002)
- [ ] Sentry Auth Token en env var `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` pour fetchSentryIssues
- [ ] Navigation latérale entre les 10 sections
- [ ] Refresh automatique toutes les X minutes (configurable)
