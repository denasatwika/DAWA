import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

export type ButtonVariant = "solid" | "inverse" | "accent" | "link";
export type ButtonSize = "sm" | "md";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Membuka di tab baru (mis. WhatsApp, Instagram). */
  external?: boolean;
  className?: string;
}

/**
 * Tombol berbentuk tautan. Situs ini statis, jadi semua aksi adalah navigasi:
 * rute internal memakai next/link, anchor (#) dan URL eksternal memakai <a>.
 */
export function ButtonLink({
  href,
  children,
  variant = "solid",
  size = "md",
  external = false,
  className,
}: ButtonLinkProps) {
  const classes = cn(styles.button, styles[variant], styles[size], className);

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
