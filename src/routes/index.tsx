import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { GisPanel } from "@/components/dashboard/GisPanel";
import { OperationsPanel } from "@/components/dashboard/OperationsPanel";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";

const title = "Command Center — NER-LOGIX";
const description =
  "Operational command center for logistics and medical transport across Assam and Meghalaya: missions, incidents, route risk and network accessibility.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  return (
    <AppShell activeNavId="command-center">
      <div className="space-y-4 p-4 lg:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Command Center</h1>
            <p className="text-xs text-muted-foreground">
              North Eastern Region · Assam &amp; Meghalaya · 12 districts monitored
            </p>
          </div>
          <span className="ml-auto rounded border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] tracking-wide text-primary">
            PROTOTYPE DATA — NOT OPERATIONAL
          </span>
        </div>

        <KpiGrid />

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <GisPanel />
          </div>
          <div className="grid min-h-0 gap-4 xl:grid-rows-2">
            <OperationsPanel />
            <AlertsPanel />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
