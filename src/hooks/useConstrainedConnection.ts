"use client";

import { useSyncExternalStore } from "react";

interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}

const getConnection = () =>
  (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

function subscribe(onChange: () => void) {
  const connection = getConnection();
  connection?.addEventListener("change", onChange);
  return () => connection?.removeEventListener("change", onChange);
}

/** Cek langsung (di luar render), mis. sesaat sebelum memutar video. */
export function isConstrainedConnection(): boolean {
  const connection = getConnection();
  if (!connection) return false; // browser tanpa Network Information API (mis. Safari)
  return Boolean(connection.saveData) || ["slow-2g", "2g"].includes(connection.effectiveType ?? "");
}

/**
 * true jika pengguna memakai mode hemat data atau jaringan 2G.
 * Dipakai untuk melewati unduhan berat (mis. video hero). Saat prerender selalu false.
 */
export function useConstrainedConnection(): boolean {
  return useSyncExternalStore(subscribe, isConstrainedConnection, () => false);
}
