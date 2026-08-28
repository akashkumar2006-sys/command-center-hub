/**
 * India Meteorological Department (IMD) API adapter — server side only.
 *
 * Official API reference: https://api.imd.gov.in/public/api_reference.html
 *
 * Endpoints used:
 *   /api/v1/districtrainfall                  district-wise rainfall
 *   /api/v1/districtwarning                   district-wise warnings
 *   /api/v1/districtnowcast                   district-wise nowcast
 *   /api/v1/state_district_rainfall_forecast  rainfall forecast
 *
 * These endpoints reject anonymous calls with HTTP 401 {"error":"API key
 * missing"} and cannot be called from the browser (no CORS headers), so all
 * calls are proxied through a server function.
 *
 * REQUIRED ENVIRONMENT VARIABLE FOR PRODUCTION:
 *   IMD_API_KEY — IMD-issued API key, sent as the `x-api-key` header.
 * Optional:
 *   IMD_API_BASE — override the base URL (defaults to https://api.imd.gov.in).
 *
 * Without IMD_API_KEY every adapter returns status "not_configured".
 * No value is ever fabricated.
 */

import type {
  RainfallData,
  ServiceResult,
  WarningSeverity,
  WeatherObservation,
  WeatherWarning,
} from "@/types/domain";

const TIMEOUT_MS = 8000;

type Json = Record<string, unknown>;

function fail<T>(status: ServiceResult<T>["status"], message: string): ServiceResult<T> {
  return { status, data: null, message, source: "imd" };
}

async function callImd(path: string, params: Record<string, string>): Promise<
  { ok: true; body: unknown } | { ok: false; result: ServiceResult<never> }
> {
  const apiKey = process.env["IMD_API_KEY"];
  if (!apiKey) {
    return {
      ok: false,
      result: fail(
        "not_configured",
        "IMD_API_KEY is not configured — live IMD data is unavailable.",
      ),
    };
  }
  const base = process.env["IMD_API_BASE"] ?? "https://api.imd.gov.in";
  const url = new URL(`${base}/api/v1/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey, accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, result: fail("not_configured", "IMD rejected the API key.") };
    }
    if (res.status === 429) {
      return { ok: false, result: fail("unavailable", "IMD rate limit reached.") };
    }
    if (!res.ok) {
      return { ok: false, result: fail("unavailable", `IMD responded with ${res.status}.`) };
    }
    const text = await res.text();
    if (!text.trim()) return { ok: false, result: fail("empty", "IMD returned an empty response.") };
    try {
      return { ok: true, body: JSON.parse(text) };
    } catch {
      return { ok: false, result: fail("error", "IMD returned a malformed response.") };
    }
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return {
      ok: false,
      result: fail("unavailable", timedOut ? "IMD request timed out." : "IMD is unreachable."),
    };
  }
}

/** IMD payloads vary in shape; find the record matching a district name. */
function pickDistrictRow(body: unknown, districtName: string): Json | null {
  const rows: unknown[] = Array.isArray(body)
    ? body
    : ((body as Json | null)?.["data"] as unknown[]) ??
      ((body as Json | null)?.["records"] as unknown[]) ??
      [];
  if (!Array.isArray(rows)) return null;
  const target = districtName.toLowerCase();
  const match = rows.find((r) => {
    if (!r || typeof r !== "object") return false;
    return Object.entries(r as Json).some(
      ([k, v]) =>
        /district/i.test(k) && typeof v === "string" && v.toLowerCase().includes(target),
    );
  });
  return (match as Json) ?? null;
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function severityFrom(value: unknown): WarningSeverity {
  const s = String(value ?? "").toLowerCase();
  if (s.includes("red")) return "red";
  if (s.includes("orange")) return "orange";
  if (s.includes("yellow")) return "yellow";
  if (s.includes("green") || s.includes("no warning")) return "none";
  return "unknown";
}

const now = () => new Date().toISOString();

export async function fetchRainfall(
  state: string,
  district: string,
): Promise<ServiceResult<RainfallData>> {
  const res = await callImd("districtrainfall", { state, district });
  if (!res.ok) return res.result as ServiceResult<RainfallData>;
  const row = pickDistrictRow(res.body, district);
  if (!row) return fail("empty", "IMD returned no rainfall record for this district.");
  return {
    status: "ok",
    source: "imd",
    fetchedAt: now(),
    data: {
      districtName: district,
      actualMm: num(row["actual"] ?? row["rainfall"] ?? row["actual_rainfall"]),
      normalMm: num(row["normal"] ?? row["normal_rainfall"]),
      departurePct: num(row["departure"] ?? row["dep"] ?? row["departure_percent"]),
      category: str(row["category"] ?? row["rainfall_category"]),
      date: str(row["date"] ?? row["observation_date"]),
    },
  };
}

export async function fetchWarning(
  state: string,
  district: string,
): Promise<ServiceResult<WeatherWarning>> {
  const res = await callImd("districtwarning", { state, district });
  if (!res.ok) return res.result as ServiceResult<WeatherWarning>;
  const row = pickDistrictRow(res.body, district);
  if (!row) return fail("empty", "IMD returned no warning record for this district.");
  return {
    status: "ok",
    source: "imd",
    fetchedAt: now(),
    data: {
      districtName: district,
      severity: severityFrom(row["colour"] ?? row["color"] ?? row["warning_colour"]),
      headline: str(row["warning"] ?? row["description"] ?? row["headline"]),
      validFrom: str(row["valid_from"] ?? row["from"]),
      validTo: str(row["valid_to"] ?? row["to"]),
    },
  };
}

export async function fetchObservation(
  state: string,
  district: string,
): Promise<ServiceResult<WeatherObservation>> {
  const [nowcastRes, forecastRes] = await Promise.all([
    callImd("districtnowcast", { state, district }),
    callImd("state_district_rainfall_forecast", { state, district }),
  ]);
  if (!nowcastRes.ok && !forecastRes.ok) {
    return nowcastRes.result as ServiceResult<WeatherObservation>;
  }
  const nowcastRow = nowcastRes.ok ? pickDistrictRow(nowcastRes.body, district) : null;
  const forecastRow = forecastRes.ok ? pickDistrictRow(forecastRes.body, district) : null;
  if (!nowcastRow && !forecastRow) {
    return fail("empty", "IMD returned no nowcast or forecast for this district.");
  }
  return {
    status: "ok",
    source: "imd",
    fetchedAt: now(),
    data: {
      districtName: district,
      nowcast: nowcastRow ? str(nowcastRow["nowcast"] ?? nowcastRow["description"]) : null,
      forecast: forecastRow
        ? str(forecastRow["forecast"] ?? forecastRow["rainfall_forecast"])
        : null,
      issuedAt: nowcastRow ? str(nowcastRow["issued_at"] ?? nowcastRow["issue_time"]) : null,
    },
  };
}
