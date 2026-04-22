---
name: git
description: Git workflow conventions covering commit messages, branching, rebasing, conflict resolution, and PR hygiene. Use when committing, branching, rebasing, resolving conflicts, opening pull requests, or writing commit messages.
---

# Git

## Commit messages (Conventional Commits)

```
<type>(<scope>): <subject>

<body, optional>

<footer, optional>
```

**Types:** `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`, `style`.

**Rules:**
- Subject: imperative mood, ≤ 72 chars, no trailing period.
- Body: *why*, not *what* — the diff already shows what.
- One logical change per commit. If you find yourself writing `and` in the subject, split the commit.

**Examples:**
```
feat(listings): add deep-link search with query param sync
fix(auth): prevent double-submit during login request
refactor(theme): extract palette tokens into separate file
perf(home): memoize listing filter to stop O(n) on keystroke
test(filter): cover price-asc sorting with auction bids
```

## Branching

- `main` → always deployable.
- Feature branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Keep branches short-lived (< 1 week). Rebase daily against `main`.

## Before opening a PR

- [ ] Rebase on latest `main` (not merge).
- [ ] Squash fixup commits (`git rebase -i`).
- [ ] Run lint + typecheck + tests locally.
- [ ] Self-review the diff in the PR UI before requesting review.
- [ ] PR description explains *why*, links the issue, lists manual test steps.

## Rebase vs merge

- **Rebase** your feature branch onto `main` while in progress (clean history).
- **Merge** (`--no-ff`) into `main` at PR merge time (preserves PR boundary).
- Never rebase a branch others have checked out without coordinating.

## Conflict resolution

1. Understand both sides before resolving — read `git log --oneline` on each.
2. Resolve, then run tests. Don't trust the merge just because the markers are gone.
3. For generated files (lockfiles, build output): regenerate, don't hand-merge.
4. After resolving during rebase: `git add <files> && git rebase --continue`.

## Useful recovery

```bash
git reflog                          # find any commit you "lost"
git reset --hard HEAD@{N}           # jump back to a reflog entry
git stash && git stash pop          # park changes temporarily
git commit --amend --no-edit        # fix the last commit's files
git cherry-pick <sha>               # grab a single commit from another branch
git bisect start / good / bad       # binary search for a regression
```

## What NOT to commit

- Secrets, `.env` files, API keys, certificates.
- Generated artifacts: `node_modules/`, `ios/Pods/`, `android/build/`, `dist/`, `.next/`.
- IDE settings beyond agreed-on shared ones (`.vscode/settings.json` is fine; user-specific configs are not).
- Lockfiles from non-canonical package managers for the project.

Always check `.gitignore` covers these before the first commit of a new project.

## PR description template

```markdown
## What
Brief description of the change.

## Why
The problem being solved or feature being added. Link the issue.

## How
Key implementation decisions, especially non-obvious ones.

## Testing
- [ ] Unit tests added/updated
- [ ] Manual test steps: 1) ... 2) ...

## Screenshots / recordings
(For UI changes)
```

## In this project (AltLite)

- No hooks committed yet; add `husky` + `lint-staged` when the team grows.
- `.gitignore` already excludes `node_modules/`, `ios/Pods/`, build artifacts.
- Tests run via `npm test`; typecheck via `npm run typecheck`; lint via `npm run lint`.
