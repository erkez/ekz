# @ekz/async-data

## 1.0.0

### Major Changes

- 074e8ca: Standardize on TypeScript builds with `esm` / `cjs` / `esnext` outputs and drop legacy tooling.

  - **@ekz/option** and **@ekz/async-data**: remove Flow; publish types from `lib/esm`.
  - **@ekz/formix**: remove webpack, Babel, and `bin/setup-node`; align package layout and entry points with other `@ekz/*` libraries.

  **Breaking:** `main` / `module` / `typings` now point at `lib/cjs` and `lib/esm` (not the old single-file `lib/index.js` bundle). Flow types are no longer published.

### Patch Changes

- Updated dependencies [074e8ca]
  - @ekz/option@2.0.0
