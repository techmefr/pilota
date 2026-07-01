# Pilota driver template — clone, rename, implement, publish

A minimal, working skeleton of a Pilota driver built with `defineDriver` from
`nexdk`. Clone it, rename it to your backend, fill in the `// TODO:` markers, and
publish. It ships with a passing test so you always start from a green baseline.

Read [docs/writing-a-driver.md](../../docs/writing-a-driver.md) for the full
authoring guide and [CONTRIBUTING.md](../../CONTRIBUTING.md) for the repo rules
(the independence rule is the important one: **peer-depend on `nexdk`, never
depend on it**).

## What's inside

- `src/driver.ts` — `createTemplateDriver(config)` with two representative
  methods (`get`, `create`) hitting a generic REST endpoint.
- `src/types.ts` — `TemplateConfig`, `TemplateResourceApi<T>`, and the
  `declare module 'nexdk'` typing wiring keyed `template` + the `__apiUri`.
- `test/template.test.ts` — mocks `fetch`, asserts `get` hits the endpoint and a
  non-OK response emits `error` then throws.

## Steps

1. **Copy** this folder out to its own repo (or a new package) and rename it to
   `pilota-driver-<backend>`.
2. **`package.json`**: set `name` to `pilota-driver-<backend>`, flip
   `"private"` to `false`, and add publish metadata — `description`,
   `"license": "MIT"`, `author`, `repository` (+ `directory`), and
   `"publishConfig": { "access": "public" }`. Bump `version` off `0.0.0`.
3. **Rename the identifiers**: `Template*` → `<Backend>*`, and the `template`
   uri (the `name`, the `__apiUri` marker, and the `ResourceApiKinds` key) →
   your backend uri. These three must match.
4. **Implement the methods**: adjust the URL shape and response-envelope
   unwrapping in `src/driver.ts`, and add `find`/`update`/`remove` (plus their
   signatures in `TemplateResourceApi<T>`) as your backend needs.
5. **Test**: mirror the existing test for each method you add, then `build` and
   `test`.

## Build & test

```bash
pnpm install
pnpm build   # unbuild
pnpm test    # vitest run
```

## Naming convention

- Official drivers: `@pilota/driver-<backend>`.
- Community drivers: `pilota-driver-<backend>` (this template).
