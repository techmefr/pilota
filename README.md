# Pilota — Driver-Based SDK Architecture

POC validant une approche unifiée pour gérer plusieurs backends dans une application frontend.

## L'idée centrale

Un frontend parle à plusieurs backends différents (REST, GraphQL, WebSocket) avec **exactement la même syntaxe** :

```ts
sdk.nhost.products.query({})               // GraphQL → catalogue produits
sdk.lomkit.cartItems.get({})               // REST Laravel → panier
sdk.supabase.messages.subscribe(handler)   // WebSocket → chat SAV
```

Peu importe ce qu'il y a derrière — Hasura, Laravel/Lomkit, Supabase Realtime — le frontend ne le sait pas et s'en fiche.

---

## Architecture SDK

```
sdk.[driver].[resource].[method](payload?, onEvent?, mock?)
```

### Drivers

| Driver | Backend | Protocole | Usage |
|--------|---------|-----------|-------|
| `nhost` | Hasura / PostgreSQL | GraphQL | Catalogue produits, planning poker |
| `lomkit` | Laravel + Lomkit REST API | REST | Panier, commandes, profils HP |
| `supabase` | Supabase Realtime | WebSocket | Chat SAV |

### Packages

```
packages/
├── core/          @pilota/core            — createPilota, defineResource, Proxy SDK
├── drivers/
│   ├── lomkit/    @pilota/driver-lomkit   — REST (search/mutate/delete)
│   ├── nhost/     @pilota/driver-nhost    — GraphQL + subscriptions
│   └── supabase/  @pilota/driver-supabase — Realtime postgres_changes
└── hooks/         @pilota/hooks           — useResourceForm (Zod validation)
```

---

## Architecture OSDD

Tous les playgrounds suivent la même organisation en deux domaines racines. Rien ne vit dans un dossier générique.

```
src/
├── technical/    ← infrastructure partagée, aucun lien avec le métier
│   ├── Sdk/      drivers, resources Zod, mock data
│   ├── Layout/   layout principal, sidebar, topbar, settings panel
│   ├── I18n/     traductions, store langue
│   └── styles/   tokens CSS globaux
└── functional/   ← logique métier, spécifique à l'application
    └── [Domaine]/
        ├── fetchXxx.ts       appels SDK avec fallback mock
        ├── components/       composants propres au domaine
        └── *.test.ts         tests unitaires
```

**Règle** : `technical/` peut vivre dans un autre projet sans modification. `functional/` dépend de `technical/`, jamais l'inverse.

---

## Playgrounds

Quatre frontends indépendants, chacun sur son port, tous lancés avec `make up` :

| App | Port | Stack | Statut |
|-----|------|-------|--------|
| **Shoplab** | :3010 | Nuxt 4, Vuetify, 3 drivers simultanés | Prêt |
| **Pulse** | :3001 | Next.js 15, App Router, Lomkit | Prêt |
| **Vota** | :3002 | SvelteKit, Svelte 5, Nhost WebSocket | Prêt |
| **Gearup** | :3003 | Astro 5, React, Lomkit, OSDD complet | Prêt |

Hub de navigation → **http://localhost:9999**

---

## Carte des appels SDK

### `useProducts.ts` — GraphQL (Nhost/Hasura)

```ts
const result = await productsApi.query({})
products.value = result.data?.products ?? []
//                          ↑ structure GraphQL brute : { products: Product[] }
```

### `useCart.ts` — REST (Laravel/Lomkit)

```ts
// Lecture
const result = await cartItemsApi.get({})
items.value = result.data ?? []

// Création / mise à jour
await cartItemsApi.mutate({ product_id, product_name, unit_price, quantity })

// Suppression — Lomkit attend { resources: [id] }, pas { id }
await cartItemsApi.delete({ resources: [item.id] })
```

### `useChat.ts` — WebSocket (Supabase Realtime)

```ts
cleanup = messagesApi.subscribe(
    { room_id: 'sav' },
    (event, data) => {
        // data = { eventType: 'INSERT', new: ChatMessage, old: ChatMessage }
        const payload = data as { eventType: string; new: ChatMessage }
        if (event === 'data' && payload.eventType === 'INSERT') messages.value.push(payload.new)
    },
)

await messagesApi.insert({ room_id: 'sav', content, author: 'client' })
```

