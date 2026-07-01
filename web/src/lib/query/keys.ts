/** Claves centralizadas de TanStack Query para cacheo e invalidación coherentes. */
export const queryKeys = {
  countries: ["countries"] as const,
  country: (id: string) => ["countries", id] as const,
  provinces: (countryId: string) => ["provinces", { countryId }] as const,
  province: (id: string) => ["provinces", id] as const,
  resources: ["resources"] as const,
  categories: ["categories"] as const,
  provincesGeo: (countryId: string) => ["geo", countryId, "provinces"] as const,
};
