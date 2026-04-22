---
name: backend
description: Backend and API-boundary engineering conventions covering auth, input validation, data modeling, error shape, and network layer design for client apps and services. Use when designing APIs, auth flows, data fetchers, storage layers, or anything that crosses a trust boundary.
---

# Backend

This project currently has no custom backend — data comes from a static S3 URL and user-generated data is local. This skill guides (a) how to design the **local data / API boundary** so it's swappable later, and (b) what a real backend should look like when it lands.

## Trust boundaries

Every boundary is a validation point:

1. **Network → app**: parse + validate every response with a schema. Never trust shape.
2. **User input → app**: `zod` schema on every form before it hits a store.
3. **App → storage**: serialize deterministically, version your data (`{ version: 1, data: ... }`).
4. **Storage → app**: handle missing keys, corrupted JSON, schema drift (migrate or discard).

## Auth model (local, upgrade-friendly)

When auth lives client-side but must port to a server later:

- Hash passwords client-side **only as a placeholder** (`sha256` iterated) — mark it clearly as local-only.
- Store `{ userId, email, passwordHash, salt, createdAt }` keyed by email.
- Session = `{ userId, issuedAt }` in persisted store; add `expiresAt` when migrating.
- Registration + login funnel through one `authService` module — swap implementations later without touching screens.

**When a real backend lands:**
- Move hashing to server (argon2id / bcrypt).
- Session → JWT or httpOnly cookie.
- Replace local store writes with API calls; keep the same hook surface (`useAuthStore` shape stays the same — only internals change).

## API layer shape

```
src/api/
  client.ts       # fetch wrapper, base URL, auth header injection, error normalization
  <resource>.ts   # typed endpoints, e.g. listings.ts, users.ts
src/features/<f>/queries.ts  # React Query hooks that call src/api/<resource>.ts
```

- One fetch wrapper; normalize errors to `{ code, message, status }`.
- Every endpoint returns a schema-validated DTO.
- **Never import `fetch` directly in a component.** Go through a query hook.

## Error handling

- Network failures → retry with backoff (React Query default, tuned).
- 4xx → surface user-actionable message; do not retry.
- 5xx → retry once, then show "Something went wrong, try again".
- Auth 401 → kick to login, stash intended route (see deep-link pending pattern).

## Data modeling

- Model the **wire format** and the **app format** separately. A `normalize()` function bridges them.
- Use discriminated unions for polymorphic data (`type: 'auction' | 'fixed-price'`) — never optional fields that mean "look at the other one".
- Timestamps: ISO 8601 strings across the wire, `Date` objects in memory only when arithmetic is needed.

## In this project (AltLite)

- S3 listings: `src/features/listings/queries.ts` fetches, `normalize.ts` maps raw → `Listing` union.
- Auth: `src/features/auth/store.ts` + `hash.ts` — see `README.md` "Swap local → API" section.
- Saved store: persisted `Set<string>` of listing IDs; replacing with an API is a one-function swap.
