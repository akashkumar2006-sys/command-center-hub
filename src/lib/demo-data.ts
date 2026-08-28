/**
 * NER-LOGIX prototype DEMO data.
 *
 * Nothing here is real or government data — every export is fabricated for the
 * Step-1 UI prototype and is labelled as such in the interface. Later stages
 * replace these exports with live system data without changing the consuming
 * components' props shape.
 */

export type RiskLevel = "safe" | "moderate" | "high" | "blocked";

export const RISK_META: Record<RiskLevel, { label: string }> = {
  safe: { label: "Safe" },
  moderate: { label: "Moderate Risk" },
  high: { label: "High Risk" },
  blocked: { label: "Blocked" },
};

/* ------------------------------------------------------------------ KPIs */

export interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  detail: string;
  tone: "neutral" | "safe" | "moderate" | "high";
}

export const KPIS: Kpi[] = [
  {
    id: "active-missions",
    label: "Active Missions",
    value: "34",
    delta: "+6 since 06:00",
    detail: "18 logistics · 16 medical",
    tone: "neutral",
  },
  {
    id: "logistics-vehicles",
    label: "Logistics Vehicles",
    value: "127",
    delta: "112 in service",
    detail: "15 idle at depot",
    tone: "safe",
  },
  {
    id: "medical-vehicles",
    label: "Medical Vehicles",
    value: "48",
    delta: "41 available",
    detail: "7 on emergency transfer",
    tone: "safe",
  },
  {
    id: "active-incidents",
    label: "Active Incidents",
    value: "9",
    delta: "+3 in last 6h",
    detail: "4 landslide · 3 flood · 2 road",
    tone: "high",
  },
  {
    id: "high-risk-routes",
    label: "High-Risk Routes",
    value: "12",
    delta: "2 fully blocked",
    detail: "NH-6 · NH-27 corridors",
    tone: "moderate",
  },
  {
    id: "network-accessibility",
    label: "Network Accessibility",
    value: "86.4",
    unit: "%",
    delta: "-2.1% vs yesterday",
    detail: "12 districts monitored",
    tone: "moderate",
  },
];

/* ------------------------------------------------------- Map (schematic) */

export interface MapDistrict {
  id: string;
  name: string;
  state: "Assam" | "Meghalaya";
  /** Percentage coordinates on the schematic canvas. */
  x: number;
  y: number;
  risk: RiskLevel;
}

export const DISTRICTS: MapDistrict[] = [
  { id: "kamrup-metropolitan", name: "Kamrup Metro", state: "Assam", x: 30, y: 45, risk: "safe" },
  { id: "sonitpur", name: "Sonitpur", state: "Assam", x: 46, y: 33, risk: "moderate" },
  { id: "jorhat", name: "Jorhat", state: "Assam", x: 64, y: 27, risk: "safe" },
  { id: "dibrugarh", name: "Dibrugarh", state: "Assam", x: 78, y: 19, risk: "moderate" },
  { id: "tinsukia", name: "Tinsukia", state: "Assam", x: 89, y: 14, risk: "high" },
  { id: "cachar", name: "Cachar", state: "Assam", x: 62, y: 60, risk: "high" },
  { id: "east-khasi-hills", name: "East Khasi Hills", state: "Meghalaya", x: 30, y: 64, risk: "moderate" },
  { id: "ri-bhoi", name: "Ri-Bhoi", state: "Meghalaya", x: 30, y: 55, risk: "safe" },
  { id: "west-khasi-hills", name: "West Khasi Hills", state: "Meghalaya", x: 20, y: 62, risk: "safe" },
  { id: "east-jaintia-hills", name: "East Jaintia Hills", state: "Meghalaya", x: 42, y: 66, risk: "blocked" },
  { id: "west-garo-hills", name: "West Garo Hills", state: "Meghalaya", x: 7, y: 63, risk: "moderate" },
  { id: "south-west-garo-hills", name: "SW Garo Hills", state: "Meghalaya", x: 9, y: 71, risk: "safe" },
];

export interface MapRoute {
  id: string;
  label: string;
  /** [x, y] percentage coordinates. */
  from: [number, number];
  to: [number, number];
  via?: [number, number];
  risk: RiskLevel;
}

