"use client";

import { useState } from "react";
import Link from "next/link";

const FF = '"Helvetica Neue","Inter",-apple-system,system-ui,sans-serif';

const INK         = "#111111";
const INK2        = "#3A3A38";
const INK3        = "#6B6B68";
const INK4        = "#A6A6A1";
const LINE        = "#E6E5DF";
const LINE2       = "#F1F0EC";
const ACCENT      = "#E85D3A";
const ACCENT_WASH = "#FCEDE7";
const CANVAS      = "#EEEEEA";
const PAPER       = "#FFFFFF";
const SUCCESS     = "#2E7D52";
const SUCCESS_WASH= "#E6F1EA";

// Type scale — mirrors design system exactly
const TY = {
  display: { fontFamily:FF, fontSize:28, lineHeight:"34px", fontWeight:600, letterSpacing:"-0.01em", color:INK },
  title:   { fontFamily:FF, fontSize:20, lineHeight:"26px", fontWeight:600, letterSpacing:"-0.005em", color:INK },
  section: { fontFamily:FF, fontSize:15, lineHeight:"20px", fontWeight:600, color:INK },
  body:    { fontFamily:FF, fontSize:15, lineHeight:"22px", fontWeight:400, color:INK2 },
  bodySm:  { fontFamily:FF, fontSize:14, lineHeight:"20px", fontWeight:400, color:INK2 },
  label:   { fontFamily:FF, fontSize:13, lineHeight:"16px", fontWeight:500, color:INK2 },
  meta:    { fontFamily:FF, fontSize:12, lineHeight:"16px", fontWeight:400, color:INK3 },
  eyebrow: { fontFamily:FF, fontSize:11, lineHeight:"14px", fontWeight:500, letterSpacing:"0.04em", textTransform:"uppercase" as const, color:INK3 },
};

const tiers = [
  {
    id: "explorer",
    name: "Explorer",
    tagline: "One plot to check",
    alacarte: { price: 49,  reports: 1,  tokens: 20,  topup: 49 },
    sub:      { price: 39,  reports: 2,  tokens: 60,  topup: 39 },
  },
  {
    id: "scout",
    name: "Scout",
    tagline: "Comparing a shortlist",
    popular: true,
    alacarte: { price: 199, reports: 5,  tokens: 60,  topup: 40 },
    sub:      { price: 159, reports: 7,  tokens: 160, topup: 32 },
  },
  {
    id: "hunter",
    name: "Hunter",
    tagline: "Working a whole area",
    alacarte: { price: 449, reports: 20, tokens: 150, topup: 22 },
    sub:      { price: 359, reports: 25, tokens: 400, topup: 18 },
  },
];

function CheckIcon({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0, marginTop:2 }}>
      <circle cx="7" cy="7" r="7" fill={active ? ACCENT_WASH : LINE2} />
      <path d="M4 7l2 2 4-3.5" stroke={active ? ACCENT : INK4} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0, marginTop:2 }}>
      <circle cx="7" cy="7" r="7" fill={LINE2} />
      <path d="M4.5 7h5" stroke={INK4} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const alacarteRows = (d: { reports:number; tokens:number }) => [
  { label: `${d.reports} full plot report${d.reports > 1 ? "s" : ""}`,  yes: true },
  { label: "Cadastre · PDM · REN/RAN · land use",                       yes: true },
  { label: `~${d.tokens} search tokens`,                                 yes: true },
  { label: d.reports > 1 ? "Area search included" : "Area search",      yes: d.reports > 1 },
  { label: "Never expires",                                               yes: true },
  { label: "Re-analysis & re-prompt",                                    yes: false },
  { label: "Project folders",                                             yes: false },
];

const subRows = (d: { reports:number; tokens:number }) => [
  { label: `${d.reports} reports / month`,                               yes: true },
  { label: "Cadastre · PDM · REN/RAN · land use",                       yes: true },
  { label: `~${d.tokens} tokens / month`,                                yes: true },
  { label: "Area search included",                                        yes: true },
  { label: "Re-prompt & re-run past reports",                            yes: true },
  { label: "Save to project folders",                                     yes: true },
  { label: "Quick zoning check (pre-report)",                            yes: true },
  { label: "Saved searches & plot alerts",                               yes: true, soon: true },
];

const topupQtys = [1, 5, 20];

