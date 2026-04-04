"use client";

import YonderExplorerAppInner from "./YonderExplorerAppInner";

export default function YonderExplorerApp(props: {
  embed?: boolean;
  /** When true, open map UI immediately; logo/home goes to site root (no in-app marketing duplicate). */
  skipLanding?: boolean;
}) {
  return <YonderExplorerAppInner {...props} />;
}
