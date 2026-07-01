# AGENT.md — Pilota (repo root)

Guidance for AI agents working in this repository.

## What this is

Pilota is a pnpm-workspace monorepo: a set of composable, UnJS-style packages
(a backend-agnostic frontend SDK) plus playground apps that consume them.

```
packages/
  nexdk/            the SDK (createPilota, defineResource, defineDriver) — 0 deps
  beepr/            event engine (createNotify, adapters)
  chaff/            schema-driven mock (parseMock, MirageJS)
  hooks/            @pilota/hooks — Vue useResourceForm
  drivers/
    lomkit/ nhost/ supabase/ nest/   @pilota/driver-* — one per backend
playground/         shoplab (Nuxt) · pulse (Next) · vota (SvelteKit) ·
                    gearup (Astro) · fleet-commander (Angular) · hub · backends/
```

## The rule that governs everything

**Each package is independent** (see [CONTRIBUTING.md](CONTRIBUTING.md)):
core tools (`nexdk`/`beepr`/`chaff`) depend on nothing else in the repo; drivers
and hooks **peer-depend on `nexdk` only**, never as a `dependency`. `nexdk` has
zero runtime dependencies. Do not create cross-package coupling.

Each package has its own `AGENT.md` — read it before editing that package.

## Conventions

- English everywhere. No AI attribution in commits.
- Strict TS, no `any`. Source files < 200 lines. Vitest for tests.
- Unified driver contract: emit `'error'` then `throw` on failure.
- Git identity for this repo is `techmefr <compigni.gaetan@gmail.com>` (personal),
  set as a local override — do not commit as another identity.

## Build & test

```bash
pnpm install
pnpm --filter "./packages/**" build
pnpm --filter "./packages/**" test
```

## Running the stack

`make certs && make proxy-up && make up` (needs Docker + mkcert). Traefik serves
`https://<branch>-<svc>.localhost`. If ports 80/443 are taken, override:
`PILOTA_HTTP_PORT=8081 PILOTA_HTTPS_PORT=8443 make up`. Do not stop other Traefik
stacks on the machine.