---

## Signature complète d'un appel SDK

```
sdk.[driver].[resource].[method](payload?, notify?, mock?)
                                    ↑         ↑       ↑
                                 données   adapter   mock
                                 / filtre  events   réseau
```

| Paramètre | Type | Rôle |
|-----------|------|------|
| `payload` | `object` | Données à envoyer : filtre de recherche, objet à créer, etc. |
| `notify` | `PilotaEventHandler` | Callback d'événements — construit avec `createNotify(adapter)` |
| `mock` | `unknown` | Données de remplacement — court-circuite l'appel réseau si fourni |

```ts
// payload + notify + mock (pas d'appel réseau, données injectées)
await sdk.lomkit.cartItems.get(
    {},
    createNotify(createSnackAdapter({ success: 'Mock OK' })),
    [{ id: 1, product_id: 42, product_name: 'T-shirt', unit_price: 29, quantity: 2 }],
)
```

---

## Moteur d'événements — `createNotify`

`createNotify(adapter)` transforme un objet de handlers typés en une callback brute `(event, data) => void` attendue par les drivers.

### Événements émis

| Event | Moment | `data` |
|-------|--------|--------|
| `'request'` | avant l'appel réseau | `{ resource, payload }` |
| `'success'` | réponse OK | résultat brut |
| `'error'` | erreur réseau ou HTTP | `{ message, errors? }` |
| `'data'` | message Realtime reçu | payload postgres_changes |
| `'connected'` | WebSocket établi | `{ resource }` |
| `'disconnected'` | WebSocket fermé | `{ resource }` |

### Adapters disponibles

```ts
// Logs console uniquement (dev)
createNotify(createLogAdapter())

// Toast UI
createNotify(createSnackAdapter({ success: 'Chargé', error: 'Erreur réseau' }))

// Les deux combinés — spread, les keys non-définies ne s'écrasent pas
createNotify({ ...createLogAdapter(), ...createSnackAdapter({ error: 'Erreur' }) })
```

### Global vs per-call

```ts
// sdk.ts — log global actif sur tous les appels, uniquement en dev
export const sdk = createPilota({
    drivers: { nhost, lomkit, supabase },
    notify: import.meta.dev ? createNotify(createLogAdapter()) : undefined,
})

// composable — toast en plus du log global
await sdk.lomkit.cartItems.mutate(
    item,
    createNotify(createSnackAdapter({ success: 'Ajouté au panier', error: 'Echec' })),
)
// résultat : le log global + le toast per-call tirent tous les deux
```

---

## Démarrage rapide

```bash
# Tous les services (backends + frontends + tooling)
make up

# Ou service par service
docker compose up -d
```

### Commandes utiles

```bash
make up       # lance tout
make down     # arrête tout
make logs     # logs de tous les services
make restart  # redémarre tout
```

### Tests E2E (Shoplab)

```bash
cd playground/nuxt
pnpm test:e2e     # Playwright — mock réseau, pas besoin des backends
```

---

## Playground Shoplab — E-commerce (Nuxt 4)

Vitrine e-commerce validant les 3 drivers simultanément. Organisé en OSDD layers.

```
playground/nuxt/
├── layers/
│   ├── technical/
│   │   ├── sdk/           createPilota() avec nhost + lomkit + supabase
│   │   └── plugins/       tolgee.client.ts (i18n EN/FR)
│   └── functional/
│       ├── pages/         index, products/[id], cart, checkout
│       ├── components/    ProductCard, ChatWidget
│       └── composables/   useProducts, useCart, useChat, useNotify
└── e2e/                   Tests Playwright (page.route() mock réseau)
```

### Calls SDK

```ts
// Catalogue — GraphQL (Nhost)
const result = await sdk.nhost.products.query({})

// Panier — REST (Lomkit)
await sdk.lomkit.cartItems.get({})

// Chat SAV — WebSocket (Supabase Realtime)
sdk.supabase.messages.subscribe({ room_id: 'sav' }, handler)
```

---

## Playground Vota — Planning Poker (SvelteKit + Svelte 5)

