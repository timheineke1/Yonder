import type { Metadata } from "next";
import { ExplorerPageClient } from "../components/ExplorerPageClient";

export const metadata: Metadata = {
  title: "Yonder — Explorer",
  description: "Search plots, map view, and project pipeline — prototype UI.",
};

export default function ExplorerPage() {
  return <ExplorerPageClient />;
}
