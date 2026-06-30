# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

- Add a changeset for a change you want released: `pnpm changeset`
- Apply pending changesets to bump versions + changelogs: `pnpm version-packages`
- Build and publish to npm: `pnpm release`

Private packages (the playgrounds under `playground/`) are ignored automatically.
The published libraries are `nexdk`, `beepr`, `chaff`, and the `@pilota/driver-*` drivers.
