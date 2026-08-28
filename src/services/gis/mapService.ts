/**
 * GIS service — real district boundary geometry for the prototype region.
 *
 * Boundaries are the official administrative district polygons (Census of
 * India district vintage, as published in open datasets). They are stored
 * locally so the map never depends on a third-party tile/vector host being
 * reachable. Basemap tiles come from CARTO / OpenStreetMap.
 */
import raw from "@/data/districts/ner-districts.geojson.json";
import type { DataSource } from "@/services/types";

export interface DistrictFeatureProps {
  name: string;
  state: string;
  censusDistrictCode: string;
  stateCode: string;
  vintage: string;
}

export type DistrictFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  DistrictFeatureProps
>;

export const BOUNDARY_SOURCE: DataSource = "Government OGD / LGD";

export function getDistrictBoundaries(): DistrictFeatureCollection {
  return raw as unknown as DistrictFeatureCollection;
}

/** [south, west, north, east] covering Assam + Meghalaya prototype districts. */
export function getRegionBounds(): [[number, number], [number, number]] {
  let minLat = 90;
  let minLng = 180;
  let maxLat = -90;
  let maxLng = -180;
  const walk = (coords: unknown): void => {
    if (Array.isArray(coords) && typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      return;
    }
    if (Array.isArray(coords)) coords.forEach(walk);
  };
  getDistrictBoundaries().features.forEach((f) => walk((f.geometry as GeoJSON.Polygon).coordinates));
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

export function getFeatureCenter(feature: GeoJSON.Feature): [number, number] {
  let sumLat = 0;
  let sumLng = 0;
  let n = 0;
  const walk = (coords: unknown): void => {
    if (Array.isArray(coords) && typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number];
      sumLat += lat;
      sumLng += lng;
      n += 1;
      return;
    }
    if (Array.isArray(coords)) coords.forEach(walk);
  };
  walk((feature.geometry as GeoJSON.Polygon).coordinates);
  return n ? [sumLat / n, sumLng / n] : [26, 92];
}

export const BASEMAP = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
} as const;
