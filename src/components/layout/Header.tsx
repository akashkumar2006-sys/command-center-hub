import { Bell, ChevronDown, Hexagon, Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-surface-raised">
          <Hexagon className="size-5 text-primary" aria-hidden />
        </div>
        <div className="leading-tight">
          <p className="font-mono text-base font-semibold tracking-[0.14em] text-foreground">
            NER-LOGIX
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Regional Logistics &amp; Accessibility Intelligence
          </p>
        </div>
      </div>

      <div className="ml-4 hidden max-w-sm flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 xl:flex">
        <Search className="size-4 text-muted-foreground" aria-hidden />
        <span className="text-xs text-muted-foreground">
          Search missions, districts, incidents
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 md:flex">
          <span className="size-2 rounded-full bg-safe" aria-hidden />
          <span className="text-xs font-medium text-foreground">Operational</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            SYNC 02:14 IST
          </span>
        </div>

        <button
          type="button"
          className="relative rounded-md border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" aria-hidden />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive font-mono text-[9px] text-destructive-foreground">
            4
          </span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border bg-background py-1.5 pl-1.5 pr-2 text-left transition-colors hover:border-border-strong"
        >
          <span className="flex size-7 items-center justify-center rounded bg-surface-raised font-mono text-[11px] text-foreground">
            AK
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-medium text-foreground">A. Kalita</span>
            <span className="block text-[10px] text-muted-foreground">Regional Coordinator</span>
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
        </button>
      </div>
    </header>
  );
}
