import type { Metadata } from "next";
import { DeckHeader } from "../components/DeckHeader";

export const metadata: Metadata = {
  title: "Yonder — Investor Deck",
  description: "Investor deck · Land intelligence for Europe",
};

export default function DeckPage() {
  return (
    <div className="relative min-h-screen bg-[#F9F9F9] text-[#1a1a18] font-sans overflow-x-hidden">
      <div className="cadastral-grid fixed inset-0 -z-20 opacity-[0.12] pointer-events-none" aria-hidden />
      <DeckHeader />
      <div className="h-[calc(100dvh-3rem)] w-full">
        <iframe
          src="/investor-deck.html"
          title="Yonder — Investor Deck"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
