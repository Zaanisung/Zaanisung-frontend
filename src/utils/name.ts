/**
 * Returns the first word of a person's name, safely.
 *
 * Account profiles can, in edge cases, surface an empty or missing `name`,
 * which previously crashed the landing success panel and the dashboard
 * greeting with `Cannot read properties of undefined (reading 'split')`.
 */
export function firstName(name?: string | null): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  return words[0] ?? "";
}