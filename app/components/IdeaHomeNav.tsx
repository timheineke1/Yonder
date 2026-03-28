"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#map", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#concierge", label: "Concierge" },
  { href: "#contact", label: "Contact" },
] as const;

function HamburgerIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
      <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Minimal chrome: wordmark + hamburger; light-on-dark when over hero. */
export function IdeaHomeNav() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);

  const updateFromScroll = useCallback(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    setOnDark(window.scrollY < vh * 0.88);
  }, []);

  useEffect(() => {
    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [updateFromScroll]);

  const text = onDark ? "text-white" : "text-[#111]";
  const border = onDark ? "border-white/15" : "border-black/[0.08]";
  const panelBg = onDark ? "bg-[#111]/40 backdrop-blur-md" : "bg-white/95 backdrop-blur-md";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${border} ${panelBg}`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        <Link
          href="/my-idea-home"
          className={`text-[15px] font-semibold tracking-[0.02em] no-underline ${text}`}
          onClick={() => setOpen(false)}
        >
          yonder
        </Link>

        <button
          type="button"
          className={`flex items-center justify-center p-1 ${text}`}
          aria-expanded={open}
          aria-controls="idea-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <span className="text-[12px] font-semibold tracking-[0.14em] uppercase">Close</span> : <HamburgerIcon />}
        </button>
      </div>

      <div
        id="idea-mobile-nav"
        className={`border-t ${border} ${onDark ? "bg-[#111]/92 backdrop-blur-lg" : "bg-white"} px-6 py-8 sm:px-8 lg:px-12 ${open ? "block" : "hidden"}`}
      >
        <nav className="flex flex-col gap-5" aria-label="Primary">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-[13px] font-semibold uppercase tracking-[0.16em] no-underline transition-opacity hover:opacity-65 ${text}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
