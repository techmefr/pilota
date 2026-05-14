# Pilota — Driver-Based SDK Architecture

POC validant une approche unifiée pour gérer plusieurs backends dans une application Nuxt.

## L'idée centrale

Un frontend e-commerce parle à 3 backends différents (REST, GraphQL, WebSocket) avec **exactement la même syntaxe** :

```ts
sdk.nhost.products.query({})               // GraphQL → catalogue produits
sdk.lomkit.cartItems.get({})               // REST Laravel → panier
sdk.supabase.messages.subscribe(handler)   // WebSocket → chat SAV
```

Peu importe ce qu'il y a derrière — Hasura, Laravel/Lomkit, Supabase Realtime — le frontend ne le sait pas et s'en fiche.

---

## Architecture

```
sdk.[driver].[resource].[method](payload?, onEvent?, mock?)
```

### Drivers

| Driver | Backend | Protocole | Usage |
|--------|---------|-----------|-------|
| `nhost` | Hasura / PostgreSQL | GraphQL | Catalogue produits |
| `lomkit` | Laravel + Lomkit REST API | REST | Panier, commandes |
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

### Playground e-commerce

```
playground/nuxt/
├── app/
│   ├── pages/
│   │   ├── index.vue           — Catalogue produits
│   │   ├── products/[id].vue   — Fiche produit
│   │   ├── cart.vue            — Panier
│   │   └── checkout.vue        — Formulaire commande (useResourceForm)
│   ├── components/
│   │   ├── ProductCard.vue     — Carte produit avec ajout panier
│   │   └── ChatWidget.vue      — FAB + chat SAV (WebSocket simulé)
│   ├── composables/
│   │   ├── useProducts.ts      ← sdk.nhost.products.query()
│   │   ├── useCart.ts          ← sdk.lomkit.cartItems.get/mutate/delete()
│   │   └── useChat.ts          ← sdk.supabase.messages.subscribe/insert()
│   ├── resources/
│   │   └── order.resource.ts   — Schema Zod + defineResource
│   ├── plugins/
│   │   └── tolgee.client.ts    — i18n (EN/FR/DE/ES/IT)
│   └── utils/sdk.ts            — Configuration des 3 drivers
└── e2e/                        — Tests Playwright (page.route() mock réseau)
```

---

## Carte des appels SDK

### `useProducts.ts` — GraphQL (Nhost/Hasura)

```ts
// Charge la liste complète des produits
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
// Abonnement postgres_changes
cleanup = messagesApi.subscribe(
    { room_id: 'sav' },
    (event, data) => {
        // data = { eventType: 'INSERT', new: ChatMessage, old: ChatMessage }
        // ↑ IMPORTANT : le payload n'est PAS ChatMessage directement
        if (event === 'data' && data) {
            const payload = data as { eventType: string; new: ChatMessage }
            if (payload.eventType === 'INSERT') messages.value.push(payload.new)
        }
    },
)

// Insertion (déclenche le realtime côté serveur)
await messagesApi.insert({ room_id: 'sav', content, author: 'client' })
```

### `checkout.vue` — Formulaire Zod (hooks)

```ts
// useResourceForm valide en temps réel avec le schema Zod du resource
const { values, errors, isDirty, handleSubmit, reset } = useResourceForm(
    orderResource as unknown as Parameters<typeof useResourceForm>[0],
    //              ↑ cast nécessaire — voir section "problèmes résolus"
)
```

---

## Signature complète d'un appel SDK

Chaque méthode driver accepte trois paramètres optionnels :

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
// payload seul
await sdk.lomkit.cartItems.get({})

// payload + notify (succès et erreur)
await sdk.lomkit.cartItems.get(
    { filter: { user_id: 1 } },
    createNotify(createSnackAdapter({ success: 'Panier chargé', error: 'Erreur réseau' })),
)

