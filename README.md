# @ekz libraries

Public monorepo for the [`@ekz`](https://www.npmjs.com/org/ekz) npm packages.

| Package | Description |
|---------|-------------|
| [`@ekz/option`](./option) | Option/Maybe type |
| [`@ekz/async-data`](./async-data) | Async data wrapper for promises |
| [`@ekz/react-utils`](./react-utils) | React hooks and utilities |
| [`@ekz/formix`](./formix) | Type-safe React forms |
| [`@ekz/api`](./api) | HTTP/WebSocket API client |
| [`@ekz/blueprintjs`](./blueprintjs) | Blueprint-based UI components |

## Development

Requires Node 24 and Yarn 4 (Corepack).

```bash
corepack enable
yarn install --immutable
yarn lint
yarn compile
```

## Releases

Package versions are managed with [Changesets](https://github.com/changesets/changesets) and published to npm. This repository is updated automatically when new versions are released.

To report bugs or suggest improvements, open an issue here.