App de planning poker collaboratif en temps réel. Sessions de vote, révélation synchronisée, export CSV / JSON / Jira.

### Architecture OSDD dans Svelte 5

```
src/lib/
├── technical/
│   ├── sdk/
│   │   ├── index.ts        createVotaPilota() + types NhostResult
│   │   └── resources.ts    defineResource() pour les 4 entités (Zod schemas)
│   ├── types.ts            interfaces TypeScript + constantes (SCALES, AVAILABLE_TAGS)
│   ├── i18n.ts             store lang + store t (fr/en/de)
│   ├── theme.ts            store theme dark/light + store fontSize (localStorage)
│   ├── layout.ts           store layoutBarVisible
│   └── export.ts           toCSV, toJSON, toJiraText, downloadFile, printAsPDF
└── functional/
    └── useSession.svelte.ts   toute la logique planning poker (Svelte 5 composable)
```

### Svelte 5 — Composables avec Runes

Les composables Svelte 5 utilisent l'extension `.svelte.ts` pour activer la syntaxe rune.

```ts
export function useSession(data: SessionData) {
    let session = $state<Session>(untrack(() => ({ ...data.session })))
    let tasks   = $state<Task[]>(untrack(() => [...data.tasks]))

    $effect(() => { /* réagit aux changements */ })

    onMount(() => {
        layoutBarVisible.set(false)
        // 4 subscriptions temps-réel via SDK
    })

    // Pattern getter/setter — nécessaire pour bind:value dans le template
    return {
        get session() { return session },
        get tasks()   { return tasks },
        set tasks(v)  { tasks = v },
    }
}
```

### SDK Pilota dans Svelte 5

```ts
// subscription temps-réel
sdk.nhost.planning_votes.subscribe(
    { where: { session_id: { _eq: id } } },
    (event, data) => { /* mise à jour locale */ }
)

// upsert avec conflict
sdk.nhost.planning_votes.upsert({
    data: { session_id, task_id, participant_id, value },
    conflictConstraint: 'planning_votes_participant_task_key',
    updateColumns: ['value', 'updated_at'],
})
```

---

## Playground Gearup — Configurateur HP XEFI (Astro 5 + React)

Configurateur de postes HP par profil (dev, CDP, commercial, technicien…) pour le cycle d'achat XEFI 2024–2027. Remplace le PDF/Excel partagé.

### Architecture OSDD dans Astro

```
src/
├── technical/
│   ├── Sdk/
│   │   ├── index.ts      createPilota() + LomkitDriver + types castés
│   │   ├── resources.ts  defineResource() + Zod pour les 5 entités
│   │   └── mock.ts       données de démo (profiles, repairs, orders, alerts)
│   ├── Layout/
│   │   ├── Layout.astro  shell (sidebar + topbar + slot)
│   │   ├── Sidebar.tsx   navigation + cycle d'achat (React island)
│   │   ├── Topbar.tsx    titre de page + bouton réglages
│   │   └── SettingsPanel.tsx  drawer lang / thème / taille police
│   ├── I18n/
│   │   └── index.ts      getTranslations(lang) → objet de traductions (fr/en/de)
│   └── styles/
│       └── global.css    design system (OKLCH, Apple/macOS aesthetic)
├── functional/
│   └── Gearup/
│       ├── components/   Dashboard, ProfilesPage, InventoryPage, RepairsPage, OrdersPage, PreventionPage
│       ├── fetchPcProfiles.ts   sdk.lomkit.pcProfiles.get() avec fallback mock
│       ├── fetchInventory.ts    sdk.lomkit.assignments.get()
│       ├── fetchRepairs.ts      sdk.lomkit.repairs.get()
│       ├── fetchOrders.ts       sdk.lomkit.orders.get()
│       └── fetchAlerts.ts       sdk.lomkit.alerts.get()
└── pages/
    └── *.astro           SSR : fetch serveur → props vers React islands
```

### Astro + React islands

```astro
---
// pages/repairs.astro — serveur
import Layout from '../technical/Layout/Layout.astro'
import RepairsPage from '../functional/Gearup/components/RepairsPage'
import { fetchRepairs } from '../functional/Gearup/fetchRepairs'

const repairs = await fetchRepairs()
---

<Layout title="Réparations" currentPath="/repairs">
    <RepairsPage client:load repairs={repairs} />
</Layout>
```

