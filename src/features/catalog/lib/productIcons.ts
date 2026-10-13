import type { ComponentType } from "react";
import {
  BookOpenIcon,
  DiscoBallIcon,
  FadersIcon,
  HeadsetIcon,
  LampIcon,
  LightbulbIcon,
  MicrophoneIcon,
  MicrophoneStageIcon,
  MonitorIcon,
  PackageIcon,
  PlugChargingIcon,
  PlugsConnectedIcon,
  RadioIcon,
  SpeakerHifiIcon,
  UsbIcon,
} from "@/components/ui";
import type { ProductIcon } from "@/content/schema";

type IconComponent = ComponentType<{ size?: number; weight?: "light"; "aria-hidden"?: boolean }>;

/** Ikon pengganti foto untuk setiap nilai `icon` di konten produk. */
export const PRODUCT_ICON: Record<NonNullable<ProductIcon>, IconComponent> = {
  radio: RadioIcon,
  charger: PlugChargingIcon,
  headset: HeadsetIcon,
  usb: UsbIcon,
  package: PackageIcon,
  mixer: FadersIcon,
  microphone: MicrophoneStageIcon,
  disco: DiscoBallIcon,
  spotlight: LightbulbIcon,
  "book-stand": BookOpenIcon,
  "mic-stand": MicrophoneIcon,
  "lamp-stand": LampIcon,
  speaker: SpeakerHifiIcon,
  cable: PlugsConnectedIcon,
  monitor: MonitorIcon,
};

/** Inisial nama produk, untuk produk tanpa foto maupun ikon. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");
