"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import IconRail from "./shell/IconRail";

const YonderExplorerApp = dynamic(() => import("./YonderExplorerApp"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  ),
});

type NavId = "search" | "projects";

export default function ExplorerPageClient() {
  const [activeNav, setActiveNav] = useState<NavId>("search");

  return (
    <div className="flex h-screen bg-background overflow-hidden yonder-explorer-page">
      <IconRail activeNav={activeNav} onNavChange={setActiveNav} />
      <div className="flex-1 min-w-0 flex overflow-hidden">
        <YonderExplorerApp skipLanding sidebarMode={activeNav} />
      </div>
    </div>
  );
}
