# @ekz libraries

Public monorepo for the [`@ekz`](https://www.npmjs.com/org/ekz) npm packages.

| Package | Description |
|---------|-------------|
| [`@ekz/option`](./option) | Option/Maybe type ([docs](https://docs.ekz.io/option/)) |
| [`@ekz/async-data`](./async-data) | Async data wrapper for promises ([docs](https://docs.ekz.io/async-data/)) |
| [`@ekz/react-utils`](./react-utils) | React hooks and utilities ([docs](https://docs.ekz.io/react-utils/)) |
| [`@ekz/formix`](./formix) | Type-safe React forms ([docs](https://docs.ekz.io/formix/)) |
| [`@ekz/api`](./api) | HTTP/WebSocket API client ([docs](https://docs.ekz.io/api/)) |
| [`@ekz/blueprintjs`](./blueprintjs) | Blueprint-based UI components |

Documentation: [https://docs.ekz.io](https://docs.ekz.io)

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
