export default function Home() {
  const features = [
    { num: "01", title: "All data layers ingested, not just one.", desc: "Zoning plans, PDM, building regulations, cadastre, land registries, GIS land-use data — Yonder pulls from every source, not just the easy ones.", screen: "layers" },
    { num: "02", title: "Cross-connected and AI-reasoned.", desc: "The hard part isn't collecting data — it's making it talk to itself. Yonder cross-references every layer and lets AI reason across the full regulatory picture.", screen: "connect" },
    { num: "03", title: "From 500-page PDFs to a plain verdict.", desc: "Municipal planning docs, RAN and REN restrictions, registry status — AI reads and interprets them all, condensing weeks of manual diligence into a clear answer.", screen: "verdict" },
    { num: "04", title: "Listed and unlisted, in one search.", desc: "7 in 10 land transactions happen off-market. Yonder surfaces unlisted plots alongside listed stock — search by intent, draw an area, or query by use case.", screen: "search" },
    { num: "05", title: "Predictive, not just descriptive.", desc: "As more plots are structured, the engine becomes predictive — matching land to demand before it's ever listed, and getting smarter with every query.", screen: "predict" },
    { num: "06", title: "Full due diligence, on demand.", desc: "Deep-dive reports combining AI analysis with expert review. What used to take a €2K architect study and four weeks now takes 48 hours.", screen: "report" },
  ];

  const FeatureScreen = ({ type }: { type: string }) => (
    <div className="mt-4 max-w-[220px] overflow-hidden rounded-lg border border-black/[0.08] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#f0eeea] px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        <span className="ml-1 text-[9px] text-[#999]">Yonder</span>
      </div>
      <div className="min-h-[100px] p-2.5 text-[9px]">
        {type === "layers" && (
          <div className="flex flex-wrap gap-1.5">
            {["PDM", "Cadastre", "REN", "RAN", "Registry"].map((l, i) => (
              <div key={l} className="flex items-center gap-1 rounded-md border border-black/[0.06] bg-[#fafafa] px-2 py-1">
                <span className="text-[#4a9a4a]">✓</span>
                <span className="text-[#555]">{l}</span>
              </div>
            ))}
          </div>
        )}
        {type === "connect" && (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2 py-1.5 text-[#3B82F6] font-medium">Zoning</div>
            <div className="agent-pulse flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/20">
              <div className="agent-spin h-3 w-3" />
            </div>
            <div className="rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2 py-1.5 text-[#3B82F6] font-medium">Cadastre</div>
          </div>
        )}
        {type === "verdict" && (
          <div className="pdf-scan-container relative space-y-1.5 rounded-md bg-[#f8f7f4] p-2">
            <div className="pdf-scan-line" aria-hidden />
            <div className="relative flex items-center gap-1.5 text-[#888]">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 1h8v10H2z" /><path d="M2 4h8M2 6h6M2 8h4" /></svg>
              <span className="text-[8px] font-medium">PDM_Algarve.pdf</span>
            </div>
            <div className="relative space-y-0.5">
              {["Art. 12 — Zoning…", "Art. 34 — REN…", "RAN status…"].map((line, i) => (
                <div key={i} className={`flex items-center gap-1 font-mono text-[8px] text-[#888] ${i === 1 ? "pdf-line-scan text-[#1a1a18]" : ""}`}>
                  {line}
                </div>
              ))}
            </div>
            <div className="relative mt-1.5 rounded bg-[#4a9a4a]/15 px-2 py-1 text-[9px] font-medium text-[#2d7a2d]">Verdict: Viable ✓</div>
          </div>
        )}
        {type === "search" && (
          <div className="space-y-1.5">
            <div className="relative overflow-hidden rounded-md bg-[#e8eef4] p-1.5" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "8px 8px" }}>
              <span className="absolute right-2 top-1.5 rounded bg-[#c84b0a]/15 px-1.5 py-0.5 text-[7px] font-medium text-[#c84b0a]">Draw</span>
              <svg viewBox="0 0 100 70" className="h-14 w-full overflow-visible">
                <rect x="5" y="5" width="90" height="60" fill="rgba(255,255,255,0.6)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
                <path d="M25 25 L55 30 L75 50 L50 55 L20 45 Z" fill="rgba(59,130,246,0.25)" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="35" cy="35" r="3" fill="#3B82F6" />
                <circle cx="60" cy="40" r="2.5" fill="#3B82F6" />
                <circle cx="45" cy="50" r="2" fill="#3B82F6" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#3B82F6] font-medium">847 drawn</span>
              <span className="text-[#888]">Listed + Unlisted</span>
            </div>
          </div>
        )}
        {type === "predict" && (
          <div className="space-y-2 rounded-md bg-[#f8f7f4] p-2">
            <div className="flex items-center gap-2">
              <div className="agent-pulse flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/15">
                <div className="agent-spin h-3 w-3" />
              </div>
              <div>
                <div className="text-[10px] font-medium text-[#1a1a18]">Matching demand…</div>
                <div className="text-[8px] text-[#888]">Plot fit · Signal</div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-black/[0.06] bg-white px-2 py-1.5">
              <span className="text-[#888]">Score</span>
              <span className="font-semibold text-[#3B82F6]">94%</span>
            </div>
          </div>
        )}
        {type === "report" && (
          <div className="rounded-md border border-black/[0.06] bg-[#fafafa] p-2">
            <div className="flex items-center gap-2">
              <div className="agent-pulse flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/15">
                <div className="agent-spin h-2 w-2" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-0.5 text-[9px] font-medium text-[#1a1a18]">
                  Understanding
                  <span className="type-cursor inline-block w-px self-center bg-[#1a1a18]">|</span>
                </div>
                <div className="mt-0.5 text-[8px] text-[#888]">Due diligence report</div>
              </div>
            </div>
            <div className="mt-2 rounded border border-black/[0.05] bg-white p-1.5">
              <div className="mb-1 flex gap-1">
                <span className="text-[7px] text-[#4a9a4a]">✓</span>
                <span className="text-[8px] text-[#555]">REN/RAN</span>
              </div>
              <div className="flex gap-1">
                <span className="text-[7px] text-[#4a9a4a]">✓</span>
                <span className="text-[8px] text-[#555]">Registry</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const whoFor = [
    { title: "Land Owners", desc: "Know what you own, what you can build, and what it's worth.", icon: "house" },
    { title: "Buyers & Realtors", desc: "Search listed and unlisted plots together. Share reports before the first visit.", icon: "person" },
    { title: "Eco Tourism & Cabins", desc: "Find rural plots with the right access, zoning, and permits for retreats and cabins.", icon: "pin" },
    { title: "Energy & Data", desc: "Site solar and data infrastructure by grid access, zoning class, and viability score.", icon: "energy" },
    { title: "Property Developers", desc: "Screen portfolios at scale and run feasibility fast.", icon: "building" },
  ];

  const coverage = [
    { region: "Portugal", status: "Live now", active: true },
    { region: "Spain", status: "Next up", next: true },
    { region: "Italy · Greece · Balkans", status: "2025–26", planned: true },
    { region: "France · Germany · Benelux", status: "2025–26", planned: true },
    { region: "Scandinavia", status: "2025–26", planned: true },
  ];

  return (
    <div className="relative min-h-screen bg-[#F9F9F9] text-[#1a1a18] font-sans overflow-x-hidden">
      <div className="cadastral-grid fixed inset-0 -z-20 opacity-[0.12] pointer-events-none" aria-hidden />

      {/* NAV */}
      <nav className="sticky top-0 z-[100] border-b border-black/[0.08] bg-[#F9F9F9]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-12">
          <a href="#" className="flex items-center gap-2.5 text-[#1a1a18] no-underline">
          {/* Cadastre blocks logo — 2x2 land parcels */}
          <div className="flex h-5 w-5 shrink-0 overflow-hidden rounded-[4px] bg-[#1a1a18] p-[2px]">
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1px]">
              <div className="bg-white" />
              <div className="bg-[#4a4a4a]" />
              <div className="bg-[#a8a8a8]" />
              <div className="bg-[#c84b0a]" />
            </div>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.06em] uppercase">Yonder</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#product" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">Product</a>
          <a href="#who" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">For who</a>
          <a href="#coverage" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">Coverage</a>
          <a href="#pricing" className="text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:text-[#c84b0a]">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="text-[13px] font-medium text-[#1a1a18] no-underline">Sign in</a>
          <a href="#" className="inline-flex items-center gap-1 rounded-full border-none bg-[#1a1a18] px-4 py-2 text-[13px] font-medium text-white no-underline">Get access</a>
        </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-12">
      {/* HERO */}
      <div className="relative overflow-hidden pb-14 pt-16 sm:pt-20 lg:pb-16 lg:pt-24">
        <div className="cadastral-grid absolute inset-0 -z-10 opacity-[0.15]" aria-hidden />
        <div className="absolute -right-32 top-1/4 h-64 w-64 -z-10 opacity-[0.06]" aria-hidden>
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#1a1a18]">
            <path d="M20 20 L80 20 L120 60 L180 60 L180 140 L100 180 L20 140 Z" />
            <path d="M60 80 L140 40 L160 100 L100 160 L40 120 Z" />
          </svg>
        </div>
        <h1 className="text-hero mb-6 flex flex-col gap-0.5 leading-tight text-[#1a1a18]">
          <span>Find land.</span>
          <span>Understand <em>everything</em> about it.</span>
        </h1>
        <p className="mb-8 max-w-[520px] text-[15px] leading-[1.6] text-[#6b6b68]">
          Search millions of plots across Europe — listed and unlisted. Get instant answers on zoning, regulations, buildability, and use rights.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="inline-flex items-center gap-2 rounded-full border-none bg-[#1a1a18] px-6 py-2.5 text-[14px] font-medium text-white no-underline">
            Search land →
          </a>
          <a href="#product" className="rounded-full border border-black/[0.15] px-5 py-2.5 text-[14px] font-medium text-[#6b6b68] no-underline transition-colors hover:border-black/[0.25] hover:text-[#1a1a18]">See how it works →</a>
        </div>
      </div>

      {/* MAIN SCREENSHOT — Land Agent at Work: Chat + Map */}
      <div className="relative mb-14 overflow-hidden rounded-[12px] bg-[#f0f0f0] lg:mb-20">
        <div className="cadastral-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="relative z-10 flex justify-center px-4 py-6 lg:px-6 lg:py-8">
          <div className="w-full max-w-[1200px] overflow-hidden rounded-[12px] bg-white shadow-[0_8px_48px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2 border-b border-black/[0.08] bg-[#fafafa] px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto text-sm text-[#999]">Yonder — Land Agent</span>
            </div>
            <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-[380px_1fr]">
              {/* Left: Project sidebar — clean list with spinners (reference style) */}
              <div className="flex flex-col border-r border-black/[0.08] bg-[#F5F5F5]">
                <div className="border-b border-black/[0.06] px-5 py-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#888]">Your Project</span>
                </div>
                {/* Area search bar — links sidebar to map */}
                <div className="border-b border-black/[0.08] bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-medium text-[#1a1a18]">Area search Alentejo</div>
                      <div className="text-[11px] text-[#6b6b68]">120 plots · Analyze all</div>
                    </div>
                    <button className="shrink-0 rounded-md bg-[#1a1a18] px-3 py-1.5 text-[11px] font-medium text-white">Analyze</button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
                  {/* IN PROGRESS — thin circle spinner with orange segment */}
                  <div className="mb-5">
                    <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#999]">In progress 2</div>
                    {[
                      { title: "Alentejo rural plots", subtitle: "Scanning registry…" },
                      { title: "Solar suitability — Évora", subtitle: "Running model…" },
                    ].map((item, i) => (
                      <div key={i} className="mb-4 flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                          <div className="h-5 w-5 shrink-0 rounded-full border-[1.5px] border-[#ddd] border-t-[#c84b0a] animate-spin" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-[#1a1a18]">{item.title}</div>
                          <div className="text-[12px] text-[#6b6b68]">{item.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/[0.08] py-4" />
                  {/* READY FOR REVIEW — checkmark in circle */}
                  <div>
                    <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#999]">Ready for review 4</div>
                    {[
                      { title: "Herdade do Outeiro", subtitle: "28ha · REN clear · €890K", time: "now", selected: true },
                      { title: "Barcelos cluster", subtitle: "3 plots · PDM rezone risk", time: "14m" },
                      { title: "Setúbal coastal rustic", subtitle: "AUGI constraint flagged", time: "1h" },
                      { title: "Algarve scrubland 4ha", subtitle: "Tourism zone potential", time: "2h" },
                    ].map((item, i) => (
                      <div key={i} className={`mb-3 flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-black/[0.04] ${item.selected ? "bg-black/[0.04]" : ""}`}>
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#ccc]">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4 L4 7 L9 1" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-[#1a1a18]">{item.title}</div>
                          <div className="text-[12px] text-[#6b6b68]">{item.subtitle}</div>
                        </div>
                        <div className="shrink-0 pt-0.5 text-[11px] text-[#999]">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-black/[0.06] p-4">
                  <div className="flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-4 py-2.5">
                    <input type="text" placeholder="Ask about this area…" className="flex-1 bg-transparent text-[13px] text-[#1a1a18] placeholder:text-[#999] focus:outline-none" />
                    <button className="rounded-full bg-[#1a1a18] px-3 py-1 text-[11px] font-medium text-white">+</button>
                  </div>
                </div>
              </div>
              {/* Right: Map panel */}
              <div className="flex flex-col bg-white">
                <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-3.5">
                  <div className="flex flex-1 items-center gap-2 rounded-[10px] bg-[#1a1a18] px-4 py-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <span className="text-[13px] text-white/90">Find Land</span>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-[8px] border border-black/[0.12] bg-white px-3 py-2 text-[12px] font-medium text-[#1a1a18]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    Your Project
                  </button>
                </div>
                <div className="flex items-center gap-2 border-b border-black/[0.06] px-5 py-2.5">
                  <button className="rounded-md bg-black/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#1a1a18]">Map</button>
                  <button className="rounded-md px-3 py-1.5 text-[11px] font-medium text-[#888] hover:bg-black/[0.03]">List</button>
                  <button className="rounded-md px-3 py-1.5 text-[11px] font-medium text-[#888] hover:bg-black/[0.03]">Filters</button>
                  <div className="ml-2 flex flex-wrap gap-1.5">
                    <span className="flex items-center gap-1 rounded-full bg-[#f0f0f0] px-2.5 py-1 text-[10px] text-[#666]">
                      <span className="hidden sm:inline">Location: 39.41, -8.50</span>
                      <span className="sm:hidden">Alentejo</span> <span className="text-[#999]">×</span>
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-[#f0f0f0] px-2.5 py-1 text-[10px] text-[#666]">
                      <span className="hidden sm:inline">Price: €1000 - ∞</span>
                      <span className="sm:hidden">Price</span> <span className="text-[#999]">×</span>
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-[#f0f0f0] px-2.5 py-1 text-[10px] text-[#666]">
                      Size <span className="text-[#999]">×</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-[12px] font-medium text-[#1a1a18]">120 plots in drawn area</span>
                  <button className="rounded-md border border-black/[0.12] px-3 py-1.5 text-[11px] font-medium text-[#1a1a18]">Select Plots</button>
                </div>
                <div className="relative flex-1 overflow-hidden bg-[#e8e8e8]">
                  {/* Grey map background — clean, abstract (no geography) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        linear-gradient(180deg, #e5e5e5 0%, #d4d4d4 50%, #c9c9c9 100%),
                        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.03) 20px),
                        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.03) 20px)
                      `,
                    }}
                  />
                  {/* User-drawn area overlay */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 280" preserveAspectRatio="none" fill="none" aria-hidden>
                    <path d="M80 60 L180 50 L260 100 L240 180 L140 200 L60 150 Z" fill="rgba(200,75,10,0.1)" stroke="#c84b0a" strokeWidth="2" strokeDasharray="6 4" />
                  </svg>
                  {/* Blue cluster markers */}
                  {[
                    { top: "18%", left: "22%", num: "276" },
                    { top: "35%", left: "45%", num: "184" },
                    { top: "55%", left: "38%", num: "101" },
                    { top: "42%", left: "62%", num: "89" },
                    { top: "28%", left: "72%", num: "52" },
                    { top: "62%", left: "28%", num: "47" },
                  ].map((m) => (
                    <div
                      key={m.num}
                      className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] text-[12px] font-semibold text-white shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
                      style={{ top: m.top, left: m.left }}
                    >
                      {m.num}
                    </div>
                  ))}
                  {/* Map tools — Pin, Draw (active), Layers — like real app */}
                  <div className="absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border border-black/[0.08] bg-white/95 shadow-sm">
                    <button className="flex items-center gap-2 rounded-t-lg px-3 py-2.5 text-[11px] font-medium text-[#555] hover:bg-black/[0.03]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Pin
                    </button>
                    <button className="flex items-center gap-2 rounded-md border border-[#c84b0a]/30 bg-[#c84b0a]/10 px-3 py-2.5 text-[11px] font-medium text-[#c84b0a]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /></svg>
                      Draw
                    </button>
                    <button className="flex items-center justify-between gap-2 rounded-b-lg px-3 py-2.5 text-[11px] font-medium text-[#555] hover:bg-black/[0.03]">
                      <span className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /></svg>
                        Layers
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                  </div>
                  <div className="absolute right-4 top-4 rounded-lg border border-black/[0.06] bg-white/95 px-3 py-2 text-[11px] text-[#555] shadow-sm">
                    120 plots shown <span className="text-[#999]">(max 1000)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES — 2x3 grid with cadastral lines */}
      <div id="product" className="relative py-14 lg:py-20">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c84b0a]">Product</div>
        <div className="cadastral-grid-dense absolute inset-0 -z-10 opacity-60" aria-hidden />
        <div className="absolute -left-20 bottom-1/4 h-48 w-48 -z-10 opacity-[0.06]" aria-hidden>
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-[#1a1a18]">
            <polygon points="10,10 50,10 90,50 50,90 10,50" />
            <polygon points="30,30 70,30 70,70 30,70" />
          </svg>
        </div>
        <h2 className="text-h2 mb-3 flex items-center gap-2 text-[#1a1a18]">
          <span className="hidden sm:inline-flex" aria-hidden>
            <span className="agent-pulse flex h-6 w-6 items-center justify-center rounded-full bg-[#c84b0a]/10">
              <span className="agent-spin h-2 w-2" />
            </span>
          </span>
          Every data layer. <em>One connected picture.</em>
        </h2>
        <p className="mb-10 max-w-[520px] text-[15px] leading-[1.6] text-[#6b6b68]">
          Zoning, cadastre, REN/RAN, registries — all connected. AI reasons across the full picture.
        </p>
        <div className="relative">
          {/* Dotted lines + labels + orange dots — data passing between blocks */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Subtle dotted grid lines */}
              <line x1="33.33" y1="25" x2="66.67" y2="25" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" strokeDasharray="2 2" />
              <line x1="33.33" y1="75" x2="66.67" y2="75" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" strokeDasharray="2 2" />
              <line x1="33.33" y1="25" x2="33.33" y2="75" stroke="rgba(0,0,0,0.08)" strokeWidth="0.25" strokeDasharray="2 2" />
              <line x1="66.67" y1="25" x2="66.67" y2="75" stroke="rgba(0,0,0,0.08)" strokeWidth="0.25" strokeDasharray="2 2" />
              <line x1="16.67" y1="50" x2="83.33" y2="50" stroke="rgba(0,0,0,0.08)" strokeWidth="0.25" strokeDasharray="2 2" />
              {/* Small orange dots moving — info passing from one to the other */}
              <circle r="0.5" fill="#c84b0a" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 33.33 25 L 66.67 25" />
              </circle>
              <circle r="0.5" fill="#c84b0a" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 33.33 75 L 66.67 75" begin="1.2s" />
              </circle>
              <circle r="0.45" fill="#c84b0a" opacity="0.75">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M 33.33 25 L 33.33 75" begin="0.5s" />
              </circle>
              <circle r="0.45" fill="#c84b0a" opacity="0.75">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M 66.67 75 L 66.67 25" begin="2s" />
              </circle>
              <circle r="0.45" fill="#c84b0a" opacity="0.7">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M 16.67 50 L 83.33 50" begin="0.8s" />
              </circle>
            </svg>
            {/* Labels on the horizontal line between rows */}
            <div className="absolute left-[16.67%] top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded border border-black/[0.06] bg-[#F9F9F9] px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-[#c84b0a]/70">Land use</span>
            </div>
            <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded border border-black/[0.06] bg-[#F9F9F9] px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-[#c84b0a]/70">Registry</span>
            </div>
            <div className="absolute left-[83.33%] top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded border border-black/[0.06] bg-[#F9F9F9] px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-[#c84b0a]/70">Zoning</span>
            </div>
          </div>
        <div className="grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.num} className="cadastral-block relative z-10 flex flex-col bg-[#F9F9F9] p-6 lg:p-7">
              <span className="absolute right-4 top-4 font-mono text-[9px] font-semibold tracking-wider text-black/20">PT-{f.num}</span>
              <div className="mb-2 text-[28px] font-medium leading-none tracking-[-0.02em] text-[#ccc] sm:text-[32px]">{f.num}</div>
              <div className="mb-2 text-[15px] font-medium leading-snug text-[#1a1a18]">{f.title}</div>
              <div className="text-[14px] leading-[1.55] text-[#6b6b68]">{f.desc}</div>
              <FeatureScreen type={f.screen} />
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* WHO */}
      <div id="who" className="relative py-14 lg:py-20">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c84b0a]">For who</div>
        <div className="cadastral-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
        <div className="absolute -right-24 top-1/3 h-40 w-40 -z-10 opacity-[0.05]" aria-hidden>
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#1a1a18]">
            <path d="M5 40 L40 5 L75 40 L40 75 Z" />
            <path d="M20 40 L40 20 L60 40 L40 60 Z" />
          </svg>
        </div>
        <h2 className="text-h2 mb-3 text-[#1a1a18]">
          Built for everyone <em>who works with land.</em>
        </h2>
        <p className="mb-10 max-w-[520px] text-[15px] leading-[1.6] text-[#6b6b68]">
          From individual buyers to large developers — Yonder adapts to how you work with land.
        </p>
        <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-[10px] border border-black/[0.12] bg-black/[0.08] md:grid-cols-2 lg:grid-cols-5" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
          {whoFor.map((w, i) => (
            <div key={w.title} className="cadastral-block relative flex flex-col gap-3 bg-[#F9F9F9] p-5 lg:p-6">
              <span className="absolute right-3 top-3 font-mono text-[9px] font-semibold tracking-wider text-black/20">PDM-{(i + 1).toString().padStart(2, "0")}</span>
              <div className={`flex h-9 w-9 items-center justify-center ${w.icon === "house" || w.icon === "energy" ? "text-[#c84b0a]" : "text-[#3B82F6]"}`}>
                {w.icon === "house" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                )}
                {w.icon === "person" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
                )}
                {w.icon === "pin" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                )}
                {w.icon === "energy" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                )}
                {w.icon === "building" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M8 10h.01M16 14h.01M8 14h.01" /></svg>
                )}
              </div>
              <div className="text-[14px] font-medium text-[#1a1a18]">{w.title}</div>
              <div className="text-[13px] leading-[1.5] text-[#6b6b68]">{w.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COVERAGE — two-column: list + map */}
      <div id="coverage" className="py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
        <h2 className="text-h2 mb-3 text-[#1a1a18]">
          Portugal live. <em>Europe next.</em>
        </h2>
            <p className="mb-8 text-[15px] leading-[1.6] text-[#6b6b68]">
              We&apos;re building the cadastral intelligence layer market by market — starting where data is most fragmented and demand is highest.
            </p>
            <div className="flex flex-col gap-4">
              {coverage.map((c) => (
                <div key={c.region} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${c.active ? "bg-[#3B82F6]" : c.next ? "bg-[#3B82F6]/50" : "bg-[#ccc]"}`} />
                    <span className="text-[14px] font-medium text-[#1a1a18]">{c.region}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${c.active ? "bg-[#3B82F6]/15 text-[#3B82F6]" : "bg-[#f0f0f0] text-[#6b6b68]"}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[10px] border border-black/[0.08] bg-[#e8eef4] cadastral-lines">
            <div className="cadastral-grid absolute inset-0 opacity-40" aria-hidden />
            {/* Simplified Europe map with countries */}
            <svg className="relative h-full min-h-[280px] w-full" viewBox="0 0 400 320" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8">
              {/* Portugal - highlighted */}
              <path d="M85 195 L115 185 L125 210 L110 235 L90 250 L75 240 L70 215 Z" fill="#3B82F6" fillOpacity="0.25" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="95" y="220" fontSize="10" fontWeight="600" fill="#3B82F6">PT</text>
              {/* Spain */}
              <path d="M95 155 L130 140 L180 150 L200 175 L220 200 L210 230 L195 250 L160 255 L125 250 L110 235 L115 185 L105 170 Z" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 2" />
              <text x="165" y="210" fontSize="10" fill="#3B82F6" opacity="0.8">ES</text>
              {/* France */}
              <path d="M155 95 L195 85 L220 100 L230 130 L215 155 L195 150 L180 120 L165 105 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="195" y="125" fontSize="9" fill="#6b7280">FR</text>
              {/* Italy */}
              <path d="M215 130 L235 125 L250 155 L245 195 L230 210 L220 185 L225 155 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="235" y="170" fontSize="9" fill="#6b7280">IT</text>
              {/* UK */}
              <path d="M130 55 L165 50 L175 75 L160 95 L135 90 L125 70 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="145" y="75" fontSize="9" fill="#6b7280">UK</text>
              {/* Germany */}
              <path d="M195 75 L235 70 L255 95 L250 125 L230 130 L215 155 L195 150 L185 120 L190 90 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="220" y="105" fontSize="9" fill="#6b7280">DE</text>
              {/* Scandinavia */}
              <path d="M230 35 L270 25 L285 55 L275 85 L250 90 L235 70 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="255" y="60" fontSize="9" fill="#6b7280">SE</text>
              {/* Balkans */}
              <path d="M255 155 L280 150 L295 180 L285 215 L260 220 L245 195 L250 170 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="268" y="190" fontSize="9" fill="#6b7280">Balkans</text>
              {/* Greece */}
              <path d="M275 195 L295 190 L305 215 L295 240 L275 235 L268 210 Z" fill="#e5e7eb" stroke="#9ca3af" />
              <text x="285" y="220" fontSize="9" fill="#6b7280">GR</text>
            </svg>
            <div className="absolute bottom-4 left-4 right-4 flex gap-4 rounded-md border border-black/[0.06] bg-white/90 px-3 py-2">
              <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b68]"><span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" /> Live</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b68]"><span className="h-1.5 w-1.5 rounded-full border border-[#3B82F6] bg-[#3B82F6]/20" /> Next</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b68]"><span className="h-1.5 w-1.5 rounded-full border border-[#ccc] bg-transparent" /> Planned</span>
            </div>
          </div>
        </div>
        {/* Partners — part of Coverage block */}
        <div className="mt-10 overflow-hidden rounded-[10px] border border-black/[0.08] bg-[#1a1a18] p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <h3 className="text-h3 mb-2 text-white">
                Looking for local <span className="text-[#3B82F6]">partners</span> across Europe.
              </h3>
              <p className="max-w-[480px] text-[15px] leading-[1.6] text-white/70">
                We co-build the land intelligence layer market by market. If you have cadastral data access and know your country&apos;s land market — let&apos;s talk.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href="#" className="rounded-full bg-white px-6 py-2.5 text-center text-[14px] font-medium text-[#1a1a18] no-underline hover:bg-white/90">Become a partner</a>
              <a href="mailto:hello@liveyonder.co" className="rounded-full border border-white/30 px-6 py-2.5 text-center text-[14px] font-medium text-white no-underline hover:border-white/50">hello@liveyonder.co</a>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="relative py-14 lg:py-20">
        <div className="cadastral-grid-dense absolute inset-0 -z-10 opacity-35" aria-hidden />
        <h2 className="text-h2 mb-3 text-[#1a1a18]">
          Pay for outcomes, not <em>infrastructure</em>.
        </h2>
        <p className="mb-10 max-w-[520px] text-[15px] leading-[1.6] text-[#6b6b68]">
          Browse and filter everything for free. Spend tokens on the intelligence you actually need — analysis, reports, off-market discovery.
        </p>

        {/* Token pricing */}
        <div className="mb-12 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 md:grid-cols-4">
          <div className="bg-[#F9F9F9] p-5">
            <div className="mb-0.5 text-[13px] font-medium text-[#1a1a18]">Browse & search</div>
            <div className="text-[18px] font-medium text-[#1a1a18]">Free</div>
          </div>
          <div className="bg-[#F9F9F9] p-5">
            <div className="mb-0.5 text-[13px] font-medium text-[#1a1a18]">Zoning check</div>
            <div className="text-[18px] font-medium text-[#1a1a18]">1 token</div>
          </div>
          <div className="bg-[#F9F9F9] p-5">
            <div className="mb-0.5 text-[13px] font-medium text-[#1a1a18]">Full AI report</div>
            <div className="text-[18px] font-medium text-[#1a1a18]">10 tokens</div>
          </div>
          <div className="bg-[#F9F9F9] p-5">
            <div className="mb-0.5 text-[13px] font-medium text-[#1a1a18]">Off-market discovery</div>
            <div className="text-[18px] font-medium text-[#1a1a18]">20 tokens</div>
          </div>
        </div>

        {/* Free for land owners */}
        <div className="relative mb-12 overflow-hidden rounded-[10px] border border-emerald-200/60 bg-emerald-50/80 p-6">
          <div className="cadastral-grid absolute inset-0 opacity-30" aria-hidden />
          <h3 className="mb-1.5 text-[17px] font-medium text-emerald-800">Free for land owners</h3>
          <p className="mb-2 text-[14px] leading-[1.5] text-emerald-800/90">
            You own land. Find out what it&apos;s worth.
          </p>
          <p className="mb-4 text-[13px] leading-[1.5] text-emerald-900/75">
            Free plot analysis — zoning, building rights, permitted uses. We only earn when your land sells.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="rounded-full border border-emerald-600/50 bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white no-underline transition-colors hover:bg-emerald-700">Sign up</a>
            <a href="#" className="rounded-full border border-emerald-600/50 bg-transparent px-4 py-2 text-[13px] font-medium text-emerald-800 no-underline transition-colors hover:bg-emerald-100">Contact us</a>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-black/[0.08] bg-black/[0.08] md:grid-cols-3 md:items-stretch">
          <div className="flex flex-col bg-[#F9F9F9] p-6">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b6b68]">Explorer</div>
            <div className="mb-0.5 text-[38px] font-medium leading-none tracking-[-0.03em] text-[#1a1a18] sm:text-[42px]">€49</div>
            <div className="mb-4 text-[13px] text-[#6b6b68]">/ month</div>
            <div className="mb-4 text-[12px] text-[#6b6b68]">50 tokens · ~5 reports</div>
            <div className="mb-4 h-px bg-black/[0.08]" />
            <div className="mb-4 text-[12px] text-[#6b6b68]">For the one-plot buyer. Home buyer · Land buyer · Architect · Realtor</div>
            <div className="flex-1">
              {["50 tokens", "~5 reports", "Basic analysis"].map((f) => (
                <div key={f} className="mb-2 flex items-start gap-2 text-[13px] leading-snug text-[#6b6b68]">
                  <span className="pf-check" />
                  {f}
                </div>
              ))}
            </div>
            <a href="#" className="mt-4 block w-full rounded-full border border-black/[0.18] bg-transparent py-2.5 text-center text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:bg-black/[0.05]">Get started</a>
          </div>
          <div className="plan featured relative flex flex-col bg-[#1a1a18] p-6 text-white">
            <div className="absolute right-4 top-4 rounded-full border border-[#c84b0a]/25 bg-[#c84b0a]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#c84b0a]">Most popular</div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45">Scout</div>
            <div className="mb-0.5 text-[38px] font-medium leading-none tracking-[-0.03em] text-white sm:text-[42px]">€299</div>
            <div className="mb-4 text-[13px] text-white/40">/ month</div>
            <div className="mb-4 text-[12px] text-white/40">400 tokens · ~40 reports</div>
            <div className="mb-4 h-px bg-white/10" />
            <div className="mb-4 text-[12px] text-white/40">For the multi-plot operator. Eco tourism · Hospitality · Land investor · Active agent</div>
            <div className="flex-1">
              {["400 tokens", "~40 reports", "Full constraint layer", "Tracker", "Off-market discovery"].map((f) => (
                <div key={f} className="mb-2 flex items-start gap-2 text-[13px] leading-snug text-white/55">
                  <span className="pf-check" />
                  {f}
                </div>
              ))}
            </div>
            <a href="#" className="mt-4 block w-full rounded-full border-none bg-white py-2.5 text-center text-[13px] font-medium text-[#1a1a18] no-underline">Get started</a>
          </div>
          <div className="flex flex-col bg-[#F9F9F9] p-6">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b6b68]">Pro</div>
            <div className="mb-0.5 text-[38px] font-medium leading-none tracking-[-0.03em] text-[#1a1a18] sm:text-[42px]">€999</div>
            <div className="mb-4 text-[13px] text-[#6b6b68]">/ month</div>
            <div className="mb-4 text-[12px] text-[#6b6b68]">2,000 tokens · ~200 reports</div>
            <div className="mb-4 h-px bg-black/[0.08]" />
            <div className="mb-4 text-[12px] text-[#6b6b68]">For the at-scale player. Project developer · Solar & energy · Data center · Land bank</div>
            <div className="flex-1">
              {["2,000 tokens", "~200 reports", "Everything in Scout", "API access", "Dedicated account manager"].map((f) => (
                <div key={f} className="mb-2 flex items-start gap-2 text-[13px] leading-snug text-[#6b6b68]">
                  <span className="pf-check" />
                  {f}
                </div>
              ))}
            </div>
            <a href="#" className="mt-4 block w-full rounded-full border border-black/[0.18] bg-transparent py-2.5 text-center text-[13px] font-medium text-[#1a1a18] no-underline transition-colors hover:bg-black/[0.05]">Talk to us</a>
          </div>
        </div>
        <p className="mt-5 text-center text-[13px] text-[#6b6b68]">
          <a href="#" className="text-[#c84b0a] no-underline hover:text-[#a63d08]">2% agent fee</a>, capped at €10,000 on closed deals.
        </p>
      </div>

      {/* FOOTER */}
      <footer className="py-12 lg:py-16">
        <div className="mb-4 text-[15px] font-medium text-[#1a1a18]">
          Find land. Know land. The land operating system for Europe.
        </div>
        <div className="mb-6 text-[13px] text-[#6b6b68]">
          <a href="https://liveyonder.co" className="text-[#c84b0a] no-underline hover:text-[#a63d08]">liveyonder.co</a>
          {" · © 2025"}
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b6b68]">Product</div>
            <div className="flex flex-col gap-1">
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Search land</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Browse cadastre</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Draw search</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Reports</a>
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b6b68]">Company</div>
            <div className="flex flex-col gap-1">
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">About</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Partners</a>
              <a href="#pricing" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Pricing</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Blog</a>
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b6b68]">Contact</div>
            <div className="flex flex-col gap-1">
              <a href="mailto:hello@liveyonder.co" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">hello@liveyonder.co</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">LinkedIn</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Privacy</a>
              <a href="#" className="text-[13px] text-[#6b6b68] no-underline transition-colors hover:text-[#c84b0a]">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
