import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { IdeaHomeNav } from "../components/IdeaHomeNav";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SAGE = "#6b7c5c";

/** Portugal / Alentejo-style countryside — full-bleed, edge to edge. */
const LAND = {
  hero: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=2800&q=85",
  band: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=2800&q=85",
  lower: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=2800&q=85",
} as const;

export const metadata: Metadata = {
  title: "Yonder — Land intelligence",
  description:
    "Buy land with clarity. Yonder maps opportunity layers—solar, eco, ruins, and more—across Portugal and beyond.",
};

function SectionPad({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

function FullBleedImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full min-h-[56vh] sm:min-h-[62vh] md:min-h-[72vh]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={priority}
      />
    </div>
  );
}

function MapInterfaceMock() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#dfe6d9]"
      style={{ aspectRatio: "16 / 9" }}
      aria-label="Illustrative map: opportunity layers"
    >
      <div className="absolute inset-0 opacity-[0.35]" aria-hidden>
        <svg className="h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b7c5c" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path
            d="M40 380 Q200 200 360 220 T620 140 L760 80"
            fill="none"
            stroke="#b8c4ae"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M120 40 L180 400" fill="none" stroke="#c8d1bf" strokeWidth="2" strokeLinecap="round" />
          <path d="M500 320 L720 360" fill="none" stroke="#c8d1bf" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-8 sm:top-8">
        {[
          { label: "Solar", className: "bg-[#5a6b4e] text-white" },
          { label: "Eco", className: "bg-[#6b7c5c] text-white" },
          { label: "Ruins", className: "bg-[#3d4536] text-white" },
        ].map((x) => (
          <span
            key={x.label}
            className={`rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${x.className}`}
          >
            {x.label}
          </span>
        ))}
      </div>
      {/* Pins — sage family only */}
      <div className="absolute left-[18%] top-[38%] flex h-3 w-3 items-center justify-center rounded-full bg-[#5a6b4e] shadow-md ring-2 ring-white">
        <span className="sr-only">Solar opportunity</span>
      </div>
      <div className="absolute left-[52%] top-[44%] flex h-3 w-3 items-center justify-center rounded-full bg-[#6b7c5c] shadow-md ring-2 ring-white">
        <span className="sr-only">Eco opportunity</span>
      </div>
      <div className="absolute left-[68%] top-[28%] flex h-3 w-3 items-center justify-center rounded-full bg-[#3d4536] shadow-md ring-2 ring-white">
        <span className="sr-only">Ruin opportunity</span>
      </div>
      <div className="absolute right-4 bottom-4 max-w-[200px] text-[11px] font-medium leading-snug text-[#111]/70 sm:right-8 sm:bottom-8 sm:text-xs">
        Opportunity layer preview — illustrative
      </div>
    </div>
  );
}

