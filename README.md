# @ekz libraries

Public monorepo for the [`@ekz`](https://www.npmjs.com/org/ekz) npm packages.

| Package | Description |
|---------|-------------|
| [`@ekz/react-utils`](./react-utils) | React hooks and utilities |
| [`@ekz/api`](./api) | HTTP/WebSocket API client |
| [`@ekz/blueprintjs`](./blueprintjs) | Blueprint-based UI components |

## Development

Requires Node 20+ and Yarn 4 (Corepack).

```bash
corepack enable
yarn install --immutable
yarn lint
yarn compile
```

## Releases

Versions are managed in a separate private repository with [Changesets](https://github.com/changesets/changesets). This repository is synced automatically when packages are published to npm.

To report bugs or suggest improvements, open an issue here.

## Maintainer notes

This directory is a **template** checked into the private monorepo. Shared tooling (`.prettierrc`, `.eslintrc`, `.yarnrc.yml`, etc.) is copied from the monorepo root at sync time by `scripts/assemble-ekz-public-mirror.sh`. Only mirror-specific files live here.
