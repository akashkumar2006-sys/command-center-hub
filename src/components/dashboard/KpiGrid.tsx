import { KPIS, type Kpi } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const TONE_BAR: Record<Kpi["tone"], string> = {
  neutral: "bg-accent",
  safe: "bg-safe",
  moderate: "bg-moderate",
  high: "bg-high",
};

const TONE_TEXT: Record<Kpi["tone"], string> = {
  neutral: "text-muted-foreground",
  safe: "text-safe",
  moderate: "text-moderate",
  high: "text-high",
};

export function KpiGrid({ items = KPIS }: { items?: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {items.map((kpi) => (
        <article key={kpi.id} className="panel relative overflow-hidden px-4 py-3">
          <span
            className={cn("absolute inset-x-0 top-0 h-0.5", TONE_BAR[kpi.tone])}
            aria-hidden
          />
          <p className="label-caps">{kpi.label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-foreground">
            {kpi.value}
            {kpi.unit ? (
              <span className="ml-0.5 text-base text-muted-foreground">{kpi.unit}</span>
            ) : null}
          </p>
          <p className={cn("mt-1 text-[11px] font-medium", TONE_TEXT[kpi.tone])}>{kpi.delta}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{kpi.detail}</p>
        </article>
      ))}
    </div>
  );
}
