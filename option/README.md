# @ekz/option

Option/Maybe type for TypeScript — a port of Scala's `Option`.

**Documentation:** [https://docs.ekz.io/option/](https://docs.ekz.io/option/)

## Install

```bash
npm install @ekz/option
```

## Quick example

```typescript
import { Option, Some, None } from '@ekz/option';

const label = Option.of(maybeName).map((n) => n.trim()).getOrElse(() => 'Anonymous');

Some(1).flatMap((n) => (n > 0 ? Some(n) : None)); // Some(1)
```

See the [docs](https://docs.ekz.io/option/) for constructors, transformations, and safe unwrapping.
