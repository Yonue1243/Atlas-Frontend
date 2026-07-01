/**
 * Tipos del dominio de Atlas.
 *
 * Reflejan el contrato JSON expuesto por la API REST del backend. Son la única
 * fuente de verdad de tipos para el frontend.
 */

export interface Country {
  id: string;
  slug: string;
  name: string;
  /** [lng, lat] */
  center: [number, number];
  /** [minLng, minLat, maxLng, maxLat] */
  bbox: [number, number, number, number];
  defaultZoom: number;
  geojsonRef: string;
}

export interface Province {
  id: string;
  countryId: string;
  name: string;
  slug: string;
  region: string;
  /** Superficie en km². */
  area: number;
  population: number;
  resourceIds: string[];
}

export interface Resource {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  color: string;
  /** Nombre de ícono de lucide-react. */
  icon: string;
  description: string;
  uses: string[];
  generalInfo: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

/** Propiedades relevantes de cada feature del GeoJSON de provincias. */
export interface ProvinceFeatureProperties {
  id: string;
  nombre: string;
  centroide?: { lon: number; lat: number };
}
