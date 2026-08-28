/**
 * India Meteorological Department (IMD) service layer.
 *
 * Official API reference: https://api.imd.gov.in/public/api_reference.html
 *   district rainfall : /api/v1/districtrainfall
 *   district warning  : /api/v1/districtwarning
 *   district nowcast  : /api/v1/districtnowcast
 *   rainfall forecast : /api/v1/state_district_rainfall_forecast
 *
 * api.imd.gov.in does not send CORS headers and is rate limited, so it cannot
 * be called from the browser. Nothing here invents values: when no proxy base
 * URL is configured, or when a request fails/times out/returns malformed data,
 * the service returns an explicit non-ok ServiceResult and the UI shows a
 * "data unavailable" state.
 *
 * PRODUCTION INTEGRATION
 *   Set `VITE_IMD_PROXY_BASE` to a server endpoint that proxies the IMD API
 *   (server-side, with any credential IMD requires stored as a secret).
 *   The proxy must expose the same four paths listed above and return the IMD
 *   JSON payload unchanged.
 */
import type {
  RainfallData,
  ServiceResult,
  WeatherObservation,
  WeatherWarning,
} from "@/services/types";

export const IMD_SOURCE = "India Meteorological Department" as const;

const PROXY_BASE = (import.meta.env['VITE_IMD_PROXY_BASE'] as string | undefined) ?? "";
const TIMEOUT_MS = 8000;

export const IMD_ENDPOINTS = {
  rainfall: "/api/v1/districtrainfall",
  warning: "/api/v1/districtwarning",
  nowcast: "/api/v1/districtnowcast",
  forecast: "/api/v1/state_district_rainfall_forecast",
} as const;

export function isImdConfigured() {
  return PROXY_BASE.length > 0;
}

function unavailable<T>(message: string): ServiceResult<T> {
  return { status: "unavailable", data: null, source: IMD_SOURCE, message };
}

async function imdFetch<T>(path: string, params: Record<string, string>): Promise<ServiceResult<T>> {
  if (!isImdConfigured()) {
    return unavailable<T>("IMD proxy not configured (VITE_IMD_PROXY_BASE)");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = new URL(path, PROXY_BASE);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (res.status === 429) {
      return { status: "unavailable", data: null, source: IMD_SOURCE, message: "IMD rate limit reached" };
    }
    if (!res.ok) {
      return { status: "error", data: null, source: IMD_SOURCE, message: `IMD responded ${res.status}` };
    }
    const json = (await res.json()) as unknown;
    if (json == null || (Array.isArray(json) && json.length === 0)) {
      return { status: "empty", data: null, source: IMD_SOURCE };
    }
    return { status: "ok", data: json as T, source: IMD_SOURCE, retrievedAt: new Date().toISOString() };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    return {
      status: "error",
      data: null,
      source: IMD_SOURCE,
      message: aborted ? "IMD request timed out" : "Unable to retrieve live data",
    };
  } finally {
    clearTimeout(timer);
  }
}

export function getDistrictRainfall(districtName: string) {
  return imdFetch<RainfallData>(IMD_ENDPOINTS.rainfall, { district: districtName });
}

export function getDistrictWarning(districtName: string) {
  return imdFetch<WeatherWarning>(IMD_ENDPOINTS.warning, { district: districtName });
}

export function getDistrictNowcast(districtName: string) {
  return imdFetch<WeatherObservation>(IMD_ENDPOINTS.nowcast, { district: districtName });
}

export function getDistrictForecast(districtName: string) {
  return imdFetch<WeatherObservation>(IMD_ENDPOINTS.forecast, { district: districtName });
}

export interface DistrictWeatherBundle {
  rainfall: ServiceResult<RainfallData>;
  warning: ServiceResult<WeatherWarning>;
  nowcast: ServiceResult<WeatherObservation>;
  forecast: ServiceResult<WeatherObservation>;
}

export async function getDistrictWeather(districtName: string): Promise<DistrictWeatherBundle> {
  const [rainfall, warning, nowcast, forecast] = await Promise.all([
    getDistrictRainfall(districtName),
    getDistrictWarning(districtName),
    getDistrictNowcast(districtName),
    getDistrictForecast(districtName),
  ]);
  return { rainfall, warning, nowcast, forecast };
}