// payload + notify + mock (pas d'appel réseau, données injectées)
await sdk.lomkit.cartItems.get(
    {},
    createNotify(createSnackAdapter({ success: 'Mock OK' })),
    [{ id: 1, product_id: 42, product_name: 'T-shirt', unit_price: 29, quantity: 2 }],
)
```

---

## Moteur d'événements — `createNotify`

### Principe

`createNotify(adapter)` transforme un objet de handlers typés en une callback brute `(event, data) => void` attendue par les drivers. On ne passe que les hooks qui nous intéressent — les autres sont ignorés.

### Événements émis

| Event | Moment | `data` |
|-------|--------|--------|
| `'request'` | avant l'appel réseau | `{ resource, payload }` |
| `'success'` | réponse OK | résultat brut |
| `'error'` | erreur réseau ou HTTP | `{ message, errors? }` |
| `'data'` | message Realtime reçu | payload postgres_changes |
| `'connected'` | WebSocket établi | `{ resource }` |
| `'disconnected'` | WebSocket fermé | `{ resource }` |

### Adapter minimal

```ts
import { createNotify } from '@pilota/hooks'
import type { PilotaNotifyAdapter } from '@pilota/hooks'

const myAdapter: PilotaNotifyAdapter = {
    onSuccess: data => console.log('OK', data),
    onError:   err  => alert(err.message),
}

await sdk.nhost.products.query({}, createNotify(myAdapter))
```

### Adapters fournis dans le playground

`playground/nuxt/app/composables/useNotify.ts`

```ts
import { createSnackAdapter, createLogAdapter } from '~/composables/useNotify'

// Logs console uniquement en dev (onRequest + onSuccess + onError)
createNotify(createLogAdapter())

// Toast UI vers la notification stack de app.vue
createNotify(createSnackAdapter({ success: 'Chargé', error: 'Erreur réseau' }))

// Combiner les deux — spread, les keys non-définies ne s'écrasent pas
createNotify({ ...createLogAdapter(), ...createSnackAdapter({ error: 'Erreur' }) })
```

### Global vs per-call

Le handler global se configure une seule fois dans `createPilota` — il s'applique à **tous** les appels de tous les drivers. Le handler per-call se passe à l'appel — les deux sont mergés et **tirent chacun de leur côté**.

```ts
// sdk.ts — configure une fois, actif partout
export const sdk = createPilota({
    drivers: { nhost, lomkit, supabase },
    // logs console uniquement en dev, rien en prod
    notify: import.meta.dev ? createNotify(createLogAdapter()) : undefined,
})
```

```ts
// composable — ajoute un toast en plus du log global
await sdk.lomkit.cartItems.mutate(
    item,
    createNotify(createSnackAdapter({ success: 'Ajouté au panier', error: 'Echec' })),
)
// résultat : le log global tire + le toast per-call tire
```

### Patterns courants

```ts
// État de chargement local
const isLoading = ref(false)

await sdk.nhost.products.query({}, createNotify({
    onRequest: () => { isLoading.value = true },
    onSuccess: () => { isLoading.value = false },
    onError:   () => { isLoading.value = false },
}))
```

```ts
// Sentry en prod
import * as Sentry from '@sentry/vue'

await sdk.lomkit.cartItems.get({}, createNotify({
    onError: err => Sentry.captureMessage(err.message),
}))
```

```ts
// Sans notify — aucun effet de bord
await sdk.nhost.products.query({})
```

---

## Démarrage rapide

### Backends

```bash
# Nhost/Hasura (GraphQL, port 1337)
docker compose -f playground/backends/nhost/docker-compose.yml up -d

# Laravel/Lomkit (REST, port 8000)
docker compose -f playground/backends/laravel/docker-compose.yml up -d --build

