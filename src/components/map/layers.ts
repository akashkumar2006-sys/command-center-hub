export type MapLayerId =
  | "boundaries"
  | "weather"
  | "incidents"
  | "logistics"
  | "medical"
  | "routes";

export interface MapLayerDef {
  id: MapLayerId;
  label: string;
  source: string;
  government: boolean;
}

export const MAP_LAYERS: MapLayerDef[] = [
  { id: "boundaries", label: "District Boundaries", source: "Government OGD / LGD", government: true },
  { id: "weather", label: "Weather Risk", source: "India Meteorological Department", government: true },
  { id: "incidents", label: "NER-LOGIX Incidents", source: "NER-LOGIX Reports", government: false },
  { id: "logistics", label: "Logistics Vehicles", source: "NER-LOGIX Simulation", government: false },
  { id: "medical", label: "Medical Vehicles", source: "NER-LOGIX Simulation", government: false },
  { id: "routes", label: "Active Routes", source: "NER-LOGIX Simulation", government: false },
];

export const DEFAULT_LAYERS: Record<MapLayerId, boolean> = {
  boundaries: true,
  weather: false,
  incidents: true,
  logistics: true,
  medical: true,
  routes: true,
};
