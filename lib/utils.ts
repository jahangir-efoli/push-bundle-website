/** Join conditional class names. Tiny local helper — no extra dependency. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
