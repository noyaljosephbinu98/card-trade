---
name: frontend
description: Frontend engineering conventions covering accessibility, performance, state management boundaries, and component design for web and mobile UIs. Use when building or reviewing any UI code, components, screens, forms, lists, or anything that renders in a browser or on a device.
---

# Frontend

## Core principles

1. **Accessibility is not optional.** Every interactive element needs a role + label. Hit targets ≥ 44×44 pt. Respect user color scheme (`prefers-color-scheme`, `useColorScheme()`).
2. **Primitives over re-implementation.** Buttons, inputs, chips, empty-states, skeletons belong in a shared `components/` folder. Never restyle a button inline in a screen.
3. **Forms have schemas.** User input is untrusted — validate with `zod` (or equivalent), bind via `react-hook-form`. Show field-level errors, not global alerts.
4. **State lives where it's read.** Component-local first, feature-store second, global store only for truly cross-cutting state (auth, theme).
5. **Styles scale with theme.** Never hardcode colors. Use a `useTheme()` or CSS variables. Memoize theme-dependent styles (`useMemo(() => makeStyles(t), [t])`).

## Performance checklist (before shipping a list-heavy screen)

- Rows wrapped in `React.memo`, props are primitives or stable references.
- Filtering / sorting wrapped in `useMemo` with tight deps.
- Search input **debounced** (~250 ms) before hitting any store.
- No inline `{}`, `[]`, or arrow functions crossing a `memo` boundary (ESLint `react-perf/*` catches these).
- Images: lazy-loaded, cached, correctly sized.

## Forms checklist

- [ ] Schema defined once, shared between form + any API boundary.
- [ ] Loading state disables submit + shows spinner.
- [ ] Errors are shown inline, not via alert/modal (except network errors).
- [ ] `autoComplete` / `textContentType` set correctly (email, password, name).
- [ ] Keyboard type matches field (`email-address`, `numeric`).
- [ ] Submit on Enter / keyboard return key works.

## Folder shape (feature-first)

```
features/
  <feature-name>/
    store.ts              # state owned by this feature
    schemas.ts            # zod schemas (if forms)
    components/           # feature-local components
    screens/ | pages/     # feature screens
    queries.ts            # API hooks (React Query / SWR / tanstack)
    index.ts              # public barrel
components/               # shared primitives only
hooks/                    # shared hooks
utils/                    # pure helpers (formatters, parsers)
```

## Anti-patterns

- God components > 300 lines — split by responsibility.
- Mixing network + render + styling in one file — extract `queries.ts`, `styles.ts` (or `makeStyles`).
- Prop drilling more than 2 levels — reach for context or a store.
- Any `any` in props types.
- Styles inside `render()` or `return (...)`.

## In this project (AltLite)

- Shared primitives: `src/components/` (`Button`, `Input`, `Chip`, `EmptyState`, `Skeleton`).
- Feature layout: `src/features/{auth,listings,saved,profile,theme}/`.
- Theme: `src/features/theme/useTheme.ts` — always `const theme = useTheme();` at the top of a screen.
- Forms: `react-hook-form` + `zod` (`src/features/auth/schemas.ts`).
