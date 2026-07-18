# @ekz/async-data

## 1.0.2

### Patch Changes

- 23d366c: Include declared `lib` (CJS, ESM, `.d.ts`) artifacts in published tarballs.

  The build was wired to a `prepublish` script, which npm ≥7 and Yarn Berry do not run at publish
  time, so `changeset publish` (`npm publish` under the hood) shipped tarballs containing only
  `package.json`, `README.md`, and `LICENSE`. `lib` is gitignored, so it was never present in a clean
  CI checkout either. Renamed the hook to `prepack`, which runs for both `npm publish`/`npm pack` and
  `yarn npm publish`/`yarn pack`, so `lib` is built into the tarball and `npm pack` output can be
  verified locally.

- cc378db: Fix internal dependencies published with the `workspace:^` protocol instead of a resolvable semver range, which broke installs outside the monorepo (e.g. `pnpm add @ekz/api` failing with `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`).

  Fixes erkez/ekz#1.

- Updated dependencies [23d366c]
  - @ekz/option@2.0.2

## 1.0.1

### Patch Changes

- 6aa0479: TypeScript 6 and React 19 type compatibility across `@ekz` libraries.

  - **@ekz/formix**: add TypeScript 6 to `peerDependencies`; standardize tests under `src/main/web/**/__tests__`.
  - **@ekz/blueprintjs**: upgrade Blueprint dependencies; widen `Table` `noResultsDescription` prop to `React.ReactNode` for React 19 types.
  - **@ekz/api**: replace Node `querystring` types in `stringifyQueryParams` with local option types (TypeScript 6); bump `axios` to `^1.18.0`.
  - **@ekz/react-utils**: fix `useTimer` ref typing for browser `setTimeout` (TypeScript 6).
  - **@ekz/async-data** and **@ekz/option**: compile and test tooling updates only; no public API changes.

- Updated dependencies [6aa0479]
  - @ekz/option@2.0.1

## 1.0.0

### Major Changes

- 074e8ca: Standardize on TypeScript builds with `esm` / `cjs` / `esnext` outputs and drop legacy tooling.

  - **@ekz/option** and **@ekz/async-data**: remove Flow; publish types from `lib/esm`.
  - **@ekz/formix**: remove webpack, Babel, and `bin/setup-node`; align package layout and entry points with other `@ekz/*` libraries.

  **Breaking:** `main` / `module` / `typings` now point at `lib/cjs` and `lib/esm` (not the old single-file `lib/index.js` bundle). Flow types are no longer published.

### Patch Changes

- Updated dependencies [074e8ca]
  - @ekz/option@2.0.0
