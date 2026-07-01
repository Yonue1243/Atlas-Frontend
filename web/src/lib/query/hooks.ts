"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/endpoints";

import { queryKeys } from "./keys";

/** Datos de referencia que casi no cambian: se cachean de forma agresiva. */
const STATIC_STALE_TIME = 1000 * 60 * 60; // 1 hora

export function useCountries() {
  return useQuery({
    queryKey: queryKeys.countries,
    queryFn: api.countries,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useProvinces(countryId: string) {
  return useQuery({
    queryKey: queryKeys.provinces(countryId),
    queryFn: () => api.provinces({ countryId }),
    staleTime: STATIC_STALE_TIME,
  });
}

export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources,
    queryFn: api.resources,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.categories,
    staleTime: STATIC_STALE_TIME,
  });
}

export function useProvincesGeoJSON(countryId: string) {
  return useQuery({
    queryKey: queryKeys.provincesGeo(countryId),
    queryFn: () => api.provincesGeoJSON(countryId),
    staleTime: STATIC_STALE_TIME,
  });
}
