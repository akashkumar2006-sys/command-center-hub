import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/** Application chrome. Pages render inside the scrollable work area. */
export function AppShell({
  children,
  activeNavId = "command-center",
}: {
  children: ReactNode;
  activeNavId?: string;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar activeId={activeNavId} />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
