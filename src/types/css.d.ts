import "react";

declare module "react" {
  /** Mengizinkan CSS custom properties (mis. "--brand-accent") di prop `style` tanpa type cast. */
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