export default function MyIdeaHomePage() {
  return (
    <div className={`min-h-screen bg-white text-[#111] antialiased ${dmSans.className}`}>
      <IdeaHomeNav />

      <main>
        {/* Hero — full-bleed Alentejo-style land */}
        <section className="relative min-h-screen w-full" id="top" aria-label="Hero">
          <Image
            src={LAND.hero}
            alt="Rolling agricultural land in Alentejo, Portugal — open fields and gentle hills under a wide sky"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden />
          <div className="relative z-10 flex min-h-screen flex-col justify-end pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28">
            <SectionPad>
              <p className="mb-6 text-[13px] font-medium tracking-[0.06em] text-white">Welcome to Yonder.</p>
              <h1 className="max-w-[1200px] text-[clamp(2rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
                land — where intelligence meets opportunity
              </h1>
            </SectionPad>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="bg-white py-24 sm:py-32 lg:py-40">
          <SectionPad>
            <div className="mx-auto max-w-[720px]">
              <p className="text-[clamp(1.35rem,3vw,1.85rem)] font-semibold leading-snug tracking-[-0.02em]">
                Buy land. They are not making it anymore.
              </p>
              <div className="mt-10 space-y-6 text-[17px] font-normal leading-[1.75] text-[#111]/85 sm:text-[18px]">
                <p>
                  Yonder turns fragmented registry data, zoning, and opportunity signals into a single map you can
                  actually use—so you see where solar, ecotourism, ruin conversion, and transition plots pencil out
                  before the market catches up.
                </p>
                <p>
                  We are building the diligence layer for land in Southern Europe: fast scans, defensible sources, and
                  alerts when something worth your time appears.
                </p>
              </div>
              <div className="mt-12">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: SAGE }}
                >
                  Request access
                </a>
              </div>
            </div>
          </SectionPad>
        </section>

        {/* Full-bleed land + centered white mission text */}
        <section className="relative w-full min-h-[62vh]" aria-label="Landscape and promise">
          <Image
            src={LAND.band}
            alt="Terraced hills and open land — typical of southern Portugal"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="max-w-[880px] text-center text-[clamp(1.25rem,3.2vw,2rem)] font-semibold leading-snug text-white">
              Every hectare tells a story—zoning, risk, and upside. We help you read it before you commit.
            </p>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="bg-white py-24 sm:py-32" aria-label="Use cases">
          <SectionPad>
            <ul className="mx-auto max-w-[720px] divide-y divide-black/10">
              {[
                "Solar & energy",
                "Eco tourism & retreats",
                "Ruin conversion",
                "Agricultural transition",
                "Urban fringe development",
                "Portfolio monitoring",
              ].map((label) => (
                <li key={label} className="py-6 text-[17px] font-medium tracking-[-0.01em] sm:text-[18px]">
                  {label}
                </li>
              ))}
            </ul>
          </SectionPad>
        </section>

        <FullBleedImage
          src={LAND.lower}
          alt="Green countryside path through Portuguese landscape, cork oak and open ground"
        />

        {/* Quote */}
        <section className="bg-white py-28 sm:py-36 lg:py-44" aria-label="Quote">
          <SectionPad>
            <blockquote className="mx-auto max-w-[900px] text-center text-[clamp(1.5rem,3.8vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
              Not all land is equal—but most buyers only see a polygon on a listing. Yonder shows what the polygon
              actually promises.
            </blockquote>
          </SectionPad>
        </section>

        {/* Map UI */}
        <section id="map" className="bg-white pb-28 sm:pb-36" aria-label="Product preview">
          <SectionPad>
            <p className="mx-auto mb-10 max-w-[720px] text-[17px] font-normal leading-[1.7] text-[#111]/82">
              The surface is a live map: opportunity layers you can toggle—solar yield proxies, eco constraints, ruin
              footprints, and change over time—so you spot parcels worth a second look.
            </p>
            <div className="mx-auto w-full max-w-[1100px]">
              <MapInterfaceMock />
            </div>
          </SectionPad>
        </section>

        {/* Features — text only */}
        <section id="features" className="bg-white py-24 sm:py-32" aria-label="Features">
          <SectionPad>
            <div className="mx-auto max-w-[720px] space-y-16 sm:space-y-20">
              <p className="text-[clamp(1.2rem,2.4vw,1.45rem)] font-semibold leading-snug tracking-[-0.02em]">
                Spot opportunities on the map before anyone else
              </p>
              <p className="text-[clamp(1.2rem,2.4vw,1.45rem)] font-semibold leading-snug tracking-[-0.02em]">
                Add to pipeline / track land / portfolio alerts
              </p>
            </div>
          </SectionPad>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-[#f4f4f4] py-24 sm:py-32 lg:py-40" aria-label="Pricing">
          <SectionPad>
            <div className="mx-auto flex max-w-[900px] flex-col gap-16 sm:flex-row sm:justify-between sm:gap-8">
              {[
                { price: "€29", hint: "per month, explorer" },
                { price: "€99", hint: "per month, team" },
                { price: "€499", hint: "per month, organisation" },
              ].map((t) => (
                <div key={t.price} className="text-center sm:text-left">
                  <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-semibold tracking-[-0.03em]">{t.price}</p>
                  <p className="mt-3 text-[14px] font-normal text-[#111]/65">{t.hint}</p>
                </div>
              ))}
            </div>
          </SectionPad>
        </section>

        {/* Concierge — sage, white type */}
        <section
          id="concierge"
          className="py-24 text-white sm:py-32 lg:py-40"
          style={{ backgroundColor: SAGE }}
          aria-label="Concierge"
        >
          <SectionPad>
            <div className="mx-auto max-w-[720px]">
              <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-snug tracking-[-0.02em]">
                We find it. We check it. We buy it for you.
              </h2>
              <p className="mt-8 text-[17px] font-normal leading-[1.75] text-white/92 sm:text-[18px]">
                Full-service search and acquisition support on a success fee basis —{" "}
                <span className="font-semibold text-white">2% capped at €10,000</span>.
              </p>
              <div className="mt-12">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center border border-white px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
                >
                  Talk to concierge
                </a>
              </div>
            </div>
          </SectionPad>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-black px-6 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-[20px] font-semibold tracking-[0.02em]">yonder</div>
            <div className="space-y-6 text-[14px] font-normal leading-relaxed text-white/75">
              <div>
                <a href="mailto:hello@liveyonder.co" className="text-white no-underline hover:underline">
                  hello@liveyonder.co
                </a>
              </div>
              <div className="flex flex-col gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">
                <Link href="/" className="text-white/80 no-underline hover:text-white">
                  Marketing site →
                </Link>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-14 max-w-[1400px] text-[11px] leading-relaxed text-white/40">
            Photography via Unsplash (Portugal / Alentejo-style countryside). Map preview is illustrative.
          </p>
        </footer>
      </main>
    </div>
  );
}
