import {
  LayoutDashboard,
  Radio,
  Truck,
  AlertTriangle,
  Route as RouteIcon,
  CloudRain,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

/** Navigation model. Later stages attach real routes to each id. */
const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Operations",
    items: [
      { id: "command-center", label: "Command Center", icon: LayoutDashboard },
      { id: "live-operations", label: "Live Operations", icon: Radio },
      { id: "transport-missions", label: "Transport Missions", icon: Truck, badge: "24" },
      { id: "incident-reports", label: "Incident Reports", icon: AlertTriangle, badge: "7" },
    ],
  },
  {
    heading: "Intelligence",
    items: [
      { id: "route-intelligence", label: "Route Intelligence", icon: RouteIcon },
      { id: "weather-intelligence", label: "Weather Intelligence", icon: CloudRain },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    heading: "System",
    items: [{ id: "settings", label: "Settings", icon: Settings }],
  },
];

export function Sidebar({ activeId = "command-center" }: { activeId?: string }) {
  return (
    <nav
      aria-label="Primary"
      className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex"
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading} className="mb-5">
            <p className="label-caps px-2 pb-2">{section.heading}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.id === activeId;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      disabled={!active}
                      title={active ? undefined : "Available in a later stage"}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-foreground shadow-[inset_2px_0_0_0_var(--color-primary)]"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground disabled:cursor-not-allowed disabled:opacity-70",
                      )}
                    >
                      <Icon
                        className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")}
                        aria-hidden
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="label-caps">Coverage</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Assam · Meghalaya — 12 districts
        </p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">
          BUILD 0.1 · PROTOTYPE DATA
        </p>
      </div>
    </nav>
  );
}