Les pages fetchent les données côté serveur, les composants React s'hydratent côté client via `client:load`.

### Resources Zod

Toutes les entités sont définies via `defineResource` — pas de types manuels :

```ts
export const repairResource = defineResource({
    name: 'repairs',
    schema: z.object({
        id: z.number(),
        ticket: z.string(),
        status: z.enum(['open', 'in_progress', 'waiting_parts', 'closed']),
        technician: z.string().nullable(),
        parts: z.array(z.string()),
        // ...
    }),
    fragments: { default: ['id', 'ticket', 'status', 'technician', 'parts', ...] },
})

export type Repair = z.infer<typeof repairResource.schema>
```

### Fetch avec fallback mock

Pattern identique sur toutes les entités :

```ts
export async function fetchRepairs(): Promise<Repair[]> {
    try {
        const result = await sdk.lomkit.repairs.get()
        return result.data ?? mockRepairs
    } catch {
        return mockRepairs       // Laravel offline → données de démo
    }
}
```

---

## Playground Pulse — Dashboard hebdomadaire équipe (Next.js 15)

Pulse remplace les slides Canva créées manuellement chaque semaine (18 à 35 slides, copier-coller, saisie répétitive). C'est une application web vivante, alimentée automatiquement depuis les sources de données réelles de l'équipe.

### Ce qu'on voit dans Pulse

| Section | Source | Description |
|---------|--------|-------------|
| **Santé des projets** | Laravel + Sentry | Bugs ouverts et MEP en cours par projet |
| **Objectifs semaine** | Laravel | Par personne : focus, blocages, victoires |
| **Objectifs N-1** | Laravel | Semaine précédente pour comparaison |
| **Congés / Présence** | Supabase Realtime | Qui est absent quel jour, en temps réel |
| **Livraisons** | Laravel | Releases prévues + compteur tickets résolus/total |
| **Besoins DevOps** | Laravel | Sujets en cours, incidents récurrents |
| **Infos semaine** | Laravel | Events, DevTalk, scores |
| **Money Maker** | Laravel | CA du mois, cumul annuel |
| **Quête des contrats** | Laravel | Progression franchise vs propre |
| **Missions** | Laravel | Kanban par statut (OPCO, conformité, chefferie, features) |

### Intégrations

- **Sentry** → remonte les bugs automatiquement dans "Santé des projets"
- **Supabase Realtime** → présence équipe en temps réel dans "Congés / Présence"
- **Vota** → un ticket dans Pulse ouvre directement une session de planning poker

### Architecture cible

```
src/
├── technical/
│   ├── Sdk/          createPilota() + LomkitDriver + SupabaseDriver
│   └── Layout/       shell, navigation par section
└── functional/
    ├── ProjectHealth/    fetchIssues() — Laravel + Sentry API
    ├── Objectives/       fetchObjectives() — semaine courante et N-1
    ├── Absences/         subscribePresence() — Supabase Realtime
    ├── Deliveries/       fetchDeliveries() — releases + tickets
    ├── DevOps/           fetchDevOpsNeeds()
    ├── WeekInfo/         fetchWeekInfo()
    ├── MoneyMaker/       fetchRevenue()
    ├── Contracts/        fetchContractProgress()
    └── Missions/         fetchMissions() — kanban
```

**Stack cible** : Next.js 15 App Router, Shadcn UI, Pilota SDK, Tolgee namespace `pulse`.

---

## Système de réglages — Transversal

Chaque frontend expose un panneau de réglages persistant en localStorage :

| Réglage | Clé localStorage | Portée |
|---------|-----------------|--------|
| Langue | `{app}-lang` | traductions UI (fr / en / de) |
| Thème | `{app}-theme` | `dark` / `light`, attribut `data-theme` sur `<html>` |
| Taille de police | `{app}-font-size` | 15 / 17 / 19 / 21 px sur `html.style.fontSize` |

La taille de police cible `html.style.fontSize` — tous les `rem` du CSS s'adaptent automatiquement.

