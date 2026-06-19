# @ekz documentation

Unified [Docusaurus](https://docusaurus.io/) site for all public `@ekz` package docs.

Published at [https://docs.ekz.io](https://docs.ekz.io).

## Structure

```
modules/ekz/docs/
  content/        # markdown per package (formix, api, …)
  sidebars/       # one sidebar config per package
  packages.ts     # package metadata (nav, colors, routes)
  src/pages/      # landing page
```

Add or edit docs under `content/<package>/`. Register new packages in `packages.ts`, add a sidebar file, and extend `docusaurus.config.ts` via the shared `ekzDocPackages` list.

## Local development

Isolated Yarn project (not part of the monorepo workspace).

```bash
cd modules/ekz/docs
corepack enable
yarn install
yarn start
```

## Deploy

`.github/workflows/ekz-docs.yml` builds and publishes to the `gh-pages` branch of the public `erkez/ekz` repository.
