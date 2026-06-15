# Tolgee SDK Integration

## Vota (SvelteKit) — project 41 · fr/en/de · 51 keys ✓ imported

- [x] Remplacer `src/lib/technical/i18n.ts` par le setup Tolgee (`@tolgee/svelte`)
- [x] `+page.svelte` — adapter `$t()` via Tolgee
- [x] `session/[id]/+page.svelte` — adapter `$t()` via Tolgee
- [x] `+layout.svelte` — conserver le switcher de langue (branché sur Tolgee `changeLanguage`)
- [x] Rebuild container vota

## Gearup (Astro + React) — project 42 · fr/en · 94 keys ✓ imported

- [x] Créer `src/technical/Tolgee/index.ts` — setup `@tolgee/web` (instance partagée)
- [x] Remplacer `getTranslations(lang)` par `tolgee.t()` dans les 6 composants React
- [x] `SettingsPanel.tsx` — brancher `applyLang` sur `tolgee.changeLanguage()`
- [x] Supprimer `src/technical/I18n/index.ts`
- [x] Rebuild container gearup

## Pulse (Next.js) — project 40 · fr/en · 17 keys ✓ importés

- [x] Identifier les chaînes dans les composants (Sidebar, SettingsPanel)
- [x] Importer les clés dans Tolgee projet 40
- [x] Créer `src/technical/Tolgee/index.ts` — setup `@tolgee/react`
- [x] Créer `TolgeeClientProvider.tsx` — wrapper client-side
- [x] Wrapper `layout.tsx` avec `TolgeeClientProvider`
- [x] Remplacer les chaînes hardcodées par `useTranslate` dans Sidebar et SettingsPanel
- [x] Rebuild container pulse (si HMR ne suffit pas)

## Fleet Commander (Angular 19) — Hypervision PC · OSDD · RxJS

- [ ] Scaffold `playground/fleet-commander` (Angular 19 + Tailwind/Shadcn-like)
- [ ] Setup OSDD structure (`src/app/technical` vs `src/app/functional`)
- [ ] Intégration Pilota SDK dans Angular (Service Injectable `PilotaService`)
- [ ] **Technical** : Créer l'adapter RxJS pour transformer les `subscribe` du SDK en `Observables`
- [ ] **Functional** : Dashboard Fleet (Realtime via Supabase)
- [ ] **Functional** : Inventory List (Lomkit/Laravel) avec filtres réactifs
- [ ] **Functional** : PC Detail View (Agrégation 3 drivers : Lomkit, Nhost, Supabase)
- [ ] Intégration Tolgee pour Angular
- [ ] Dockerisation du service et ajout au `docker-compose.yml` racine
- [ ] Tests unitaires via Vitest (Angular + Vitest setup)
