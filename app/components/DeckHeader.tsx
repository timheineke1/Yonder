import Link from "next/link";

/** Minimal chrome for /deck — logo only, back to marketing site. Width matches `public/investor-deck.html` `.wrap` (1152px). */
export function DeckHeader() {
  return (
    <header className="sticky top-0 z-[100] border-b border-black/[0.08] bg-[#F9F9F9]">
      <div className="mx-auto flex h-12 max-w-[1152px] items-center px-5 sm:px-6 min-[861px]:px-12">
        <Link
          href="/"
          className="text-[#1a1a18] no-underline transition-opacity hover:opacity-80"
          aria-label="Back to Yonder"
        >
          <div className="flex h-5 w-5 shrink-0 overflow-hidden rounded-[4px] bg-[#1a1a18] p-[2px]">
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1px]">
              <div className="bg-white" />
              <div className="bg-[#4a4a4a]" />
              <div className="bg-[#a8a8a8]" />
              <div className="bg-[#c84b0a]" />
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
