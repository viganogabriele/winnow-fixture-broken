/**
 * Pre-existing debt, on purpose.
 *
 * The unused `LEGACY_PREFIX` below produces one ESLint warning, and it is on
 * `main` as well as on every branch. No pull request in this fixture touches
 * this file.
 *
 * It exists so that a correct QA tool stays **quiet** about it: a tool that
 * reports every problem it can see would flag this on every pull request, which
 * is exactly the noise that makes such tools get switched off.
 */

const LEGACY_PREFIX = "v1:";

export function legacyKey(id: string): string {
  return `legacy-${id}`;
}
