"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Berlangganan ke media query CSS secara aman untuk SSR/static export.
 * Saat prerender (server) selalu mengembalikan `serverFallback`.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
