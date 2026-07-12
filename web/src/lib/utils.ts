import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases condicionales resolviendo conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Normaliza texto para búsquedas: minúsculas y sin acentos. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Formatea un número entero con separadores de miles (es-AR). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;

  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Ajusta colores para dark mode: aclara tonos oscuros y sube saturación en grises. */
export function resourceDisplayColor(hex: string, minLuminance = 0.28): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { h, s: rawS, l: rawL } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  let s = rawS;
  let l = rawL;

  if (s < 0.22) s = Math.min(0.5, s + 0.22);
  if (l < 0.32) l = 0.32 + l * 0.25;
  if (l > 0.82) {
    s = Math.max(s, 0.38);
    l = 0.68;
  }

  const adjusted = hslToRgb(h, s, l);
  if (relativeLuminance(adjusted.r, adjusted.g, adjusted.b) >= minLuminance) {
    return toHex(adjusted);
  }

  const mix = 0.45;
  return toHex({
    r: Math.round(adjusted.r + (255 - adjusted.r) * mix),
    g: Math.round(adjusted.g + (255 - adjusted.g) * mix),
    b: Math.round(adjusted.b + (255 - adjusted.b) * mix),
  });
}
