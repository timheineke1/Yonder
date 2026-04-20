"use client";

import React from "react";

type NavId = "search" | "projects";

interface SidebarContainerProps {
  mode: NavId;
  width: number;
  children?: React.ReactNode;
}

function SearchHeader() {
  return (
    <div className="h-12 px-4 border-b border-border flex items-center justify-between flex-shrink-0">
      <span className="text-sm font-medium text-foreground">Yonder</span>
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">Online</span>
      </span>
    </div>
  );
}

function ProjectsHeader() {
  return (
    <div className="h-12 px-4 border-b border-border flex items-center justify-between flex-shrink-0">
      <span className="text-sm font-medium text-foreground">Projects</span>
      <button className="bg-foreground text-background rounded-full px-4 py-[5px] text-xs font-medium">
        + New project
      </button>
    </div>
  );
}

export default function SidebarContainer({ mode, width, children }: SidebarContainerProps) {
  return (
    <aside
      aria-label={mode === "search" ? "Search and chat" : "Projects"}
      className="flex flex-col bg-background border-r border-border h-screen overflow-hidden"
      style={{ width, flexShrink: 0 }}
    >
      {mode === "search" ? <SearchHeader /> : <ProjectsHeader />}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {children}
      </div>
    </aside>
  );
}
