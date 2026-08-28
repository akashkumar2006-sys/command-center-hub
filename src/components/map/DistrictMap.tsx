import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import type { Layer, PathOptions } from "leaflet";
import { CircleMarker, GeoJSON, MapContainer, Polyline, Tooltip, TileLayer } from "react-leaflet";
import {
  BASEMAP,
  getDistrictBoundaries,
  getRegionBounds,
  type DistrictFeatureProps,
} from "@/services/gis/mapService";
import { INCIDENT_POINTS, ROUTES, VEHICLES } from "@/lib/demo-data";
import type { RiskLevel } from "@/services/types";
import type { MapLayerId } from "./layers";

const RISK_COLOR: Record<RiskLevel, string> = {
  safe: "#3fbf7f",
  moderate: "#e2b13c",
  high: "#e0533d",
  blocked: "#7c8496",
};

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export interface DistrictMapProps {
  selectedDistrictId: string | null;
  onSelectDistrict: (id: string) => void;
  layers: Record<MapLayerId, boolean>;
  /** Optional per-district weather risk tint (only set from real IMD data). */
  weatherRisk?: Record<string, RiskLevel>;
}

export default function DistrictMap({
  selectedDistrictId,
  onSelectDistrict,
  layers,
  weatherRisk,
}: DistrictMapProps) {
  const boundaries = useMemo(() => getDistrictBoundaries(), []);
  const bounds = useMemo(() => getRegionBounds(), []);

  const style = (feature?: GeoJSON.Feature): PathOptions => {
    const props = feature?.properties as DistrictFeatureProps | undefined;
    const id = props ? slug(props.name) : "";
    const selected = id === selectedDistrictId;
    const risk = layers.weather ? weatherRisk?.[id] : undefined;
    return {
      color: selected ? "#7cc4ff" : "#4d5a70",
      weight: selected ? 2.5 : 1,
      fillColor: risk ? RISK_COLOR[risk] : "#8fa3bf",
      fillOpacity: selected ? 0.35 : risk ? 0.28 : 0.12,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties as DistrictFeatureProps;
    layer.on("click", () => onSelectDistrict(slug(props.name)));
    layer.bindTooltip(`${props.name.toUpperCase()} · ${props.state}`, {
      direction: "center",
      className: "ner-district-tooltip",
      permanent: true,
    });
  };

  return (
    <MapContainer
      bounds={bounds}
      className="size-full bg-background"
      scrollWheelZoom
      zoomControl
      attributionControl
      minZoom={5}
      maxZoom={12}
    >
      <TileLayer url={BASEMAP.url} attribution={BASEMAP.attribution} />

      {layers.boundaries ? (
        <GeoJSON
          key={`${selectedDistrictId}-${layers.weather}`}
          data={boundaries as unknown as GeoJSON.GeoJsonObject}
          style={style}
          onEachFeature={onEachFeature}
        />
      ) : null}

      {layers.routes
        ? ROUTES.map((r) => (
            <Polyline
              key={r.id}
              positions={r.path}
              pathOptions={{
                color: RISK_COLOR[r.risk],
                weight: 3,
                opacity: 0.9,
                dashArray: r.risk === "blocked" ? "6 6" : undefined,
              }}
            >
              <Tooltip>
                {r.label} — {r.risk} (NER-LOGIX Simulation)
              </Tooltip>
            </Polyline>
          ))
        : null}

      {VEHICLES.filter(
        (v) => (v.kind === "logistics" && layers.logistics) || (v.kind === "medical" && layers.medical),
      ).map((v) => (
        <CircleMarker
          key={v.id}
          center={[v.lat, v.lng]}
          radius={6}
          pathOptions={{
            color: v.kind === "medical" ? "#e0533d" : "#5aa9e6",
            fillColor: v.kind === "medical" ? "#e0533d" : "#5aa9e6",
            fillOpacity: 0.85,
            weight: 1.5,
          }}
        >
          <Tooltip>
            {v.label} — {v.kind} (NER-LOGIX Simulation)
          </Tooltip>
        </CircleMarker>
      ))}

      {layers.incidents
        ? INCIDENT_POINTS.map((i) => (
            <CircleMarker
              key={i.id}
              center={[i.lat, i.lng]}
              radius={8}
              pathOptions={{
                color: RISK_COLOR[i.severity],
                fillColor: RISK_COLOR[i.severity],
                fillOpacity: 0.5,
                weight: 2,
              }}
            >
              <Tooltip>
                {i.id} — {i.type} (NER-LOGIX Reports)
              </Tooltip>
            </CircleMarker>
          ))
        : null}
    </MapContainer>
  );
}
