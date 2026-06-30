# Pilota

**Un SDK frontend qui parle à n'importe quel backend — REST, GraphQL ou WebSocket — avec la même grammaire.** Le code métier déclare des ressources ; le protocole derrière (Laravel/Lomkit, Hasura, Supabase Realtime…) devient un détail interchangeable.

```ts
sdk.nhost.products.query({})              // GraphQL  → catalogue
sdk.lomkit.cartItems.get({})              // REST     → panier
sdk.supabase.messages.subscribe(handler)  // WebSocket → chat temps réel
```

Le frontend ne sait pas ce qu'il y a derrière, et s'en fiche. Changer de backend ne touche pas la couche métier.

---

## Pourquoi

La plupart des abstractions d'accès aux données sont liées à un protocole (un client REST, un client GraphQL…) ou à un framework. Pilota sépare deux choses :

- **la grammaire d'appel** (`resource.method`), uniforme quel que soit le backend ;
- **le driver**, qui sait traduire cette grammaire vers un protocole concret.

Résultat : une appli multi-backend (catalogue en GraphQL, transactions en REST, présence en temps réel) s'écrit avec une seule API, validée par des schémas Zod, sur n'importe quel framework front.

---

## Les paquets

Pilota est découpé en briques composables, à la UnJS — chacune s'utilise seule.

| Paquet | Rôle | Dépendances |
|--------|------|-------------|
| [`nexdk`](packages/nexdk) | Le SDK : `createPilota`, `defineResource`, proxy + types inférés de bout en bout | `beepr`, `zod` |
| [`beepr`](packages/beepr) | Moteur d'événements : `createNotify`, adapters, `mergeEventHandlers` | `hookable` |
| [`chaff`](packages/chaff) | Mock piloté par schéma : `parseMock`/`parseMockList`, serveur MirageJS optionnel | `zod` (peer) |
| `@pilota/driver-lomkit` | Driver REST (Laravel + Lomkit : `search`/`mutate`/`delete`) | `nexdk`, `beepr`, `chaff` |
| `@pilota/driver-nhost` | Driver GraphQL + subscriptions (Hasura, graphql-transport-ws) | `nexdk`, `beepr` |
| `@pilota/driver-supabase` | Driver Realtime (`postgres_changes`) | `nexdk`, `beepr` |
| `@pilota/hooks` | `useResourceForm` (formulaires Vue + validation Zod) | `nexdk`, `vue` |

Graphe acyclique : `beepr` et `chaff` ne dépendent de rien d'autre du repo ; `nexdk` consomme le contrat d'événement de `beepr` ; les drivers se branchent au-dessus.

---

## La signature d'un appel

```
sdk.[driver].[resource].[method](payload?, notify?, mock?)
                                    │        │       │
                                 données  events   mock réseau
                                 / filtre  (beepr)  (chaff)
```

| Paramètre | Type | Rôle |
|-----------|------|------|
| `payload` | `object` | Filtre de recherche, objet à créer… |
| `notify`  | `PilotaEventHandler` | Callback d'événements — construite via `createNotify(adapter)` |
| `mock`    | `T \| T[]` | Données de remplacement — court-circuite le réseau, validées par le schéma |

Événements émis : `request · success · error · data · connected · disconnected`.

```ts
import { createPilota, defineResource } from 'nexdk'
import { z } from 'zod'

const product = defineResource({
  name: 'products',
  schema: z.object({ id: z.number(), name: z.string(), price: z.number() }),
})

export const sdk = createPilota({
  drivers: { nhost, lomkit, supabase },
  resources: { nhost: { products: product } },
  notify: import.meta.dev ? createNotify(logAdapter) : undefined,
})
```

---

## Architecture OSDD

Tous les playgrounds suivent la même séparation, sans dossier fourre-tout :

```
src/
├── technical/   ← infrastructure partagée, agnostique du métier (SDK, Layout, i18n, styles)
└── functional/  ← logique métier, propre à l'app — dépend de technical/, jamais l'inverse
```

---

## Les playgrounds

Cinq frontends indépendants consomment le même SDK, sur cinq stacks différentes — la preuve de portabilité.

| App | Port | Stack | Valide |
|-----|------|-------|--------|
| **Shoplab** | 3010 | Nuxt 4, Vuetify | Les 3 drivers simultanément (REST + GraphQL + WS) |
| **Pulse** | 3001 | Next.js 15, App Router | Dashboard hebdo, Lomkit |
| **Vota** | 3002 | SvelteKit, Svelte 5 runes | Planning poker temps réel (Nhost WS) |
| **Gearup** | 3003 | Astro 5, React islands | Configurateur, OSDD complet, fallback mock |
| **Fleet Commander** | 3004 | Angular 19, RxJS | Adapter RxJS au-dessus du SDK |

Hub de navigation + backends (Laravel/Lomkit, Hasura, Supabase) complètent la stack.

---

## Démarrage

**Prérequis** : Docker, et [`mkcert`](https://github.com/FiloSottile/mkcert) (`mkcert -install` une fois) pour le HTTPS local de confiance.

```bash
make certs      # génère le certificat *.localhost (mkcert)
make proxy-up   # Traefik + Tolgee (une fois par machine)
make up         # backends + frontends + hub
```

Accès par URL, en HTTPS : `https://<branche>-shoplab.localhost`, `…-vota.localhost`, etc.

**Ports configurables** — si 80/443 sont déjà pris sur ta machine (autre proxy), surcharge sans rien casser :

```bash
PILOTA_HTTP_PORT=8081 PILOTA_HTTPS_PORT=8443 make up
# → https://<branche>-shoplab.localhost:8443
```

Sur une machine où 80/443 sont libres, les URL sont sans port. Voir `.env.example`.

---

## Développement

```bash
pnpm install
pnpm --filter "./packages/**" build     # build les paquets
pnpm --filter "./packages/**" test      # Vitest (nexdk, beepr, chaff, drivers, hooks)
```

- **Tests** : Vitest sur les paquets, Playwright (réseau mocké) sur les e2e Shoplab/Vota.
- **CI** : GitHub Actions build + teste les paquets à chaque push/PR.
- **Release** : changesets — `pnpm changeset`, `pnpm version-packages`, `pnpm release`.

---

## Stack technique

| Couche | Techno |
|--------|--------|
| SDK | TypeScript strict, Zod, pnpm workspaces, unbuild |
| Backends | Laravel 11 (Lomkit REST), Hasura v2 (GraphQL + WS), Supabase (Realtime) |
| Infra | Traefik + mkcert (HTTPS `*.localhost`), Docker Compose multi-branche |
| i18n | Tolgee self-hosted, fallback statique |
| Tests | Vitest + Playwright |

---

## Licence

MIT © techmefr
