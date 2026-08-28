import { Ambulance, ArrowRight, Truck } from "lucide-react";
import { MISSIONS, type Mission } from "@/lib/demo-data";
import { Panel, RISK_CHIP } from "./Panel";
import { cn } from "@/lib/utils";

function MissionRow({ mission }: { mission: Mission }) {
  const isMedical = mission.type === "Medical";
  return (
    <article className="border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded border",
            isMedical
              ? "border-medical/50 bg-medical/10 text-medical"
              : "border-logistics/50 bg-logistics/10 text-logistics",
          )}
        >
          {isMedical ? (
            <Ambulance className="size-4" aria-hidden />
          ) : (
            <Truck className="size-4" aria-hidden />
          )}
        </span>
        <span className="font-mono text-xs font-semibold tracking-wide text-foreground">
          {mission.code}
        </span>
        <span className="rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {mission.type}
        </span>
        {mission.priority ? (
          <span className="rounded border border-destructive/50 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
            {mission.priority}
          </span>
        ) : null}
        <span
          className={cn(
            "ml-auto rounded border px-1.5 py-0.5 text-[10px] font-medium",
            RISK_CHIP[mission.risk],
          )}
        >
          Risk: {mission.riskLabel}
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        <span className="label-caps mr-1.5">{mission.descriptorLabel}</span>
        <span className="text-foreground/90">{mission.descriptor}</span>
      </p>

      <div className="mt-2 flex items-center gap-2 text-xs text-foreground/90">
        <span>{mission.origin}</span>
        <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />
        <span>{mission.destination}</span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          ETA {mission.eta}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", isMedical ? "bg-medical" : "bg-logistics")}
            style={{ width: `${mission.progress}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {mission.status} · {mission.progress}%
        </span>
      </div>
    </article>
  );
}

export function OperationsPanel({ missions = MISSIONS }: { missions?: Mission[] }) {
  return (
    <Panel
      title="Active Operations"
      subtitle={`${missions.length} missions in transit`}
      actions={
        <span className="rounded border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] text-muted-foreground">
          LIVE FEED PENDING
        </span>
      }
      bodyClassName="overflow-y-auto"
    >
      {missions.map((m) => (
        <MissionRow key={m.code} mission={m} />
      ))}
    </Panel>
  );
}
