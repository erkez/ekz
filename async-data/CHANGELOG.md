# @ekz/async-data

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
