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
