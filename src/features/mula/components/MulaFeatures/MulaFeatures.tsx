import type { ComponentType } from "react";
import { CalendarBlankIcon, ShieldCheckIcon, TruckIcon, UserIcon } from "@/components/ui";
import styles from "./MulaFeatures.module.css";

export type MulaFeatureIcon = "delivery" | "tested" | "flexible" | "support";

interface MulaFeaturesProps {
  id: string;
  items: readonly { icon: MulaFeatureIcon; title: string; text: string }[];
}

type IconComponent = ComponentType<{ size?: number; weight?: "regular"; "aria-hidden"?: boolean }>;

const ICONS: Record<MulaFeatureIcon, IconComponent> = {
  delivery: TruckIcon,
  tested: ShieldCheckIcon,
  flexible: CalendarBlankIcon,
  support: UserIcon,
};

/** Empat keunggulan layanan dalam kartu timbul kecil (ikon di lingkaran "masuk"). */
export function MulaFeatures({ id, items }: MulaFeaturesProps) {
  return (
    <section id={id} className={styles.section} aria-label="Cara sewa & layanan">
      <ul className={styles.grid}>
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.title} className={styles.card}>
              <span className={styles.icon}>
                <Icon size={18} weight="regular" aria-hidden />
              </span>
              <span>
                <strong className={styles.title}>{item.title}</strong>
                <span className={styles.text}>{item.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
