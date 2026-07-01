"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado global de UI de Atlas, compartido entre el mapa, el sidebar, los
 * filtros y el buscador. Se mantiene deliberadamente pequeño y desacoplado de
 * los datos del servidor (que gestiona TanStack Query).
 */
interface AppState {
  countryId: string;
  selectedProvinceId: string | null;
  hoveredProvinceId: string | null;
  activeResourceIds: ReadonlySet<string>;
  isFiltering: boolean;
  selectProvince: (id: string | null) => void;
  setHoveredProvince: (id: string | null) => void;
  toggleResource: (id: string) => void;
  clearResources: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({
  countryId,
  children,
}: {
  countryId: string;
  children: ReactNode;
}) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(
    null,
  );
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(
    null,
  );
  const [activeResourceIds, setActiveResourceIds] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleResource = useCallback((id: string) => {
    setActiveResourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearResources = useCallback(() => setActiveResourceIds(new Set()), []);

  const value = useMemo<AppState>(
    () => ({
      countryId,
      selectedProvinceId,
      hoveredProvinceId,
      activeResourceIds,
      isFiltering: activeResourceIds.size > 0,
      selectProvince: setSelectedProvinceId,
      setHoveredProvince: setHoveredProvinceId,
      toggleResource,
      clearResources,
    }),
    [
      countryId,
      selectedProvinceId,
      hoveredProvinceId,
      activeResourceIds,
      toggleResource,
      clearResources,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
