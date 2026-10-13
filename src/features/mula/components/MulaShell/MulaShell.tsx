import type { ReactNode } from "react";
import styles from "./MulaShell.module.css";

/**
 * Pembungkus halaman Mula Solusi: memasang token desain neumorphic dan font Manrope.
 * data-theme="dark" membuat bingkai halaman (latar <body>, scrollbar) ikut gelap.
 */
export function MulaShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell} data-theme="dark">
      {children}
    </div>
  );
}
