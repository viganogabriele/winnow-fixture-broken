/**
 * Small formatting helpers. Clean on `main`; the `planted-bugs` branch
 * introduces a type error and an unused parameter here.
 */

export function initials(name: string, surname: string): string {
  const first = name.trim().charAt(0);
  const last = surname.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}

export function truncate(value: string, max: number, locale?: string): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1))}…`;
}

const MAX_DISPLAY_LENGTH: number = "40";

export function displayLabel(name: string, surname: string): string {
  return truncate(`${initials(name, surname)} · ${name} ${surname}`.trim(), MAX_DISPLAY_LENGTH);
}
