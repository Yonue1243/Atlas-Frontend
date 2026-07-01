"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAppState } from "@/components/providers/app-state";
import { useCountries, useProvinces, useProvincesGeoJSON } from "@/lib/query/hooks";
import type { ProvinceFeatureProperties } from "@/lib/types/domain";

import {
  FILL_LAYER_ID,
  SOURCE_ID,
  STYLE_URL,
  addProvinceLayers,
} from "./map-config";
import { MapOverlays } from "./map-overlays";

interface Centroid {
  lon: number;
  lat: number;
}

interface TooltipState {
  x: number;
  y: number;
  name: string;
}

/** Mapa interactivo de provincias con estados hover / selected / matched. */
export function MapView() {
  const {
    countryId,
    selectProvince,
    setHoveredProvince,
    hoveredProvinceId,
    selectedProvinceId,
    activeResourceIds,
    isFiltering,
  } = useAppState();

  const { data: countries } = useCountries();
  const { data: provinces = [] } = useProvinces(countryId);
  const { data: geojson } = useProvincesGeoJSON(countryId);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const prevHoverRef = useRef<string | null>(null);
  const prevSelectedRef = useRef<string | null>(null);

  const [styleEpoch, setStyleEpoch] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const country = countries?.find((c) => c.id === countryId);

  // Callbacks estables para los handlers del mapa (evita closures obsoletas).
  const callbacks = useRef({ selectProvince, setHoveredProvince });
  callbacks.current = { selectProvince, setHoveredProvince };

  const centroidById = useMemo(() => {
    const map = new Map<string, Centroid>();
    for (const f of geojson?.features ?? []) {
      const props = f.properties as ProvinceFeatureProperties | null;
      if (props?.id && props.centroide) map.set(props.id, props.centroide);
    }
    return map;
  }, [geojson]);

  const matchedIds = useMemo(() => {
    if (activeResourceIds.size === 0) return new Set<string>();
    const set = new Set<string>();
    for (const p of provinces) {
      if (p.resourceIds.some((id) => activeResourceIds.has(id))) set.add(p.id);
    }
    return set;
  }, [provinces, activeResourceIds]);

  // Inicialización del mapa (una sola vez, cuando hay datos y contenedor).
  useEffect(() => {
    if (mapRef.current || !containerRef.current || !geojson || !country) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: country.center,
      zoom: country.defaultZoom,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    const onMove = (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      map.getCanvas().style.cursor = "pointer";
      const props = feature.properties as ProvinceFeatureProperties;
      callbacks.current.setHoveredProvince(String(feature.id));
      setTooltip({ x: e.point.x, y: e.point.y, name: props.nombre });
    };

    const onLeave = () => {
      map.getCanvas().style.cursor = "";
      callbacks.current.setHoveredProvince(null);
      setTooltip(null);
    };

    const onClick = (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (feature) callbacks.current.selectProvince(String(feature.id));
    };

    // Los listeners atados a la capa se pierden al cambiar de estilo, por eso se
    // (re)registran en cada carga de estilo, evitando duplicados con off previo.
    const onStyleLoad = () => {
      addProvinceLayers(map, geojson);
      map.off("mousemove", FILL_LAYER_ID, onMove);
      map.on("mousemove", FILL_LAYER_ID, onMove);
      map.off("mouseleave", FILL_LAYER_ID, onLeave);
      map.on("mouseleave", FILL_LAYER_ID, onLeave);
      map.off("click", FILL_LAYER_ID, onClick);
      map.on("click", FILL_LAYER_ID, onClick);
      setStyleEpoch((e) => e + 1);
    };
    map.on("style.load", onStyleLoad);

    map.once("load", () => {
      map.fitBounds(country.bbox, {
        padding: { top: 100, bottom: 80, left: 80, right: 80 },
        duration: 0,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Solo se ejecuta cuando pasan a estar disponibles datos y contenedor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojson, country]);

  // Mantiene los datos de la fuente sincronizados.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojson || styleEpoch === 0) return;
    const source = map.getSource(SOURCE_ID);
    if (source && "setData" in source) {
      (source as maplibregl.GeoJSONSource).setData(geojson);
    }
  }, [geojson, styleEpoch]);

  // Estado de hover.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleEpoch === 0 || !map.getSource(SOURCE_ID)) return;
    const prev = prevHoverRef.current;
    if (prev && prev !== hoveredProvinceId) {
      map.setFeatureState({ source: SOURCE_ID, id: prev }, { hover: false });
    }
    if (hoveredProvinceId) {
      map.setFeatureState(
        { source: SOURCE_ID, id: hoveredProvinceId },
        { hover: true },
      );
    }
    prevHoverRef.current = hoveredProvinceId;
  }, [hoveredProvinceId, styleEpoch]);

  // Estado de selección (feature-state). Se re-aplica tras recargar el estilo.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleEpoch === 0 || !map.getSource(SOURCE_ID)) return;
    const prev = prevSelectedRef.current;
    if (prev && prev !== selectedProvinceId) {
      map.setFeatureState({ source: SOURCE_ID, id: prev }, { selected: false });
    }
    if (selectedProvinceId) {
      map.setFeatureState(
        { source: SOURCE_ID, id: selectedProvinceId },
        { selected: true },
      );
    }
    prevSelectedRef.current = selectedProvinceId;
  }, [selectedProvinceId, styleEpoch]);

  // Movimiento de cámara: solo cuando cambia la selección (no al cambiar tema).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleEpoch === 0) return;
    if (selectedProvinceId) {
      const c = centroidById.get(selectedProvinceId);
      if (c) {
        map.flyTo({
          center: [c.lon, c.lat],
          zoom: Math.max(map.getZoom(), 5),
          duration: 900,
          essential: true,
          padding: { left: 0, right: 380, top: 0, bottom: 0 },
        });
      }
    } else if (country) {
      map.fitBounds(country.bbox, {
        padding: { top: 100, bottom: 80, left: 80, right: 80 },
        duration: 700,
      });
    }
    // Intencionalmente no depende de styleEpoch para no mover la cámara al
    // cambiar de tema.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvinceId, centroidById, country]);

  // Estado de coincidencia con los filtros de recursos.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleEpoch === 0 || !map.getSource(SOURCE_ID)) return;
    for (const p of provinces) {
      map.setFeatureState(
        { source: SOURCE_ID, id: p.id },
        { matched: isFiltering ? matchedIds.has(p.id) : null },
      );
    }
  }, [matchedIds, isFiltering, provinces, styleEpoch]);

  const loading = !geojson || !country;

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />
      <MapOverlays tooltip={tooltip} />
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-background">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
            <span className="text-sm">Cargando mapa…</span>
          </div>
        </div>
      )}
    </div>
  );
}
