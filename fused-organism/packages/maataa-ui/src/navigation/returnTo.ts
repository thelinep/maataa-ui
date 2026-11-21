/**
 * @maataa/ui/navigation/returnTo
 * Remember where someone was going before sign-in, and send them back safely
 */

const KEY = "maataa.returnTo";

/**
 * Returns `target` only if it is a same-origin path (no protocol-relative or
 * external URLs, no javascript:). Otherwise returns `fallback`.
 */
export function safeReturnTo(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback;
  const t = target.trim();
  if (!t.startsWith("/") || t.startsWith("//") || t.startsWith("/\\")) return fallback;
  try {
    const url = new URL(t, "https://maataa.invalid");
    if (url.origin !== "https://maataa.invalid") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

/** Store the current location before redirecting to sign-in. */
export function rememberReturnTo(path: string): void {
  try {
    sessionStorage.setItem(KEY, safeReturnTo(path));
  } catch {
    /* storage unavailable */
  }
}

/** Read and clear the stored location; falls back to `fallback`. */
export function consumeReturnTo(fallback = "/"): string {
  try {
    const v = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return safeReturnTo(v, fallback);
  } catch {
    return fallback;
  }
}