export const MAP_ROUTES: MapRoute[] = [
  { id: "R-01", label: "Dibrugarh — Guwahati", from: [78, 19], to: [30, 45], via: [55, 26], risk: "moderate" },
  { id: "R-02", label: "Shillong — Guwahati", from: [30, 64], to: [30, 45], risk: "safe" },
  { id: "R-03", label: "Guwahati — Silchar", from: [30, 45], to: [62, 60], via: [46, 56], risk: "high" },
  { id: "R-04", label: "Jowai — Silchar", from: [42, 66], to: [62, 60], risk: "blocked" },
  { id: "R-05", label: "Tura — Guwahati", from: [7, 63], to: [30, 45], via: [16, 51], risk: "moderate" },
];

export interface MapVehicle {
  id: string;
  label: string;
  kind: "logistics" | "medical";
  x: number;
  y: number;
}

export const MAP_VEHICLES: MapVehicle[] = [
  { id: "LG-114", label: "LG-114", kind: "logistics", x: 66, y: 24 },
  { id: "LG-208", label: "LG-208", kind: "logistics", x: 48, y: 34 },
  { id: "LG-331", label: "LG-331", kind: "logistics", x: 20, y: 53 },
  { id: "MD-051", label: "MD-051", kind: "medical", x: 30, y: 55 },
  { id: "MD-077", label: "MD-077", kind: "medical", x: 55, y: 58 },
];

export interface MapIncident {
  id: string;
  type: string;
  severity: RiskLevel;
  x: number;
  y: number;
}

export const MAP_INCIDENTS: MapIncident[] = [
  { id: "INC-2291", type: "Landslide", severity: "blocked", x: 47, y: 64 },
  { id: "INC-2288", type: "Flooding", severity: "high", x: 62, y: 55 },
  { id: "INC-2284", type: "Road erosion", severity: "moderate", x: 86, y: 16 },
];

/* -------------------------------------------------------------- Missions */

export interface Mission {
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
}

export const MISSIONS: Mission[] = [
  {
    code: "MISSION 001",
    type: "Logistics",
    descriptorLabel: "Cargo",
    descriptor: "Essential Supplies",
    origin: "Dibrugarh",
    destination: "Guwahati",
    status: "En Route",
    progress: 62,
    eta: "04h 20m",
    riskLabel: "Moderate",
    risk: "moderate",
  },
  {
    code: "MISSION 002",
    type: "Medical",
    descriptorLabel: "Service",
    descriptor: "Emergency Medical Transfer",
    origin: "Shillong",
    destination: "Guwahati",
    status: "En Route",
    progress: 41,
    eta: "01h 05m",
    riskLabel: "Safe",
    risk: "safe",
    priority: "Emergency",
  },
  {
    code: "MISSION 003",
    type: "Logistics",
    descriptorLabel: "Cargo",
    descriptor: "Cold-chain Vaccines",
    origin: "Guwahati",
    destination: "Silchar",
    status: "Rerouting",
    progress: 28,
    eta: "07h 45m",
    riskLabel: "High",
    risk: "high",
  },
  {
    code: "MISSION 004",
    type: "Medical",
    descriptorLabel: "Service",
    descriptor: "Blood Unit Relay",
    origin: "Jorhat",
    destination: "Dibrugarh",
    status: "En Route",
    progress: 77,
    eta: "00h 55m",
    riskLabel: "Safe",
    risk: "safe",
  },
];

/* ---------------------------------------------------------------- Alerts */

export interface AlertItem {
  id: string;
  title: string;
  detail: string;
  location: string;
  time: string;
  severity: RiskLevel;
}

export const ALERTS: AlertItem[] = [
  {
    id: "ALT-4417",
    title: "High-risk road segment detected",
    detail: "NH-6 corridor flagged for slope instability; convoy speed restricted.",
    location: "East Jaintia Hills, Meghalaya",
    time: "09 min ago",
    severity: "blocked",
  },
  {
    id: "ALT-4415",
    title: "Weather deterioration",
    detail: "Heavy rainfall band advancing over Barak valley for the next 12 hours.",
    location: "Cachar, Assam",
    time: "34 min ago",
    severity: "high",
  },
  {
    id: "ALT-4412",
    title: "New incident reported",
    detail: "Road erosion reported near Makum; single-lane movement only.",
    location: "Tinsukia, Assam",
    time: "01h 12m ago",
    severity: "moderate",
  },
  {
    id: "ALT-4408",
    title: "Medical route priority active",
    detail: "Shillong — Guwahati corridor held under emergency transfer priority.",
    location: "Ri-Bhoi, Meghalaya",
    time: "02h 03m ago",
    severity: "safe",
  },
];
