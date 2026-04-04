import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-[100] border-b border-black/[0.08] bg-[#F9F9F9]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-[#1a1a18] no-underline">
          <div className="flex h-5 w-5 shrink-0 overflow-hidden rounded-[4px] bg-[#1a1a18] p-[2px]">
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1px]">
              <div className="bg-white" />
              <div className="bg-[#4a4a4a]" />
              <div className="bg-[#a8a8a8]" />
              <div className="bg-[#c84b0a]" />
            </div>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.06em] uppercase">Yonder</span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto sm:gap-5">
          <Link href="/explorer" className="shrink-0 text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">
            Explorer
          </Link>
          <Link href="/#product" className="hidden shrink-0 text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a] sm:inline">
            Product
          </Link>
          <Link href="/#who" className="hidden shrink-0 text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a] md:inline">
            For who
          </Link>
          <Link href="/#coverage" className="hidden shrink-0 text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a] md:inline">
            Coverage
          </Link>
          <Link href="/#pricing" className="hidden shrink-0 text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a] lg:inline">
            Pricing
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/explorer" className="hidden text-[13px] font-medium text-[#1a1a18] no-underline md:inline">
            Sign in
          </Link>
          <Link
            href="/explorer"
            className="inline-flex items-center gap-1 rounded-full border-none bg-[#1a1a18] px-3 py-2 text-[13px] font-medium text-white no-underline sm:px-4"
          >
            Get access
          </Link>
        </div>
      </div>
    </nav>
  );
}
