import type { Metadata } from "next";
import { DeckHeader } from "../components/DeckHeader";

export const metadata: Metadata = {
  title: "Yonder — Investor Deck",
  description: "Investor deck · Land intelligence for Europe",
};

/** Bump when `public/investor-deck.html` changes so browsers (and CDNs) don’t serve a stale iframe document. */
const INVESTOR_DECK_VERSION = "20260328o";

export default function DeckPage() {
  const deckSrc =
    process.env.NODE_ENV === "development"
      ? `/investor-deck.html?dev=${Date.now()}`
      : `/investor-deck.html?v=${INVESTOR_DECK_VERSION}`;

  return (
    <div className="relative min-h-screen bg-white text-[#1a1a18] font-sans overflow-x-hidden">
      <div className="cadastral-grid fixed inset-0 -z-20 opacity-[0.08] pointer-events-none" aria-hidden />
      <DeckHeader />
      <div className="h-[calc(100dvh-3rem)] w-full">
        <iframe
          src={deckSrc}
          title="Yonder — Investor Deck"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
