# Pilota

**A frontend SDK that talks to any backend — REST, GraphQL or WebSocket — through one grammar.** Business code declares resources; the protocol behind them (Laravel/Lomkit, Hasura, Supabase Realtime…) becomes an interchangeable detail.

```ts
sdk.nhost.products.query({})              // GraphQL   → catalogue
sdk.lomkit.cartItems.get({})              // REST      → cart
sdk.supabase.messages.subscribe(handler)  // WebSocket → realtime chat
```

The frontend doesn't know — and doesn't care — what's behind a resource. Swapping the backend never touches the business layer.

---

## Why

Most data-access abstractions are tied to a protocol (a REST client, a GraphQL client…) or to a framework. Pilota separates two things:

- **the call grammar** (`resource.method`), uniform across every backend;
- **the driver**, which knows how to translate that grammar to a concrete protocol.

The result: a multi-backend app (catalogue over GraphQL, transactions over REST, presence in real time) is written with a single API, validated by Zod schemas, on any frontend framework.

---

## Packages

Pilota is split into composable, UnJS-style building blocks — each usable on its own.

| Package | Role | Depends on |
|---------|------|------------|
| [`nexdk`](packages/nexdk) | The SDK: `createPilota`, `defineResource`, `defineDriver`, proxy + end-to-end inferred types | **nothing** (`zod` peer) |
| [`beepr`](packages/beepr) | Event engine: `createNotify`, adapters, `mergeEventHandlers` | `hookable` |
| [`chaff`](packages/chaff) | Schema-driven mock: `parseMock`/`parseMockList`, optional MirageJS server | `zod` (peer) |
| `@pilota/driver-lomkit` | REST driver (Laravel + Lomkit: `search`/`mutate`/`delete`) | `nexdk` (peer), `chaff` |
| `@pilota/driver-nhost` | GraphQL + subscriptions driver (Hasura, graphql-transport-ws) | `nexdk` (peer) |
| `@pilota/driver-supabase` | Realtime driver (`postgres_changes`) | `nexdk` (peer), `@supabase/supabase-js` |
| `@pilota/driver-nest` | Conventional REST CRUD driver (common NestJS controller shape) | `nexdk` (peer) |
| `@pilota/driver-symfony` | REST driver for Symfony / API Platform (Hydra, merge-patch) | `nexdk` (peer) |
| `@pilota/hooks` | `useResourceForm` (Vue forms + Zod validation) | `nexdk`, `vue`, `zod` (peers) |

**Independence is the rule.** The core tools (`nexdk`, `beepr`, `chaff`) depend on
nothing else in the repo — `nexdk` has **zero** runtime dependencies (`zod` is a
peer). Extensions (drivers, hooks) **peer-depend on `nexdk` only** — you bring the
SDK, they don't bundle it, like an ESLint/Vite plugin. Each package builds, tests
and ships on its own. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Anatomy of a call

```
sdk.[driver].[resource].[method](payload?, notify?, mock?)
                                    │        │       │
                                  data    events   network mock
                                 / filter  (beepr)  (chaff)
```

| Parameter | Type | Role |
|-----------|------|------|
| `payload` | `object` | Search filter, object to create… |
| `notify`  | `PilotaEventHandler` | Event callback — built with `createNotify(adapter)` |
| `mock`    | `T \| T[]` | Replacement data — short-circuits the network, validated by the schema |

Events emitted: `request · success · error · data · connected · disconnected`.

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

## Writing a driver

A driver translates the call grammar into a concrete protocol. The recommended
path is the `defineDriver` helper (in `nexdk`): you write only the protocol
translation and the unified event contract (`request`/`success`/`error`, plus
`data`/`connected`/`disconnected` for reactive methods) is supplied for you.
`@pilota/driver-nest` (and `@pilota/driver-symfony`) are the reference examples.
To start your own, clone **[`packages/driver-template`](packages/driver-template)**
(`pilota-driver-template`) and rename it.

See **[docs/writing-a-driver.md](docs/writing-a-driver.md)** for the runtime
contract, the `defineDriver` API, and how to add end-to-end typing.

**Naming**: official drivers are `@pilota/driver-*`; community drivers are
`pilota-driver-*`.

---

## OSDD layout

Every playground follows the same split — no catch-all folder:

```
src/
├── technical/   ← shared infrastructure, business-agnostic (SDK, Layout, i18n, styles)
└── functional/  ← business logic, app-specific — depends on technical/, never the reverse
```

---

## Playgrounds

Five independent frontends consume the same SDK on five different stacks — the portability proof.

| App | Port | Stack | Validates |
|-----|------|-------|-----------|
| **Shoplab** | 3010 | Nuxt 4, Vuetify | All 3 drivers at once (REST + GraphQL + WS) |
| **Pulse** | 3001 | Next.js 15, App Router | Weekly dashboard, Lomkit |
| **Vota** | 3002 | SvelteKit, Svelte 5 runes | Real-time planning poker (Nhost WS) |
| **Gearup** | 3003 | Astro 5, React islands | Configurator, full OSDD, mock fallback |
| **Fleet Commander** | 3004 | Angular 19, RxJS | RxJS adapter on top of the SDK |

A navigation hub plus the backends (Laravel/Lomkit, Hasura, Supabase) round out the stack.

---

## Getting started

**Prerequisites**: Docker, and [`mkcert`](https://github.com/FiloSottile/mkcert) (`mkcert -install` once) for trusted local HTTPS.

```bash
make certs      # generate the *.localhost certificate (mkcert)
make proxy-up   # Traefik + Tolgee (once per machine)
make up         # backends + frontends + hub
```

URL-based access, over HTTPS: `https://<branch>-shoplab.localhost`, `…-vota.localhost`, etc.

**Configurable ports** — if 80/443 are already taken on your machine (another proxy), override without breaking anything:

```bash
PILOTA_HTTP_PORT=8081 PILOTA_HTTPS_PORT=8443 make up
# → https://<branch>-shoplab.localhost:8443
```

On a machine where 80/443 are free, URLs carry no port. See `.env.example`.

---

## Development

```bash
pnpm install
pnpm --filter "./packages/**" build     # build the packages
pnpm --filter "./packages/**" test      # Vitest (nexdk, beepr, chaff, drivers, hooks)
```

- **Tests**: Vitest on the packages, Playwright (mocked network) on the Shoplab/Vota e2e.
- **CI**: GitHub Actions builds + tests the packages on every push/PR.
- **Release**: changesets — `pnpm changeset`, `pnpm version-packages`, `pnpm release`.

---

## Tech stack

| Layer | Tech |
|-------|------|
| SDK | Strict TypeScript, Zod, pnpm workspaces, unbuild |
| Backends | Laravel 11 (Lomkit REST), Hasura v2 (GraphQL + WS), Supabase (Realtime) |
| Infra | Traefik + mkcert (HTTPS `*.localhost`), multi-branch Docker Compose |
| i18n | Self-hosted Tolgee, static fallback |
| Tests | Vitest + Playwright |

---

## Contributing

New drivers welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and
[docs/writing-a-driver.md](docs/writing-a-driver.md). The one rule: keep every
package independent (core depends on nothing; drivers peer-depend on `nexdk`).

## License

MIT © techmefr
