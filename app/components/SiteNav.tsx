import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-[100] border-b border-black/[0.08] bg-[#F9F9F9]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 text-[#1a1a18] no-underline">
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
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/#product" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">
            Product
          </Link>
          <Link href="/#who" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">
            For who
          </Link>
          <Link href="/#coverage" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">
            Coverage
          </Link>
          <Link href="/#pricing" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="text-[13px] font-medium text-[#1a1a18] no-underline">
            Sign in
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1 rounded-full border-none bg-[#1a1a18] px-4 py-2 text-[13px] font-medium text-white no-underline"
          >
            Get access
          </a>
        </div>
      </div>
    </nav>
  );
}