| App | Accès aux réglages |
|-----|--------------------|
| **Gearup** | Bouton ⚙ dans la topbar → drawer latéral |
| **Vota** | Icône profil dans la topbar → dropdown |
| **Pulse** | Bouton ⚙ dans le header → drawer latéral |
| **Shoplab** | Boutons lang + thème dans la navbar + boutons A−/A/A+/A++ |

---

## Ce qu'on a appris (problèmes rencontrés et solutions)

### 1. `noUncheckedIndexedAccess` — index signature Nuxt

**Problème** : Nuxt active `noUncheckedIndexedAccess`. Le SDK est typé comme `Record<string, DriverProxy>`, donc `sdk.nhost` retourne `DriverProxy | undefined`.

**Solution** : Pattern d'accesseur typé explicite avec double cast :

```ts
type ProductsApi = { query: (p: object) => Promise<NhostQueryResult<{ products: Product[] }>> }
const productsApi = (sdk.nhost as unknown as { products: ProductsApi }).products
```

### 2. `ZodObject<T>` est invariant sur T

**Problème** : `ZodObject<{ full_name: ZodString }>` n'est pas assignable à `ZodObject<any>` à cause d'une propriété interne `keyof()._cache`.

**Solution** : Cast double en entrée de `useResourceForm` :

```ts
useResourceForm(orderResource as unknown as Parameters<typeof useResourceForm>[0])
```

### 3. `t()` de Tolgee est une Ref dans `<script setup>`

**Problème** : `useTranslate()` retourne `{ t: Ref<TFnType> }`. Dans le script, `t('key')` essaie d'appeler une Ref.

**Solution** : `t.value('key')` dans le script, `{{ t('key') }}` dans le template (Vue auto-unwrap les Refs).

### 4. Payload Supabase Realtime — structure imbriquée

```ts
// ❌ mauvais — data n'est pas directement ChatMessage
const msg = data as ChatMessage

// ✅ correct
const payload = data as { eventType: string; new: ChatMessage }
messages.value.push(payload.new)
```

### 5. Lomkit delete — format du payload

```ts
// ❌ ignoré silencieusement
await cartItemsApi.delete({ id: item.id })

// ✅
await cartItemsApi.delete({ resources: [item.id] })
```

### 6. `tsconfig.json` manquant pour vue-tsc

**Solution** : Créer `playground/nuxt/tsconfig.json` :

```json
{ "extends": "./.nuxt/tsconfig.json" }
```

### 7. Vite Node IPC en mode dev — socket Unix null byte

**Contexte** : Sur Linux + Node ≥ 20, Nuxt génère un socket Unix abstrait dont le chemin commence par `\0`. Ce null byte est tronqué → `socketPath` vaut `undefined` → 500 sur toutes les routes.

**Solution** : Forcer un chemin dans `/tmp` dans `nuxt.config.ts` :

```ts
vite: { viteNode: { socketPath: `/tmp/nuxt-vite-node-${process.pid}.sock` } }
```

### 8. `import.meta.dev` — logs dev-only

Nuxt remplace `import.meta.dev` à la compilation — `true` en dev, éliminé (dead code) en prod.

```ts
notify: import.meta.dev ? createNotify(createLogAdapter()) : undefined,
```

### 9. Global notify + per-call — merge automatique

`mergeEventHandlers(global, local)` appelle les deux si les deux sont définis. Le per-call s'ajoute au global, ils ne se remplacent pas.

### 10. `$env/static/public` vs `$env/dynamic/public` (SvelteKit)

**Problème** : `$env/static/public` fait échouer le build si la variable est absente du `.env`.

**Solution** : `$env/dynamic/public` tolère les variables absentes à la compilation.

### 11. Getter/setter pattern pour `bind:value` avec `$state` exporté (Svelte 5)

```ts
// ❌ perd la réactivité — Svelte copie la valeur
return { nameInput }

// ✅ conserve la réactivité, compatible avec bind:value={s.nameInput}
return {
    get nameInput() { return nameInput },
    set nameInput(v) { nameInput = v },
}
```

### 12. `untrack()` pour initialiser `$state` depuis props (Svelte 5)

```ts
let session = $state<Session>(untrack(() => ({ ...data.session })))
```

### 13. Docker hot-reload — volume mount obligatoire