# Supabase (Realtime, port 54321)
docker compose -f playground/backends/supabase/docker-compose.yml up -d
```

### Frontend

```bash
pnpm install
cd playground/nuxt
pnpm dev          # http://localhost:3000
```

### Tests E2E

```bash
cd playground/nuxt
pnpm test:e2e     # Playwright — mock réseau, pas besoin des backends
```

---

## Ce qu'on a appris (problèmes rencontrés et solutions)

### 1. `noUncheckedIndexedAccess` — index signature Nuxt

**Problème** : Nuxt active `noUncheckedIndexedAccess` dans son tsconfig strict. Le SDK est typé comme `Record<string, DriverProxy>`, donc `sdk.nhost` retourne `DriverProxy | undefined`. Et `DriverProxy` est `Record<string, ResourceProxy>`, donc `sdk.nhost.products` retourne `ResourceProxy | undefined`.

**Solution** : Pattern d'accesseur typé explicite avec double cast :

```ts
type ProductsApi = { query: (p: object) => Promise<NhostQueryResult<{ products: Product[] }>> }
const productsApi = (sdk.nhost as unknown as { products: ProductsApi }).products
```

On caste `sdk.nhost` vers un objet avec le type exact attendu. Le `as unknown` est nécessaire parce que les types ne sont pas compatibles structurellement.

### 2. `ZodObject<T>` est invariant sur T

**Problème** : `ZodObject<{ full_name: ZodString, ... }>` n'est pas assignable à `ZodObject<any>` à cause d'une propriété interne `keyof()._cache` dont le type dépend de T. `Set<'full_name'|...>` n'est pas assignable à `Set<never>`.

**Solution** : Cast double en entrée de `useResourceForm` :

```ts
useResourceForm(orderResource as unknown as Parameters<typeof useResourceForm>[0])
```

### 3. `t()` de Tolgee est une Ref dans `<script setup>`

**Problème** : `useTranslate()` retourne `{ t: Ref<TFnType> }`. Dans le script, `t('key')` essaie d'appeler une Ref comme fonction → erreur runtime.

**Solution** : Utiliser `t.value('key')` dans le script, mais `{{ t('key') }}` dans le template (Vue auto-unwrap les Refs).

```ts
// ❌ script setup
error.value = t('Product not found')

// ✅ script setup
error.value = t.value('Product not found')

// ✅ template (auto-unwrap)
{{ t('Product not found') }}
```

### 4. Payload Supabase Realtime — structure imbriquée

**Problème** : Le handler `subscribe` reçoit `data` qui contient `{ eventType, new, old }`, pas directement l'objet inséré.

**Solution** :

```ts
// ❌ mauvais
const msg = data as ChatMessage

// ✅ correct
const payload = data as { eventType: string; new: ChatMessage }
messages.value.push(payload.new)
```

### 5. Lomkit delete — format du payload

**Problème** : L'endpoint destroy de Lomkit attend `{ resources: [id] }`, pas `{ id }`.

```ts
// ❌ ignoré silencieusement
await cartItemsApi.delete({ id: item.id })

