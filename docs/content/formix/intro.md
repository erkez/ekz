---
slug: /
sidebar_position: 1
title: Introduction
---

# Formix

**Formix** (`@ekz/formix`) is a headless, type-safe React form library for TypeScript. It focuses on:

- **Field references** instead of stringly-typed form state
- **Composable validation** with `useFieldValidation`
- **Array fields** for dynamic lists
- **Submit gating** via `valid` and `modified` from `useForm`

Formix does not ship UI components. You bind `FieldRef` values to your own inputs (or a design system) with `useField` and `useArrayField`.

## When to use Formix

Reach for Formix when you need:

- Type-safe mapping from form state to API payloads
- Field-level and cross-field validation that blocks submit
- Dynamic lists (add/remove rows) with per-row rules
- A consistent pattern across modals, wizards, and settings pages

## Core concepts

| Concept | Role |
| ------- | ---- |
| `defineField` / `defineArrayField` | Declare typed field references |
| `withForm` / `useForm` | Provide form context and read `valid`, `modified`, `getValues` |
| `useField` / `useArrayField` | Bind inputs to field refs |
| `useFieldValidation` | Register validators; errors surface on fields |

## Install

```bash
npm install @ekz/formix @ekz/option immutable react
# or
yarn add @ekz/formix @ekz/option immutable react
```

Peer dependencies: `react`, `typescript`, `immutable`, `@ekz/option`.

## Next steps

- [Getting started](./getting-started) — minimal working form
- [Form shell](./guide/form-shell) — `withForm`, submit gating
- [Fields](./guide/fields) — scalars, arrays, serialization
- [Validation](./guide/validation) — rules, cross-field deps, stable errors
