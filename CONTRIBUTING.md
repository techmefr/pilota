# Contributing to Pilota

Thanks for helping. Pilota is a set of small, composable tools — the guiding
principle below is what keeps them composable.

## The independence rule (non-negotiable)

**Every package must build, test and be used on its own. No tool forces another
on you.**

- **Core tools — `nexdk`, `beepr`, `chaff` — depend on nothing else in the repo.**
  Never import one core package from another. Never add a sibling package to a
  core package's `dependencies`. `nexdk` in particular has **zero** runtime
  dependencies (its event contract and `mergeEventHandlers` are native; `zod` is
  a `peerDependency`).
- **Extensions — drivers and `@pilota/hooks` — peer-depend on `nexdk` only.**
  A driver plugs into the SDK the way an ESLint/Vite plugin plugs into its host:
  `nexdk` goes in `peerDependencies` (plus a `devDependency` `workspace:*` so the
  package still builds in isolation), **never** in `dependencies`. You bring
  `nexdk`; the driver doesn't bundle its own copy.
- **External libraries**: put them in `peerDependencies` when the consumer
  already has them (`zod`, `vue`), or in `dependencies` when the package genuinely
  owns them at runtime (`hookable` for beepr, `@supabase/supabase-js` for the
  supabase driver, `chaff` for lomkit's mock feature).

If a change would make one package need another core package, stop — rethink it.
The tiny duplication of the event-contract type between `nexdk` and `beepr` is
the deliberate price of independence; do **not** introduce a shared package.

## Writing a driver

Read [docs/writing-a-driver.md](docs/writing-a-driver.md). In short: use
`defineDriver` from `nexdk` (you write only the protocol translation; the unified
event contract is supplied), declare your typed API via the `ResourceApiKinds`
augmentation + `__apiUri`, and follow the naming convention:

- official drivers: `@pilota/driver-<backend>`
- community drivers: `pilota-driver-<backend>`

`@pilota/driver-nest` is the reference example.

## Conventions

- **Language**: all code, comments and docs in English.
- **File size**: keep source code files under 200 lines; split by responsibility.
- **Types**: strict TypeScript, no `any` (use `unknown`); validate at boundaries
  with Zod.
- **Tests**: every package uses Vitest; cover new behaviour. Drivers mock
  `fetch` / `WebSocket`.
- **Error/event contract**: emit the `'error'` event, then `throw`, on any
  failure (network, non-2xx HTTP, validation). `defineDriver` does this for you.

## Build & test

```bash
pnpm install
pnpm --filter <package> build      # e.g. nexdk, beepr, @pilota/driver-nest
pnpm --filter <package> test
pnpm --filter "./packages/**" test # everything
```

Each package must pass `build` + `test` on its own.

## Commits & releases

- Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`…).
- No AI attribution in commit messages.
- Versioning/publishing via changesets: `pnpm changeset`, `pnpm version-packages`,
  `pnpm release`.