// ✅
await cartItemsApi.delete({ resources: [item.id] })
```

### 6. `tsconfig.json` manquant pour vue-tsc

**Problème** : Sans `tsconfig.json` à la racine du playground qui étend `.nuxt/tsconfig.json`, vue-tsc ne charge pas les déclarations d'auto-import Nuxt (`useCart`, `ref`, `computed`, etc. tous en erreur).

**Solution** : Créer `playground/nuxt/tsconfig.json` :

```json
{ "extends": "./.nuxt/tsconfig.json" }
```

### 7. Vite Node IPC en mode dev — socket Unix null byte

**Contexte** : Sur Linux + Node ≥ 20, Nuxt génère un socket Unix abstrait dont le chemin commence par `\0`. Ce null byte est tronqué quand le chemin passe dans une variable d'environnement → `NUXT_VITE_NODE_OPTIONS.socketPath` vaut `undefined` → 500 sur toutes les routes.

**Solution** : Forcer un chemin dans `/tmp` dans `nuxt.config.ts` :

```ts
vite: {
    viteNode: {
        socketPath: `/tmp/nuxt-vite-node-${process.pid}.sock`,
    },
}
```

### 8. Logs dev-only — `import.meta.dev`

**Problème** : `createLogAdapter()` appelle `console.log` sur tous les environnements. En production, ça pollue la console utilisateur.

**Solution** : Nuxt remplace `import.meta.dev` à la compilation — `true` en dev, éliminé (dead code) en prod build.

```ts
// sdk.ts
export const sdk = createPilota({
    drivers: { nhost, lomkit, supabase },
    notify: import.meta.dev ? createNotify(createLogAdapter()) : undefined,
})
```

Zéro `console.log` dans le bundle de production sans aucune condition manuelle.

### 9. Global notify + per-call — merge automatique

**Problème** : On voulait un handler global (logs) sans perdre la capacité d'ajouter un handler per-call (toast UI).

**Solution** : `mergeEventHandlers(global, local)` dans `create-pilota.ts` appelle les deux si les deux sont définis. Le per-call s'ajoute au global, ils ne se remplacent pas.

```ts
// global log → tire sur tout
// per-call snack → s'ajoute uniquement sur cet appel
await cartItemsApi.mutate(item, createNotify(createSnackAdapter({ success: 'Ajouté' })))
// résultat : log console + toast UI, les deux tirent
```

---

## Ce qu'on valide

### Le pattern fonctionne

Les composables ne voient aucune différence de syntaxe entre GraphQL, REST ou WebSocket :

```ts
// GraphQL
const result = await productsApi.query({})

// REST
const result = await cartItemsApi.get({})

// WebSocket
const stop = messagesApi.subscribe({ room_id: 'sav' }, handler)
```

### Les 3 paramètres d'un appel

```ts
sdk.[driver].[resource].[method](payload?, notify?, mock?)
```

- **payload** → filtre ou données à envoyer
- **notify** → `createNotify(adapter)` — mergé avec le global si présent
- **mock** → données injectées qui court-circuitent l'appel réseau — utile en test ou offline

### Ce que ça simplifie

- **Pas de switch/if sur le backend** dans les composables
- **Onboarding d'un nouveau backend** : créer un Driver + bindResource, rien à changer dans l'app
- **Mock sans toucher l'app** : passer `mock` en 3e argument court-circuite l'appel réseau
- **Formulaires validés** : `useResourceForm` + Zod, `isDirty` et `errors` en temps réel
- **Notifications composables** : adapter global pour les logs, adapter per-call pour les toasts — les deux coexistent sans configuration supplémentaire

### Limites

- **Noms de ressources couplés** : `cartItems` → `/api/cartItems/search`. Lomkit génère ses routes au même format — couplage implicite.
- **`NhostQueryResult<T>`** : le `data` est `{ products: Product[] }`, pas `Product[]` directement. Moins ergonomique.
- **Supabase sans RLS** : en dev RLS est désactivé. En prod il faut configurer les policies.
- **Realtime bot simulé** : en l'absence d'un vrai agent SAV, le chat génère des phrases lorem ipsum localement après chaque envoi.

### Ce qu'on ferait en production

- Plugin `@pilota/nuxt` pour injecter le SDK via `useNuxtApp()` (auto-import)
- Typage générique strict sur les retours de chaque driver
- Middleware d'authentification JWT dans les drivers
- Adapter Sentry branché sur `onError` du global notify
- RLS Supabase configuré avec le JWT de l'utilisateur connecté

---

## Stack technique

- **Nuxt 4** (compatibilityVersion: 4, SPA mode `ssr: false`)
- **Vuetify 3** dark theme indigo/violet
- **Tolgee** i18n (EN/FR/DE/ES/IT) — JSON statique offline-first
- **Zod** validation schemas des resources
- **Playwright** tests E2E avec `page.route()` pour mocker les 3 APIs
- **pnpm workspaces** + **unbuild** pour les packages
- **Vitest** tests unitaires des drivers et hooks
