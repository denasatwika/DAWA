import type { ReactNode } from "react";
import { SiteChrome } from "../site-chrome";

/** Beranda grup dan halaman brand umum (Rentalek, Dawa Decoration). */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
