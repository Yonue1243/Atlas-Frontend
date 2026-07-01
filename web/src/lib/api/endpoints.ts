import type {
  Category,
  Country,
  Province,
  Resource,
} from "@/lib/types/domain";
import type { FeatureCollection } from "geojson";

import { apiGet } from "./client";

/** Funciones de acceso a cada endpoint de la API, tipadas de extremo a extremo. */
export const api = {
  countries: () => apiGet<Country[]>("/countries"),
  country: (id: string) => apiGet<Country>(`/countries/${id}`),

  provinces: (params?: { countryId?: string; resourceId?: string }) => {
    const search = new URLSearchParams();
    if (params?.countryId) search.set("countryId", params.countryId);
    if (params?.resourceId) search.set("resourceId", params.resourceId);
    const qs = search.toString();
    return apiGet<Province[]>(`/provinces${qs ? `?${qs}` : ""}`);
  },
  province: (id: string) => apiGet<Province>(`/provinces/${id}`),

  resources: () => apiGet<Resource[]>("/resources"),
  resource: (id: string) => apiGet<Resource>(`/resources/${id}`),

  categories: () => apiGet<Category[]>("/categories"),

  provincesGeoJSON: (countryId: string) =>
    apiGet<FeatureCollection>(`/geo/${countryId}/provinces`),
};