export default function PricingPage() {
  const [mode, setMode] = useState<"alacarte" | "sub">("alacarte");
  const [topupTierId, setTopupTierId] = useState("scout");
  const [topupQty,    setTopupQty]    = useState(1);

  const TOPUP_RATES: Record<string, number> = { explorer: 49, scout: 40, hunter: 22 };
  const topupTier  = tiers.find(t => t.id === topupTierId)!;
  const topupRate  = TOPUP_RATES[topupTierId] ?? 49;
  const topupTotal = topupRate * topupQty;

  return (
    <div style={{ background: CANVAS, minHeight: "100vh", fontFamily: FF }}>

      {/* ── Nav bar — matches app chrome ── */}
      <div style={{ background: PAPER, borderBottom: `1px solid ${LINE}`, height: 52, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/explorer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 20, height: 20, borderRadius: 999, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5 4.5 8l4.5-5" stroke={PAPER} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ ...TY.section }}>Yonder</span>
        </Link>
        <Link href="/explorer" style={{ ...TY.label, color: INK3, textDecoration: "none" }}>← Explorer</Link>
      </div>

      {/* ── Page content — single panel on canvas ── */}
      <div style={{ maxWidth: 860, margin: "16px auto", padding: "0 16px 80px" }}>

        {/* Header */}
        <div style={{ background: PAPER, borderRadius: 12, padding: "32px 32px 28px", marginBottom: 8 }}>
          <div style={{ ...TY.eyebrow, color: ACCENT, marginBottom: 10 }}>Pricing</div>
          <div style={{ ...TY.display, fontSize: 28, marginBottom: 10 }}>Know the land before you buy it.</div>
          <div style={{ ...TY.body, color: INK3, maxWidth: 480 }}>
            Full plot intelligence — cadastre, zoning, PDM, REN/RAN. Buy reports when you need them, or subscribe for ongoing analysis and re-prompting.
          </div>
        </div>

        {/* ── Toggle: à la carte / subscription ── */}
        <div style={{ background: PAPER, borderRadius: 12, padding: "20px 32px", marginBottom: 8, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
          <div style={{ ...TY.label, color: INK3, marginRight: 4 }}>Billing</div>
          <div style={{ display: "flex", background: CANVAS, borderRadius: 999, padding: 3, gap: 2 }}>
            {[
              { id: "alacarte" as const, label: "À la carte",   note: "buy once · never expires" },
              { id: "sub"      as const, label: "Subscription", note: "monthly · 20% off + more" },
            ].map(opt => {
              const on = mode === opt.id;
              return (
                <button key={opt.id} type="button" onClick={() => setMode(opt.id)} style={{
                  background: on ? PAPER : "transparent",
                  border: on ? `1px solid ${LINE}` : "1px solid transparent",
                  borderRadius: 999, padding: "7px 18px", cursor: "pointer",
                  display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 1,
                  transition: "all 0.12s",
                }}>
                  <span style={{ ...TY.label, color: on ? INK : INK3 }}>{opt.label}</span>
                  <span style={{ ...TY.meta, color: on && opt.id === "sub" ? ACCENT : INK4, fontWeight: opt.id === "sub" ? 500 : 400 }}>{opt.note}</span>
                </button>
              );
            })}
          </div>
          {mode === "sub" && (
            <div style={{ ...TY.meta, color: SUCCESS, background: SUCCESS_WASH, borderRadius: 999, padding: "4px 10px", fontWeight: 500 }}>
              Save ~20% vs à la carte
            </div>
          )}
        </div>

        {/* ── Subscription extras — only in sub mode ── */}
        {mode === "sub" && (
          <div style={{ background: PAPER, borderRadius: 12, padding: "20px 32px", marginBottom: 8, borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ ...TY.label, color: INK, marginBottom: 12 }}>Everything in à la carte — plus your reports stay alive.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "8px 24px" }}>
              {[
                "Re-prompt & re-run analysis on any past report",
                "Save reports into project folders",
                "Quick zoning check before spending a report",
                "More tokens per month — search, analyse, re-analyse",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckIcon active />
                  <span style={{ ...TY.bodySm, color: INK3 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tier cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8, marginBottom: 8 }}>
          {tiers.map(tier => {
            const d = mode === "alacarte" ? tier.alacarte : tier.sub;
            const rows = mode === "alacarte" ? alacarteRows(d) : subRows(d);
            const bonus = mode === "sub" ? d.reports - tier.alacarte.reports : 0;

            return (
              <div key={tier.id} style={{
                background: PAPER, borderRadius: 12,
                border: (tier as any).popular ? `1px solid ${ACCENT}` : `1px solid ${LINE}`,
                padding: "24px 20px 20px",
                display: "flex", flexDirection: "column" as const,
                position: "relative" as const,
              }}>
                {(tier as any).popular && (
                  <div style={{ position: "absolute" as const, top: -10, left: 16, background: ACCENT, ...TY.eyebrow, color: PAPER, padding: "3px 10px", borderRadius: 999 }}>
                    Popular
                  </div>
                )}

                {/* Tier name */}
                <div style={{ ...TY.eyebrow, color: (tier as any).popular ? ACCENT : INK3, marginBottom: 2 }}>{tier.name}</div>
                <div style={{ ...TY.meta, color: INK4, marginBottom: 16 }}>{tier.tagline}</div>

                {/* Price */}
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: FF, fontSize: 36, fontWeight: 600, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}>€{d.price}</span>
                  <span style={{ ...TY.meta, marginLeft: 6 }}>{mode === "sub" ? "/ mo" : "one-off"}</span>
                </div>
                <div style={{ ...TY.meta, marginBottom: 20 }}>
                  {d.reports} report{d.reports > 1 ? "s" : ""}{mode === "sub" ? " / month" : " · never expires"}
                  {bonus > 0 && <span style={{ color: ACCENT, fontWeight: 500 }}> · +{bonus} vs à la carte</span>}
                </div>

                {/* Feature rows */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 20, borderTop: `1px solid ${LINE}`, paddingTop: 16 }}>
                  {rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      {r.yes ? <CheckIcon active={(tier as any).popular} /> : <DashIcon />}
                      <span style={{ ...TY.bodySm, color: r.yes ? INK2 : INK4 }}>
                        {r.label}
                        {(r as any).soon && (
                          <span style={{ ...TY.eyebrow, color: INK4, background: LINE2, borderRadius: 4, padding: "1px 5px", marginLeft: 6, verticalAlign: "middle" }}>soon</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button type="button" style={{
                  background: (tier as any).popular ? ACCENT : INK,
                  border: "none", borderRadius: 999, padding: "10px 0",
                  ...TY.label, color: PAPER, cursor: "pointer", width: "100%",
                }}>
                  {mode === "alacarte"
                    ? tier.id === "explorer" ? "Buy report" : `Buy ${d.reports} reports`
                    : `Start ${tier.name}`}
                </button>

                {mode === "sub" && (
                  <div style={{ ...TY.meta, textAlign: "center" as const, marginTop: 8, color: INK4 }}>Cancel anytime</div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Top-up panel ── */}
        <div style={{ background: PAPER, borderRadius: 12, padding: "24px 32px", marginBottom: 8 }}>
          <div style={{ ...TY.eyebrow, marginBottom: 6 }}>Top-up</div>
          <div style={{ ...TY.title, marginBottom: 4 }}>Need more? Add reports any time.</div>
          <div style={{ ...TY.bodySm, color: INK3, marginBottom: 20 }}>
            Same à la carte pricing — more reports, lower price per report. Buy once, never expires.
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 1, border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden" }}>
            {[
              { qty: 1,  total: 49,  perReport: 49,  saving: null },
              { qty: 5,  total: 199, perReport: 39.8, saving: "save €46 vs 5×€49" },
              { qty: 20, total: 449, perReport: 22.45, saving: "save €531 vs 20×€49" },
            ].map((opt, i) => {
              const on = topupQty === opt.qty;
              return (
                <div key={opt.qty} onClick={() => setTopupQty(opt.qty)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 16px",
                  background: on ? ACCENT_WASH : PAPER,
                  borderTop: i > 0 ? `1px solid ${LINE}` : "none",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${on ? ACCENT : LINE}`, background: on ? ACCENT : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {on && <div style={{ width: 5, height: 5, borderRadius: "50%", background: PAPER }} />}
                    </div>
                    <span style={{ ...TY.label, color: on ? INK : INK2 }}>
                      {opt.qty === 1 ? "1 report" : `${opt.qty} reports`}
                    </span>
                    {opt.saving && (
                      <span style={{ ...TY.meta, color: SUCCESS, background: SUCCESS_WASH, borderRadius: 999, padding: "2px 8px" }}>{opt.saving}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 15, fontWeight: 600, color: on ? INK : INK3, letterSpacing: "-0.01em" }}>
                    €{opt.total}
                    <span style={{ ...TY.meta, marginLeft: 6, fontWeight: 400 }}>
                      {opt.qty > 1 ? `· €${opt.perReport.toFixed(0)}/report` : "· one-off"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" as const, marginTop: 16 }}>
            <button type="button" style={{ background: INK, border: "none", borderRadius: 999, padding: "10px 24px", ...TY.label, color: PAPER, cursor: "pointer" }}>
              Buy {topupQty === 1 ? "1 report" : `${topupQty} reports`} →
            </button>
          </div>
        </div>

        {/* ── Subscription nudge (à la carte view only) ── */}
        {mode === "alacarte" && (
          <div style={{ background: PAPER, borderRadius: 12, padding: "20px 32px", marginBottom: 8, display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: 16, borderLeft: `3px solid ${LINE}` }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ ...TY.label, color: INK, marginBottom: 4 }}>Want your reports to stay alive?</div>
              <div style={{ ...TY.bodySm, color: INK3 }}>Subscribe — re-prompt past reports, save to projects, 20% off.</div>
            </div>
            <button type="button" onClick={() => setMode("sub")} style={{ background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "8px 18px", ...TY.label, color: INK2, cursor: "pointer", whiteSpace: "nowrap" as const }}>
              See monthly plans →
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ padding: "24px 0 0", display: "flex", flexWrap: "wrap" as const, gap: "6px 28px", ...TY.meta, borderTop: `1px solid ${LINE}`, marginTop: 8 }}>
          <span>Portugal coverage</span>
          <span>Cadastre · PDM · REN · RAN</span>
          <span>Instant reports</span>
          <span>Buyer&apos;s agent · 2% no cure no pay</span>
        </div>
      </div>
    </div>
  );
}
