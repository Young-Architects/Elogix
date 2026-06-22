import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — merge conditional class names safely.
 *
 * `clsx` resolves conditional/array/object class inputs into a string, then
 * `tailwind-merge` de-duplicates conflicting Tailwind utilities so the last one
 * wins (e.g. `cn("p-2", "p-4")` → `"p-4"`). This is the standard shadcn/ui
 * helper; it is wired up via `components.json` for any generated UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}