**Problème** : Docker copie les fichiers au `build`. Les modifications sur le host ne sont pas reflétées dans le conteneur.

**Solution** : Monter le répertoire source en volume dans `docker-compose.yml` :

```yaml
volumes:
    - ./src:/app/playground/gearup/src
```

Le serveur Astro dev surveille les fichiers montés et rechauffe le HMR.

### 14. Next.js 15 RSC + Client Components — init thème sans flash

**Problème** : `layout.tsx` est un Server Component. Les paramètres localStorage (thème, taille) ne sont pas accessibles côté serveur → flash au chargement.

**Solution** : Inline script dans `<head>` exécuté avant le rendu du body :

```tsx
<script dangerouslySetInnerHTML={{ __html: `
(function(){
    var t = localStorage.getItem('pulse-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
    var s = localStorage.getItem('pulse-font-size');
    if (s) document.documentElement.style.fontSize = s + 'px';
})();
`}} />
```

### 15. WCAG AA — couleurs `--muted` insuffisantes

**Problème** : `--muted: #5F6368` sur fond sombre `#202124` donnait 2.78:1 (requis 4.5:1). `--muted: #9AA0A6` sur fond clair `#F8F9FA` donnait 2.39:1.

**Solution** : Ajuster par thème pour passer le seuil.

```css
/* dark */  --muted: #8F9397;   /* 5.2:1 sur #202124 */
/* light */ --muted: #636B70;   /* 5.0:1 sur #F8F9FA */
```

### 17. Sentry — intégration opt-in avec graceful degradation

Chaque frontend intègre Sentry SDK + `feedbackIntegration()` (widget flottant, labels FR). Sentry ne s'initialise que si le DSN est fourni — aucun crash si la variable est absente :

```ts
// pattern identique sur tous les frameworks
const dsn = import.meta.env.PUBLIC_SENTRY_DSN
if (dsn) {
    Sentry.init({ dsn, integrations: [Sentry.feedbackIntegration({ ... })] })
}
```

| Framework | Package | Config client | DSN env var |
|-----------|---------|---------------|-------------|
| Astro | `@sentry/astro` | `sentry.client.config.ts` | `PUBLIC_SENTRY_DSN` |
| Next.js | `@sentry/nextjs` | `sentry.client.config.ts` | `NEXT_PUBLIC_SENTRY_DSN` |
| SvelteKit | `@sentry/sveltekit` | `src/hooks.client.ts` | `PUBLIC_SENTRY_DSN` |
| Nuxt | `@sentry/nuxt` | `sentry.client.config.ts` | `NUXT_PUBLIC_SENTRY_DSN` |

Les DSNs sont transmis via les `docker-compose.yml` de chaque playground avec `${VAR:-}` (vide par défaut).

### 16. `body { font-size: px }` bloque le scaling de taille

**Problème** : Changer `html.style.fontSize` ne change rien si `body { font-size: 17px }` est en pixels fixes.

**Solution** : Utiliser `1rem` sur body et déclarer la valeur par défaut sur `html` :

```css
:global(html) { font-size: 17px; }
:global(body) { font-size: 1rem; } /* hérite et scale avec html */
```

---

## Stack technique

| Couche | Technologie |
|--------|------------|
| **SDK** | TypeScript strict, Zod schemas, pnpm workspaces, unbuild |
| **Shoplab** | Nuxt 4, Vuetify 3, OSDD layers, Tolgee i18n (EN/FR/DE) |
| **Vota** | SvelteKit 2, Svelte 5 runes, `.svelte.ts` composables |
| **Gearup** | Astro 5, React islands (`client:load`), OSDD complet |
| **Pulse** | Next.js 15, App Router, Shadcn UI, dashboard hebdomadaire équipe |
| **Backends** | Laravel 11 (Lomkit REST), Hasura v2 (GraphQL + WS), Supabase (Realtime) |
| **Tests** | Playwright E2E (mock réseau), Vitest (drivers + hooks) |
| **CSS** | OKLCH, CSS custom properties, `data-theme`, font-size scaling via rem |
| **i18n** | Tolgee self-hosted, getTranslations() statique en fallback |
| **Fonts** | Inter (Shoplab), Plus Jakarta Sans (Vota), SF Pro / system (Gearup, Pulse) |
