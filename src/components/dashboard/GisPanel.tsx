import { AlertTriangle, Ambulance, Layers, Maximize2, Truck } from "lucide-react";
import {
  DISTRICTS,
  MAP_INCIDENTS,
  MAP_ROUTES,
  MAP_VEHICLES,
  RISK_META,
  type RiskLevel,
} from "@/lib/demo-data";
import { Panel, RISK_DOT, RISK_STROKE } from "./Panel";
import { cn } from "@/lib/utils";

/**
 * Schematic GIS surface for the prototype.
 * Positions are percentage coordinates on a fixed canvas, so a later stage can
 * swap this component's internals for a real map/routing engine while keeping
 * the same panel slot, legend and marker semantics.
 */

const ASSAM_SHAPE =
  "M14,46 L22,36 L34,31 L46,24 L58,25 L70,17 L82,11 L94,10 L96,18 L84,24 L72,29 L60,36 L48,40 L36,45 L26,50 L18,52 Z";
const MEGHALAYA_SHAPE =
  "M2,58 L14,54 L26,52 L38,56 L48,62 L46,74 L34,78 L20,76 L8,72 L1,66 Z";

function routePath(r: (typeof MAP_ROUTES)[number]) {
  const [x1, y1] = r.from;
  const [x2, y2] = r.to;
  if (r.via) {
    const [vx, vy] = r.via;
    return `M${x1},${y1} Q${vx},${vy} ${x2},${y2}`;
  }
  return `M${x1},${y1} L${x2},${y2}`;
}

export function GisPanel() {
  return (
    <Panel
      title="Regional Accessibility Map"
      subtitle="Assam & Meghalaya — schematic view (prototype data)"
      className="min-h-[520px]"
      bodyClassName="relative"
      actions={
        <>
          <span className="hidden rounded border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] text-muted-foreground sm:inline">
            DEMO LAYER
          </span>
          <button
            type="button"
            className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Map layers"
          >
            <Layers className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Expand map"
          >
            <Maximize2 className="size-4" aria-hidden />
          </button>
        </>
      }
    >
      <div className="relative h-full min-h-[460px] w-full overflow-hidden rounded-b-lg bg-background">
        {/* grid + geography */}
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <pattern id="ner-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path
                d="M5 0 L0 0 L0 5"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="0.15"
                vectorEffect="non-scaling-stroke"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#ner-grid)" opacity="0.6" />
          <path
            d={ASSAM_SHAPE}
            fill="var(--color-surface)"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={MEGHALAYA_SHAPE}
            fill="var(--color-surface-raised)"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {MAP_ROUTES.map((r) => (
            <path
              key={r.id}
              d={routePath(r)}
              fill="none"
              stroke={RISK_STROKE[r.risk]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={r.risk === "blocked" ? "4 4" : undefined}
              opacity={r.risk === "blocked" ? 0.7 : 0.9}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* state captions */}
        <span className="pointer-events-none absolute left-[52%] top-[6%] font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          ASSAM
        </span>
        <span className="pointer-events-none absolute left-[16%] top-[82%] font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          MEGHALAYA
        </span>

        {/* districts */}
        {DISTRICTS.map((d) => (
          <div
            key={d.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            <div className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full ring-2 ring-background", RISK_DOT[d.risk])} />
              <span className="whitespace-nowrap rounded bg-background/80 px-1 text-[10px] text-foreground/80">
                {d.name}
              </span>
            </div>
          </div>
        ))}

        {/* vehicles */}
        {MAP_VEHICLES.map((v) => (
          <div
            key={v.id}
            title={`${v.kind === "medical" ? "Medical" : "Logistics"} vehicle ${v.label}`}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded border px-1 py-0.5",
              v.kind === "medical"
                ? "border-medical/50 bg-medical/15 text-medical"
                : "border-logistics/50 bg-logistics/15 text-logistics",
            )}
            style={{ left: `${v.x}%`, top: `${v.y}%` }}
          >
            {v.kind === "medical" ? (
              <Ambulance className="size-3" aria-hidden />
            ) : (
              <Truck className="size-3" aria-hidden />
            )}
            <span className="font-mono text-[9px]">{v.label}</span>
          </div>
        ))}

        {/* incidents */}
        {MAP_INCIDENTS.map((i) => (
          <div
            key={i.id}
            title={`${i.type} — ${i.id}`}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded border border-high/60 bg-high/15 px-1 py-0.5 text-high"
            style={{ left: `${i.x}%`, top: `${i.y}%` }}
          >
            <AlertTriangle className="size-3" aria-hidden />
            <span className="font-mono text-[9px]">{i.id}</span>
          </div>
        ))}

        {/* legend */}
        <div className="absolute bottom-3 left-3 rounded-md border border-border bg-card/95 px-3 py-2 backdrop-blur">
          <p className="label-caps mb-1.5">Route status</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {(Object.keys(RISK_META) as RiskLevel[]).map((k) => (
              <li key={k} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
                <span className={cn("size-2 rounded-full", RISK_DOT[k])} />
                {RISK_META[k].label}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-3 border-t border-border pt-2 text-[11px] text-foreground/80">
            <span className="flex items-center gap-1">
              <Truck className="size-3 text-logistics" aria-hidden /> Logistics
            </span>
            <span className="flex items-center gap-1">
              <Ambulance className="size-3 text-medical" aria-hidden /> Medical
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="size-3 text-high" aria-hidden /> Incident
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 rounded border border-border bg-card/95 px-2 py-1 font-mono text-[10px] text-muted-foreground">
          SCHEMATIC · NOT TO SCALE
        </div>
      </div>
    </Panel>
  );
}
