"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/** State menu mobile: tutup otomatis saat pindah halaman, kunci scroll, dan dukung Escape. */
export function useMobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Tutup saat rute berubah (pola "derive state from props", tanpa efek tambahan)
  if (isOpen && openedAt !== pathname) {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const toggle = useCallback(() => {
    setOpenedAt(pathname);
    setIsOpen((open) => !open);
  }, [pathname]);

  return { isOpen, toggle, pathname };
}
