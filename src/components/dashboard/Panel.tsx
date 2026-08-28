import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex min-h-0 flex-col", className)}>
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export const RISK_DOT: Record<string, string> = {
  safe: "bg-safe",
  moderate: "bg-moderate",
  high: "bg-high",
  blocked: "bg-blocked",
};

export const RISK_TEXT: Record<string, string> = {
  safe: "text-safe",
  moderate: "text-moderate",
  high: "text-high",
  blocked: "text-muted-foreground",
};

export const RISK_CHIP: Record<string, string> = {
  safe: "border-safe/40 bg-safe/10 text-safe",
  moderate: "border-moderate/40 bg-moderate/10 text-moderate",
  high: "border-high/40 bg-high/10 text-high",
  blocked: "border-border-strong bg-muted text-muted-foreground",
};

export const RISK_STROKE: Record<string, string> = {
  safe: "var(--color-safe)",
  moderate: "var(--color-moderate)",
  high: "var(--color-high)",
  blocked: "var(--color-blocked)",
};
