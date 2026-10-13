import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Container.module.css";

interface ContainerProps {
  as?: ElementType;
  /** "content" (default) untuk konten halaman, "chrome" untuk navbar & footer yang lebih sempit. */
  size?: "content" | "chrome";
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}

/** Membatasi lebar konten dan memberi gutter kiri-kanan yang konsisten. */
export function Container({
  as: Tag = "div",
  size = "content",
  children,
  className,
  ...rest
}: ContainerProps) {
  return (
    <Tag className={cn(styles.container, size === "chrome" && styles.chrome, className)} {...rest}>
      {children}
    </Tag>
  );
}
