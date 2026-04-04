"use client";

import dynamic from "next/dynamic";

const YonderExplorerApp = dynamic(() => import("./YonderExplorerApp"), {
  ssr: false,
  loading: () => (
    <div className="yonder-explorer-page flex min-h-dvh items-center justify-center text-[13px] text-[#6b7280]">
      Loading explorer…
    </div>
  ),
});

/** Full-viewport app. Marketing homepage is `/` (SiteNav → Explorer). */
export function ExplorerPageClient() {
  return (
    <div className="yonder-explorer-page relative min-h-dvh">
      <YonderExplorerApp skipLanding />
    </div>
  );
}
