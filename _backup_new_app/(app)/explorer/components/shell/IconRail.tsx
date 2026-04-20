"use client";

import React, { useState } from "react";

type NavId = "search" | "projects";

interface IconRailProps {
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
}

function Logo() {
  return (
    <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center mb-5 cursor-pointer flex-shrink-0">
      <div className="grid grid-cols-2 gap-[1.5px]">
        <div className="w-[7px] h-[7px] rounded-[1px] bg-white" />
        <div className="w-[7px] h-[7px] rounded-[1px] bg-[#4a4a4a]" />
        <div className="w-[7px] h-[7px] rounded-[1px] bg-[#a8a8a8]" />
        <div className="w-[7px] h-[7px] rounded-[1px] bg-[#c84b0a]" />
      </div>
    </div>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7.5" cy="7.5" r="5" />
      <line x1="11.5" y1="11.5" x2="15.5" y2="15.5" />
    </svg>
  );
}

function ProjectsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" fill={active ? "currentColor" : "none"} opacity={active ? 0.8 : 1} />
      <rect x="2" y="10" width="6" height="6" rx="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2.5 13.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" />
    </svg>
  );
}

const NAV_ITEMS: { id: NavId; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: "search", label: "Search", Icon: SearchIcon },
  { id: "projects", label: "Projects", Icon: ProjectsIcon },
];

export default function IconRail({ activeNav, onNavChange }: IconRailProps) {
  const [tooltip, setTooltip] = useState<NavId | null>(null);

  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="flex flex-col items-center py-3.5 gap-1 h-screen bg-background border-r border-border"
      style={{ width: 52, flexShrink: 0 }}
    >
      <Logo />

      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = activeNav === id;
        return (
          <div key={id} className="relative">
            <button
              role="tab"
              aria-selected={active}
              aria-label={label}
              onClick={() => onNavChange(id)}
              onMouseEnter={() => setTooltip(id)}
              onMouseLeave={() => setTooltip(null)}
              className={[
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-border outline-none",
                active
                  ? "bg-accent border border-border text-foreground"
                  : "bg-transparent border border-transparent text-tertiary-foreground hover:text-foreground",
              ].join(" ")}
            >
              <Icon active={active} />
            </button>
            {tooltip === id && (
              <div
                className="absolute top-1/2 -translate-y-1/2 animate-in fade-in duration-150 pointer-events-none z-[999]"
                style={{ left: "calc(100% + 10px)" }}
              >
                <div className="bg-foreground text-background text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap relative">
                  {label}
                  <span
                    className="absolute top-1/2 -translate-y-1/2 -left-[5px] border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent"
                    style={{ borderRightColor: "var(--foreground)" }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-auto">
        <button
          className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="User menu"
        >
          <UserIcon />
        </button>
      </div>
    </nav>
  );
}
