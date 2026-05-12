# Pilota — Driver-Based SDK Architecture

POC validant une approche unifiée pour gérer plusieurs backends dans une application Nuxt.

## L'idée centrale

Un frontend e-commerce parle à 3 backends différents (REST, GraphQL, WebSocket) avec **exactement la même syntaxe** :

```ts
sdk.nhost.products.query({})               // GraphQL → catalogue produits
sdk.lomkit.cartItems.mutate(item)          // REST Laravel → panier
sdk.supabase.messages.subscribe(handler)   // WebSocket → chat SAV
```

Peu importe ce qu'il y a derrière — Hasura, Laravel/Lomkit, Supabase Realtime — le frontend ne le sait pas et s'en fiche.

---

## Architecture

```
sdk.[driver].[resource].[method](payload?, onEvent?, mock?)
```

### Drivers

| Driver | Backend | Protocol | Usage |
|--------|---------|----------|-------|
| `nhost` | Hasura / PostgreSQL | GraphQL | Catalogue produits |
| `lomkit` | Laravel + Lomkit REST API | REST | Panier, commandes |
| `supabase` | Supabase Realtime | WebSocket | Chat SAV |

### Packages

```
packages/
├── core/          @pilota/core        — createPilota, defineResource, Proxy SDK
├── drivers/
│   ├── lomkit/    @pilota/driver-lomkit   — REST (search/mutate/delete)
│   ├── nhost/     @pilota/driver-nhost    — GraphQL + WebSocket subscription
│   └── supabase/  @pilota/driver-supabase — Realtime postgres_changes
└── hooks/         @pilota/hooks       — bus d'events global, useResourceForm
```

### Playground e-commerce

```
playground/nuxt/
├── app/
│   ├── pages/
│   │   ├── index.vue   — Catalogue (Nhost GraphQL)
│   │   └── cart.vue    — Panier (Lomkit REST)
│   ├── components/
│   │   ├── ProductCard.vue
│   │   └── ChatWidget.vue  — Chat SAV (Supabase Realtime)
│   ├── composables/
│   │   ├── useProducts.ts  — sdk.nhost.products.query()
│   │   ├── useCart.ts      — sdk.lomkit.cartItems.*
│   │   └── useChat.ts      — sdk.supabase.messages.subscribe/insert()
│   └── utils/sdk.ts        — configuration des 3 drivers
└── e2e/            — Tests Playwright (page.route() mock des APIs)
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

## Ce qu'on a validé

### L'approche fonctionne

Le pattern `sdk.[driver].[resource].[method]()` s'applique identiquement aux 3 backends. Les composables ne voient aucune différence de syntaxe entre un appel GraphQL, REST ou WebSocket.

```ts
// useProducts.ts — GraphQL
const result = await sdk.nhost.products.query({})

// useCart.ts — REST
const result = await sdk.lomkit.cartItems.get({})

// useChat.ts — WebSocket
cleanup = sdk.supabase.messages.subscribe({ room_id: 'sav' }, handler)
```

### Ce que ça simplifie

- **Pas de switch/if sur le type de backend** dans les composables
- **Onboarding d'un nouveau backend** = créer un Driver + bindResource, aucun changement dans les composables
- **Mock sans changer une ligne** dans l'app : passer `mock` en 3e argument court-circuite l'appel réseau
- **Event engine** : `onEvent` unifie la gestion des états loading/success/error, qu'on soit en REST ou GraphQL

### Limites découvertes

- **Typage du retour** : `NhostQueryResult<T>` retourne `{ data: T | null }` où T est la structure GraphQL brute `{ products: Product[] }`. C'est correct mais moins ergonomique qu'un type générique `T[]` direct.
- **Noms de ressources** : le driver utilise le nom tel quel dans l'URL (`cartItems` → `/api/cartItems/search`). Lomkit génère les routes Laravel dans le même format, donc ça matche — mais c'est un couplage implicite à documenter.
- **Auto-tracking Hasura** : Hasura ne track pas les tables automatiquement. Il faut appeler l'API metadata au démarrage. Résolu par un container init dans le docker-compose.
- **Supabase Realtime** sans RLS : en dev c'est désactivé, en prod il faudra configurer les policies.

### Ce qu'on ferait en production

- Ajouter `@pilota/nuxt` pour injecter le SDK via `useNuxtApp()` (plugin Nuxt auto-import)
- Typage générique strict sur les retours de chaque driver
- Middleware d'authentification dans les drivers (JWT Bearer)
- `useResourceForm` sur le formulaire de commande (déjà implémenté dans `@pilota/hooks`)

---

## Stack technique

- **Nuxt 4** (compatibilityVersion: 4, SPA mode)
- **Vuetify 3** dark theme
- **Zod** — validation schemas des resources
- **Playwright** — tests E2E avec `page.route()` pour mocker les 3 APIs
- **pnpm workspaces** + **unbuild** pour les packages
- **Vitest** — tests unitaires des drivers et hooks
