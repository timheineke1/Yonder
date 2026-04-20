"use client";

import YonderExplorerAppInner from "./YonderExplorerAppInner";

export default function YonderExplorerApp(props: {
  embed?: boolean;
  skipLanding?: boolean;
  sidebarMode?: "search" | "projects";
}) {
  return <YonderExplorerAppInner {...props} />;
}
