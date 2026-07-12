import {
  Atom,
  BatteryCharging,
  Cable,
  Circle,
  CircleDot,
  Diamond,
  Droplet,
  Droplets,
  Flame,
  FlaskConical,
  Fuel,
  Gem,
  Hexagon,
  Magnet,
  Mountain,
  SquareStack,
  Sun,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Mapa de nombres de ícono (definidos en la data) a componentes de lucide. */
const iconMap: Record<string, LucideIcon> = {
  atom: Atom,
  "battery-charging": BatteryCharging,
  cable: Cable,
  "circle-dot": CircleDot,
  diamond: Diamond,
  droplet: Droplet,
  droplets: Droplets,
  flame: Flame,
  "flask-conical": FlaskConical,
  fuel: Fuel,
  gem: Gem,
  hexagon: Hexagon,
  magnet: Magnet,
  mountain: Mountain,
  "square-stack": SquareStack,
  sun: Sun,
  waves: Waves,
  wind: Wind,
  zap: Zap,
};

interface ResourceIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

/** Renderiza el ícono de un recurso, con un fallback seguro. */
export function ResourceIcon({ name, className, strokeWidth }: ResourceIconProps) {
  const Icon = iconMap[name] ?? Circle;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
