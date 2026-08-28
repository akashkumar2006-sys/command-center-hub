import { MapPin } from "lucide-react";
import { ALERTS, type AlertItem } from "@/lib/demo-data";
import { Panel, RISK_DOT, RISK_CHIP } from "./Panel";
import { cn } from "@/lib/utils";

export function AlertsPanel({ alerts = ALERTS }: { alerts?: AlertItem[] }) {
  return (
    <Panel
      title="Alerts"
      subtitle="Signals awaiting coordinator review"
      actions={
        <span className="rounded border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] text-muted-foreground">
          {alerts.length} OPEN
        </span>
      }
      bodyClassName="overflow-y-auto"
    >
      <ul>
        {alerts.map((a) => (
          <li key={a.id} className="border-b border-border px-4 py-3 last:border-b-0">
            <div className="flex items-start gap-2.5">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", RISK_DOT[a.severity])} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="size-3" aria-hidden />
                    {a.location}
                  </span>
                  <span
                    className={cn(
                      "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                      RISK_CHIP[a.severity],
                    )}
                  >
                    {a.id}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {a.time}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
