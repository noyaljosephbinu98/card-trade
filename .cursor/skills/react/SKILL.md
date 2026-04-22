---
name: react
description: React-specific patterns for hooks, memoization, context, state colocation, and render performance. Use when writing or reviewing React components, hooks, or any .tsx / .jsx code, or when debugging re-renders, stale closures, or render loops.
---

# React

## The memoization rule

Don't memoize everything — memoize what crosses a boundary.

**Memoize when:**
- Prop crosses a `React.memo` child (arrays, objects, callbacks must be stable).
- Value is expensive to compute (`> O(n)` over a list).
- Hook returns an object/array consumed in a dep array downstream.

**Don't memoize when:**
- The child isn't memoized anyway (React will re-render regardless).
- The dep array is a new object every render (memoization is a no-op).
- It's a primitive — React's `===` check is free.

## Hooks rules (beyond the official ones)

1. **One concern per hook.** `useAuth()` returns auth. Don't bundle unrelated state.
2. **Selectors for stores.** With Zustand/Redux, subscribe to the narrowest slice:
   ```ts
   const user = useAuthStore(s => s.user);        // ✅
   const { user, login } = useAuthStore();         // ❌ re-renders on any change
   ```
3. **Derive, don't sync.** If B can be computed from A, compute it in render (with `useMemo` if expensive). Never `useEffect(() => setB(f(a)), [a])`.
4. **Effects are for side effects** (subscriptions, focus, imperative APIs). Not for state transformation.

## Re-render debugging

Use this order:

1. Install React DevTools, flip on "Highlight updates when components render".
2. If a child flashes every render, the parent is passing an unstable prop. Check arrays / objects / inline functions.
3. If a context consumer re-renders on unrelated changes, split the context (stable vs volatile).
4. If a list row re-renders when unrelated rows change, the row isn't `memo`'d or `keyExtractor` is unstable.

## Context vs store

| Use Context when... | Use a store when... |
|---|---|
| Value rarely changes (theme, i18n, auth user object) | Value changes often or is read by many components |
| Scope is a subtree | Scope is app-wide |
| You want provider-level reset | You want granular subscriptions |

Context triggers **all consumers** on any change. Stores (Zustand, Jotai) only trigger subscribers of the changed slice.

## Component design

- **Props as data, not instructions.** `<Button variant="danger" />` not `<Button onStyle={...} />`.
- **Children for composition.** If you're tempted to add `leftIcon`, `rightIcon`, `label`, `subtitle` props, accept `children` instead.
- **Compound components** for things like `Menu.Root / Menu.Item` when parts must share state.
- **Render props / hooks** for behavior; **components** for DOM shape.

## Forms

- `react-hook-form` for anything with > 2 fields.
- `zod` schema drives validation and type inference (`z.infer<typeof schema>`).
- Connect with `zodResolver` from `@hookform/resolvers/zod`.

## TypeScript with React

- `React.FC` is unnecessary — type props directly: `function Button(props: ButtonProps) { ... }`.
- Event handlers: `React.MouseEventHandler<HTMLButtonElement>`, not `(e: any) => void`.
- `children: React.ReactNode` (never `JSX.Element` — that excludes strings, arrays, null).
- Prefer `type` over `interface` for props (better with unions and intersection).

## Anti-patterns

- `useEffect` to copy a prop into state.
- `useMemo(() => x, [])` when `x` is already a primitive or already stable.
- Multiple `useState` calls that always change together — use one `useReducer`.
- `key={index}` on a reorderable or filterable list.
- Reading and writing the same state in one effect (loop hazard).

## In this project (AltLite)

- Store selectors: `src/features/saved/store.ts`, `src/features/auth/store.ts` — all reads use narrow selectors.
- Memo boundaries: `src/features/listings/components/ListingCard.tsx` (`React.memo`), `ListingList.tsx`.
- Theme-dependent styles: `useMemo(() => StyleSheet.create({...}), [theme])`.
