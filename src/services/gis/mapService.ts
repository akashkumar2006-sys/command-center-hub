/**
 * GIS helpers: boundary access, bounds and risk styling for the Leaflet map.
 *
 * Boundary geometry comes from public administrative boundary data (GADM 4.1
 * India level-2, derived from official administrative sources) and has been
 * simplified for web rendering. No polygon is hand-drawn.
 */

import { DISTRICT_GEOJSON } from "@/services/government/lgdService";
import type { RiskLevel } from "@/types/domain";

export const BOUNDARY_SOURCE_LABEL = "Administrative boundaries (open geodata)";
export const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
export const BASEMAP_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export function getDistrictGeoJson() {
  return DISTRICT_GEOJSON;
}

/** [[southLat, westLng], [northLat, eastLng]] covering all monitored districts. */
export function getRegionBounds(): [[number, number], [number, number]] {
  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180;

  const visit = (coords: unknown): void => {
    if (Array.isArray(coords) && typeof coords[0] === "number") {
      const [lng, lat] = coords as [number, number];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      return;
    }
    if (Array.isArray(coords)) coords.forEach(visit);
  };

  DISTRICT_GEOJSON.features.forEach((f) =>
    visit((f.geometry as { coordinates: unknown }).coordinates),
  );

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  safe: "#22c55e",
  moderate: "#f59e0b",
  high: "#ef4444",
  blocked: "#94a3b8",
};

export const DISTRICT_FILL = "#38bdf8";
export const DISTRICT_LINE = "#7dd3fc";

export interface LayerToggles {
  boundaries: boolean;
  weatherRisk: boolean;
  incidents: boolean;
  logisticsVehicles: boolean;
  medicalVehicles: boolean;
  routes: boolean;
}

export const DEFAULT_LAYERS: LayerToggles = {
  boundaries: true,
  weatherRisk: false,
  incidents: true,
  logisticsVehicles: true,
  medicalVehicles: true,
  routes: true,
};

export const LAYER_META: {
  key: keyof LayerToggles;
  label: string;
  sourceLabel: string;
  government: boolean;
}[] = [
  {
    key: "boundaries",
    label: "District Boundaries",
    sourceLabel: "Government OGD / LGD",
    government: true,
  },
  {
    key: "weatherRisk",
    label: "Weather Risk",
    sourceLabel: "India Meteorological Department",
    government: true,
  },
  {
    key: "incidents",
    label: "NER-LOGIX Incidents",
    sourceLabel: "NER-LOGIX Reports",
    government: false,
  },
  {
    key: "logisticsVehicles",
    label: "Logistics Vehicles",
    sourceLabel: "NER-LOGIX Simulation",
    government: false,
  },
  {
    key: "medicalVehicles",
    label: "Medical Vehicles",
    sourceLabel: "NER-LOGIX Simulation",
    government: false,
  },
  {
    key: "routes",
    label: "Active Routes",
    sourceLabel: "NER-LOGIX Simulation",
    government: false,
  },
];
