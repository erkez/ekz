# @ekz/react-utils

## 1.0.1

### Patch Changes

- 6aa0479: TypeScript 6 and React 19 type compatibility across `@ekz` libraries.

  - **@ekz/formix**: add TypeScript 6 to `peerDependencies`; standardize tests under `src/main/web/**/__tests__`.
  - **@ekz/blueprintjs**: upgrade Blueprint dependencies; widen `Table` `noResultsDescription` prop to `React.ReactNode` for React 19 types.
  - **@ekz/api**: replace Node `querystring` types in `stringifyQueryParams` with local option types (TypeScript 6); bump `axios` to `^1.18.0`.
  - **@ekz/react-utils**: fix `useTimer` ref typing for browser `setTimeout` (TypeScript 6).
  - **@ekz/async-data** and **@ekz/option**: compile and test tooling updates only; no public API changes.
