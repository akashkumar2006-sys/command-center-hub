/**
 * Shared NER-LOGIX domain types.
 *
 * Every value carried through the app is tagged with the source it came from so
 * the UI can never imply that NER-LOGIX generated data is government data.
 */

export type DataSourceId =
  | "gov-lgd"
  | "gov-boundary"
  | "imd"
  | "nerlogix-system"
  | "nerlogix-simulation"
  | "nerlogix-calculated";

export const DATA_SOURCE_LABEL: Record<DataSourceId, string> = {
  "gov-lgd": "Government OGD / LGD",
  "gov-boundary": "Government / Open boundary data",
  imd: "India Meteorological Department",
  "nerlogix-system": "NER-LOGIX System Data",
  "nerlogix-simulation": "NER-LOGIX Simulation",
  "nerlogix-calculated": "Calculated by NER-LOGIX",
};

/** Generic transport for anything that can fail, be empty or be unconfigured. */
export type ServiceStatus =
  | "ok"
  | "empty"
  | "unavailable"
  | "error"
  | "not_configured";

export interface ServiceResult<T> {
  status: ServiceStatus;
  data: T | null;
  /** Human readable explanation shown in the UI when status !== "ok". */
  message?: string;
  source: DataSourceId;
  fetchedAt?: string;
}

export const STATUS_MESSAGE: Record<Exclude<ServiceStatus, "ok">, string> = {
  empty: "No current data available",
  unavailable: "Government data temporarily unavailable",
  error: "Unable to retrieve live data",
  not_configured: "Live data source not configured",
};

/* ------------------------------------------------------------- Geography */

export type StateName = "Assam" | "Meghalaya";

export interface District {
  /** Slug used across the app. */
  id: string;
  name: string;
  state: StateName;
  /** Local Government Directory district code, when verified. */
  lgdCode: string | null;
  /** ISO/HASC administrative code from the boundary dataset, when present. */
  hasc: string | null;
  /** [lng, lat] label point derived from the boundary polygon. */
  centroid: [number, number];
  /** Caveat about the boundary geometry, e.g. a parent-district polygon. */
  boundaryNote?: string | null;
}

export interface DistrictFeatureProperties {
  id: string;
  name: string;
  state: StateName;
  hasc: string | null;
  centroid: [number, number];
  boundaryNote: string | null;
}

/* --------------------------------------------------------------- Weather */

export type WarningSeverity = "none" | "yellow" | "orange" | "red" | "unknown";

export interface RainfallData {
  districtName: string;
  /** Millimetres, as published by IMD. */
  actualMm: number | null;
  normalMm: number | null;
  departurePct: number | null;
  category: string | null;
  date: string | null;
}

export interface WeatherWarning {
  districtName: string;
  severity: WarningSeverity;
  headline: string | null;
  validFrom: string | null;
  validTo: string | null;
}

export interface WeatherObservation {
  districtName: string;
  nowcast: string | null;
  forecast: string | null;
  issuedAt: string | null;
}

export interface DistrictWeather {
  rainfall: ServiceResult<RainfallData>;
  warning: ServiceResult<WeatherWarning>;
  observation: ServiceResult<WeatherObservation>;
}

/* ----------------------------------------------------- NER-LOGIX domain  */

export type RiskLevel = "safe" | "moderate" | "high" | "blocked";

export interface Incident {
  id: string;
  type: string;
  severity: RiskLevel;
  districtId: string;
  position: [number, number];
  reportedAt: string;
  source: DataSourceId;
}

export interface TransportMission {
  code: string;
  type: "Logistics" | "Medical";
  descriptorLabel: string;
  descriptor: string;
  origin: string;
  destination: string;
  originDistrictId: string;
  destinationDistrictId: string;
  status: string;
  progress: number;
  eta: string;
  riskLabel: string;
  risk: RiskLevel;
  priority?: string;
  source: DataSourceId;
}

export interface Vehicle {
  id: string;
  kind: "logistics" | "medical";
  districtId: string;
  position: [number, number];
  status: string;
  source: DataSourceId;
}

export interface RouteSegment {
  id: string;
  label: string;
  waypointDistrictIds: string[];
  risk: RiskLevel;
  source: DataSourceId;
}

export type AlertCategory = "government-weather" | "nerlogix-incident" | "simulation";

export interface OperationalAlert {
  id: string;
  category: AlertCategory;
  title: string;
  detail: string;
  location: string;
  time: string;
  severity: RiskLevel;
  source: DataSourceId;
}
