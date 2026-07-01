import type {
  FillLayerSpecification,
  LineLayerSpecification,
  Map as MapLibreMap,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";

/** Estilo base oscuro y gratuito de CARTO (sin API key). */
export const STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const SOURCE_ID = "provinces";
export const FILL_LAYER_ID = "province-fill";
export const OUTLINE_LAYER_ID = "province-outline";

const COLORS = {
  primary: "#5b8def",
  accent: "#22d3ee",
  outline: "#6b7a90",
};

/** Ubica la primera capa de símbolos para insertar los polígonos por debajo. */
function firstSymbolLayerId(map: MapLibreMap): string | undefined {
  const layers = map.getStyle().layers ?? [];
  return layers.find((l) => l.type === "symbol")?.id;
}

const fillLayer: FillLayerSpecification = {
  id: FILL_LAYER_ID,
  type: "fill",
  source: SOURCE_ID,
  paint: {
    "fill-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      COLORS.primary,
      ["boolean", ["feature-state", "matched"], false],
      COLORS.accent,
      COLORS.primary,
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      0.6,
      ["boolean", ["feature-state", "hover"], false],
      0.32,
      ["boolean", ["feature-state", "matched"], false],
      0.42,
      ["==", ["feature-state", "matched"], false],
      0.03,
      0.1,
    ],
  },
};

const outlineLayer: LineLayerSpecification = {
  id: OUTLINE_LAYER_ID,
  type: "line",
  source: SOURCE_ID,
  paint: {
    "line-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      COLORS.primary,
      ["boolean", ["feature-state", "matched"], false],
      COLORS.accent,
      ["boolean", ["feature-state", "hover"], false],
      COLORS.primary,
      COLORS.outline,
    ],
    "line-width": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      2.4,
      ["boolean", ["feature-state", "hover"], false],
      1.6,
      0.6,
    ],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      1,
      ["boolean", ["feature-state", "hover"], false],
      0.9,
      0.45,
    ],
  },
};

/**
 * Registra la fuente GeoJSON de provincias y sus capas de relleno y contorno.
 * Usa promoteId para que feature-state se indexe por la propiedad `id`.
 */
export function addProvinceLayers(
  map: MapLibreMap,
  geojson: FeatureCollection,
): void {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: geojson,
      promoteId: "id",
    });
  }

  const beforeId = firstSymbolLayerId(map);
  if (!map.getLayer(FILL_LAYER_ID)) {
    map.addLayer(fillLayer, beforeId);
  }
  if (!map.getLayer(OUTLINE_LAYER_ID)) {
    map.addLayer(outlineLayer, beforeId);
  }
}
