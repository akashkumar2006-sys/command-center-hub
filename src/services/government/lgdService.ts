/**
 * Government district directory service.
 *
 * Authoritative source: Government of India Open Government Data platform,
 * Local Government Directory (LGD)
 *   https://data.gov.in/catalog/local-government-directory-lgd
 *   https://data.gov.in/resource/local-government-directory-lgd-districts
 *
 * The LGD district resource on data.gov.in requires a personal API key
 * (`api-key` query parameter) which is not available in this environment, so
 * this service reads a small locally stored dataset that contains ONLY the
 * district names, states and boundary-derived label points taken from public
 * administrative boundary data. No LGD numeric codes are stored here because
 * they could not be verified against the official resource — they are reported
 * as `null` and rendered as "Awaiting verified LGD code" in the UI.
 *
 * To switch to the live API, implement `fetchLiveDistricts()` below with
 * OGD_API_KEY and keep the same return shape.
 */

import districtCollection from "@/data/districts/ner-districts.geojson.json";
import type {
  District,
  DistrictFeatureProperties,
  ServiceResult,
  StateName,
} from "@/types/domain";

type Feature = {
  type: "Feature";
  properties: DistrictFeatureProperties;
  geometry: GeoJSON.Geometry;
};

export interface DistrictCollection {
  type: "FeatureCollection";
  features: Feature[];
}

export const DISTRICT_GEOJSON = districtCollection as unknown as DistrictCollection;

export const LGD_SOURCE_URL =
  "https://data.gov.in/resource/local-government-directory-lgd-districts";

/**
 * Environment variable required for live LGD integration:
 *   OGD_API_KEY  — data.gov.in personal API key (server-side only)
 */
export const LGD_REQUIRED_ENV = "OGD_API_KEY";

const DISTRICTS: District[] = DISTRICT_GEOJSON.features
  .map((f) => ({
    id: f.properties.id,
    name: f.properties.name,
    state: f.properties.state as StateName,
    lgdCode: null,
    hasc: f.properties.hasc ?? null,
    centroid: f.properties.centroid,
    boundaryNote: f.properties.boundaryNote ?? null,
  }))
  .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));

export function getDistricts(): ServiceResult<District[]> {
  if (DISTRICTS.length === 0) {
    return { status: "empty", data: null, source: "gov-lgd" };
  }
  return {
    status: "ok",
    data: DISTRICTS,
    source: "gov-lgd",
  };
}

export function getDistrictById(id: string | null): District | null {
  if (!id) return null;
  return DISTRICTS.find((d) => d.id === id) ?? null;
}

/** [lng, lat] label point for a district, or null when unknown. */
export function getDistrictCentroid(id: string): [number, number] | null {
  return getDistrictById(id)?.centroid ?? null;
}
