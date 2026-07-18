# @ekz/react-utils

## 1.0.2

### Patch Changes

- 23d366c: Include declared `lib` (CJS, ESM, `.d.ts`) artifacts in published tarballs.

  The build was wired to a `prepublish` script, which npm ≥7 and Yarn Berry do not run at publish
  time, so `changeset publish` (`npm publish` under the hood) shipped tarballs containing only
  `package.json`, `README.md`, and `LICENSE`. `lib` is gitignored, so it was never present in a clean
  CI checkout either. Renamed the hook to `prepack`, which runs for both `npm publish`/`npm pack` and
  `yarn npm publish`/`yarn pack`, so `lib` is built into the tarball and `npm pack` output can be
  verified locally.

## 1.0.1

### Patch Changes

- 6aa0479: TypeScript 6 and React 19 type compatibility across `@ekz` libraries.

  - **@ekz/formix**: add TypeScript 6 to `peerDependencies`; standardize tests under `src/main/web/**/__tests__`.
  - **@ekz/blueprintjs**: upgrade Blueprint dependencies; widen `Table` `noResultsDescription` prop to `React.ReactNode` for React 19 types.
  - **@ekz/api**: replace Node `querystring` types in `stringifyQueryParams` with local option types (TypeScript 6); bump `axios` to `^1.18.0`.
  - **@ekz/react-utils**: fix `useTimer` ref typing for browser `setTimeout` (TypeScript 6).
  - **@ekz/async-data** and **@ekz/option**: compile and test tooling updates only; no public API changes.
