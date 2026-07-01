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
