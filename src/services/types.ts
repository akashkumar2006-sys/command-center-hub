/**
 * Shared domain types for NER-LOGIX.
 * Every record carries an explicit `source` so the UI can never imply that
 * NER-LOGIX-generated data came from a government body.
 */

export type DataSource =
  | "Government OGD / LGD"
  | "India Meteorological Department"
  | "NER-LOGIX System Data"
  | "NER-LOGIX Simulation"
  | "NER-LOGIX Reports"
  | "Calculated by NER-LOGIX";

export type FetchStatus = "loading" | "ok" | "unavailable" | "empty" | "error";

export interface ServiceResult<T> {
  status: FetchStatus;
  data: T | null;
  source: DataSource;
  /** Human readable reason shown in the UI when status !== "ok". */
  message?: string;
  retrievedAt?: string;
}

export const STATUS_MESSAGE: Record<Exclude<FetchStatus, "ok">, string> = {
  loading: "Loading government data...",
  unavailable: "Government data temporarily unavailable",
  empty: "No current data available",
  error: "Unable to retrieve live data",
};

export type RiskLevel = "safe" | "moderate" | "high" | "blocked";

export interface District {
  /** Stable slug used internally by NER-LOGIX. */
  id: string;
  name: string;
  state: "Assam" | "Meghalaya";
  /** Census 2011 / administrative district code shipped with the boundary set. */
  censusDistrictCode: string | null;
  stateCode: string | null;
  /** Local Government Directory code — only set when the live LGD API is wired. */
  lgdCode: string | null;
  vintage: string | null;
}

export interface RainfallData {
  districtName: string;
  actualMm: number | null;
  normalMm: number | null;
  departurePct: number | null;
  category: string | null;
  date: string | null;
}

export interface WeatherWarning {
  districtName: string;
  severity: string | null;
  headline: string | null;
  validFrom: string | null;
  validTo: string | null;
}

export interface WeatherObservation {
  districtName: string;
  nowcast: string | null;
  forecast: string | null;
  observedAt: string | null;
}

export interface Incident {
  id: string;
  type: string;
  severity: RiskLevel;
  districtId: string | null;
  reportedAt: string;
  source: DataSource;
}

export interface Vehicle {
  id: string;
  kind: "logistics" | "medical";
  label: string;
  lat: number;
  lng: number;
  source: DataSource;
}

export interface TransportMission {
  code: string;
  type: "Logistics" | "Medical";
  descriptorLabel: string;
  descriptor: string;
  origin: string;
  destination: string;
  status: string;
  progress: number;
  eta: string;
  riskLabel: string;
  risk: RiskLevel;
  priority?: string;
  simulated: boolean;
}
