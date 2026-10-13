/**
 * Satu-satunya pintu masuk ikon: semua ikon berasal dari Phosphor (satu keluarga),
 * bukan path SVG buatan sendiri. Varian "ssr" tidak memakai React context,
 * sehingga aman di Server maupun Client Component.
 *
 * Ketebalan standar: "fill" untuk ikon kontrol media, "bold" untuk ikon garis kecil,
 * "light" untuk ikon garis besar (pengganti foto produk).
 */
export {
  ArrowCounterClockwiseIcon as ReplayIcon,
  ArrowRightIcon,
  CalendarBlankIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserIcon,
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
  PauseIcon,
  PlayIcon,
  PlugChargingIcon,
  PlugsConnectedIcon,
  RadioIcon,
  SpeakerHifiIcon,
  UsbIcon,
  XIcon,
} from "@phosphor-icons/react/ssr";
