# AGENT.md — pilota-driver-template

## Role
A clonable skeleton for a Pilota **community** driver. It is a template, not a
real driver — it lives at `packages/driver-template` (outside `packages/drivers`)
and is `private: true` so it is never published.

## Keep it minimal + working
- It must **build and pass its test as-is** so CI keeps it valid. Do not grow it
  into a real driver here; a real driver is a fresh clone.
- Two representative methods (`get`, `create`) built WITH `defineDriver`, with
  `// TODO:` markers where an author fills in their backend. Keep files short.

## Dependency rule
- `nexdk` is a **peerDependency** (+ devDependency `workspace:*`), never a
  `dependency`. See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Build/test
`node_modules/.bin/unbuild` · `node_modules/.bin/vitest run`. Tests mock `fetch`.
