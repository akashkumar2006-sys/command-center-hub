/**
 * Government district directory service.
 *
 * Authoritative source: Open Government Data (OGD) platform / Local Government
 * Directory (LGD)
 *   catalog:  https://data.gov.in/catalog/local-government-directory-lgd
 *   resource: https://data.gov.in/resource/local-government-directory-lgd-districts
 *
 * The OGD resource API requires an `api-key` issued per account. No such
 * credential is available in this environment, so this service reads a locally
 * stored, verified subset (district names + administrative codes shipped with
 * the official boundary set) instead of fabricating government records.
 *
 * To enable the live API later, set `VITE_OGD_API_KEY` and implement
 * `fetchDistrictsFromLgd()` below — the rest of the app only depends on
 * `getDistricts()`.
 */
import boundaries from "@/data/districts/ner-districts.geojson.json";
import type { District, ServiceResult } from "@/services/types";

export const LGD_SOURCE = "Government OGD / LGD" as const;

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function readLocalDistricts(): District[] {
  return (boundaries.features as Array<{ properties: Record<string, string> }>)
    .map((f) => ({
      id: slug(f.properties.name),
      name: f.properties.name,
      state: f.properties.state as District["state"],
      censusDistrictCode: f.properties.censusDistrictCode ?? null,
      stateCode: f.properties.stateCode ?? null,
      lgdCode: null,
      vintage: f.properties.vintage ?? null,
    }))
    .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
}

export async function getDistricts(): Promise<ServiceResult<District[]>> {
  try {
    const data = readLocalDistricts();
    if (!data.length) {
      return { status: "empty", data: null, source: LGD_SOURCE };
    }
    return {
      status: "ok",
      data,
      source: LGD_SOURCE,
      retrievedAt: new Date().toISOString(),
      message: "Local verified subset — live LGD API key not configured",
    };
  } catch {
    return {
      status: "error",
      data: null,
      source: LGD_SOURCE,
      message: "Unable to retrieve live data",
    };
  }
}

export function getDistrictById(districts: District[], id: string | null) {
  return districts.find((d) => d.id === id) ?? null;
}
