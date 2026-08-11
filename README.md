# winnow-fixture-broken

A deliberately defective web application, used to verify [winnow](https://github.com/viganogabriele/winnow).
It exists to be broken on purpose, in ways that are known in advance, so that a QA tool can be judged on
whether it finds exactly those defects and nothing else.

**This is a test fixture. Do not depend on it, and do not copy it as an example of anything.**

## The design: `main` is green, the pull request is not

The interesting property of this repository is not that it contains bugs — it is *where* they live.

- **`main` is clean and working.** The application boots, all three end-to-end tests pass, `tsc` is happy,
  and ESLint reports one long-standing warning that nobody has fixed.
- **The `planted-bugs` branch introduces four defects**, one of each class winnow needs to catch.

That split is the point. A tool that reports every problem it can see is useless on a real repository; the
question is whether it reports **what this change introduced**. The pre-existing ESLint warning on `main` is
there precisely so that a correct tool stays quiet about it.

## What the pull request plants

| # | Class | Where | What a correct tool should say |
|---|---|---|---|
| 1 | **Runtime 500** | `src/server.ts` — the `surname` default is removed from the destructuring | `PATCH /api/profile` with no surname → 500, unhandled `TypeError`, with the exact request |
| 2 | **Type error** | `src/format.ts` — a `number` assigned a string | `tsc` fails; the build stops |
| 3 | **Mobile layout** | `public/index.html` — the container's `padding-bottom` is removed | at 390×844 the submit button is covered by the fixed footer |
| 4 | **New lint warning** | `src/format.ts` — an unused parameter | one *new* ESLint warning, on the changed line |

And what it should **not** say:

| Not a finding | Why |
|---|---|
| The pre-existing ESLint warning in `src/legacy.ts` | It is on `main` too. The pull request never touches that file. |
| Anything in `e2e/` | The tests are correct; they are what *detects* defects 1 and 3. |

## Running it

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint           # ESLint
pnpm build          # tsc --noEmit
pnpm test:e2e       # Playwright, desktop + mobile
```

On `main` everything passes except the one known lint warning. On `planted-bugs`, `pnpm build` fails and two
of the three Playwright tests fail.

## Why the tests live here

The end-to-end tests are deliberately written to catch defects 1 and 3, because a repository's own tests are
the most trustworthy signal a QA tool can use — winnow prefers running them over generating its own. A
fixture whose tests pass while the application is broken would be testing the wrong thing.

## Licence

MIT. It is a test fixture; take whatever is useful.
