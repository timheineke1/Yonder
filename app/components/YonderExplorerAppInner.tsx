// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useMemo, useCallback, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FF = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif";
const FFM = "var(--font-geist-mono), ui-monospace, monospace";

/** Hex tokens — marketing site (`/`) neutrals + blue/green in-app accents (see `.yonder-explorer-page`). */
const INK = "#1a1a18";
const MID = "#6b6b68";
const BRAND_ORANGE = "#c84b0a";
/** Chat cards — homepage-aligned tints (see yonder-product-design-SKILL.md + globals `.yonder-explorer-page`) */
const CARD_POS_BG = "var(--chat-card-positive-bg, #ecfdf5)";
const CARD_POS_BD = "var(--chat-card-positive-border, rgba(16, 185, 129, 0.22))";
const CARD_CAUTION_BG = "var(--chat-card-caution-bg, #fffbeb)";
const CARD_CAUTION_BD = "var(--chat-card-caution-border, rgba(245, 158, 11, 0.28))";
const CARD_NOTE_BG = "var(--chat-card-note-bg, #fdf2f8)";
const CARD_NOTE_BD = "var(--chat-card-note-border, rgba(236, 72, 153, 0.22))";
const CARD_GOOD_BLUE_BG = "#eff6ff";
const CARD_GOOD_BLUE_BD = "rgba(59, 130, 246, 0.2)";
const CHAT_THINK_BG = "var(--chat-thinking-bg, #f0fdf4)";
const CHAT_THINK_BD = "var(--chat-thinking-border, rgba(16, 185, 129, 0.15))";
/** Primary UI / map accent (blue). */
const ORANGE = "#3b82f6";
const GREEN  = "#166534";
const GREEN_BRIGHT = "#16a34a";
const SUCCESS_CARD_BG = "#dcfce7";
const ACTIVE_ROW_BG = "#eff6ff";
const ACCENT = "#3B82F6";

const BG    = "var(--explorer-bg, var(--background))";
const BG2   = "var(--explorer-card, var(--bg-card))";
const PANEL = "var(--explorer-sidebar, var(--surface-panel))";
const SUBTLE = "var(--explorer-muted-surface, var(--surface-subtle))";
const CHROME = "var(--explorer-chrome, #ffffff)";
const CHAT_USER_BG = "var(--chat-user-bg, #eff6ff)";
const CHAT_USER_BD = "var(--chat-user-border, rgba(37, 99, 235, 0.14))";
const WARM  = "var(--surface-warm)";
const WHITE = "#ffffff";
const LIGHT = "var(--text-tertiary)";
const LIGHTER = "var(--border-default)";
const ROW_HOVER = "rgba(0,0,0,0.04)";
const ONLINE = "var(--online)";
/** SVG stroke/fill — avoid `var()` on SVG attributes (Safari / some clients ignore it). */
const SVG_MUTED = "#888888";

// Type scale — uses globals.css tokens (same as marketing homepage)
const T = {
  display:  { fontFamily: FF, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: INK },
  heading:  { fontFamily: FF, fontSize: 20, fontWeight: 500, color: INK, lineHeight: 1.22 },
  body:     { fontFamily: FF, fontSize: "var(--text-body)", color: INK, lineHeight: 1.65 },
  secondary:{ fontFamily: FF, fontSize: "var(--text-body)", color: MID, lineHeight: 1.55 },
  label:    { fontFamily: FF, fontSize: "var(--text-muted)", color: MID },
  labelUC:  { fontFamily: FF, fontSize: "var(--text-eyebrow)", fontWeight: 600, color: "var(--text-hint)", letterSpacing: "0.14em", textTransform: "uppercase" as const },
  mono:     { fontFamily: FFM, fontSize: "var(--text-muted)", color: MID, letterSpacing: "0.04em" },
};

/** Explorer chat — smaller, calmer type (ChatGPT-like density) */
const TC = {
  title:   { fontFamily: FF, fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: INK, lineHeight: 1.35 },
  body:    { fontFamily: FF, fontSize: 13, fontWeight: 400, color: INK, lineHeight: 1.55 },
  secondary:{ fontFamily: FF, fontSize: 12, color: MID, lineHeight: 1.5 },
  label:   { fontFamily: FF, fontSize: 11, color: LIGHT },
  labelUC: { fontFamily: FF, fontSize: 10, fontWeight: 600, color: LIGHT, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  mono:    { fontFamily: FFM, fontSize: 11, color: MID, letterSpacing: "0.03em" },
};

/** Pipeline, tables, listing overlay — same type scale + chrome as Search (TC). */
const TP = {
  pageTitle: { fontFamily: FF, fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: INK, lineHeight: 1.25 },
  sectionTitle: { fontFamily: FF, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: INK, lineHeight: 1.3 },
  body: TC.body,
  secondary: TC.secondary,
  label: TC.label,
  labelUC: TC.labelUC,
  mono: TC.mono,
  crumb: { fontFamily: FF, fontSize: 12, color: LIGHT },
  stat: { fontFamily: FF, fontSize: 16, fontWeight: 600, color: INK, lineHeight: 1 },
  statCap: { fontFamily: FF, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: LIGHT },
  tableHead: { fontFamily: FF, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: LIGHT },
};

// Stage / type tokens kept for logic
const STAGES = ["Discovered","Agent Run","Outreach Sent","Legal Check","Offer","Closed"];
const STAGE_COLORS = {"Discovered":MID,"Agent Run":"#1A5276","Outreach Sent":"#B8860B","Legal Check":"#8B5E3C","Offer":GREEN,"Closed":ORANGE};

// ── PLOT DATA ─────────────────────────────────────────────────────────────────
const PLOT_DETAILS = {
  "PT-0182": {
    id:"PT-0182", ref:"PT-SB-0182-A", name:"Rustic land near Comporta", region:"Comporta, Setúbal", area:"2,340 m²", price:"€87,500", pricePerSqm:"€37/m²", type:"Rustic", score:94, aiVerdict:"great_match",
    tag:"Sea 4km · Build-ready", x:31, y:62,
    images:["coastal_land","sunset_field","access_road"],
    timeOnMarket:"18 days",
    description:"A rare build-ready rustic plot just 4 kilometres from the Comporta coastline. Confirmed building rights for rural tourism or residential use — unusual for this proximity to the protected Comporta zone. Flat topography with full south orientation and paved access.",
    highlights:["Build rights confirmed","Clean registry chain","Paved road access","Water connection nearby","Full south exposure","Low fire risk"],
    aiSummary:"Strong buy for anyone looking to build a holiday home or eco retreat. Confirmed building rights — unusual this close to Comporta. Access road paved, water connection nearby. No legal flags found.",
    signals:[{ok:true,label:"Build rights confirmed",detail:"PDM allows 0.3 FAR for rural tourism or residential"},{ok:true,label:"No ownership disputes",detail:"Single owner since 2008, clean registry chain"},{ok:false,label:"RAN agricultural restriction",detail:"30% of plot is under RAN — cannot build on that portion"},{ok:true,label:"Access & utilities",detail:"Paved access, water 80m, electricity at boundary"}],
    amenities:[{icon:"🏖",label:"Beach",dist:"4km"},{icon:"✈",label:"Airport",dist:"78km"},{icon:"🏫",label:"Schools",dist:"6km"},{icon:"🛒",label:"Shops",dist:"4km"},{icon:"🏥",label:"Hospital",dist:"38km"},{icon:"⛽",label:"Fuel",dist:"5km"}],
    technical:{"Cadastre ref":"PT-SB-0182-A","PDM zone":"Solo Rústico – Espaço Agrícola","RAN":"Parcial (720 m²)","REN":"No","IMT estimate":"~€2,100","Last transaction":"2014 – €52,000","Ownership":"Single private owner","Encumbrances":"None found","Fire risk":"Low","Grid distance":"140m","Substation":"N/A","Slope":"<3%","Orientation":"South"},
    contact:{name:"Lucas Fox Portugal",role:"Listing Agent",phone:"+351 912 345 678",email:"listings@lucasfox.pt"},
    nearby:["Comporta Village 4.2km","Troia Ferry 12km","Setúbal 38km","Lisbon 78km"],
  },
  "PT-0441": {
    id:"PT-0441", ref:"PT-OB-0441-U", name:"Urban plot — Óbidos village edge", region:"Óbidos, Leiria", area:"1,820 m²", price:"€54,000", pricePerSqm:"€30/m²", type:"Urban", score:88, aiVerdict:"good_match",
    tag:"Village edge · Water connected", x:22, y:38,
    images:["village_plot","cobblestone","hilltop"],
    timeOnMarket:"34 days",
    description:"Urban plot on the edge of Óbidos' historic village. Zoned for residential construction up to 2 floors. All utilities available at the boundary — water, electricity and sewage. Slight slope adds character but may require a retaining wall.",
    highlights:["Urban zoning","2-floor residential build","Utilities at boundary","Historic village setting","Clean title","Strong tourism rental potential"],
    aiSummary:"Urban plot on the edge of a historic village — water and electricity already at the boundary. Zoned for residential construction up to 2 floors. Great value, though slight slope may add foundation costs.",
    signals:[{ok:true,label:"Urban zoning",detail:"Residential construction permitted"},{ok:true,label:"Utilities at boundary",detail:"Water, electricity and sewage available"},{ok:false,label:"Topography",detail:"8% slope — may require retaining wall"},{ok:true,label:"Clean title",detail:"No mortgage or encumbrances on record"}],
    amenities:[{icon:"🏰",label:"Castle",dist:"600m"},{icon:"🛒",label:"Shops",dist:"1km"},{icon:"🏫",label:"Schools",dist:"3km"},{icon:"✈",label:"Airport",dist:"87km"},{icon:"🏥",label:"Hospital",dist:"6km"},{icon:"⛽",label:"Fuel",dist:"2km"}],
    technical:{"Cadastre ref":"PT-OB-0441-U","PDM zone":"Solo Urbano – Residencial","Max height":"2 floors (7.5m)","RAN":"No","REN":"No","IMT estimate":"~€1,400","Last transaction":"2019 – €38,000","Ownership":"Estate (2 co-owners)","Encumbrances":"None","Fire risk":"Very low","Grid distance":"15m","Slope":"8%","Orientation":"West"},
    contact:{name:"FindLand Portugal",role:"Listing Agent",phone:"+351 922 111 222",email:"diogo@findlandportugal.pt"},
    nearby:["Óbidos Castle 600m","Lagoa de Óbidos 5km","Caldas da Rainha 6km","Lisbon 87km"],
  },
  "PT-1093": {
    id:"PT-1093", ref:"PT-GR-1093-R", name:"South-facing rustic — Grândola", region:"Grândola, Setúbal", area:"5,600 m²", price:"€112,000", pricePerSqm:"€20/m²", type:"Rustic", score:82, aiVerdict:"good_match",
    tag:"South-facing · PDM compliant", x:28, y:70,
    images:["rural_field","alentejo_plain","country_road"],
    timeOnMarket:"52 days",
    description:"Large south-facing rustic plot with confirmed rural tourism eligibility. Ideal for an eco lodge, glamping site or off-grid retreat. One flag: the northern boundary touches a wildfire-risk zone, which means specific ICNF building material rules apply.",
    highlights:["Rural tourism eligible","5,600m² above 4,000m² minimum","South orientation","No RAN restriction","Eco lodge potential","Natural landscape setting"],
    aiSummary:"Large south-facing rustic plot with confirmed rural tourism eligibility. Ideal for eco lodge or glamping. One flag: borders a wildfire-risk zone.",
    signals:[{ok:true,label:"Tourism build eligible",detail:"PDM allows rural tourism structures"},{ok:true,label:"Good size for licencing",detail:"5,600m² above 4,000m² minimum"},{ok:false,label:"Wildfire border zone",detail:"ICNF rules apply to materials"},{ok:true,label:"South orientation",detail:"Full south exposure"}],
    amenities:[{icon:"🏖",label:"Beach",dist:"22km"},{icon:"✈",label:"Airport",dist:"78km"},{icon:"🛒",label:"Shops",dist:"8km"},{icon:"🏫",label:"Schools",dist:"8km"},{icon:"🏥",label:"Hospital",dist:"42km"},{icon:"⛽",label:"Fuel",dist:"9km"}],
    technical:{"Cadastre ref":"PT-GR-1093-R","PDM zone":"Solo Rústico – Uso Múltiplo","RAN":"No","REN":"Partial (border)","Tourism build":"Permitted","IMT estimate":"~€2,800","Last transaction":"2017 – €74,000","Ownership":"Single private owner","Encumbrances":"None","Fire risk":"Moderate (border)","Slope":"<5%","Orientation":"South"},
    contact:{name:"Dils Portugal",role:"Listing Agent",phone:"+351 934 222 333",email:"grândola@dils.pt"},
    nearby:["Grândola Town 8km","Carvalhal Beach 22km","Comporta 28km","Setúbal 42km"],
  },
  "PT-0677": {
    id:"PT-0677", ref:"PT-SI-0677-U", name:"Ruin plot — Sintra protected zone", region:"Sintra, Lisboa", area:"980 m²", price:"€138,000", pricePerSqm:"€141/m²", type:"Urban", score:79, aiVerdict:"consider",
    tag:"45 min Lisbon · Plot + ruin", x:18, y:50,
    images:["sintra_hills","palace_view","ruin_structure"],
    timeOnMarket:"61 days",
    description:"Urban plot with an existing ruin within the Sintra-Cascais Natural Park. The ruin simplifies the licencing process — reconstruction is permitted up to the original footprint plus 30%. Strong location with exceptional views, 45 minutes from Lisbon.",
    highlights:["Existing ruin simplifies licencing","45 min from Lisbon","Protected landscape views","Reconstruction permitted","Strong capital appreciation","Tourism rental market"],
    aiSummary:"Urban plot with an existing ruin — simplifies the licencing process. Strong location 45 min from Lisbon in a protected landscape zone.",
    signals:[{ok:true,label:"Ruin simplifies licencing",detail:"Reconstruction permit easier than new build"},{ok:false,label:"Protected landscape",detail:"Sintra-Cascais NP — facade & height restricted"},{ok:true,label:"Strong location premium",detail:"Sintra consistently outperforms regional index"},{ok:false,label:"Higher price per m²",detail:"€141/m² above regional average"}],
    amenities:[{icon:"🏰",label:"Palace",dist:"1.2km"},{icon:"🛒",label:"Shops",dist:"2km"},{icon:"🏫",label:"Schools",dist:"3km"},{icon:"✈",label:"Airport",dist:"28km"},{icon:"🏥",label:"Hospital",dist:"12km"},{icon:"🚂",label:"Train",dist:"3km"}],
    technical:{"Cadastre ref":"PT-SI-0677-U","PDM zone":"Solo Urbano – Parque Natural","Heritage":"Sintra-Cascais NP","Existing structure":"Ruin ~80m²","Max build":"+30% of original footprint","REN":"Yes (partial)","IMT estimate":"~€4,100","Last transaction":"2021 – €105,000","Ownership":"Single private owner","Encumbrances":"None","Fire risk":"Low","Slope":"12%","Orientation":"South-West"},
    contact:{name:"Lucas Fox Portugal",role:"Listing Agent",phone:"+351 912 888 777",email:"sintra@lucasfox.pt"},
    nearby:["Sintra Palace 1.2km","Cascais 18km","Lisbon 28km","Sintra Train Station 3km"],
  },
  "PT-2201": {
    id:"PT-2201", ref:"PT-ME-2201-R", name:"River view land — Guadiana", region:"Mértola, Beja", area:"8,200 m²", price:"€38,500", pricePerSqm:"€4.7/m²", type:"Rustic", score:75, aiVerdict:"consider",
    tag:"River view · Eco build eligible", x:38, y:82,
    images:["guadiana_river","alentejo_sunset","remote_land"],
    timeOnMarket:"143 days",
    description:"Best value in this region. Expansive rustic plot with Guadiana river frontage and eco build eligibility. Trade-off is genuine remoteness — 2.5 hours from Lisbon — and no existing road access. Perfect for an off-grid project with patience.",
    highlights:["Guadiana river frontage","Eco build eligible","8,200m² large format","Excellent value at €4.7/m²","Off-grid construction permitted","Natural reserve adjacent"],
    aiSummary:"Best value in this shortlist. River views, large size, eco build eligible. Trade-off is remoteness and no road access yet.",
    signals:[{ok:true,label:"Excellent price per m²",detail:"€4.7/m² — well below regional average"},{ok:true,label:"River view & eco eligible",detail:"Guadiana frontage, off-grid construction qualifies"},{ok:false,label:"No road access",detail:"Access track est. €8–15k"},{ok:false,label:"Remote location",detail:"2.5hr from Lisbon, limited services"}],
    amenities:[{icon:"🏞",label:"River",dist:"On site"},{icon:"🛒",label:"Shops",dist:"14km"},{icon:"🏫",label:"Schools",dist:"14km"},{icon:"✈",label:"Airport",dist:"88km"},{icon:"🏥",label:"Hospital",dist:"52km"},{icon:"⛽",label:"Fuel",dist:"14km"}],
    technical:{"Cadastre ref":"PT-ME-2201-R","PDM zone":"Solo Rústico – Espaço Natural","RAN":"No","REN":"Yes (river buffer 50m)","Access":"None — track needed","IMT estimate":"~€900","Last transaction":"2010 – €18,000","Ownership":"Single private owner","Encumbrances":"None","Fire risk":"Low","River frontage":"~120m","Slope":"<8%","Orientation":"East"},
    contact:{name:"FindLand Portugal",role:"Listing Agent",phone:"+351 963 000 111",email:"diogo@findlandportugal.pt"},
    nearby:["Mértola Village 14km","Castro Marim 52km","Faro Airport 88km","Seville 138km"],
  },
};

const VERDICT = {
  great_match:{label:"Great match", color:GREEN,   bg:CARD_POS_BG},
  good_match: {label:"Good match",  color:ORANGE,  bg:CARD_GOOD_BLUE_BG},
  consider:   {label:"Worth a look",color:MID,     bg:CARD_NOTE_BG},
};

const CHAT_ICPS = [
  {id:"buyer",  icon:"⊞", short:"Buyer",    label:"Land Buyer",      desc:"Find your perfect plot — guided through every step.", prompts:["Find plots under €120k near Lisbon","Show rustic land in Alentejo","Find eco land for a self-build"]},
  {id:"ruin",   icon:"◫", short:"Ruins",    label:"Ruin Tracker",     desc:"Hunt for ruins with reconstruction rights — listed and unlisted.", prompts:["Find ruins under €80k in Alentejo","Ruins within 50km of Lisbon","Ruins for tourism conversion"]},
  {id:"solar",  icon:"◈", short:"Solar",    label:"Solar Tracker",    desc:"Identify large-scale land near grid infrastructure.", prompts:["Plots over 5ha near grid in Alentejo","Southern-facing land near substations","Active solar permitting plots"]},
  {id:"project",icon:"⬡", short:"Developer",label:"Developer",        desc:"Source urban and rural plots for residential or mixed-use.", prompts:["Urban plots near Porto for residential","Developable land near A1","Plots with reclassification pending"]},
  {id:"zoning", icon:"◉", short:"Zoning",   label:"Zoning Tracker",   desc:"Monitor PDM changes and reclassifications in real time.", prompts:["Alert rustic→urban reclassification","PDM amendments last 30 days","Active master plan reviews"]},
  {id:"eco",    icon:"◍", short:"Eco",      label:"Eco & Rural",      desc:"Rustic land for cabins, glamping and eco tourism.", prompts:["Eco lodges land in Alentejo","Rustic plots allowing tourism build","Land near national parks for glamping"]},
];

const CHAT_PLOTS = Object.values(PLOT_DETAILS);

/** Demo headline for nationwide browse (toolbar + list); map/list rows stay `CHAT_PLOTS` samples. */
const NATIONWIDE_HEADLINE_TOTAL = 4203;

function shufflePlots<T>(pool: T[]): T[] {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

const MAX_SYNTHETIC_PLOTS = 400;

/**
 * One map pin + one list row per match. Cycles demo templates with unique ids & jittered x/y.
 * `canonicalListingId` keeps Open / pipeline on real PLOT_DETAILS keys.
 */
function expandPlotsForSearchResults(pool, count, queryText) {
  const cap = Math.min(Math.max(1, count | 0), MAX_SYNTHETIC_PLOTS);
  const shuffled = shufflePlots([...pool]);
  const q = (queryText || "").toLowerCase();
  let ax = 0;
  let ay = 0;
  if (q.includes("porto")) {
    ax = -14;
    ay = -20;
  } else if (q.includes("lisbon") || q.includes("lisboa")) {
    ax = 4;
    ay = -6;
  } else if (q.includes("alentejo")) {
    ax = 8;
    ay = 14;
  } else if (q.includes("algarve")) {
    ax = -2;
    ay = 18;
  } else if (q.includes("coimbra")) {
    ax = -6;
    ay = -6;
  }
  const out = [];
  for (let i = 0; i < cap; i++) {
    const base = shuffled[i % shuffled.length];
    const ring = Math.floor(Math.sqrt(i)) * 2.6;
    const ang = (i * 2.399963229728653) % (Math.PI * 2);
    const jitterX = Math.cos(ang) * ring + (i % 4) * 1.4;
    const jitterY = Math.sin(ang) * ring + ((i * 2) % 5) * 1.2;
    const x = Math.round(Math.max(10, Math.min(90, base.x + ax + jitterX)));
    const y = Math.round(Math.max(10, Math.min(85, base.y + ay + jitterY)));
    const scoreNudge = (i % 7) - 3;
    out.push({
      ...base,
      id: `${base.id}~${i + 1}`,
      canonicalListingId: base.id,
      x,
      y,
      score: Math.max(55, Math.min(99, base.score + scoreNudge)),
    });
  }
  return out;
}

/** Registry id for opening a listing / pipeline (synthetic rows share a canonical PT-* id). */
function plotListingOpenId(p) {
  return p?.canonicalListingId ?? p?.id;
}

function isExplorerPinPlot(p) {
  return p && String(p.id || "").startsWith("pin-");
}

/** User-dropped map pin — not a listing; opens sidebar + chat context for “this spot”. */
function makeExplorerPinPlot(xPct, yPct) {
  const id = `pin-${Date.now()}`;
  return {
    id,
    canonicalListingId: undefined,
    name: "Dropped pin",
    region: `Approx. ${Math.round(xPct)}% E · ${Math.round(yPct)}% N (demo map)`,
    area: "—",
    price: "—",
    pricePerSqm: "—",
    type: "Pin",
    score: null,
    aiVerdict: "consider",
    tag: "Map marker · search chat for listings near here",
    x: Math.round(Math.max(8, Math.min(92, xPct))),
    y: Math.round(Math.max(8, Math.min(88, yPct))),
    technical: { "PDM zone": "—", RAN: "—", REN: "—" },
    signals: [],
    aiSummary: "This is a user-placed pin, not a listing. Search the chat for an area or pick a plot on the map for a full Yonder dossier.",
    ref: "MAP-PIN",
  };
}

const LISTING_SCAN_LS_KEY = "yonder-explorer-listing-scans-v1";
/** Only `runAnalysis` (land agent + regulatory pass in chat) may persist recap data. */
const LAND_AGENT_SCAN_SOURCE = "land_agent_chat";

function wrapLandAgentListingScan(recapData) {
  return { recap: recapData, source: LAND_AGENT_SCAN_SOURCE, completedAt: Date.now() };
}

function getLandAgentListingRecap(entry) {
  if (!entry) return null;
  if (entry.source === LAND_AGENT_SCAN_SOURCE && entry.recap) return entry.recap;
  return null;
}

/** Sidebar, listing page, pipeline — use this instead of raw `listingSavedScans[id]`. */
function listingRecapFromStore(store, canonicalId) {
  if (!store || canonicalId == null) return null;
  return getLandAgentListingRecap(store[String(canonicalId)]);
}

function normalizeListingScanStorage(raw) {
  if (typeof raw !== "object" || !raw) return {};
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v && v.source === LAND_AGENT_SCAN_SOURCE && v.recap) {
      out[k] = v;
    } else if (v && v.verdictLabel != null && Array.isArray(v.keyFacts)) {
      out[k] = { recap: v, source: LAND_AGENT_SCAN_SOURCE, completedAt: 0 };
    }
  }
  return out;
}

function loadListingScansFromStorage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LISTING_SCAN_LS_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw);
    return normalizeListingScanStorage(typeof o === "object" && o ? o : {});
  } catch {
    return {};
  }
}

/** Demo “AI scan” recap — same shape for sidebar scan + chat deep-dive persistence. */
function buildListingRecapData(plot) {
  const tech = plot?.technical || {};
  const ranRaw = tech.RAN ?? plot?.ran ?? "No";
  const renRaw = tech.REN ?? plot?.ren ?? "No";
  const norm = (s) => {
    const t = String(s == null ? "" : s).trim();
    if (!t || t === "—") return "No";
    if (/^no\b|^não|^none/i.test(t)) return "No";
    return t;
  };
  const ran = norm(ranRaw);
  const ren = norm(renRaw);
  const zone = plot?.type || "—";
  const pdm = tech["PDM zone"] || tech.pdm || plot?.pdm || zone;
  const buildable = ran === "No" && ren === "No" && zone !== "RAN" && zone !== "REN";
  const region = plot?.region || plot?.ref || "—";
  return {
    id: plotListingOpenId(plot),
    verdict: buildable ? "buildable" : "not_buildable",
    verdictLabel: buildable ? "Likely buildable" : "Restricted / verify",
    verdictSummary: buildable
      ? `${pdm}. No major RAN/REN flags in demo data. Confirm COS, height, setbacks with the Câmara.`
      : `${zone}. ${ran !== "No" ? "RAN applies. " : ""}${ren !== "No" ? "REN applies. " : ""}Construction may be limited — review overlays.`,
    location: region,
    zoningShort: zone,
    area: plot?.area || "—",
    keyFacts: [
      { label: "Zone", value: zone, note: pdm || "" },
      { label: "Area", value: plot?.area || "—", note: plot?.pricePerSqm || "" },
      {
        label: "RAN / REN",
        value: ran !== "No" || ren !== "No" ? "Restricted" : "Clear",
        note: ran !== "No" ? `RAN: ${ran}` : ren !== "No" ? `REN: ${ren}` : "No overlay flags (demo)",
      },
    ],
    restrictions: [
      { name: "RAN", status: ran !== "No" ? "blocking" : "clear", note: ran !== "No" ? String(ranRaw) : "Not applicable" },
      { name: "REN", status: ren !== "No" ? "blocking" : "clear", note: ren !== "No" ? String(renRaw) : "Not applicable" },
      { name: "PDM", status: buildable ? "clear" : "blocking", note: pdm || "—" },
      { name: "Natura 2000", status: "clear", note: "Demo: verify live layer" },
    ],
    cta: { label: buildable ? "Request PDM parameters" : "Explore permitted uses" },
  };
}

function PlotRecapCard({ data }) {
  const isBuildable = data.verdict === "buildable";
  const RC = {
    blocking: { bg: "#fef2f2", color: "#9b1c1c", dot: "#9b1c1c" },
    clear: { bg: "#f0fdf4", color: "#166534", dot: "#166534" },
  };
  return (
    <div style={{ fontFamily: FF, background: BG, borderRadius: 10, overflow: "hidden", color: INK, border: `1px solid ${LIGHTER}` }}>
      <div style={{ background: INK, padding: "12px 14px", color: WHITE }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, fontFamily: FF }}>AI scan</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: isBuildable ? GREEN : "#9b1c1c", color: WHITE, fontFamily: FF }}>{data.verdictLabel}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, marginBottom: 4, fontFamily: FF }}>{data.location}</div>
        <div style={{ fontSize: 10, opacity: 0.55, marginBottom: 6, fontFamily: FF }}>{data.zoningShort}</div>
        <div style={{ fontSize: 11, lineHeight: 1.5, opacity: 0.72, fontFamily: FF }}>{data.verdictSummary}</div>
      </div>
      <div style={{ padding: "8px 12px 0" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {data.keyFacts.map((f, i) => (
            <div key={i} style={{ flex: 1, background: WHITE, borderRadius: 6, padding: "7px 8px", border: `1px solid ${LIGHTER}` }}>
              <div style={{ fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: LIGHT, marginBottom: 2, fontFamily: FF }}>{f.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: INK, fontFamily: FF }}>{f.value}</div>
              <div style={{ fontSize: 9, color: MID, marginTop: 2, lineHeight: 1.3, fontFamily: FF }}>{f.note}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "8px 12px 10px", display: "flex", flexWrap: "wrap", gap: 4 }}>
        {data.restrictions.map((restr, i) => {
          const c = RC[restr.status] || RC.clear;
          return (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 99, background: c.bg, color: c.color, fontFamily: FF }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot, flexShrink: 0 }}/>
              {restr.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Map+list: listing dossier + saved AI report; full analysis runs in chat (land agent → deep dive). */
function ListingInsightSidebar({
  plot,
  onClose,
  onOpenListing,
  onAddToProject,
  inProject,
  upgraded,
  onUpgrade,
  savedRecap,
  onStartLandAgentInChat,
  onSendToChat,
}) {
  const cid = plotListingOpenId(plot);
  const pinPlot = isExplorerPinPlot(plot);
  const v = VERDICT[plot.aiVerdict] || VERDICT.consider;
  const recap = savedRecap || null;

  function startAnalysis() {
    if (pinPlot) {
      onSendToChat(plot, { mode: "ask" });
      return;
    }
    if (!upgraded) {
      onUpgrade();
      return;
    }
    onStartLandAgentInChat();
  }

  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 300, background: WHITE, borderLeft: `1px solid ${LIGHTER}`, zIndex: 65, display: "flex", flexDirection: "column", animation: "slideInRight 0.2s ease both", boxShadow: "-4px 0 20px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "11px 13px", borderBottom: `1px solid ${LIGHTER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: ORANGE, fontFamily: FFM, letterSpacing: "0.06em", marginBottom: 2 }}>{pinPlot ? "MAP PIN" : plot.ref || cid}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK, fontFamily: FF, lineHeight: 1.25, marginBottom: 4 }}>{plot.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: v.color, fontFamily: FF, fontWeight: 600 }}>{pinPlot ? "Marker" : v.label}</span>
              {plot.score != null ? <ScoreRing pct={plot.score} size={28} /> : <span style={{ fontSize: 11, color: LIGHT, fontFamily: FF }}>No listing score</span>}
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${LIGHTER}`, background: BG, color: MID, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "0 13px 10px", borderBottom: `1px solid ${LIGHTER}` }}>
          <div style={{ position: "relative", width: "100%", height: 118, borderRadius: 10, overflow: "hidden", marginTop: 8, border: `1px solid ${LIGHTER}`, background: BG2 }}>
            <PlotImage plot={plot} type={plot.type} index={0} style={{ width: "100%", height: "100%", display: "block" }} />
            <div style={{ position: "absolute", bottom: 6, left: 8, right: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: WHITE, fontFamily: FF, letterSpacing: "0.06em", textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.45)" }}>Listing visual</span>
              {plot.timeOnMarket && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.9)", fontFamily: FF, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>{plot.timeOnMarket}</span>}
            </div>
          </div>
        </div>

        <div style={{ padding: "10px 13px", borderBottom: `1px solid ${LIGHTER}` }}>
          <div style={{ ...TC.labelUC, color: LIGHT, marginBottom: 8 }}>From listing</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontFamily: FF, fontSize: 17, fontWeight: 600, color: INK }}>{plot.price}</span>
            <span style={{ fontSize: 10, color: LIGHT, fontFamily: FFM }}>{plot.area} · {plot.pricePerSqm}</span>
          </div>
          {plot.tag && (
            <div style={{ fontSize: 11, color: MID, fontFamily: FF, lineHeight: 1.4, marginBottom: 6 }}>{plot.tag}</div>
          )}
          <div style={{ fontSize: 10, color: INK, fontFamily: FF, lineHeight: 1.45 }}>
            <span style={{ color: LIGHT }}>Region · </span>
            {plot.region || "—"}
          </div>
          <div style={{ fontSize: 10, color: INK, fontFamily: FF, marginTop: 4 }}>
            <span style={{ color: LIGHT }}>Type · </span>
            {plot.type || "—"}
          </div>
          {!pinPlot && (
            <button type="button" onClick={() => onOpenListing(cid)} style={{ width: "100%", marginTop: 10, background: "none", border: `1px solid ${LIGHTER}`, borderRadius: 99, padding: "7px", fontSize: 11, color: MID, cursor: "pointer", fontFamily: FF }}>
              View full listing →
            </button>
          )}
        </div>

        <div style={{ padding: "10px 13px", borderBottom: `1px solid ${LIGHTER}` }}>
          <div style={{ ...TC.labelUC, color: LIGHT, marginBottom: 6 }}>Yonder layers</div>
          {!pinPlot && !upgraded && (
            <div style={{ fontSize: 10, color: MID, fontFamily: FF, lineHeight: 1.45, marginBottom: 8, padding: "8px 10px", background: SUBTLE, borderRadius: 8, border: `1px solid ${LIGHTER}` }}>
              Regulatory preview only. <button type="button" onClick={onUpgrade} style={{ border: "none", background: "none", padding: 0, color: ACCENT, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>Upgrade</button> for full PDM parameters, RAN/REN overlays, and dossier.
            </div>
          )}
          {[
            ["PDM", plot.technical?.["PDM zone"] || plot.type || "—"],
            ["RAN", plot.technical?.RAN || "—"],
            ["REN", plot.technical?.REN || "—"],
          ].map(([k, val]) => {
            const lockLayer = !pinPlot && !upgraded && (k === "RAN" || k === "REN");
            const shortPdm = !pinPlot && !upgraded && k === "PDM" && String(val).length > 36;
            const displayVal = shortPdm ? `${String(val).slice(0, 34)}…` : val;
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${LIGHTER}`, position: "relative", gap: 8 }}>
                <span style={{ fontSize: 10, color: LIGHT, fontFamily: FF, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 10, color: INK, fontFamily: FF, fontWeight: 500, textAlign: "right", maxWidth: "62%" }}>{displayVal}</span>
                {lockLayer && (
                  <button
                    type="button"
                    onClick={onUpgrade}
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: "linear-gradient(90deg, rgba(248,247,244,0.15), rgba(248,247,244,0.9) 50%)",
                      backdropFilter: "blur(3px)",
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: FF,
                      color: ACCENT,
                      padding: "0 8px 0 38%",
                      textAlign: "right",
                    }}
                  >
                    Unlock on Pro
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "10px 13px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: INK, fontFamily: FF }}>AI scan</div>
            {!upgraded && !pinPlot && (
              <button type="button" onClick={onUpgrade} style={{ fontSize: 10, fontWeight: 600, fontFamily: FF, color: ACCENT, background: "rgba(37,99,235,0.08)", border: `1px solid rgba(37,99,235,0.2)`, borderRadius: 99, padding: "3px 10px", cursor: "pointer", flexShrink: 0 }}>
                Pro
              </button>
            )}
          </div>
          {!upgraded && !pinPlot && (
            <div style={{ fontSize: 10, color: MID, fontFamily: FF, lineHeight: 1.45, marginBottom: 8, padding: "8px 10px", background: `${ACCENT}06`, borderRadius: 8, border: `1px solid ${ACCENT}22` }}>
              New runs and the full saved AI dossier need Pro. You can still ask questions in chat on any tier.
            </div>
          )}
          {pinPlot ? (
            <>
              <div style={{ fontSize: 10, color: LIGHT, fontFamily: FF, lineHeight: 1.45, marginBottom: 8 }}>
                Pins mark a spot on the map. <strong style={{ color: INK }}>Land-agent analysis and AI scan</strong> need a real listing — search in chat or tap a plot, then run analysis (Pro).
              </div>
              <button type="button" onClick={() => onSendToChat(plot, { mode: "ask" })} style={{ width: "100%", background: INK, border: "none", borderRadius: 99, padding: "9px", fontSize: 12, fontWeight: 600, color: WHITE, cursor: "pointer", fontFamily: FF }}>
                Ask about this area in chat →
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 10, color: LIGHT, fontFamily: FF, lineHeight: 1.45, marginBottom: 8 }}>
                The <strong style={{ color: INK }}>saved AI recap</strong> appears here only <strong style={{ color: INK }}>after</strong> you run <strong style={{ color: INK }}>Land agent + analysis</strong> in chat (land agent → regulatory pass → verdict card). Then it syncs to this sidebar and the full listing.
                {!upgraded && <> <strong style={{ color: INK }}>Pro</strong> required to run a new scan.</>}
              </div>

              {!recap && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button type="button" onClick={startAnalysis} style={{ width: "100%", background: ORANGE, border: "none", borderRadius: 99, padding: "9px", fontSize: 12, fontWeight: 600, color: WHITE, cursor: "pointer", fontFamily: FF }}>
                    {upgraded ? "⊕ Run land agent + analysis in chat" : "⊕ Run analysis in chat (Pro)"}
                  </button>
                  <button type="button" onClick={() => onSendToChat(plot, { mode: "ask" })} style={{ width: "100%", background: "none", border: `1px solid ${LIGHTER}`, borderRadius: 99, padding: "7px", fontSize: 11, color: MID, cursor: "pointer", fontFamily: FF }}>
                    Ask a question in chat →
                  </button>
                </div>
              )}

              {recap && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN_BRIGHT, flexShrink: 0 }}/>
                    <span style={{ fontSize: 11, fontWeight: 600, color: INK, fontFamily: FF }}>Saved report · land agent run</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <PlotRecapCard data={recap} />
                    {!upgraded && (
                      <button
                        type="button"
                        onClick={onUpgrade}
                        style={{
                          position: "absolute",
                          inset: 0,
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "rgba(248,247,244,0.75)",
                          backdropFilter: "blur(4px)",
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: FF,
                          color: ACCENT,
                        }}
                      >
                        Upgrade to read full AI scan
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => onSendToChat(plot, { mode: "deep", recap })} style={{ width: "100%", marginTop: 8, background: `${ORANGE}12`, border: `1px solid ${ORANGE}35`, borderRadius: 99, padding: "8px", fontSize: 11, fontWeight: 600, color: ORANGE, cursor: "pointer", fontFamily: FF }}>
                    Continue in chat (Q&amp;A) →
                  </button>
                  <button type="button" onClick={startAnalysis} style={{ width: "100%", marginTop: 6, background: "none", border: `1px solid ${LIGHTER}`, borderRadius: 99, padding: "7px", fontSize: 11, color: MID, cursor: "pointer", fontFamily: FF }}>
                    {upgraded ? "Re-run analysis in chat" : "Re-run analysis (Pro)"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "10px 13px", borderTop: `1px solid ${LIGHTER}`, flexShrink: 0 }}>
        <button type="button" onClick={() => onAddToProject(cid)} style={{ width: "100%", background: inProject ? `${GREEN}10` : INK, border: `1px solid ${inProject ? `${GREEN}35` : "transparent"}`, borderRadius: 99, padding: "9px", fontSize: 12, fontWeight: 600, color: inProject ? GREEN : WHITE, cursor: "pointer", fontFamily: FF }}>
          {pinPlot ? inProject ? "✓ Pin saved" : "✦ Save pin to workspace" : inProject ? "✓ In pipeline" : "✦ Save to pipeline"}
        </button>
        <div style={{ fontSize: 10, color: LIGHT, fontFamily: FF, textAlign: "center", marginTop: 8, lineHeight: 1.4 }}>
          The report stays on this listing and in your pipeline — not only in the chat thread.
        </div>
      </div>

      <style>{`@keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
    </div>
  );
}

/** Save flow: My listings (default pipeline) or named pipeline (demo label). */
function PipelineSaveModal({ open, count, pipelineName, setPipelineName, onClose, onSaveMyListings, onSaveNamed }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(17,17,16,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ width: "min(380px, 100%)", background: WHITE, borderRadius: 12, border: `1px solid ${LIGHTER}`, boxShadow: "0 16px 48px rgba(0,0,0,0.18)", padding: "18px 18px 16px", animation: "fadeIn 0.18s ease both" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: FF, fontSize: 16, fontWeight: 600, color: INK, marginBottom: 4 }}>Add to pipeline</div>
        <div style={{ fontSize: 13, color: MID, fontFamily: FF, lineHeight: 1.45, marginBottom: 14 }}>
          {count} {count === 1 ? "item" : "items"} · choose where to save (demo: same workspace; named pipeline is a label for now).
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button type="button" onClick={onSaveMyListings} style={{ width: "100%", background: INK, border: "none", borderRadius: 99, padding: "10px 14px", fontSize: 13, fontWeight: 600, color: WHITE, cursor: "pointer", fontFamily: FF }}>
            Save to My listings
          </button>
          <div style={{ fontSize: 11, color: LIGHT, fontFamily: FF, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>Or name a pipeline</div>
          <input value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} placeholder="e.g. Alentejo shortlist" style={{ width: "100%", border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "9px 11px", fontSize: 13, fontFamily: FF, outline: "none" }} />
          <button type="button" onClick={() => onSaveNamed(pipelineName?.trim() || "Untitled pipeline")} style={{ width: "100%", background: `${ORANGE}12`, border: `1px solid ${ORANGE}40`, borderRadius: 99, padding: "9px 14px", fontSize: 13, fontWeight: 600, color: ORANGE, cursor: "pointer", fontFamily: FF }}>
            Save to named pipeline
          </button>
          <button type="button" onClick={onClose} style={{ width: "100%", background: "none", border: "none", padding: "6px", fontSize: 12, color: LIGHT, cursor: "pointer", fontFamily: FF }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/** Drawn-area hits: list + analyse / save (replaces map bottom overlay). */
function DrawAreaSelectionSidebar({ lens, rows, onClose, onInspectListing, onInspectParcel, onSaveAll, onAnalyseAll, bulkRunning, bulkDone, projectPlots }) {
  const n = rows.length;
  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 300, background: WHITE, borderLeft: `1px solid ${LIGHTER}`, zIndex: 66, display: "flex", flexDirection: "column", animation: "slideInRight 0.2s ease both", boxShadow: "-4px 0 20px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "11px 13px", borderBottom: `1px solid ${LIGHTER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: ORANGE, fontFamily: FFM, letterSpacing: "0.06em", marginBottom: 2 }}>AREA SEARCH</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK, fontFamily: FF, lineHeight: 1.25 }}>{lens === "parcels" ? "Parcels in shape" : "Listings in shape"}</div>
            <div style={{ fontSize: 11, color: MID, fontFamily: FF, marginTop: 4 }}>{n} {lens === "parcels" ? "parcels" : "listings"} · use List tab for the same set</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${LIGHTER}`, background: BG, color: MID, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {lens === "listings"
          ? rows.map((p, idx) => {
              const lid = plotListingOpenId(p);
              const inProj = projectPlots.includes(lid);
              return (
                <button type="button" key={p.id} onClick={() => onInspectListing(p)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: BG, border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 8px 6px 6px", marginBottom: 6, cursor: "pointer", fontFamily: FF }}>
                  <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 7, overflow: "hidden", border: `1px solid ${LIGHTER}`, background: BG2 }}>
                    <PlotImage plot={p} type={p.type} index={idx} style={{ width: "100%", height: "100%", display: "block" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: ACCENT, fontFamily: FFM }}>{p.id}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: INK }}>{p.price}</div>
                    <div style={{ fontSize: 11, color: MID, lineHeight: 1.3 }}>{p.region}</div>
                    <div style={{ fontSize: 10, color: inProj ? GREEN : LIGHT, marginTop: 3 }}>{inProj ? "In pipeline" : "Tap for dossier"}</div>
                  </div>
                </button>
              );
            })
          : rows.map((par) => {
              const zc = ZONE_COLORS[par.zone] || ZONE_COLORS["Rústico"];
              return (
                <button type="button" key={par.id} onClick={() => onInspectParcel(par)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: BG, border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 8px 6px 6px", marginBottom: 6, cursor: "pointer", fontFamily: FF }}>
                  <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 7, background: zc.fill, border: `2px solid ${zc.stroke}` }} aria-hidden />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: ORANGE, fontFamily: FFM }}>{par.ref}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: INK }}>{par.zone} · {par.pdm}</div>
                    <div style={{ fontSize: 11, color: MID }}>{par.area}</div>
                  </div>
                </button>
              );
            })}
      </div>
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${LIGHTER}`, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <button type="button" disabled={bulkRunning || bulkDone} onClick={onAnalyseAll} style={{ width: "100%", background: bulkDone ? `${GREEN}15` : ORANGE, border: `1px solid ${bulkDone ? GREEN + "40" : "transparent"}`, borderRadius: 99, padding: "9px", fontSize: 12, fontWeight: 600, color: bulkDone ? GREEN : WHITE, cursor: bulkRunning || bulkDone ? "default" : "pointer", fontFamily: FF, opacity: bulkRunning ? 0.85 : 1 }}>
          {bulkDone ? `✓ Analysis sent to chat` : bulkRunning ? "Analysing…" : "⊕ Analyse all (chat)"}
        </button>
        <button type="button" disabled={bulkRunning} onClick={onSaveAll} style={{ width: "100%", background: WHITE, border: `1px solid ${LIGHTER}`, borderRadius: 99, padding: "8px", fontSize: 12, fontWeight: 600, color: INK, cursor: bulkRunning ? "default" : "pointer", fontFamily: FF }}>
          ✦ Add all to pipeline…
        </button>
      </div>
      <style>{`@keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
    </div>
  );
}

/** Listings count for map chrome + list header: exact row count for search / lasso, inventory headline for nationwide browse. */
function listingsCountForMapAndList(mr) {
  if (mr.kind !== "listings") return mr.headlineCount;
  if (mr.contextLabel.includes("Portugal — all land")) return mr.headlineCount;
  return mr.plots.length;
}

function initialNationwideMapResults() {
  return {
    kind: "listings",
    headlineCount: NATIONWIDE_HEADLINE_TOTAL,
    contextLabel: "Portugal — all land listings",
    plots: [...CHAT_PLOTS],
    parcels: [],
  };
}

const MOCK_PLOTS = [
  {id:1,ref:"PT-0847-ALT",name:"Ruin — Évora surroundings",type:"Ruin",region:"Alentejo",size:"1,200 m²",price:"€65,000",suitability:88,stage:"Legal Check",favourite:true,contacts:[{name:"João Silva",role:"Listing Agent",phone:"+351 912 345 678",email:"joao@idealista.pt"},{name:"Diogo Leal",role:"Legal Expert",phone:"+351 963 000 111",email:"diogo@leal-advogados.pt"}],agentSummary:"Rustic land, PDM allows rural tourism reconstruction. Existing stone structure ~80m². Access via municipal road. No agricultural restrictions. Recommended for boutique tourism project.",legalNotes:"Clean title. No outstanding liens. PDM Article 34b permits reconstruction up to original footprint +30%. Municipal approval required for tourism use.",steps:[{label:"Add to pipeline",done:true},{label:"Run AI land agent",done:true},{label:"Outreach to realtor",done:true},{label:"Legal check — Diogo",done:true},{label:"Make offer",done:false},{label:"Close",done:false}]},
  {id:2,ref:"PT-1234-DOU",name:"Agricultural — Douro Valley",type:"Eco Tourism",region:"Douro Valley",size:"8,500 m²",price:"€120,000",suitability:74,stage:"Outreach Sent",favourite:false,contacts:[{name:"Ana Ferreira",role:"Listing Agent",phone:"+351 922 111 222",email:"ana@remax.pt"}],agentSummary:"Agricultural classification. PDM allows agro-tourism structures up to 500m². River views. Adjacent to DOC wine region. Good access road. Suitable for glamping or eco lodge.",legalNotes:"Pending review.",steps:[{label:"Add to pipeline",done:true},{label:"Run AI land agent",done:true},{label:"Outreach to realtor",done:true},{label:"Legal check — Diogo",done:false},{label:"Make offer",done:false},{label:"Close",done:false}]},
  {id:3,ref:"PT-0392-ALE",name:"Urban plot — Lisbon surrounds",type:"Development",region:"Setúbal",size:"3,200 m²",price:"€280,000",suitability:91,stage:"Agent Run",favourite:true,contacts:[],agentSummary:"Urban zoning. PDM permits residential + commercial mixed use up to 4 floors. Excellent access. 35min from Lisbon centre. Reclassified 2022.",legalNotes:"Pending review.",steps:[{label:"Add to pipeline",done:true},{label:"Run AI land agent",done:true},{label:"Outreach to realtor",done:false},{label:"Legal check — Diogo",done:false},{label:"Make offer",done:false},{label:"Close",done:false}]},
  {id:4,ref:"PT-0911-MNH",name:"Rustic cabin land — Minho",type:"Cabin",region:"Minho",size:"4,100 m²",price:"€42,000",suitability:61,stage:"Discovered",favourite:false,contacts:[],agentSummary:"Not yet analysed.",legalNotes:"Not yet reviewed.",steps:[{label:"Add to pipeline",done:true},{label:"Run AI land agent",done:false},{label:"Outreach to realtor",done:false},{label:"Legal check — Diogo",done:false},{label:"Make offer",done:false},{label:"Close",done:false}]},
  {id:5,ref:"PT-0556-BEJ",name:"Solar — Beja plains",type:"Solar",region:"Baixo Alentejo",size:"42,000 m²",price:"€390,000",suitability:95,stage:"Offer",favourite:true,contacts:[{name:"Carlos Mota",role:"Listing Agent",phone:"+351 934 567 890",email:"carlos@solarland.pt"},{name:"Diogo Leal",role:"Legal Expert",phone:"+351 963 000 111",email:"diogo@leal-advogados.pt"}],agentSummary:"Large agricultural flat land. Southern exposure. 2.1km from 60kV substation. No protected zones. PDM allows energy infrastructure. Grid connection feasibility: HIGH.",legalNotes:"Clean title. No encumbrances. REN grid proximity confirmed. Environmental screening recommended before permitting application.",steps:[{label:"Add to pipeline",done:true},{label:"Run AI land agent",done:true},{label:"Outreach to realtor",done:true},{label:"Legal check — Diogo",done:true},{label:"Make offer",done:true},{label:"Close",done:false}]},
];

// ── CADASTRE PARCELS ──────────────────────────────────────────────────────────
// 20 parcels as SVG polygon points (% of map container), with metadata
const CADASTRE_PARCELS = [
  {id:"CAD-001",ref:"PT-SB-001",zone:"Rústico",pdm:"Espaço Agrícola",area:"2,340 m²",owner:"Private",listed:true,  plotId:"PT-0182",score:94,verdict:"great_match",pts:"28,58 34,58 34,66 28,66"},
  {id:"CAD-002",ref:"PT-SB-002",zone:"Rústico",pdm:"Espaço Florestal",area:"1,820 m²",owner:"Private",listed:false, plotId:null,   score:null,verdict:null,     pts:"34,58 40,58 40,64 34,64"},
  {id:"CAD-003",ref:"PT-SB-003",zone:"Rústico",pdm:"Espaço Agrícola",area:"3,100 m²",owner:"Private",listed:false, plotId:null,   score:null,verdict:null,     pts:"28,66 36,66 36,74 28,74"},
  {id:"CAD-004",ref:"PT-SB-004",zone:"RAN",    pdm:"Reserva Agrícola",area:"4,200 m²",owner:"Estado", listed:false, plotId:null,   score:null,verdict:null,     pts:"36,64 44,64 44,72 36,72"},
  {id:"CAD-005",ref:"PT-OB-005",zone:"Urbano", pdm:"Residencial",    area:"1,200 m²",owner:"Private",listed:true,  plotId:"PT-0441",score:88,verdict:"good_match",pts:"20,34 26,34 26,42 20,42"},
  {id:"CAD-006",ref:"PT-OB-006",zone:"Urbano", pdm:"Misto",          area:"980 m²",  owner:"Private",listed:false, plotId:null,   score:null,verdict:null,     pts:"26,34 32,34 32,40 26,40"},
  {id:"CAD-007",ref:"PT-OB-007",zone:"Urbano", pdm:"Residencial",    area:"760 m²",  owner:"Private",listed:false, plotId:null,   score:null,verdict:null,     pts:"20,42 26,42 26,50 20,50"},
  {id:"CAD-008",ref:"PT-AL-008",zone:"Rústico",pdm:"Espaço Agrícola",area:"8,500 m²",owner:"Private",listed:true,  plotId:"PT-1093",score:76,verdict:"good_match",pts:"52,48 60,48 60,58 52,58"},
  {id:"CAD-009",ref:"PT-AL-009",zone:"REN",    pdm:"Proteção Ecológica",area:"5,200 m²",owner:"Estado",listed:false,plotId:null,  score:null,verdict:null,     pts:"60,48 68,48 68,56 60,56"},
  {id:"CAD-010",ref:"PT-AL-010",zone:"Rústico",pdm:"Agro-Florestal",  area:"6,700 m²",owner:"Private",listed:false,plotId:null,  score:null,verdict:null,     pts:"52,58 60,58 60,66 52,66"},
  {id:"CAD-011",ref:"PT-AL-011",zone:"Rústico",pdm:"Espaço Florestal",area:"3,900 m²",owner:"Private",listed:false,plotId:null,  score:null,verdict:null,     pts:"60,56 68,56 68,64 60,64"},
  {id:"CAD-012",ref:"PT-EV-012",zone:"Urbano", pdm:"Industrial",     area:"2,800 m²",owner:"Empresa", listed:true,  plotId:"PT-0677",score:71,verdict:"good_match",pts:"62,68 70,68 70,76 62,76"},
  {id:"CAD-013",ref:"PT-EV-013",zone:"Rústico",pdm:"Espaço Agrícola",area:"12,000 m²",owner:"Private",listed:false,plotId:null,  score:null,verdict:null,     pts:"70,68 78,68 78,78 70,78"},
  {id:"CAD-014",ref:"PT-EV-014",zone:"RAN",    pdm:"Reserva Agrícola",area:"9,400 m²",owner:"Estado", listed:false,plotId:null,  score:null,verdict:null,     pts:"62,76 70,76 70,84 62,84"},
  {id:"CAD-015",ref:"PT-BE-015",zone:"Rústico",pdm:"Área de Produção",area:"42,000 m²",owner:"Private",listed:true, plotId:"PT-2201",score:82,verdict:"good_match",pts:"55,74 65,74 65,84 55,84"},
  {id:"CAD-016",ref:"PT-BE-016",zone:"Rústico",pdm:"Espaço Agrícola",area:"18,000 m²",owner:"Private",listed:false,plotId:null,  score:null,verdict:null,     pts:"45,76 55,76 55,84 45,84"},
  {id:"CAD-017",ref:"PT-BE-017",zone:"REN",    pdm:"Proteção Ecológica",area:"7,200 m²",owner:"Estado",listed:false,plotId:null, score:null,verdict:null,     pts:"65,74 75,74 75,82 65,82"},
  {id:"CAD-018",ref:"PT-VC-018",zone:"Urbano", pdm:"Residencial",    area:"890 m²",  owner:"Private",listed:false,plotId:null,  score:null,verdict:null,     pts:"18,22 24,22 24,30 18,30"},
  {id:"CAD-019",ref:"PT-VC-019",zone:"Rústico",pdm:"Agro-Florestal",  area:"5,600 m²",owner:"Private",listed:false,plotId:null,  score:null,verdict:null,     pts:"24,22 32,22 32,30 24,30"},
  {id:"CAD-020",ref:"PT-VC-020",zone:"RAN",    pdm:"Reserva Agrícola",area:"3,300 m²",owner:"Estado", listed:false,plotId:null,  score:null,verdict:null,     pts:"18,30 26,30 26,38 18,38"},
];

/** Centroid in % of map box (matches cadastre SVG viewBox 900×760). */
function addParcelMapPct(p) {
  const pairs = p.pts.trim().split(/\s+/).map((s) => s.split(",").map(Number));
  let sx = 0;
  let sy = 0;
  for (const pair of pairs) {
    sx += pair[0];
    sy += pair[1];
  }
  const n = pairs.length || 1;
  return { ...p, mapX: (sx / n / 900) * 100, mapY: (sy / n / 760) * 100 };
}
const CADASTRE_PARCELS_MAP = CADASTRE_PARCELS.map(addParcelMapPct);

function parcelCatalogResults() {
  return {
    kind: "parcels",
    headlineCount: CADASTRE_PARCELS_MAP.length,
    contextLabel: "Parcels · cadastre / BUPI (demo)",
    plots: [],
    parcels: CADASTRE_PARCELS_MAP.map((p) => ({ ...p })),
  };
}

/** Shape a cadastre parcel like a listing plot for bulk / verdict demo UI. */
function parcelToBulkPlot(parcel) {
  const base = parcel.plotId ? CHAT_PLOTS.find((x) => x.id === parcel.plotId) : null;
  if (base) {
    return { ...base, id: parcel.id, name: `${parcel.ref} — ${base.name}` };
  }
  return {
    id: parcel.id,
    ref: parcel.ref,
    name: parcel.pdm,
    region: parcel.zone,
    area: parcel.area,
    type: parcel.zone,
    price: parcel.listed ? "Listed" : "—",
    pricePerSqm: "—",
    score: parcel.score ?? 70,
    aiVerdict: parcel.verdict ?? "consider",
  };
}

// zone colours for cadastre map
const ZONE_COLORS = {
  "Urbano":  {fill:"#e8d5b7", stroke:"#b8956a"},
  "Rústico": {fill:"#d4e6c3", stroke:"#8aac6a"},
  "RAN":     {fill:"#f5e6a3", stroke:"#c8a034"},
  "REN":     {fill:"#b8dde0", stroke:"#2196a0"},
};


/** Stub “listing photo” from demo `images[]` keys + plot type (no external assets). */
const PLOT_IMAGE_GRADIENTS = {
  coastal_land: ["#153d45", "#2a6b6a", "#8fb8a8"],
  sunset_field: ["#4a3528", "#7a5538", "#c9a06c"],
  access_road: ["#3a3d38", "#5c6258", "#9aa090"],
  village_plot: ["#4a4438", "#6b6355", "#b8a894"],
  cobblestone: ["#3d3a36", "#6a6258", "#a39888"],
  hilltop: ["#2d3540", "#4a5a68", "#8a9aaa"],
  rural_field: ["#2d4a28", "#4a6b3a", "#9bb88a"],
  alentejo_plain: ["#5a4a2a", "#8a7040", "#d4c090"],
  country_road: ["#353828", "#5a6248", "#9aa878"],
  sintra_hills: ["#2a3840", "#4a5c50", "#7a9088"],
  palace_view: ["#3a3548", "#5a4870", "#9080a8"],
  ruin_structure: ["#404040", "#606058", "#989088"],
  guadiana_river: ["#1a3a4a", "#2a5a6a", "#6a9aaa"],
  alentejo_sunset: ["#5a3020", "#8a5040", "#d09060"],
  remote_land: ["#283028", "#405038", "#788868"],
};
const TYPE_IMAGE_FALLBACK = {
  Rustic: ["#1e4024", "#2d5a32", "#6a9070"],
  Urban: ["#2a3540", "#3d4d5c", "#7a8c9c"],
  Ruin: ["#403830", "#5c5048", "#908578"],
  Pin: ["#3d3530", "#6b5030", "#c9842d"],
};

function plotImageGradient(plot) {
  const key = plot?.images?.[0];
  if (key && PLOT_IMAGE_GRADIENTS[key]) return PLOT_IMAGE_GRADIENTS[key];
  const t = plot?.type;
  if (t && TYPE_IMAGE_FALLBACK[t]) return TYPE_IMAGE_FALLBACK[t];
  return ["#1a2e22", "#2C5F2D", "#5a8a62"];
}

function PlotImage({ plot, type, index = 0, style = {} }) {
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = plot ? plotImageGradient(plot) : TYPE_IMAGE_FALLBACK[type] || TYPE_IMAGE_FALLBACK.Rustic;
  const [a, b, c] = g;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={style}>
      <defs>
        <linearGradient id={`pg-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={a} />
          <stop offset="55%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#pg-${gid})`} />
      <ellipse cx="200" cy="210" rx="280" ry="24" fill="rgba(0,0,0,0.12)" />
      <circle cx="320" cy="68" r="36" fill="rgba(255,248,220,0.35)" />
    </svg>
  );
}

// ── SHARED PRIMITIVES ─────────────────────────────────────────────────────────
function ScoreRing({pct,size=44}){
  const r=(size/2)-4,circ=2*Math.PI*r;
  const color=pct>=85?GREEN:pct>=70?ACCENT:MID;
  return(
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={LIGHTER} strokeWidth="2.5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize={size<=36?10:12}
        fontFamily={FF} fill={color} fontWeight="600">{pct}</text>
    </svg>
  );
}

function StagePill({stage}){
  const c=STAGE_COLORS[stage]||MID;
  return(
    <span style={{...TC.labelUC,letterSpacing:"0.08em",background:`${c}12`,color:c,padding:"3px 8px",borderRadius:6,whiteSpace:"nowrap",border:`1px solid ${c}22`,fontWeight:600}}>
      {stage}
    </span>
  );
}

function StepTracker({steps}){
  const done=steps.filter(s=>s.done).length;
  const nextIdx=steps.findIndex(x=>!x.done);
  return(
    <div style={{border:`1px solid ${LIGHTER}`,borderRadius:10,padding:12,background:SUBTLE}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{...TP.labelUC,color:MID}}>Progress</span>
        <span style={{...TP.body,fontWeight:700,color:ORANGE}}>{done}/{steps.length}</span>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:14}}>
        {steps.map((s,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:s.done?ORANGE:`${LIGHTER}`}}/>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {steps.map((s,i)=>{
        const active=!s.done&&i===nextIdx;
        return(
        <div key={i} style={{
          display:"flex",alignItems:"center",gap:12,
          padding:"10px 12px",
          borderRadius:10,
          background:s.done?SUCCESS_CARD_BG:active?ACTIVE_ROW_BG:"transparent",
          border:`1px solid ${s.done?"transparent":active?`${ORANGE}35`:LIGHTER}`,
        }}>
          <div style={{
            width:18,height:18,borderRadius:"50%",
            background:s.done?GREEN_BRIGHT:"transparent",
            border:s.done?"none":active?`2px solid ${ORANGE}40`:`1.5px solid ${LIGHTER}`,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            {s.done&&<span style={{color:"white",fontSize:11,lineHeight:1,fontWeight:700}}>✓</span>}
            {active&&<div style={{width:11,height:11,border:`2px solid ${LIGHTER}`,borderTopColor:ORANGE,borderRadius:"50%",animation:"spin 0.85s linear infinite"}}/>}
          </div>
          <span style={{...TP.body,fontWeight:s.done||active?600:400,color:s.done?GREEN:MID}}>{s.label}</span>
          {active&&<span style={{marginLeft:"auto",...TP.label,color:ORANGE,fontWeight:700}}>Active</span>}
        </div>
      );})}
      </div>
    </div>
  );
}

// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
function UpgradeModal({onClose,onUpgrade}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(17,17,16,0.5)",backdropFilter:"blur(6px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:WHITE,borderRadius:12,padding:"32px 28px",maxWidth:400,width:"90%",boxShadow:"0 24px 80px rgba(0,0,0,0.2)",position:"relative",border:`1px solid ${LIGHTER}`}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:18,color:LIGHT,cursor:"pointer"}}>✕</button>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${ORANGE}0f`,border:`1px solid ${ORANGE}30`,borderRadius:99,padding:"3px 10px",marginBottom:16}}>
          <span style={{...TP.labelUC,color:ORANGE,letterSpacing:"0.1em"}}>Upgrade required</span>
        </div>
        <div style={{...TP.pageTitle,fontSize:20,lineHeight:1.25,marginBottom:8}}>Unlock the full<br/>land intelligence suite</div>
        <div style={{...TP.secondary,lineHeight:1.65,marginBottom:20}}>Upgrade to Pro for unlimited searches, full cadastre reports and expert legal checks.</div>
        <div style={{background:SUBTLE,borderRadius:8,padding:"14px",marginBottom:20,border:`1px solid ${LIGHTER}`}}>
          {["Unlimited AI land searches","Full cadastre + registry data","Expert manual check on any plot","BUPI, PDM, RAN/REN unlocked","Priority support from land advisors"].map(t=>(
            <div key={t} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,...TP.body}}>
              <span style={{color:ORANGE,flexShrink:0}}>—</span>{t}
            </div>
          ))}
        </div>
        <button type="button" onClick={onUpgrade} style={{width:"100%",background:INK,border:"none",borderRadius:99,padding:"11px 0",...TP.body,fontWeight:600,color:WHITE,cursor:"pointer",marginBottom:8}}>Upgrade to Pro — €99 / month</button>
        <button type="button" onClick={onClose} style={{width:"100%",background:"none",border:"none",...TP.secondary,color:MID,cursor:"pointer",padding:"4px 0"}}>Maybe later</button>
        <div style={{textAlign:"center",marginTop:8,...TP.labelUC,letterSpacing:"0.12em",color:LIGHT}}>Cancel anytime · No commitment</div>
      </div>
    </div>
  );
}

function PlotListingPage({plotId,upgraded,onUpgrade,onBack,onAddToProject,inProject,savedAiRecap}){
  const plot=PLOT_DETAILS[plotId]||CHAT_PLOTS[0];
  const [descExpanded,setDescExpanded]=useState(false);
  const [contacted,setContacted]=useState(false);
  const [activeImg,setActiveImg]=useState(0);
  const v=VERDICT[plot.aiVerdict];

  // Split technical into visible (free) and locked (pro) sections
  const freeKeys=["PDM zone","RAN","REN","Orientation","Slope","Fire risk"];
  const lockedKeys=["Cadastre ref","IMT estimate","Last transaction","Ownership","Encumbrances","Grid distance","Max build","Heritage","Tourism build","River frontage","Substation","Access","Max height"];

  return(
    <div style={{flex:1,background:WHITE,display:"flex",flexDirection:"column"}}>

      {/* Sticky top bar */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${LIGHTER}`,padding:"0 24px",minHeight:48,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button type="button" onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",cursor:"pointer",...TP.body,color:MID,fontWeight:500}}>← Back</button>
        <span style={{...TP.mono,color:LIGHT}}>{plot.ref}</span>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button type="button" onClick={()=>onAddToProject(plot.id)} style={{background:inProject?`${GREEN}10`:WHITE,border:`1px solid ${inProject?GREEN+"40":LIGHTER}`,borderRadius:99,padding:"6px 14px",...TP.body,color:inProject?GREEN:MID,cursor:"pointer",fontWeight:600}}>
            {inProject?"✓ Saved":"+ Save to pipeline"}
          </button>
          <button type="button" style={{background:INK,border:"none",borderRadius:99,padding:"6px 14px",...TP.body,color:WHITE,cursor:"pointer",fontWeight:600}}>Contact agent →</button>
        </div>
      </div>

              <div style={{maxWidth:860,margin:"0 auto",width:"100%",padding:"0 0 80px"}}>

        {/* ── IMAGE GALLERY ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"200px 200px",gap:3,height:403,flexShrink:0}}>
          {/* Big left */}
          <div style={{gridRow:"1 / 3",background:BG2,position:"relative",overflow:"hidden",cursor:"pointer"}} onClick={()=>setActiveImg(0)}>
            <PlotImage plot={plot} type={plot.type} index={0} style={{width:"100%",height:"100%"}}/>
            <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
              <span style={{background:"rgba(17,17,16,0.6)",backdropFilter:"blur(6px)",color:WHITE,borderRadius:99,padding:"4px 10px",...TP.body,fontWeight:600,color:WHITE}}>{v.label}</span>
            </div>
          </div>
          {/* 4 small right */}
          {[1,2,3,4].map(i=>(
            <div key={i} style={{background:BG2,overflow:"hidden",cursor:"pointer",position:"relative",opacity:i>=plot.images.length?0.35:1}} onClick={()=>setActiveImg(i)}>
              <PlotImage plot={plot} type={plot.type} index={i} style={{width:"100%",height:"100%"}}/>
              {i===3&&plot.images.length>4&&(
                <div style={{position:"absolute",inset:0,background:"rgba(17,17,16,0.45)",display:"flex",alignItems:"center",justifyContent:"center",...TP.body,color:WHITE,fontWeight:600}}>+{plot.images.length-4} more</div>
              )}
            </div>
          ))}
        </div>

        <div style={{padding:"20px 24px 0"}}>

          {/* ── TITLE + PRICE ── */}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${LIGHTER}`}}>
            <div style={{minWidth:0}}>
              <div style={{...TP.labelUC,color:ORANGE,marginBottom:4}}>{plot.region}</div>
              <div style={{...TP.pageTitle,marginBottom:6}}>{plot.name}</div>
              <div style={{...TP.secondary}}>{plot.tag}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{...TP.pageTitle,fontSize:22}}>{plot.price}</div>
              <div style={{...TP.mono,marginTop:4}}>{plot.pricePerSqm}</div>
              <div style={{...TP.label,color:v.color,fontWeight:600,marginTop:6}}>{v.label} · {plot.score}/100</div>
            </div>
          </div>

          {/* ── KEY STATS ── */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:8,marginBottom:24}}>
            {[
              {label:"Plot size", val:plot.area},
              {label:"Price/m²", val:plot.pricePerSqm},
              {label:"Type", val:plot.type},
              {label:"On market", val:plot.timeOnMarket||"—"},
            ].map(({label,val})=>(
              <div key={label} style={{padding:"12px",background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:10,textAlign:"center"}}>
                <div style={{...TP.labelUC,marginBottom:4}}>{label}</div>
                <div style={{...TP.body,fontWeight:600}}>{val}</div>
              </div>
            ))}
          </div>

          {savedAiRecap && (
            <div style={{marginBottom:24,paddingBottom:20,borderBottom:`1px solid ${LIGHTER}`}}>
              <div style={{...TP.sectionTitle,marginBottom:10}}>AI report</div>
              <p style={{...TP.secondary,margin:"0 0 12px",lineHeight:1.55}}>Structured scan from your last <strong style={{color:INK,fontWeight:600}}>Land agent + analysis</strong> in chat (not from the listing alone). Also on the map sidebar and in your pipeline.</p>
              <PlotRecapCard data={savedAiRecap} />
            </div>
          )}

          {/* ── ABOUT ── */}
          <div style={{marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${LIGHTER}`}}>
            <div style={{...TP.sectionTitle,marginBottom:10}}>About this plot</div>
            <div style={{position:"relative",overflow:"hidden",maxHeight:descExpanded?"none":"96px"}}>
              <div style={{...TP.secondary,lineHeight:1.65}}>{plot.description}</div>
              {!descExpanded&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:48,background:`linear-gradient(transparent,${WHITE})`}}/>}
            </div>
            <button type="button" onClick={()=>setDescExpanded(x=>!x)} style={{marginTop:10,background:"none",border:"none",padding:0,cursor:"pointer",...TP.label,color:ACCENT,fontWeight:600}}>
              {descExpanded?"Show less ↑":"Read more ↓"}
            </button>
          </div>

          {/* ── HIGHLIGHTS ── */}
          <div style={{marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${LIGHTER}`}}>
            <div style={{...TP.sectionTitle,marginBottom:10}}>Highlights</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
              {plot.highlights.map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",...TP.body,borderBottom:`1px solid ${LIGHTER}`}}>
                  <span style={{color:GREEN_BRIGHT,fontSize:10,flexShrink:0}}>●</span>{h}
                </div>
              ))}
            </div>
          </div>

          {/* ── AMENITIES ── */}
          <div style={{marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${LIGHTER}`}}>
            <div style={{...TP.sectionTitle,marginBottom:10}}>In the area</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8}}>
              {(plot.amenities||[]).map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:10}}>
                  <span style={{fontSize:16,flexShrink:0,lineHeight:1}}>{a.icon}</span>
                  <div style={{minWidth:0}}>
                    <div style={{...TP.body,fontWeight:600}}>{a.label}</div>
                    <div style={{...TP.secondary,marginTop:2}}>{a.dist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CONTACT AGENT ── */}
          <div style={{background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"16px",marginBottom:20}}>
            <div style={{...TP.sectionTitle,marginBottom:12}}>Listed by</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:8,background:WHITE,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${LIGHTER}`,fontSize:16,flexShrink:0}}>⊞</div>
              <div>
                <div style={{...TP.body,fontWeight:600,color:INK}}>{plot.contact.name}</div>
                <div style={{...TP.secondary,marginTop:2}}>{plot.contact.role}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <a href={`tel:${plot.contact.phone}`} style={{flex:1,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"9px",textAlign:"center",...TP.body,color:INK,textDecoration:"none",fontWeight:600}}>Call</a>
              <a href={`mailto:${plot.contact.email}`} style={{flex:2,background:INK,borderRadius:99,padding:"9px",textAlign:"center",...TP.body,color:WHITE,textDecoration:"none",fontWeight:600}}>Send enquiry →</a>
            </div>
          </div>

          {/* ── PLOT DATA ── */}
          <div style={{marginBottom:20}}>
            <div style={{...TP.sectionTitle,marginBottom:4}}>Plot data</div>
            <div style={{...TP.secondary,marginBottom:14}}>Zoning, legal status, cadastre and land use classification.</div>

            {/* Free section — always visible */}
            <div style={{marginBottom:12}}>
              {freeKeys.filter(k=>plot.technical[k]).map(k=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"6px 0",borderBottom:`1px solid ${LIGHTER}`}}>
                  <span style={{...TP.labelUC}}>{k}</span>
                  <span style={{...TP.body,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{plot.technical[k]}</span>
                </div>
              ))}
            </div>

            {/* Pro sections — headers visible, content greyed */}
            {[
              {
                title:"Zoning & Classification",
                rows:[["PDM zone",plot.technical["PDM zone"]],["Land use","Rustic — Espaço Agrícola"],["Reclassification","No active process"],["Protected areas","None on this parcel"]],
              },
              {
                title:"PDM — Municipal Master Plan",
                rows:[["Build allowance","0.3 FAR — rural tourism"],["Max footprint","25% of plot area"],["Height limit","6.5m (2 floors)"],["Setbacks","5m from all boundaries"]],
              },
              {
                title:"BUPI & Cadastre",
                rows:[["Cadastre ref",plot.technical["Cadastre ref"]],["BUPI status","Registered — no conflicts"],["Last transaction",plot.technical["Last transaction"]],["Ownership",plot.technical["Ownership"]]],
              },
              {
                title:"Land Registry",
                rows:[["IMT estimate",plot.technical["IMT estimate"]],["Mortgage","None on record"],["Liens","None found"],["Title chain","Clean — single owner"]],
              },
              {
                title:"Infrastructure & Access",
                rows:[["Grid distance",plot.technical["Grid distance"]||"—"],["Access",plot.technical["Access"]||"Paved road"],["Water","Connection 80m"],["Slope",plot.technical["Slope"]]],
              },
            ].map(({title,rows})=>(
              <div key={title} style={{marginBottom:10,borderRadius:10,border:`1px solid ${LIGHTER}`,overflow:"hidden"}}>
                <div style={{padding:"8px 12px",background:upgraded?WHITE:SUBTLE,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${LIGHTER}`}}>
                  <span style={{...TP.body,fontWeight:600,color:upgraded?INK:MID}}>{title}</span>
                  {!upgraded&&<span style={{...TP.label,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"2px 8px",fontWeight:700}}>Pro</span>}
                </div>
                <div style={{filter:upgraded?"none":"blur(4px)",userSelect:upgraded?"auto":"none",pointerEvents:upgraded?"auto":"none",padding:"0 12px",background:WHITE}}>
                  {rows.filter(([,v])=>v).map(([k,val])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"6px 0",borderBottom:`1px solid ${LIGHTER}`}}>
                      <span style={{...TP.secondary}}>{k}</span>
                      <span style={{...TP.body,fontWeight:600,textAlign:"right",maxWidth:"55%"}}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!upgraded&&(
              <div style={{border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"16px",textAlign:"center",background:SUBTLE,marginTop:4}}>
                <div style={{...TP.body,fontWeight:600,color:INK,marginBottom:4}}>Unlock full plot data</div>
                <div style={{...TP.secondary,lineHeight:1.55,marginBottom:12,maxWidth:280,margin:"0 auto 12px"}}>Zoning rules, PDM detail, BUPI, cadastre reference, registry & infrastructure — plus AI deep research</div>
                <button type="button" onClick={onUpgrade} style={{background:INK,border:"none",borderRadius:99,padding:"9px 24px",...TP.body,color:WHITE,cursor:"pointer",fontWeight:600}}>Upgrade to Pro →</button>
              </div>
            )}
          </div>

          {/* Legal check — only if upgraded */}
          {upgraded&&(
            <div style={{background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"16px",marginBottom:20}}>
              <div style={{...TP.sectionTitle,marginBottom:6}}>Legal check</div>
              <div style={{...TP.secondary,lineHeight:1.65,marginBottom:12}}>Title verification, BUPI, PDM compliance and licencing pathway by Diogo Leal.</div>
              {contacted?(
                <div style={{textAlign:"center",...TP.body,color:GREEN,fontWeight:600,padding:"10px",background:`${GREEN}0d`,borderRadius:8,border:`1px solid ${GREEN}30`}}>✓ Request sent — Diogo responds within 48h</div>
              ):(
                <button type="button" onClick={()=>setContacted(true)} style={{width:"100%",background:INK,border:"none",borderRadius:99,padding:"9px",...TP.body,color:WHITE,cursor:"pointer",fontWeight:600}}>Request legal check →</button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
function DetailPanel({plot,onClose,onToggleFav}){
  const [tab,setTab]=useState("overview");
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:WHITE,borderLeft:`1px solid ${LIGHTER}`}}>
      <div style={{padding:"14px 16px 12px",borderBottom:`1px solid ${LIGHTER}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:8}}>
          <div style={{minWidth:0}}>
            <div style={{...TP.pageTitle,marginBottom:4}}>{plot.name}</div>
            <div style={{...TP.mono}}>{plot.ref} · {plot.region}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            <button type="button" onClick={()=>onToggleFav(plot.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:plot.favourite?ORANGE:LIGHTER,lineHeight:1}}>{plot.favourite?"★":"☆"}</button>
            <ScoreRing pct={plot.suitability} size={36}/>
            <button type="button" onClick={onClose} style={{background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:8,width:28,height:28,cursor:"pointer",...TP.body,color:MID,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500}}>✕</button>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <StagePill stage={plot.stage}/>
          <div style={{textAlign:"right"}}>
            <div style={{...TP.stat}}>{plot.price}</div>
            <div style={{...TP.secondary}}>{plot.size}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${LIGHTER}`,flexShrink:0,background:SUBTLE}}>
        {["overview","agent","legal","contacts","steps"].map(t=>(
          <button type="button" key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px 4px",background:"none",border:"none",borderBottom:tab===t?`2px solid ${ACCENT}`:"2px solid transparent",cursor:"pointer",...TP.labelUC,color:tab===t?ACCENT:LIGHT,letterSpacing:"0.08em"}}>{t}</button>
        ))}
      </div>
      <div className="ye-scroll" style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        {tab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
              {[["Reference",plot.ref],["Region",plot.region],["Size",plot.size],["Price",plot.price],["Type",plot.type],["Score",`${plot.suitability}%`]].map(([k,v])=>(
                <div key={String(k)} style={{paddingBottom:8,borderBottom:`1px solid ${LIGHTER}`}}>
                  <div style={{...TP.labelUC,marginBottom:4}}>{k}</div>
                  <div style={{...TP.body,fontWeight:600,color:INK}}>{v}</div>
                </div>
              ))}
            </div>
            <StepTracker steps={plot.steps}/>
          </div>
        )}
        {tab==="agent"&&<div style={{...TP.secondary,lineHeight:1.65,paddingTop:2}}>{plot.agentSummary}</div>}
        {tab==="legal"&&<div style={{...TP.secondary,lineHeight:1.65,paddingTop:2}}>{plot.legalNotes}</div>}
        {tab==="contacts"&&(
          <div>
            {plot.contacts.length===0
              ?<div style={{textAlign:"center",padding:"32px 0",...TP.secondary}}>No contacts yet.</div>
              :plot.contacts.map((c,i)=>(
                <div key={i} style={{paddingBottom:12,marginBottom:0,borderBottom:`1px solid ${LIGHTER}`}}>
                  <div style={{...TP.body,fontWeight:600,color:INK,marginBottom:2}}>{c.name}</div>
                  <div style={{...TP.labelUC,marginBottom:8,color:LIGHT}}>{c.role}</div>
                  <div style={{display:"flex",gap:8}}>
                    <a href={`tel:${c.phone}`} style={{flex:1,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"7px",textAlign:"center",...TP.body,color:INK,textDecoration:"none",fontWeight:500}}>Call</a>
                    <a href={`mailto:${c.email}`} style={{flex:1,background:INK,borderRadius:99,padding:"7px",textAlign:"center",...TP.body,color:WHITE,textDecoration:"none",fontWeight:600}}>Email</a>
                  </div>
                </div>
              ))
            }
          </div>
        )}
        {tab==="steps"&&<StepTracker steps={plot.steps}/>}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardView({onOpenListing,upgraded,onUpgrade}){
  const [view,setView]=useState("list");
  const [detailPlot,setDetailPlot]=useState(null);
  const [sortBy,setSortBy]=useState("suitability");
  const [filterStage,setFilterStage]=useState("All");
  const [plots,setPlots]=useState(MOCK_PLOTS);
  const [search,setSearch]=useState("");

  const filtered=plots
    .filter(p=>filterStage==="All"||p.stage===filterStage)
    .filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase())||p.region.toLowerCase().includes(search.toLowerCase())||p.ref.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>sortBy==="suitability"?b.suitability-a.suitability:sortBy==="price"?parseInt(a.price.replace(/\D/g,""))-parseInt(b.price.replace(/\D/g,"")):a.stage.localeCompare(b.stage));

  function toggleFav(id){setPlots(p=>p.map(pl=>pl.id===id?{...pl,favourite:!pl.favourite}:pl));}
  const stats=[{label:"Total",value:plots.length},{label:"Avg score",value:Math.round(plots.reduce((a,p)=>a+p.suitability,0)/plots.length)+"%"},{label:"Active",value:plots.filter(p=>!["Discovered","Closed"].includes(p.stage)).length},{label:"Closed",value:plots.filter(p=>p.stage==="Closed").length}];

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:BG}}>
      {/* Header */}
      <div style={{padding:"0 28px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${LIGHTER}`,background:WHITE,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div>
            <div style={{...T.heading}}>My Plots</div>
            <div style={{...T.label,marginTop:1}}>{filtered.length} of {plots.length} plots</div>
          </div>
          <div style={{position:"relative"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{padding:"7px 12px 7px 30px",border:`1px solid ${LIGHTER}`,borderRadius:99,background:BG,...T.body,outline:"none",width:200}}/>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:LIGHT,fontSize:14,pointerEvents:"none"}}>⌕</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setView(v=>v==="list"?"kanban":"list")} style={{background:BG,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"7px 16px",...T.label,color:MID,cursor:"pointer"}}>{view==="list"?"Board view":"List view"}</button>
          <button style={{background:INK,border:"none",borderRadius:99,padding:"7px 18px",...T.label,color:WHITE,cursor:"pointer",fontWeight:500}}>+ Add plot</button>
        </div>
      </div>

      {/* Stats + filter bar */}
      <div style={{padding:"8px 28px",display:"flex",gap:12,borderBottom:`1px solid ${LIGHTER}`,background:BG,flexShrink:0,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:8,flex:1,flexWrap:"wrap"}}>
          {stats.map(s=>(
            <div key={s.label} style={{display:"flex",gap:10,alignItems:"center",paddingRight:16,borderRight:`1px solid ${LIGHTER}`}}>
              <span style={{fontFamily:FF,fontSize:18,color:INK}}>{s.value}</span>
              <span style={{fontFamily:FF,fontSize:15,color:LIGHT,textTransform:"uppercase",letterSpacing:"0.07em"}}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {["suitability","price","stage"].map(s=>(
            <button key={s} onClick={()=>setSortBy(s)} style={{background:sortBy===s?INK:BG2,border:`1px solid ${sortBy===s?INK:LIGHTER}`,borderRadius:99,padding:"4px 10px",fontSize:15,color:sortBy===s?WHITE:MID,cursor:"pointer",fontFamily:FF,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s}</button>
          ))}
          <select value={filterStage} onChange={e=>setFilterStage(e.target.value)} style={{border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"4px 10px",fontSize:15,fontFamily:FF,color:MID,background:BG2,cursor:"pointer",outline:"none",appearance:"none"}}>
            <option>All</option>{STAGES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <div style={{flex:1,overflowY:"auto",padding:"16px 28px"}}>
          {view==="list"&&(
            <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 4px"}}>
              <thead>
                <tr>{["","Name","Region","Size","Price","Score","Stage",""].map((h,i)=>(
                  <th key={i} style={{textAlign:"left",fontFamily:FF,fontSize:15,letterSpacing:"0.07em",textTransform:"uppercase",color:LIGHT,padding:"0 12px 6px",fontWeight:400}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(plot=>(
                  <tr key={plot.id} style={{background:detailPlot?.id===plot.id?`${ORANGE}06`:WHITE,cursor:"pointer"}}>
                    <td style={{padding:"12px",borderRadius:"6px 0 0 6px",width:28}}>
                      <button onClick={()=>toggleFav(plot.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:plot.favourite?ORANGE:LIGHTER}}>{plot.favourite?"★":"☆"}</button>
                    </td>
                    <td style={{padding:"12px",minWidth:160}} onClick={()=>setDetailPlot(plot)}>
                      <div style={{fontWeight:500,fontSize:15,color:INK,marginBottom:1,fontFamily:FF}}>{plot.name}</div>
                      <div style={{fontFamily:FFM,fontSize:15,color:LIGHT,letterSpacing:"0.05em"}}>{plot.ref}</div>
                    </td>
                    <td style={{padding:"12px",fontSize:15,color:MID,fontFamily:FF}}>{plot.region}</td>
                    <td style={{padding:"12px",fontFamily:FFM,fontSize:15,color:LIGHT}}>{plot.size}</td>
                    <td style={{padding:"12px",fontFamily:FF,fontSize:18,color:INK}}>{plot.price}</td>
                    <td style={{padding:"12px"}}><ScoreRing pct={plot.suitability} size={36}/></td>
                    <td style={{padding:"12px"}}><StagePill stage={plot.stage}/></td>
                    <td style={{padding:"12px",borderRadius:"0 6px 6px 0"}}>
                      <button onClick={()=>setDetailPlot(detailPlot?.id===plot.id?null:plot)} style={{background:detailPlot?.id===plot.id?BG2:INK,border:`1px solid ${detailPlot?.id===plot.id?LIGHTER:"transparent"}`,borderRadius:99,padding:"4px 12px",fontSize:15,color:detailPlot?.id===plot.id?MID:WHITE,cursor:"pointer",fontFamily:FF}}>{detailPlot?.id===plot.id?"Close":"Open →"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {view==="kanban"&&(
            <div style={{display:"flex",gap:12,alignItems:"flex-start",overflowX:"auto",paddingBottom:20}}>
              {STAGES.map(stage=>{
                const sp=filtered.filter(p=>p.stage===stage);
                const c=STAGE_COLORS[stage];
                return(
                  <div key={stage} style={{width:200,flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,padding:"4px 0"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:c}}/>
                      <span style={{fontFamily:FF,fontSize:15,letterSpacing:"0.07em",textTransform:"uppercase",color:c,fontWeight:500}}>{stage}</span>
                      <span style={{fontFamily:FF,fontSize:15,color:LIGHT,marginLeft:"auto",background:BG2,borderRadius:99,padding:"1px 7px",border:`1px solid ${LIGHTER}`}}>{sp.length}</span>
                    </div>
                    {sp.map(plot=>(
                      <div key={plot.id} onClick={()=>setDetailPlot(detailPlot?.id===plot.id?null:plot)} style={{background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:6,padding:"12px",marginBottom:6,cursor:"pointer"}}>
                        <div style={{fontWeight:500,fontSize:15,color:INK,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:FF}}>{plot.name}</div>
                        <div style={{fontFamily:FF,fontSize:15,color:LIGHT,marginBottom:8}}>{plot.region} · {plot.size}</div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <span style={{fontFamily:FF,fontSize:15,color:INK}}>{plot.price}</span>
                          <ScoreRing pct={plot.suitability} size={32}/>
                        </div>
                      </div>
                    ))}
                    {sp.length===0&&<div style={{border:`1px dashed ${LIGHTER}`,borderRadius:6,padding:"18px",textAlign:"center",color:LIGHT,fontSize:15,fontFamily:FF}}>Empty</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {detailPlot&&(
          <div style={{width:360,flexShrink:0,overflow:"hidden",animation:"slideIn 0.18s ease both"}}>
            <DetailPanel plot={detailPlot} onClose={()=>setDetailPlot(null)} onToggleFav={toggleFav}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAP FILTERS (listings) ───────────────────────────────────────────────────
function parseListingPriceEuro(plot) {
  if (!plot?.price) return null;
  const n = parseInt(String(plot.price).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function parseListingAreaSqm(plot) {
  if (!plot?.area) return null;
  const t = String(plot.area).toLowerCase();
  const isHa = /\bha\b/.test(t);
  const m = t.match(/([\d][\d.,]*)/);
  if (!m) return null;
  const raw = m[1];
  let num = parseFloat(raw.includes(",") && raw.includes(".") ? raw.replace(/,/g, "") : raw.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(num)) num = parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(num)) return null;
  return isHa ? num * 10000 : num;
}

function blobSignals(plot) {
  return JSON.stringify(plot.signals || []).toLowerCase();
}

/** Portugal areas — no country selector; focus on province/region. */
const PT_AREA_KEYWORDS = {
  all: null,
  norte: ["porto", "braga", "guimarães", "guimaraes", "viana", "barcelos", "famalicão", "matosinhos", "gaia", "minho", "douro valley", "chaves"],
  centro: ["coimbra", "aveiro", "leiria", "viseu", "guarda", "covilhã", "figueira"],
  lisboa: ["lisboa", "lisbon", "sintra", "cascais", "oeiras", "amadora", "setúbal", "setubal", "municipalidade de lisboa"],
  alentejo: ["alentejo", "évora", "evora", "beja", "portalegre", "mértola", "mertola", "grândola", "grandola", "comporta"],
  algarve: ["algarve", "faro", "lagos", "tavira", "portimão", "loulé"],
  madeira_acores: ["madeira", "azores", "açores", "faial", "ponta delgada"],
};

/** Canonical PDM keys (RJIGT-style). `group` drives filter UI sections. */
const PDM_KEY_META = {
  AGRICOLA: { group: "rustic", label: "Agricultural" },
  AGRICOLA_PRODUCAO: { group: "rustic", label: "Agric. production" },
  AGRICOLA_OUTROS: { group: "rustic", label: "Other agric." },
  FLORESTAL_PRODUCAO: { group: "rustic", label: "Forest (prod.)" },
  FLORESTAL_CONSERVACAO: { group: "rustic", label: "Forest (cons.)" },
  USO_MULTIPLO: { group: "rustic", label: "Mixed agri–forest" },
  NATURAL: { group: "rustic", label: "Natural" },
  PARQUE_NATURAL: { group: "rustic", label: "Nat. park" },
  CULTURAL: { group: "rustic", label: "Cultural" },
  RECURSOS_GEOLOGICOS: { group: "rustic", label: "Geol. resources" },
  EQUIPAMENTOS_RURAL: { group: "rustic", label: "Rural equip." },
  TURISTICO: { group: "rustic", label: "Tourism (rural)" },
  AGLOMERADO_RURAL: { group: "rustic", label: "Rural cluster" },
  EDIFICACAO_DISPERSA: { group: "rustic", label: "Dispersed build." },
  CENTRAL: { group: "urban", label: "Central urban" },
  HABITACIONAL: { group: "urban", label: "Housing zone" },
  BAIXA_DENSIDADE: { group: "urban", label: "Low density" },
  ATIVIDADES_ECONOMICAS: { group: "urban", label: "Economic" },
  VERDE_URBANO: { group: "urban", label: "Urban green" },
  EQUIPAMENTO: { group: "urban", label: "Public equip." },
  TURISTICO_URBANO: { group: "urban", label: "Tourism (urban)" },
  RESIDENCIAL: { group: "urban", label: "Residential" },
  MISTO: { group: "urban", label: "Mixed use" },
};

const PDM_RUSTIC_KEYS = Object.entries(PDM_KEY_META)
  .filter(([, m]) => m.group === "rustic")
  .map(([k]) => k);
const PDM_URBAN_KEYS = Object.entries(PDM_KEY_META)
  .filter(([, m]) => m.group === "urban")
  .map(([k]) => k);

/**
 * First matching rule wins (most specific rules first).
 * Normalizes município phrasing toward canonical keys.
 */
const PDM_NORMALIZATION_RULES = [
  { key: "PARQUE_NATURAL", test: (s) => /parque natural|natural park/i.test(s) },
  {
    key: "NATURAL",
    test: (s) =>
      /espa[çc]o natural|solo natural|zona verde de prote[çc][aã]o|^natural\b/i.test(s) && !/parque natural/i.test(s),
  },
  {
    key: "TURISTICO_URBANO",
    test: (s) =>
      (/solo urbano|espa[çc]o urbano/i.test(s) || /uso especial/i.test(s)) &&
      /tur[ií]st|tourism|turismo/i.test(s) &&
      !/solo r[úu]stico/i.test(s),
  },
  {
    key: "TURISTICO",
    test: (s) =>
      /tur[ií]st|tourism|turismo|vocat.*tur|ocupa[çc][aã]o tur|ocupa[çc][aã]o tur[ií]stica|rural tourism/i.test(s),
  },
  { key: "AGRICOLA_PRODUCAO", test: (s) => /agr[ií]cola de produ[çc][aã]o|agricultural production/i.test(s) },
  { key: "AGRICOLA_OUTROS", test: (s) => /outros espa[çc]os agr[ií]colas|other agricultural/i.test(s) },
  {
    key: "FLORESTAL_CONSERVACAO",
    test: (s) =>
      /florest(al)?[^.,]{0,32}conserv|conserv[ãa]o forest|espa[çc]o florestal tipo\s*ii\b/i.test(s),
  },
  {
    key: "FLORESTAL_PRODUCAO",
    test: (s) => /florest|forest|silvi|espa[çc]o florestal|tipo\s*i\b/i.test(s),
  },
  {
    key: "USO_MULTIPLO",
    test: (s) => /uso m[úu]ltiplo|multiplo|agroflorest|misto agr[ií]cola e florest/i.test(s),
  },
  { key: "CULTURAL", test: (s) => /espa[çc]o cultural|patrim[óo]nio|cultural heritage/i.test(s) },
  {
    key: "RECURSOS_GEOLOGICOS",
    test: (s) => /recursos geol|geol[óo]gic|quarr|mining|minera[çc][aã]o/i.test(s),
  },
  { key: "EQUIPAMENTOS_RURAL", test: (s) => /equipamentos r[úu]st|rural equipment|estruturas r[úu]st/i.test(s) },
  { key: "AGLOMERADO_RURAL", test: (s) => /aglomerado r[úu]stico|rural settlement/i.test(s) },
  { key: "EDIFICACAO_DISPERSA", test: (s) => /edifica[çc][aã]o dispersa|dispersed building/i.test(s) },
  { key: "CENTRAL", test: (s) => /espa[çc]o central|central urban|\bcentral\b/i.test(s) },
  { key: "HABITACIONAL", test: (s) => /habitacional|housing(?!.*misto)/i.test(s) },
  { key: "BAIXA_DENSIDADE", test: (s) => /baixa densidade|low-density|low density/i.test(s) },
  {
    key: "ATIVIDADES_ECONOMICAS",
    test: (s) => /atividades econ|industrial|comercial|zona industrial/i.test(s),
  },
  { key: "VERDE_URBANO", test: (s) => /verde urbano|urban green/i.test(s) },
  {
    key: "EQUIPAMENTO",
    test: (s) => /uso especial[^.]{0,30}equipamento|equipamento coletivo|public facilit/i.test(s),
  },
  { key: "RESIDENCIAL", test: (s) => /residencial/i.test(s) && !/\bmisto\b/i.test(s) },
  { key: "MISTO", test: (s) => /\bmisto\b|mixed use|uso misto/i.test(s) },
  { key: "AGRICOLA", test: (s) => /agr[ií]cola|agricultural|solo r[úu]stico[^.]*agr/i.test(s) },
];

function normalizePdmZoneKey(plot) {
  const raw = String(plot?.technical?.["PDM zone"] || plot?.pdm || "").trim();
  if (!raw || raw === "—" || raw === "-") return null;
  const s = raw.toLowerCase();
  for (const rule of PDM_NORMALIZATION_RULES) {
    if (rule.test(s)) return rule.key;
  }
  return null;
}

const USE_CATEGORY_ORDER = ["LIVING", "TOURISM", "FARMING", "FORESTRY", "SOLAR", "CONSERVATION"];

const USE_CATEGORIES = {
  LIVING: {
    label: "Living",
    icon: "🏠",
    primary: ["RESIDENCIAL", "HABITACIONAL", "CENTRAL", "BAIXA_DENSIDADE"],
    secondary: ["MISTO", "AGLOMERADO_RURAL"],
    conditional: ["EDIFICACAO_DISPERSA"],
  },
  TOURISM: {
    label: "Tourism",
    icon: "✦",
    primary: ["TURISTICO", "TURISTICO_URBANO", "CULTURAL"],
    secondary: ["MISTO", "USO_MULTIPLO", "AGLOMERADO_RURAL"],
    conditional: ["FLORESTAL_CONSERVACAO", "NATURAL"],
  },
  FARMING: {
    label: "Farming",
    icon: "🌾",
    primary: ["AGRICOLA", "AGRICOLA_PRODUCAO", "AGRICOLA_OUTROS"],
    secondary: ["USO_MULTIPLO"],
    conditional: [],
  },
  FORESTRY: {
    label: "Forestry",
    icon: "🌲",
    primary: ["FLORESTAL_PRODUCAO", "FLORESTAL_CONSERVACAO"],
    secondary: ["USO_MULTIPLO"],
    conditional: [],
  },
  SOLAR: {
    label: "Solar",
    icon: "◆",
    primary: ["RECURSOS_GEOLOGICOS"],
    secondary: ["AGRICOLA", "FLORESTAL_PRODUCAO", "USO_MULTIPLO"],
    conditional: [],
  },
  CONSERVATION: {
    label: "Conservation",
    icon: "○",
    primary: ["NATURAL", "PARQUE_NATURAL", "FLORESTAL_CONSERVACAO"],
    secondary: ["CULTURAL"],
    conditional: [],
  },
};

function pdmKeysSuggestedForUses(useIds) {
  const set = new Set();
  if (!useIds || useIds.length === 0) return set;
  for (const id of useIds) {
    const u = USE_CATEGORIES[id];
    if (!u) continue;
    u.primary.forEach((k) => set.add(k));
    u.secondary.forEach((k) => set.add(k));
  }
  return set;
}

function plotHasRuinSignal(plot) {
  return /\bruin\b/i.test(`${plot?.name || ""} ${plot?.tag || ""}`);
}

function plotUseBlob(plot) {
  const pdm = String(plot?.technical?.["PDM zone"] || plot?.pdm || "");
  return `${plot?.name || ""} ${plot?.tag || ""} ${JSON.stringify(plot?.signals || [])} ${pdm}`.toLowerCase();
}

function plotMatchesUseFallback(plot, useId) {
  const blob = plotUseBlob(plot);
  const rustic = plot?.type === "Rustic";
  switch (useId) {
    case "LIVING":
      return (
        plot?.type === "Urban" ||
        /residencial|habita|moradia|constru|edific|\bruin\b|housing/i.test(blob)
      );
    case "TOURISM":
      return /tour|turismo|tur[ií]st|eco lodge|glamping|hotel|hospitality|quinta/i.test(blob);
    case "FARMING":
      return rustic && (/agr[ií]cola|vineyard|olive|quinta|farm/i.test(blob) || /solo r[úu]stico/i.test(blob));
    case "FORESTRY":
      return /florest|cork|silvi|woodland/i.test(blob);
    case "SOLAR":
      return /solar|fotovolta|photovoltaic|pv\b|renewable/i.test(blob);
    case "CONSERVATION":
      return /conserva|parque natural|natural park|rewild|natura|proteg ida|espa[çc]o natural/i.test(blob);
    default:
      return false;
  }
}

function plotMatchesSingleUse(plot, useId) {
  const def = USE_CATEGORIES[useId];
  if (!def) return false;
  const key = normalizePdmZoneKey(plot);
  const allow = new Set([...def.primary, ...def.secondary]);
  const hasRuin = plotHasRuinSignal(plot);
  if (key) {
    if (allow.has(key)) return true;
    if (hasRuin && def.conditional?.length && def.conditional.includes(key)) return true;
  }
  return plotMatchesUseFallback(plot, useId);
}

function plotMatchesUseCategories(plot, useIds) {
  if (!useIds || useIds.length === 0) return true;
  return useIds.some((id) => plotMatchesSingleUse(plot, id));
}

/** Older explorer state used `useIntent` strings; map to new USE keys when `useCategories` is absent. */
function legacyUseIntentToCategories(intent) {
  if (!intent || intent === "all") return [];
  if (intent === "tourism") return ["TOURISM"];
  if (intent === "construction") return ["LIVING"];
  if (intent === "agriculture") return ["FARMING", "FORESTRY"];
  return [];
}

function resolveUseFilterIds(f) {
  if (Array.isArray(f.useCategories) && f.useCategories.length > 0) return f.useCategories;
  return legacyUseIntentToCategories(f?.useIntent);
}

function parseOptionalEuro(input) {
  if (input == null || String(input).trim() === "") return null;
  const n = parseInt(String(input).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function parseOptionalSqm(input) {
  if (input == null || String(input).trim() === "") return null;
  const n = parseInt(String(input).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function plotMatchesPdmTags(plot, tagIds) {
  if (!tagIds || tagIds.length === 0) return true;
  const raw = String(plot?.technical?.["PDM zone"] || plot?.pdm || "");
  const s = raw.toLowerCase();
  const key = normalizePdmZoneKey(plot);
  return tagIds.some((id) => {
    if (key === id) return true;
    const rule = PDM_NORMALIZATION_RULES.find((r) => r.key === id);
    return rule ? rule.test(s) : false;
  });
}

/** Horizontal listing filters (client-side). */
function passesListingMapFilters(plot, f) {
  if (!f || typeof f !== "object") return true;

  if (!plotMatchesUseCategories(plot, resolveUseFilterIds(f))) return false;
  if (!plotMatchesPdmTags(plot, f.pdmTags)) return false;

  const pdmLower = String(plot.technical?.["PDM zone"] || "").toLowerCase();
  const ran = String(plot.technical?.RAN || plot.ran || "").toLowerCase();
  const ren = String(plot.technical?.REN || plot.ren || "").toLowerCase();
  const isRanClear = !ran || ran === "no" || ran === "—" || /^n[oô]$/i.test(ran);
  const isRenClear = !ren || ren === "no" || ren === "—" || /^n[oô]$/i.test(ren);

  if (f.buildableOnly) {
    if (!isRanClear || !isRenClear) return false;
    if (/partial|parcial/.test(ran) || /partial|parcial/.test(ren)) return false;
  }
  if (f.excludeRAN && !isRanClear) return false;
  if (f.excludeREN && !isRenClear) return false;
  if (f.excludeProtected) {
    const nameLow = (plot.name || "").toLowerCase();
    if (!isRenClear) return false;
    if (/parque natural|natural park|proteg|património|natura|zpe|sic|icnf/i.test(pdmLower + nameLow)) return false;
  }

  const lt = f.landType || "all";
  if (lt === "rustic" && plot.type !== "Rustic") return false;
  if (lt === "urban" && plot.type !== "Urban") return false;
  if (lt === "mixed") {
    if (!/\bmisto\b|mixed|uso múltiplo|múltiplo/i.test(pdmLower)) return false;
  }

  const ru = f.ruin || "all";
  const hasRuin = /\bruin\b/i.test(`${plot.name || ""} ${plot.tag || ""}`);
  if (ru === "has" && !hasRuin) return false;
  if (ru === "none" && hasRuin) return false;

  const prov = f.province || "all";
  if (prov !== "all" && PT_AREA_KEYWORDS[prov]) {
    const r = `${plot.region || ""} ${plot.name || ""}`.toLowerCase();
    const keys = PT_AREA_KEYWORDS[prov];
    if (!keys.some((k) => r.includes(k))) return false;
  }

  const euros = parseListingPriceEuro(plot);
  const minP = parseOptionalEuro(f.priceMin);
  const maxP = parseOptionalEuro(f.priceMax);
  if (minP != null && (euros == null || euros < minP)) return false;
  if (maxP != null && (euros == null || euros > maxP)) return false;

  const sqm = parseListingAreaSqm(plot);
  const minA = parseOptionalSqm(f.areaMin);
  const maxA = parseOptionalSqm(f.areaMax);
  if (minA != null && (sqm == null || sqm < minA)) return false;
  if (maxA != null && (sqm == null || sqm > maxA)) return false;

  if (f.fire && f.fire !== "Any") {
    const fr = String(plot.technical?.["Fire risk"] || "").toLowerCase();
    if (f.fire === "Low" && fr && !fr.includes("low") && !fr.includes("very low")) return false;
    if (f.fire === "Moderate" && !fr.includes("moder")) return false;
    if (f.fire === "High" && !fr.includes("high")) return false;
  }
  if (f.ren && f.ren !== "Any") {
    if (f.ren === "No REN" && !isRenClear) return false;
    if (f.ren === "REN partial" && !/partial|parcial|border|buffer/i.test(ren)) return false;
  }
  if (f.ran && f.ran !== "Any") {
    if (f.ran === "No RAN" && !isRanClear) return false;
    if (f.ran === "RAN partial" && !/partial|parcial|720/i.test(ran)) return false;
  }
  if (f.score && f.score !== "Any") {
    const min = { "60+": 60, "75+": 75, "85+": 85, "90+": 90 }[f.score];
    if (min != null && (plot.score || 0) < min) return false;
  }
  return true;
}

const EMPTY_LISTING_MAP_FILTERS = {
  useIntent: "all",
  useCategories: [],
  pdmTags: [],
  buildableOnly: false,
  excludeRAN: false,
  excludeREN: false,
  excludeProtected: false,
  landType: "all",
  ruin: "all",
  province: "all",
  priceMin: "",
  priceMax: "",
  areaMin: "",
  areaMax: "",
  fire: "Any",
  ren: "Any",
  ran: "Any",
  score: "Any",
  sortBy: "match",
};

function listingFiltersActive(f) {
  if (!f || typeof f !== "object") return false;
  const d = EMPTY_LISTING_MAP_FILTERS;
  const useActive =
    (Array.isArray(f.useCategories) && f.useCategories.length > 0) ||
    (f.useIntent && f.useIntent !== d.useIntent);
  return (
    useActive ||
    (f.pdmTags && f.pdmTags.length > 0) ||
    !!f.buildableOnly ||
    !!f.excludeRAN ||
    !!f.excludeREN ||
    !!f.excludeProtected ||
    (f.landType && f.landType !== d.landType) ||
    (f.ruin && f.ruin !== d.ruin) ||
    (f.province && f.province !== d.province) ||
    String(f.priceMin || "").trim() !== "" ||
    String(f.priceMax || "").trim() !== "" ||
    String(f.areaMin || "").trim() !== "" ||
    String(f.areaMax || "").trim() !== "" ||
    (f.fire && f.fire !== "Any") ||
    (f.ren && f.ren !== "Any") ||
    (f.ran && f.ran !== "Any") ||
    (f.score && f.score !== "Any")
  );
}

function ToggleRow({ label, on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 0",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: FF,
      }}
    >
      <span style={{ ...TC.label, color: MID, flex: 1, textAlign: "left" }}>{label}</span>
      <span
        style={{
          width: 36,
          height: 20,
          borderRadius: 99,
          background: on ? ORANGE : LIGHTER,
          position: "relative",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: WHITE,
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            transition: "left 0.15s",
          }}
        />
      </span>
    </button>
  );
}

function Segmented({ options, value, onChange, compact }) {
  return (
    <div style={{ display: "flex", background: SUBTLE, borderRadius: 8, padding: 3, border: `1px solid ${LIGHTER}`, gap: 2, flexWrap: "wrap" }}>
      {options.map(([v, lbl]) => (
        <button
          type="button"
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: compact ? "4px 10px" : "5px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontFamily: FF,
            fontSize: compact ? 11 : 12,
            fontWeight: value === v ? 600 : 500,
            background: value === v ? INK : "transparent",
            color: value === v ? WHITE : MID,
            whiteSpace: "nowrap",
          }}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}

/** Horizontal filter bar — PDM / use row + province; expand for restrictions, type, ruin, price, more. */
function MapFilters({ filters, setFilters, resultCount, totalCount }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [pdmOpen, setPdmOpen] = useState(false);
  const f = { ...EMPTY_LISTING_MAP_FILTERS, ...filters };

  function patch(p) {
    setFilters((prev) => ({ ...EMPTY_LISTING_MAP_FILTERS, ...prev, ...p }));
  }

  function togglePdmTag(id) {
    const cur = f.pdmTags || [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    patch({ pdmTags: next });
    if (next.length > cur.length) setPdmOpen(true);
  }

  function toggleUseCategory(id) {
    const cur = f.useCategories || [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    patch({ useCategories: next, useIntent: "all" });
  }

  function clearUseCategories() {
    patch({ useCategories: [], useIntent: "all" });
  }

  function clearAll() {
    setFilters({ ...EMPTY_LISTING_MAP_FILTERS });
    setMoreOpen(false);
    setPdmOpen(false);
  }

  return (
    <div style={{ flexShrink: 0, background: WHITE, borderBottom: `1px solid ${LIGHTER}` }}>
      {/* Row 1 — compact USE + province; PDM lives under More filters */}
      <div style={{ padding: "8px 12px 6px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: "1 1 280px" }}>
            <span style={{ ...TC.labelUC, color: LIGHT }}>Use</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => clearUseCategories()}
                style={{
                  padding: "3px 10px",
                  borderRadius: 99,
                  border: `1px solid ${!(f.useCategories || []).length ? INK : LIGHTER}`,
                  background: !(f.useCategories || []).length ? INK : WHITE,
                  color: !(f.useCategories || []).length ? WHITE : MID,
                  fontSize: 11,
                  fontFamily: FF,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                All
              </button>
              {USE_CATEGORY_ORDER.map((id) => {
                const u = USE_CATEGORIES[id];
                const on = (f.useCategories || []).includes(id);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => toggleUseCategory(id)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 99,
                      border: `1px solid ${on ? ORANGE : LIGHTER}`,
                      background: on ? `${ORANGE}12` : WHITE,
                      color: on ? ORANGE : MID,
                      fontSize: 11,
                      fontFamily: FF,
                      fontWeight: on ? 600 : 500,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ marginRight: 4 }} aria-hidden>
                      {u.icon}
                    </span>
                    {u.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 140 }}>
            <span style={{ ...TC.labelUC, color: LIGHT }}>Area (Portugal)</span>
            <select
              value={f.province || "all"}
              onChange={(e) => patch({ province: e.target.value })}
              style={{
                border: `1px solid ${LIGHTER}`,
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: FF,
                color: INK,
                background: BG2,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">All areas</option>
              <option value="norte">Norte</option>
              <option value="centro">Centro</option>
              <option value="lisboa">Lisboa & Tagus</option>
              <option value="alentejo">Alentejo</option>
              <option value="algarve">Algarve</option>
              <option value="madeira_acores">Madeira & Azores</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              style={{
                border: `1px solid ${LIGHTER}`,
                background: moreOpen ? SUBTLE : WHITE,
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontFamily: FF,
                color: MID,
                cursor: "pointer",
              }}
            >
              {moreOpen ? "▲ Fewer filters" : "▼ More filters"}
            </button>
            <button
              type="button"
              onClick={clearAll}
              style={{
                border: "none",
                background: "none",
                padding: "6px 8px",
                fontSize: 12,
                fontFamily: FF,
                color: ACCENT,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear all
            </button>
            <div style={{ ...TC.mono, color: LIGHT, padding: "6px 0", whiteSpace: "nowrap" }}>
              {resultCount}
              {totalCount != null && totalCount !== resultCount ? ` / ${totalCount}` : ""}
            </div>
          </div>
        </div>
      </div>

      {moreOpen && (
        <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${LIGHTER}`, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 10 }}>
            <div>
              <span style={{ ...TC.labelUC, color: LIGHT, display: "block", marginBottom: 6 }}>Restrictions</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ToggleRow label="Buildable only" on={!!f.buildableOnly} onToggle={() => patch({ buildableOnly: !f.buildableOnly })} />
                <ToggleRow label="Exclude RAN" on={!!f.excludeRAN} onToggle={() => patch({ excludeRAN: !f.excludeRAN })} />
                <ToggleRow label="Exclude REN" on={!!f.excludeREN} onToggle={() => patch({ excludeREN: !f.excludeREN })} />
                <ToggleRow label="Exclude protected" on={!!f.excludeProtected} onToggle={() => patch({ excludeProtected: !f.excludeProtected })} />
              </div>
            </div>
            <div>
              <span style={{ ...TC.labelUC, color: LIGHT, display: "block", marginBottom: 6 }}>Land type</span>
              <Segmented
                options={[
                  ["all", "All"],
                  ["rustic", "Rustic"],
                  ["urban", "Urban"],
                  ["mixed", "Mixed"],
                ]}
                value={f.landType || "all"}
                onChange={(v) => patch({ landType: v })}
              />
              <span style={{ ...TC.labelUC, color: LIGHT, display: "block", marginTop: 10, marginBottom: 6 }}>Ruin</span>
              <Segmented
                options={[
                  ["all", "All"],
                  ["has", "Has ruin"],
                  ["none", "No ruin"],
                ]}
                value={f.ruin || "all"}
                onChange={(v) => patch({ ruin: v })}
              />
            </div>
            <div>
              <span style={{ ...TC.labelUC, color: LIGHT, display: "block", marginBottom: 6 }}>Price (€)</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min"
                  value={f.priceMin || ""}
                  onChange={(e) => patch({ priceMin: e.target.value })}
                  style={{ flex: 1, border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 8px", fontSize: 12, fontFamily: FFM }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max"
                  value={f.priceMax || ""}
                  onChange={(e) => patch({ priceMax: e.target.value })}
                  style={{ flex: 1, border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 8px", fontSize: 12, fontFamily: FFM }}
                />
              </div>
              <span style={{ ...TC.labelUC, color: LIGHT, display: "block", marginTop: 10, marginBottom: 6 }}>Size (m²)</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min"
                  value={f.areaMin || ""}
                  onChange={(e) => patch({ areaMin: e.target.value })}
                  style={{ flex: 1, border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 8px", fontSize: 12, fontFamily: FFM }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max"
                  value={f.areaMax || ""}
                  onChange={(e) => patch({ areaMax: e.target.value })}
                  style={{ flex: 1, border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 8px", fontSize: 12, fontFamily: FFM }}
                />
              </div>
            </div>
            <div>
              <span style={{ ...TC.labelUC, color: LIGHT, display: "block", marginBottom: 6 }}>Sort</span>
              <select
                value={f.sortBy || "match"}
                onChange={(e) => patch({ sortBy: e.target.value })}
                style={{ width: "100%", border: `1px solid ${LIGHTER}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: FF, background: BG2 }}
              >
                <option value="match">Match (search order)</option>
                <option value="score-desc">Score · high first</option>
                <option value="price-asc">Price · low first</option>
                <option value="price-desc">Price · high first</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "flex-end",
              padding: "8px 0 2px",
              borderTop: `1px solid ${LIGHTER}`,
            }}
          >
            {[
              { key: "fire", label: "Fire", options: ["Any", "Low", "Moderate", "High"] },
              { key: "ren", label: "REN", options: ["Any", "No REN", "REN partial"] },
              { key: "ran", label: "RAN", options: ["Any", "No RAN", "RAN partial"] },
              { key: "score", label: "Score", options: ["Any", "60+", "75+", "85+", "90+"] },
            ].map((blk) => (
              <div key={blk.key} style={{ minWidth: 0 }}>
                <div style={{ ...TC.labelUC, color: LIGHT, marginBottom: 4, fontSize: 10 }}>{blk.label}</div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {blk.options.map((o) => (
                    <button
                      type="button"
                      key={o}
                      onClick={() => patch({ [blk.key]: f[blk.key] === o && o !== "Any" ? "Any" : o })}
                      style={{
                        background: f[blk.key] === o ? INK : BG2,
                        border: `1px solid ${f[blk.key] === o ? INK : LIGHTER}`,
                        borderRadius: 99,
                        padding: "2px 8px",
                        fontSize: 10,
                        color: f[blk.key] === o ? WHITE : MID,
                        cursor: "pointer",
                        fontFamily: FF,
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 2 }}>
            <button
              type="button"
              onClick={() => setPdmOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                border: `1px solid ${LIGHTER}`,
                background: pdmOpen ? SUBTLE : WHITE,
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                fontFamily: FF,
                textAlign: "left",
                gap: 12,
              }}
            >
              <span style={{ ...TC.labelUC, color: INK, letterSpacing: "0.05em", fontSize: 10 }}>
                Zoning · PDM classes
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FF,
                  fontSize: 11,
                  color: LIGHT,
                  flexShrink: 0,
                }}
              >
                {(f.pdmTags || []).length > 0 ? (
                  <span style={{ color: ORANGE, fontWeight: 600 }}>{(f.pdmTags || []).length} on</span>
                ) : (
                  <span>Optional</span>
                )}
                <span style={{ color: MID, fontSize: 12 }} aria-hidden>
                  {pdmOpen ? "▴" : "▾"}
                </span>
              </span>
            </button>
            {pdmOpen && (
              <div style={{ marginTop: 8 }}>
                <p
                  style={{
                    fontFamily: FF,
                    fontSize: 10,
                    color: LIGHT,
                    margin: "0 0 8px",
                    lineHeight: 1.45,
                  }}
                  title="Municipal plan land-use classes (RJIGT-style). Dashed border = suggested for your current Use filters."
                >
                  Dashed border = suggested from your Use filters. Scroll for all classes.
                </p>
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    padding: 8,
                    border: `1px solid ${LIGHTER}`,
                    borderRadius: 8,
                    background: BG2,
                  }}
                >
                  {["rustic", "urban"].map((group) => {
                    const keys = group === "rustic" ? PDM_RUSTIC_KEYS : PDM_URBAN_KEYS;
                    const title = group === "rustic" ? "Solo Rústico" : "Solo Urbano";
                    const suggested = pdmKeysSuggestedForUses(f.useCategories || []);
                    const useOn = (f.useCategories || []).length > 0;
                    return (
                      <div key={group} style={{ marginBottom: keys.length ? 10 : 0 }}>
                        <span
                          style={{
                            ...TC.labelUC,
                            color: MID,
                            display: "block",
                            marginBottom: 6,
                            fontSize: 10,
                          }}
                        >
                          {title}
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {keys.map((key) => {
                            const meta = PDM_KEY_META[key];
                            if (!meta) return null;
                            const on = (f.pdmTags || []).includes(key);
                            const sug = useOn && suggested.has(key);
                            return (
                              <button
                                type="button"
                                key={key}
                                onClick={() => togglePdmTag(key)}
                                title={key}
                                style={{
                                  padding: "4px 9px",
                                  borderRadius: 99,
                                  border: `1px ${sug && !on ? "dashed" : "solid"} ${on ? ORANGE : LIGHTER}`,
                                  background: on ? `${ORANGE}12` : WHITE,
                                  color: on ? ORANGE : MID,
                                  fontSize: 11,
                                  fontFamily: FF,
                                  fontWeight: on ? 600 : 500,
                                  cursor: "pointer",
                                }}
                              >
                                {meta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PLOT CARD ─────────────────────────────────────────────────────────────────
function PlotCard({p,activePin,setActivePin,upgraded,onUpgrade,onAddToProject,inProject,onOpenListing}){
  const isActive=activePin===p.id;
  const v=VERDICT[p.aiVerdict];
  return(
    <div style={{background:isActive?`${ORANGE}04`:WHITE,border:`1px solid ${isActive?ORANGE:LIGHTER}`,borderRadius:6,marginBottom:8,overflow:"hidden",transition:"all 0.15s",animation:"fadeIn 0.25s ease both"}}>
      <div style={{height:110,background:BG2,position:"relative",cursor:"pointer",overflow:"hidden"}} onClick={()=>onOpenListing(p.id)}>
        <PlotImage plot={p} type={p.type} index={0}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(17,17,16,0.4) 100%)"}}/>
        <div style={{position:"absolute",bottom:8,left:10}}>
          <span style={{background:WHITE,color:v.color,borderRadius:99,padding:"2px 8px",...TP.body,fontWeight:600,border:`1px solid ${v.color}30`}}>{v.label}</span>
        </div>
        <div style={{position:"absolute",top:8,right:8,background:"rgba(17,17,16,0.7)",borderRadius:6,padding:"2px 8px",...TP.body,color:WHITE,fontWeight:600}}>{p.score}</div>
      </div>
      <div style={{padding:"10px 12px 9px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6,marginBottom:6}}>
          <div style={{minWidth:0}}>
            <div style={{...TP.mono,color:ORANGE,marginBottom:2,letterSpacing:"0.06em",fontWeight:600}}>{p.id}</div>
            <div style={{...TP.body,fontWeight:600,color:INK}}>{p.region}</div>
            <div style={{...TP.secondary,marginTop:2}}>{p.area} · {p.tag}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
            <div style={{...TP.body,fontWeight:700,color:INK}}>{p.price}</div>
            <button type="button" onClick={()=>onAddToProject(p.id)} style={{background:inProject?`${GREEN}0f`:SUBTLE,border:`1px solid ${inProject?`${GREEN}30`:LIGHTER}`,borderRadius:99,padding:"3px 10px",...TP.label,color:inProject?GREEN:MID,cursor:"pointer",fontWeight:700}}>{inProject?"✓ Saved":"+ Save"}</button>
          </div>
        </div>
        <div style={{background:SUBTLE,borderRadius:8,padding:"8px 10px",...TP.secondary,lineHeight:1.55,marginBottom:8,border:`1px solid ${LIGHTER}`}}>
          <div style={{...TP.labelUC,color:ORANGE,marginBottom:4}}>AI Verdict</div>
          {p.aiSummary}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button type="button" onClick={()=>onOpenListing(p.id)} style={{flex:2,background:INK,border:"none",borderRadius:99,padding:"7px 0",...TP.body,fontWeight:600,color:WHITE,cursor:"pointer"}}>View listing →</button>
          {!upgraded&&(
            <button type="button" onClick={onUpgrade} style={{flex:1,background:`${ORANGE}0f`,border:`1px solid ${ORANGE}30`,borderRadius:99,padding:"7px 0",...TP.body,color:ORANGE,cursor:"pointer",fontWeight:600}}>Unlock</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CADASTRE SVG MAP (authentic survey style) ────────────────────────────────
function CadastreMapSVG({ selectedId, onParcelClick, highlightListed }) {
  // Realistic cadastre parcel network — irregular polygons, shared boundaries
  const parcels = [
    // Row A — top strip
    { id:"CAD-001", ref:"PT-SB-001", zone:"Rústico",  pdm:"Espaço Agrícola",   area:"2 340 m²", owner:"Private", listed:true,  plotId:"PT-0182", score:94, verdict:"great_match",
      pts:"12,8 34,6 40,10 38,22 14,24" },
    { id:"CAD-002", ref:"PT-SB-002", zone:"Rústico",  pdm:"Espaço Florestal",  area:"1 820 m²", owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"40,10 58,8 62,18 38,22" },
    { id:"CAD-003", ref:"PT-OB-005", zone:"Urbano",   pdm:"Residencial",       area:"1 200 m²", owner:"Private", listed:true,  plotId:"PT-0441", score:88, verdict:"good_match",
      pts:"62,8 80,6 84,16 64,20 62,18" },
    { id:"CAD-004", ref:"PT-VC-018", zone:"Urbano",   pdm:"Misto",             area:"980 m²",   owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"80,6 96,8 98,18 84,16" },

    // Row B
    { id:"CAD-005", ref:"PT-SB-003", zone:"RAN",      pdm:"Reserva Agrícola",  area:"4 200 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"8,24 14,24 38,22 36,38 10,40" },
    { id:"CAD-006", ref:"PT-SB-004", zone:"Rústico",  pdm:"Agro-Florestal",    area:"3 100 m²", owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"14,24 38,22 62,18 58,36 16,38" },
    { id:"CAD-007", ref:"PT-OB-006", zone:"Urbano",   pdm:"Residencial",       area:"760 m²",   owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"62,18 64,20 84,16 82,32 62,36" },
    { id:"CAD-008", ref:"PT-OB-007", zone:"Urbano",   pdm:"Misto",             area:"890 m²",   owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"84,16 98,18 97,30 84,32" },
    { id:"CAD-009", ref:"PT-AL-008", zone:"REN",      pdm:"Proteção Ecológica",area:"5 200 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"97,18 106,16 108,30 97,30" },

    // Row C — mid block
    { id:"CAD-010", ref:"PT-AL-009", zone:"Rústico",  pdm:"Espaço Agrícola",   area:"8 500 m²", owner:"Private", listed:true,  plotId:"PT-1093", score:82, verdict:"good_match",
      pts:"10,40 36,38 34,56 8,58" },
    { id:"CAD-011", ref:"PT-AL-010", zone:"RAN",      pdm:"Reserva Agrícola",  area:"3 900 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"36,38 58,36 56,52 34,56" },
    { id:"CAD-012", ref:"PT-SB-005", zone:"Rústico",  pdm:"Espaço Florestal",  area:"2 800 m²", owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"58,36 62,36 82,32 80,50 58,52" },
    { id:"CAD-013", ref:"PT-EV-012", zone:"Urbano",   pdm:"Industrial",        area:"2 800 m²", owner:"Empresa", listed:true,  plotId:"PT-0677", score:71, verdict:"good_match",
      pts:"82,32 84,32 97,30 96,48 82,50" },
    { id:"CAD-014", ref:"PT-AL-011", zone:"REN",      pdm:"Proteção Ecológica",area:"7 200 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"97,30 108,30 108,48 96,48" },

    // Row D — lower-mid
    { id:"CAD-015", ref:"PT-GR-005", zone:"Rústico",  pdm:"Uso Múltiplo",      area:"6 700 m²", owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"8,58 34,56 32,72 6,74" },
    { id:"CAD-016", ref:"PT-GR-006", zone:"RAN",      pdm:"Reserva Agrícola",  area:"3 300 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"34,56 56,52 54,68 32,72" },
    { id:"CAD-017", ref:"PT-BE-015", zone:"Rústico",  pdm:"Área de Produção",  area:"42 000 m²",owner:"Private", listed:true,  plotId:"PT-2201", score:75, verdict:"consider",
      pts:"56,52 80,50 78,66 54,68" },
    { id:"CAD-018", ref:"PT-BE-016", zone:"Urbano",   pdm:"Residencial",       area:"18 000 m²",owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"80,50 96,48 95,64 78,66" },
    { id:"CAD-019", ref:"PT-BE-017", zone:"REN",      pdm:"Proteção Ecológica",area:"9 400 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"96,48 108,48 107,64 95,64" },

    // Row E — bottom
    { id:"CAD-020", ref:"PT-ME-020", zone:"Rústico",  pdm:"Espaço Natural",    area:"8 200 m²", owner:"Private", listed:true,  plotId:"PT-2201", score:75, verdict:"consider",
      pts:"6,74 32,72 30,88 4,90" },
    { id:"CAD-021", ref:"PT-ME-021", zone:"RAN",      pdm:"Reserva Agrícola",  area:"5 600 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"32,72 54,68 52,84 30,88" },
    { id:"CAD-022", ref:"PT-ME-022", zone:"Rústico",  pdm:"Agro-Florestal",    area:"12 000 m²",owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"54,68 78,66 76,82 52,84" },
    { id:"CAD-023", ref:"PT-EV-023", zone:"Rústico",  pdm:"Espaço Agrícola",   area:"9 400 m²", owner:"Private", listed:false, plotId:null, score:null, verdict:null,
      pts:"78,66 95,64 94,80 76,82" },
    { id:"CAD-024", ref:"PT-EV-024", zone:"REN",      pdm:"Proteção Ecológica",area:"7 200 m²", owner:"Estado",  listed:false, plotId:null, score:null, verdict:null,
      pts:"95,64 107,64 106,80 94,80" },
  ];

  // Zone fill palette — muted, authentic cadastre colours
  const ZF = {
    "Urbano":  { fill:"#e8dfc8", stroke:"#8a7a50" },
    "Rústico": { fill:"#d6e4c4", stroke:"#5a7a42" },
    "RAN":     { fill:"#f0e8b0", stroke:"#a08020" },
    "REN":     { fill:"#b8dce0", stroke:"#2a8a94" },
  };

  function centroid(pts) {
    const coords = pts.trim().split(" ").map(p => { const[x,y]=p.split(","); return {x:parseFloat(x),y:parseFloat(y)}; });
    return { x: coords.reduce((s,c)=>s+c.x,0)/coords.length, y: coords.reduce((s,c)=>s+c.y,0)/coords.length };
  }

  const VB = "0 0 114 96";

  return (
    <svg viewBox={VB} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
      style={{ display:"block", background:"#f5f0e8" }}>

      {/* Paper texture */}
      <defs>
        <filter id="paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
        <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#a08020" strokeWidth="0.4" opacity="0.4"/>
        </pattern>
        <pattern id="hatchREN" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2a8a94" strokeWidth="0.4" opacity="0.35"/>
        </pattern>
      </defs>

      {/* Aged paper background */}
      <rect width="114" height="96" fill="#f5f0e8"/>
      <rect width="114" height="96" fill="#e8e0d0" opacity="0.18"/>

      {/* Grid lines — faint blue-grey like graph paper */}
      {[0,10,20,30,40,50,60,70,80,90,100,110].map(x=>(
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="96" stroke="#b0aaa0" strokeWidth="0.18" opacity="0.5"/>
      ))}
      {[0,10,20,30,40,50,60,70,80,90].map(y=>(
        <line key={`h${y}`} x1="0" y1={y} x2="114" y2={y} stroke="#b0aaa0" strokeWidth="0.18" opacity="0.5"/>
      ))}

      {/* Fill parcels */}
      {parcels.map(p => {
        const zc = ZF[p.zone] || { fill:"#e0dbd0", stroke:"#888" };
        const sel = selectedId === p.id;
        const listed = p.listed && highlightListed;
        return (
          <polygon key={p.id+"fill"}
            points={p.pts.replace(/(\d+),(\d+)/g, "$1,$2")}
            fill={listed ? "#f5e8d0" : zc.fill}
            opacity={sel ? 0.96 : 0.88}
          />
        );
      })}

      {/* Hatch patterns for RAN/REN */}
      {parcels.filter(p=>p.zone==="RAN").map(p=>(
        <polygon key={p.id+"hatch"} points={p.pts} fill="url(#hatch)" opacity="0.7"/>
      ))}
      {parcels.filter(p=>p.zone==="REN").map(p=>(
        <polygon key={p.id+"hatch"} points={p.pts} fill="url(#hatchREN)" opacity="0.7"/>
      ))}

      {/* Borders — drawn AFTER fills so lines sit on top */}
      {parcels.map(p => {
        const zc = ZF[p.zone] || { fill:"#e0dbd0", stroke:"#888" };
        const sel = selectedId === p.id;
        const listed = p.listed && highlightListed;
        return (
          <polygon key={p.id+"border"}
            points={p.pts}
            fill="none"
            stroke={sel ? ORANGE : listed ? "#2563eb" : zc.stroke}
            strokeWidth={sel ? 0.9 : listed ? 0.7 : 0.45}
            strokeLinejoin="miter"
            onClick={()=>onParcelClick&&onParcelClick(p)}
            style={{ cursor:"pointer" }}
          />
        );
      })}

      {/* Listed highlight fill overlay */}
      {parcels.filter(p=>p.listed&&highlightListed).map(p=>(
        <polygon key={p.id+"listed"} points={p.pts}
          fill={ORANGE} opacity="0.08"
          onClick={()=>onParcelClick&&onParcelClick(p)}
          style={{ cursor:"pointer" }}
        />
      ))}

      {/* Selected parcel highlight */}
      {parcels.filter(p=>p.id===selectedId).map(p=>(
        <polygon key={p.id+"sel"} points={p.pts}
          fill={ORANGE} opacity="0.16"
          onClick={()=>onParcelClick&&onParcelClick(p)}
          style={{ cursor:"pointer" }}
        />
      ))}

      {/* Invisible hit targets — full parcel clickable */}
      {parcels.map(p=>(
        <polygon key={p.id+"hit"} points={p.pts}
          fill="transparent" stroke="none"
          onClick={()=>onParcelClick&&onParcelClick(p)}
          style={{ cursor:"pointer" }}
        />
      ))}

      {/* Cadastre reference labels */}
      {parcels.map(p => {
        const c = centroid(p.pts);
        const zc = ZF[p.zone] || { stroke:"#666" };
        const sel = selectedId === p.id;
        const listed = p.listed && highlightListed;
        return (
          <text key={p.id+"label"} x={c.x} y={c.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="1.55" fontFamily="'Courier New',monospace"
            fill={sel ? ORANGE : listed ? "#2563eb" : zc.stroke}
            fontWeight={sel||listed?"700":"400"}
            opacity={sel ? 1 : 0.75}
            pointerEvents="none">
            {p.ref}
          </text>
        );
      })}

      {/* Area labels — small, below ref */}
      {parcels.map(p => {
        const c = centroid(p.pts);
        const zc = ZF[p.zone] || { stroke:"#666" };
        return (
          <text key={p.id+"area"} x={c.x} y={c.y+2.4}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="1.2" fontFamily="'Courier New',monospace"
            fill={zc.stroke} opacity="0.55"
            pointerEvents="none">
            {p.area}
          </text>
        );
      })}

      {/* Listed dot markers */}
      {parcels.filter(p=>p.listed&&highlightListed).map(p => {
        const c = centroid(p.pts);
        const sel = selectedId === p.id;
        return (
          <g key={p.id+"pin"} onClick={()=>onParcelClick&&onParcelClick(p)} style={{cursor:"pointer"}}>
            <circle cx={c.x} cy={c.y-3.5} r={sel?1.8:1.4}
              fill={sel?ORANGE:"#2563eb"} stroke="white" strokeWidth="0.4"/>
          </g>
        );
      })}

      {/* Margin frame */}
      <rect x="2" y="2" width="110" height="92" fill="none" stroke="#8a8070" strokeWidth="0.5" opacity="0.5"/>
      <rect x="3.5" y="3.5" width="107" height="89" fill="none" stroke="#8a8070" strokeWidth="0.2" opacity="0.3"/>

      {/* Corner cross-hair marks */}
      {[[6,6],[108,6],[6,90],[108,90]].map(([x,y],i)=>(
        <g key={i} stroke="#6a6050" strokeWidth="0.35" opacity="0.6">
          <line x1={x-2} y1={y} x2={x+2} y2={y}/>
          <line x1={x} y1={y-2} x2={x} y2={y+2}/>
        </g>
      ))}

      {/* Scale bar */}
      <g transform="translate(6,86)">
        <rect x="0" y="0" width="16" height="1.8" fill="#6a6050" opacity="0.5"/>
        <rect x="0" y="0" width="8" height="1.8" fill="#6a6050" opacity="0.8"/>
        <text x="0" y="4.2" fontSize="1.4" fontFamily="'Courier New',monospace" fill="#6a6050" opacity="0.8">0</text>
        <text x="13.5" y="4.2" fontSize="1.4" fontFamily="'Courier New',monospace" fill="#6a6050" opacity="0.8">500m</text>
      </g>

      {/* North arrow */}
      <g transform="translate(104,10)">
        <line x1="0" y1="4" x2="0" y2="0" stroke="#6a6050" strokeWidth="0.5" opacity="0.8"/>
        <polygon points="-1,3 0,0 1,3" fill="#6a6050" opacity="0.8"/>
        <text x="0" y="6.5" textAnchor="middle" fontSize="1.6" fontFamily="'Courier New',monospace" fill="#6a6050" opacity="0.8">N</text>
      </g>

      {/* Zone legend — bottom right */}
      <g transform="translate(68,78)">
        <rect x="-1" y="-1" width="42" height="14" fill="#f5f0e8" opacity="0.88" stroke="#8a8070" strokeWidth="0.3"/>
        {[["Urbano","#e8dfc8","#8a7a50"],["Rústico","#d6e4c4","#5a7a42"],["RAN","#f0e8b0","#a08020"],["REN","#b8dce0","#2a8a94"]].map(([lbl,fill,stroke],i)=>(
          <g key={lbl} transform={`translate(2,${i*3+1.5})`}>
            <rect x="0" y="0" width="4.5" height="2.5" fill={fill} stroke={stroke} strokeWidth="0.3"/>
            <text x="6" y="2" fontSize="1.6" fontFamily="'Courier New',monospace" fill="#4a4030">{lbl}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ── BULK RESULT CARD (carousel) ───────────────────────────────────────────────
function BulkResultCard({plots, onOpenListing, onAddToProject, projectPlots, onQueueSaveMany}){
  const [idx, setIdx] = useState(0);
  const [savedAll, setSavedAll] = useState(false);
  const sorted = [...plots].sort((a,b)=>b.score-a.score);
  const p = sorted[idx];
  const inProj = projectPlots.includes(plotListingOpenId(p));

  return(
    <div style={{width:"100%",display:"flex",flexDirection:"column",gap:0,animation:"fadeIn 0.25s ease both"}}>

      {/* ── Header bar — area summary + save all ── */}
      <div style={{background:INK,borderRadius:"10px 10px 0 0",padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:26,height:26,borderRadius:6,background:ORANGE,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontFamily:FF,fontSize:14,color:WHITE}}>Y</span>
          </div>
          <div>
            <div style={{...T.label,color:WHITE,fontWeight:500}}>Area analysis — {sorted.length} plots scored</div>
            <div style={{...T.label,color:"rgba(255,255,255,0.4)",marginTop:1}}>{[...new Set(sorted.map(pl=>pl.region))].join(" · ")}</div>
          </div>
        </div>
        <button onClick={()=>{ onQueueSaveMany?onQueueSaveMany(sorted.map((pl)=>plotListingOpenId(pl))):sorted.forEach((pl)=>onAddToProject(plotListingOpenId(pl))); setSavedAll(true);}}
          style={{...T.label,padding:"5px 13px",borderRadius:99,border:`1px solid ${savedAll?GREEN+"60":"rgba(255,255,255,0.2)"}`,background:savedAll?`${GREEN}20`:"rgba(255,255,255,0.08)",color:savedAll?GREEN:"rgba(255,255,255,0.8)",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
          {savedAll?"✓ All saved":"✦ Save all to pipeline"}
        </button>
      </div>

      {/* ── Score tab strip — ranked plots ── */}
      <div style={{display:"flex",borderBottom:`1px solid ${LIGHTER}`,background:WHITE,overflowX:"auto",borderLeft:`1px solid ${LIGHTER}`,borderRight:`1px solid ${LIGHTER}`}}>
        {sorted.map((pl,i)=>{
          const col = pl.score>=85?GREEN:pl.score>=70?ACCENT:MID;
          const active = i===idx;
          return(
            <button key={pl.id} onClick={()=>setIdx(i)}
              style={{flex:1,minWidth:52,padding:"8px 4px",background:active?BG:WHITE,border:"none",borderRight:`1px solid ${LIGHTER}`,borderBottom:active?`2px solid ${ORANGE}`:"2px solid transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all 0.1s"}}>
              <div style={{fontSize:15,fontWeight:700,color:col,fontFamily:FF,lineHeight:1}}>{pl.score}</div>
              <div style={{...T.label,color:active?INK:LIGHT,fontSize:11}}>{pl.id.replace("PT-","")}</div>
            </button>
          );
        })}
      </div>

      {/* ── Full verdict for active plot — same as VerdictMessage ── */}
      <div style={{border:`1px solid ${LIGHTER}`,borderTop:"none",borderRadius:"0 0 10px 10px",overflow:"hidden"}}>
        <VerdictMessage
          p={p}
          projectPlots={projectPlots}
          onOpenListing={onOpenListing}
          handleAddToProject={onAddToProject}
          hideHeader={true}
        />
      </div>

      {/* ── Prev / next nav ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8,padding:"0 2px"}}>
        <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}
          style={{display:"flex",alignItems:"center",gap:5,...T.label,background:"none",border:"none",color:idx===0?LIGHTER:MID,cursor:idx===0?"default":"pointer",padding:0}}>
          ← Previous
        </button>
        <span style={{...T.label,color:LIGHT}}>{idx+1} of {sorted.length}</span>
        <button onClick={()=>setIdx(i=>Math.min(sorted.length-1,i+1))} disabled={idx===sorted.length-1}
          style={{display:"flex",alignItems:"center",gap:5,...T.label,background:"none",border:"none",color:idx===sorted.length-1?LIGHTER:MID,cursor:idx===sorted.length-1?"default":"pointer",padding:0}}>
          Next →
        </button>
      </div>
    </div>
  );
}


// ── CADASTRE SIDE PANEL ───────────────────────────────────────────────────────
function CadastreSidePanel({parcel, onClose, onAddToProject, inProject, onOpenListing, onAnalyse}){
  if(!parcel) return null;
  const zc = ZONE_COLORS[parcel.zone]||{fill:"#eee",stroke:"#aaa"};
  const v = parcel.verdict ? VERDICT[parcel.verdict] : null;
  return(
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:260,background:WHITE,borderLeft:`1px solid ${LIGHTER}`,zIndex:60,display:"flex",flexDirection:"column",animation:"slideInRight 0.2s ease both",boxShadow:"-4px 0 20px rgba(0,0,0,0.08)"}}>
      {/* Header */}
      <div style={{padding:"12px 14px",borderBottom:`1px solid ${LIGHTER}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontFamily:FFM,fontSize:11,color:ORANGE,letterSpacing:"0.07em",marginBottom:2}}>{parcel.ref}</div>
          <div style={{fontSize:13,fontWeight:500,color:INK,fontFamily:FF}}>{parcel.id}</div>
        </div>
        <button onClick={onClose} style={{width:24,height:24,borderRadius:"50%",border:`1px solid ${LIGHTER}`,background:BG,color:MID,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>

      {/* Zone badge + status */}
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${LIGHTER}`,display:"flex",gap:6,flexShrink:0}}>
        <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:zc.fill,color:zc.stroke,border:`1px solid ${zc.stroke}40`,fontFamily:FF,fontWeight:500}}>{parcel.zone}</span>
        {parcel.listed
          ? <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:`${ORANGE}15`,color:ORANGE,border:`1px solid ${ORANGE}30`,fontFamily:FF}}>For sale</span>
          : <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:BG2,color:MID,border:`1px solid ${LIGHTER}`,fontFamily:FF}}>Unlisted</span>
        }
        {v&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:`${v.color}15`,color:v.color,border:`1px solid ${v.color}25`,fontFamily:FF}}>{v.label}</span>}
      </div>

      {/* Data */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
        {[
          ["Area",       parcel.area],
          ["PDM zone",   parcel.pdm],
          ["Ownership",  parcel.owner],
          ["Cadastre ref", parcel.ref],
        ].map(([k,val])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${LIGHTER}`}}>
            <span style={{fontSize:11,color:LIGHT,fontFamily:FF}}>{k}</span>
            <span style={{fontSize:12,color:INK,fontFamily:FFM,textAlign:"right",maxWidth:140}}>{val}</span>
          </div>
        ))}

        {/* Score if listed */}
        {parcel.score&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${LIGHTER}`}}>
            <span style={{fontSize:11,color:LIGHT,fontFamily:FF}}>AI score</span>
            <span style={{fontSize:18,fontWeight:700,color:parcel.score>=85?GREEN:parcel.score>=70?ACCENT:MID,fontFamily:FF}}>{parcel.score}</span>
          </div>
        )}

        {/* Unlisted note */}
        {!parcel.listed&&(
          <div style={{background:`${ORANGE}08`,border:`1px solid ${ORANGE}20`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:500,color:INK,fontFamily:FF,marginBottom:3}}>Unlisted parcel</div>
            <div style={{fontSize:11,color:MID,fontFamily:FF,lineHeight:1.5}}>This parcel has no active listing. You can still run AI analysis and add it to your pipeline.</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{padding:"12px 14px",borderTop:`1px solid ${LIGHTER}`,display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
        <button onClick={()=>onAnalyse(parcel)}
          style={{width:"100%",background:ORANGE,border:"none",borderRadius:99,padding:"9px 0",fontSize:12,fontWeight:500,color:WHITE,cursor:"pointer",fontFamily:FF}}>
          ⊕ Analyse parcel
        </button>
        {parcel.listed&&parcel.plotId&&(
          <button onClick={()=>onOpenListing(parcel.plotId)}
            style={{width:"100%",background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"9px 0",fontSize:12,color:INK,cursor:"pointer",fontFamily:FF}}>
            View listing →
          </button>
        )}
        <button onClick={()=>onAddToProject(parcel.id)}
          style={{width:"100%",background:inProject?`${GREEN}0f`:BG,border:`1px solid ${inProject?GREEN+"40":LIGHTER}`,borderRadius:99,padding:"9px 0",fontSize:12,color:inProject?GREEN:MID,cursor:"pointer",fontFamily:FF}}>
          {inProject?"✓ In pipeline":"✦ Add to pipeline"}
        </button>
        {!parcel.listed&&(
          <div style={{fontSize:11,color:LIGHT,fontFamily:FF,textAlign:"center",lineHeight:1.5}}>
            Unlisted · analyse to score and add to pipeline
          </div>
        )}
      </div>

      <style>{`@keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
    </div>
  );
}

/** Group plots in % coordinates — nearby → cluster bubble; single → price tag. Keep threshold low (~6) so demo listings stay visually separate (18 merged all PT pins into one bubble). */
function buildPlotClusters(plotList, threshold = 6) {
  const clusters = [];
  const assigned = new Set();
  for (const p of plotList) {
    if (assigned.has(p.id)) continue;
    const group = [p];
    assigned.add(p.id);
    let growing = true;
    while (growing) {
      growing = false;
      for (const q of plotList) {
        if (assigned.has(q.id)) continue;
        if (group.some((m) => Math.hypot(m.x - q.x, m.y - q.y) < threshold)) {
          group.push(q);
          assigned.add(q.id);
          growing = true;
        }
      }
    }
    const cx = group.reduce((s, g) => s + g.x, 0) / group.length;
    const cy = group.reduce((s, g) => s + g.y, 0) / group.length;
    clusters.push({ plots: group, cx, cy });
  }
  return clusters;
}

const LAYER_GROUPS = [
  { group:"Land for Sale",            color:"#e8521a", items:[{id:"listings",      label:"Property listings"}]},
  { group:"Cadastre",                 color:"#2C5F2D", items:[{id:"boundaries",    label:"Property boundaries (DGT)"},{id:"crus",label:"CRUS"}]},
  { group:"Zonamento municipal (PDM)",color:"#7B5EA7", items:[{id:"pdm",           label:"Zonamento municipal (PDM)"}]},
  { group:"REN",                      color:"#2196a0", items:[{id:"ren",           label:"Proteção ecológica — restrições"}]},
  { group:"RAN",                      color:"#c8a034", items:[{id:"ran",           label:"Reserva agrícola — restrições"}]},
  { group:"Land Use",                 color:"#5a8a3c", items:[{id:"landuse",       label:"Land use and land cover classification"}]},
  { group:"Administrative",           color:"#6b6966", items:[{id:"municipalities",label:"Municipalities (CAOP 2024)"},{id:"parishes",label:"Parishes (CAOP 2024)"},{id:"districts",label:"Districts (18 districts)"}]},
  { group:"CLC",                      color:"#3a7abf", items:[{id:"clc",           label:"European land cover classification"}]},
  { group:"Urban",                    color:"#b85042", items:[{id:"builtup",       label:"Built-up areas"}]},
  { group:"Terrain",                  color:"#8a7a6a", items:[{id:"contours",      label:"Elevation contour lines"},{id:"aerial",label:"Aerial photos (30cm, 2023)"}]},
  { group:"Natura 2000",              color:"#2C5F2D", items:[{id:"natura",        label:"Rede Natura 2000 — ZPE + SIC"}]},
];

function PortugalMap({plots,activePin,setActivePin,showPlots,onOpenListing,cadastreMode,cadastreParcels,onParcelClick,selectedParcelId,onLayerToggle,pinMode,setPinMode,pinMarker,onPinPlaced,onDrawAreaSelectionChange,lassoClearSeq}){
  const mapRef    = useRef(null);
  const canvasRef = useRef(null);
  const pathRef   = useRef([]);
  const isDrawing = useRef(false);
  const prevLassoClear = useRef(0);
  const plotClusters = useMemo(() => buildPlotClusters(plots, 6), [plots]);

  const [layersOpen,    setLayersOpen]    = useState(false);
  const [activeLayers,  setActiveLayers]  = useState({});
  const [drawMode,      setDrawMode]      = useState(false);
  const [selection,     setSelection]     = useState([]);
  function toggleLayer(id){
    setActiveLayers(l=>({...l,[id]:!l[id]}));
    if((id==="boundaries"||id==="crus") && onLayerToggle) onLayerToggle(id, !activeLayers[id]);
  }
  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  function pip(pt, poly){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const xi=poly[i].x,yi=poly[i].y,xj=poly[j].x,yj=poly[j].y;
      if(((yi>pt.y)!==(yj>pt.y))&&(pt.x<(xj-xi)*(pt.y-yi)/(yj-yi)+xi)) inside=!inside;
    }
    return inside;
  }

  // Attach move+up to window so drag outside div still works
  useEffect(()=>{
    function getPxLocal(e){
      if(!mapRef.current) return {x:0,y:0};
      const r = mapRef.current.getBoundingClientRect();
      const c = e.touches ? e.touches[0] : e;
      return { x: c.clientX - r.left, y: c.clientY - r.top };
    }
    function redrawLocal(pts, closed=false){
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
      if(closed) ctx.closePath();
      ctx.fillStyle = "rgba(232,82,26,0.10)";
      ctx.fill();
      ctx.setLineDash(closed ? [] : [6,3]);
      ctx.strokeStyle = "#e8521a";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap  = "round";
      ctx.stroke();
      ctx.setLineDash([]);
    }
    function onMove(e){
      if(!isDrawing.current) return;
      pathRef.current = [...pathRef.current, getPxLocal(e)];
      redrawLocal(pathRef.current);
    }
    function onUp(e){
      if(!isDrawing.current) return;
      isDrawing.current = false;
      const pts = pathRef.current;
      if(pts.length < 5){ redrawLocal([]); pathRef.current=[]; return; }
      redrawLocal(pts, true);
      const r = mapRef.current.getBoundingClientRect();
      let inside;
      if(cadastreMode && cadastreParcels && cadastreParcels.length){
        inside = cadastreParcels.filter(p=>
          pip({ x: p.mapX/100*r.width, y: p.mapY/100*r.height }, pts)
        ).map(p=>p.id);
      }else{
        inside = plots.filter(p =>
          pip({ x: p.x/100*r.width, y: p.y/100*r.height }, pts)
        ).map(p => p.id);
      }
      setSelection(inside);
      if(inside.length === 0){ redrawLocal([]); pathRef.current=[]; }
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, {passive:false});
    window.addEventListener("touchend",  onUp);
    return ()=>{
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
  }, [plots, cadastreMode, cadastreParcels]);

  useEffect(() => {
    onDrawAreaSelectionChange?.({ ids: selection, lens: cadastreMode ? "parcels" : "listings" });
  }, [selection, cadastreMode, onDrawAreaSelectionChange]);

  useEffect(() => {
    if (!lassoClearSeq || lassoClearSeq === prevLassoClear.current) return;
    prevLassoClear.current = lassoClearSeq;
    clearDraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lassoClearSeq]);

  // Canvas sizing
  useEffect(()=>{
    function resize(){
      const el = canvasRef.current;
      if(!el || !mapRef.current) return;
      const r = mapRef.current.getBoundingClientRect();
      el.width  = r.width;
      el.height = r.height;
    }
    resize();
    window.addEventListener("resize", resize);
    return ()=>window.removeEventListener("resize", resize);
  }, []);

  function onMapMouseDown(e){
    if(pinMode) return;
    if(!drawMode) return;
    e.preventDefault();
    isDrawing.current = true;
    const r = mapRef.current.getBoundingClientRect();
    const c = e.touches ? e.touches[0] : e;
    pathRef.current = [{ x: c.clientX - r.left, y: c.clientY - r.top }];
    setSelection([]);
    // clear canvas
    const canvas = canvasRef.current;
    if(canvas) canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
  }

  function clearDraw(){
    isDrawing.current = false;
    pathRef.current   = [];
    const canvas = canvasRef.current;
    if(canvas) canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
    setSelection([]);
    setDrawMode(false);
  }

  useEffect(()=>{
    if(!pinMode) return;
    clearDraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- sync local draw off when parent enables pin mode
  }, [pinMode]);

  function onMapClickPlacePin(e){
    if(!pinMode||drawMode||cadastreMode||!onPinPlaced||!mapRef.current) return;
    const path=e.composedPath?.()||[];
    if(path.some(n=>n instanceof HTMLElement && (n.closest?.("[data-map-chrome]")))) return;
    const r=mapRef.current.getBoundingClientRect();
    const x=Math.max(2,Math.min(98,((e.clientX-r.left)/r.width)*100));
    const y=Math.max(2,Math.min(98,((e.clientY-r.top)/r.height)*100));
    onPinPlaced(x,y);
  }

  return(
    <div ref={mapRef} style={{width:"100%",height:"100%",background:"#e8eaed",position:"relative",overflow:"hidden",cursor:drawMode||pinMode?"crosshair":"default"}}
      onMouseDown={onMapMouseDown} onTouchStart={onMapMouseDown}
      onClick={onMapClickPlacePin}>

      {/* Base map — simple grey field + Portugal silhouette (pre–Positron demo) */}
      <svg width="100%" height="100%" style={{position:"absolute",inset:0,pointerEvents:"none"}} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="100%" height="100%" fill="#e8eaed"/>
        <g transform="translate(8%,4%) scale(0.84)">
          <path
            d="M180,20 C220,18 260,30 290,60 C320,90 330,130 325,170 C320,210 300,245 290,280 C280,315 282,350 275,385 C268,420 255,450 240,475 C225,500 205,515 185,520 C165,525 148,518 135,505 C122,492 115,475 112,455 C109,435 112,415 108,395 C104,375 95,358 90,338 C85,318 85,298 82,278 C79,258 72,240 70,220 C68,200 70,180 68,160 C66,140 60,122 62,102 C64,82 72,64 85,50 C98,36 120,22 145,18 Z"
            fill="#f0f1f4"
            stroke="#dce1e8"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* Cadastre overlay — fills the whole map when active */}
      {cadastreMode && (
        <svg width="100%" height="100%" style={{position:"absolute",inset:0,zIndex:6,pointerEvents:"auto"}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 900 760">
          <rect width="900" height="760" fill="#d8d4cc"/>

          {/* Major roads */}
          <line x1="0" y1="380" x2="900" y2="380" stroke="#b8b3a8" strokeWidth="7"/>
          <line x1="450" y1="0" x2="450" y2="760" stroke="#b8b3a8" strokeWidth="6"/>
          <line x1="0" y1="190" x2="900" y2="190" stroke="#c4c0b8" strokeWidth="3.5"/>
          <line x1="0" y1="570" x2="900" y2="570" stroke="#c4c0b8" strokeWidth="3.5"/>
          <line x1="225" y1="0" x2="225" y2="760" stroke="#c4c0b8" strokeWidth="3"/>
          <line x1="675" y1="0" x2="675" y2="760" stroke="#c4c0b8" strokeWidth="3"/>
          {/* Minor roads */}
          <line x1="0" y1="95" x2="900" y2="95" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="0" y1="285" x2="900" y2="285" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="0" y1="475" x2="900" y2="475" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="0" y1="665" x2="900" y2="665" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="112" y1="0" x2="112" y2="760" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="337" y1="0" x2="337" y2="760" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="562" y1="0" x2="562" y2="760" stroke="#ccc8c0" strokeWidth="1.5"/>
          <line x1="787" y1="0" x2="787" y2="760" stroke="#ccc8c0" strokeWidth="1.5"/>

          {/* Parcels — dense grid of small irregular blocks */}
          <g stroke="#aaa69e" strokeWidth="0.6" fill="#cac6be">
            {/* Quadrant top-left */}
            <rect x="8" y="8" width="42" height="38"/><rect x="50" y="8" width="30" height="38"/>
            <rect x="80" y="8" width="30" height="18"/><rect x="80" y="26" width="30" height="20"/>
            <rect x="8" y="46" width="36" height="28"/><rect x="44" y="46" width="36" height="28"/>
            <rect x="8" y="74" width="50" height="20"/><rect x="58" y="74" width="52" height="20"/>
            <rect x="116" y="8" width="45" height="35"/><rect x="161" y="8" width="38" height="35"/>
            <rect x="116" y="43" width="35" height="30"/><rect x="151" y="43" width="48" height="30"/>
            <rect x="116" y="73" width="40" height="22"/><rect x="156" y="73" width="43" height="22"/>
            <rect x="8" y="100" width="55" height="40"/><rect x="63" y="100" width="45" height="40"/>
            <rect x="116" y="100" width="50" height="42"/><rect x="166" y="100" width="55" height="42"/>
            <rect x="8" y="140" width="48" height="30"/><rect x="56" y="140" width="50" height="30"/>
            <rect x="106" y="140" width="42" height="30"/><rect x="148" y="140" width="70" height="30"/>
            <rect x="8" y="170" width="60" height="20"/><rect x="68" y="170" width="38" height="20"/>
            <rect x="116" y="170" width="50" height="20"/><rect x="166" y="170" width="55" height="20"/>

            {/* Quadrant top-right */}
            <rect x="460" y="8" width="50" height="35"/><rect x="510" y="8" width="44" height="35"/>
            <rect x="460" y="43" width="38" height="32"/><rect x="498" y="43" width="56" height="32"/>
            <rect x="460" y="75" width="46" height="20"/><rect x="506" y="75" width="48" height="20"/>
            <rect x="556" y="8" width="40" height="40"/><rect x="596" y="8" width="50" height="40"/>
            <rect x="646" y="8" width="26" height="40"/><rect x="672" y="8" width="26" height="22"/>
            <rect x="672" y="30" width="26" height="18"/>
            <rect x="460" y="100" width="52" height="38"/><rect x="512" y="100" width="42" height="38"/>
            <rect x="460" y="138" width="44" height="32"/><rect x="504" y="138" width="50" height="32"/>
            <rect x="460" y="170" width="60" height="20"/><rect x="520" y="170" width="34" height="20"/>
            <rect x="556" y="100" width="44" height="45"/><rect x="600" y="100" width="68" height="45"/>
            <rect x="556" y="145" width="50" height="25"/><rect x="606" y="145" width="62" height="25"/>
            <rect x="684" y="8" width="50" height="55"/><rect x="734" y="8" width="55" height="55"/>
            <rect x="684" y="63" width="48" height="45"/><rect x="732" y="63" width="57" height="45"/>
            <rect x="684" y="108" width="50" height="30"/><rect x="734" y="108" width="55" height="30"/>
            <rect x="684" y="138" width="46" height="32"/><rect x="730" y="138" width="59" height="32"/>

            {/* Quadrant mid-left */}
            <rect x="8" y="200" width="55" height="40"/><rect x="63" y="200" width="45" height="40"/>
            <rect x="116" y="200" width="42" height="40"/><rect x="158" y="200" width="58" height="40"/>
            <rect x="8" y="240" width="48" height="38"/><rect x="56" y="240" width="52" height="38"/>
            <rect x="116" y="240" width="50" height="38"/><rect x="166" y="240" width="55" height="38"/>
            <rect x="8" y="295" width="40" height="35"/><rect x="48" y="295" width="62" height="35"/>
            <rect x="116" y="295" width="44" height="35"/><rect x="160" y="295" width="58" height="35"/>
            <rect x="8" y="330" width="55" height="28"/><rect x="63" y="330" width="47" height="28"/>
            <rect x="116" y="330" width="40" height="28"/><rect x="156" y="330" width="60" height="28"/>
            <rect x="8" y="358" width="42" height="22"/>
            <rect x="116" y="358" width="50" height="22"/><rect x="166" y="358" width="50" height="22"/>

            {/* Quadrant mid-right */}
            <rect x="460" y="200" width="50" height="42"/><rect x="510" y="200" width="44" height="42"/>
            <rect x="460" y="242" width="38" height="36"/><rect x="498" y="242" width="56" height="36"/>
            <rect x="460" y="295" width="46" height="34"/><rect x="506" y="295" width="48" height="34"/>
            <rect x="460" y="329" width="52" height="30"/><rect x="512" y="329" width="42" height="30"/>
            <rect x="460" y="359" width="44" height="21"/><rect x="504" y="359" width="50" height="21"/>
            <rect x="556" y="200" width="44" height="40"/><rect x="600" y="200" width="68" height="40"/>
            <rect x="556" y="240" width="50" height="38"/><rect x="606" y="240" width="62" height="38"/>
            <rect x="556" y="295" width="44" height="35"/><rect x="600" y="295" width="68" height="35"/>
            <rect x="556" y="330" width="50" height="28"/><rect x="606" y="330" width="62" height="28"/>
            <rect x="684" y="200" width="50" height="45"/><rect x="734" y="200" width="55" height="45"/>
            <rect x="684" y="245" width="48" height="38"/><rect x="732" y="245" width="57" height="38"/>
            <rect x="684" y="295" width="50" height="33"/><rect x="734" y="295" width="55" height="33"/>
            <rect x="684" y="328" width="46" height="30"/><rect x="730" y="328" width="59" height="30"/>

            {/* Quadrant bottom-left */}
            <rect x="8" y="390" width="55" height="40"/><rect x="63" y="390" width="45" height="40"/>
            <rect x="116" y="390" width="42" height="40"/><rect x="158" y="390" width="58" height="40"/>
            <rect x="8" y="430" width="48" height="38"/><rect x="56" y="430" width="52" height="38"/>
            <rect x="116" y="430" width="50" height="38"/><rect x="166" y="430" width="55" height="38"/>
            <rect x="8" y="485" width="40" height="35"/><rect x="48" y="485" width="62" height="35"/>
            <rect x="116" y="485" width="44" height="35"/><rect x="160" y="485" width="58" height="35"/>
            <rect x="8" y="520" width="55" height="30"/><rect x="63" y="520" width="47" height="30"/>
            <rect x="116" y="520" width="40" height="30"/><rect x="156" y="520" width="60" height="30"/>
            <rect x="8" y="580" width="42" height="38"/><rect x="50" y="580" width="60" height="38"/>
            <rect x="116" y="580" width="50" height="38"/><rect x="166" y="580" width="55" height="38"/>
            <rect x="8" y="618" width="55" height="32"/><rect x="63" y="618" width="47" height="32"/>
            <rect x="116" y="618" width="44" height="32"/><rect x="160" y="618" width="58" height="32"/>
            <rect x="8" y="675" width="48" height="38"/><rect x="56" y="675" width="52" height="38"/>
            <rect x="116" y="675" width="50" height="38"/><rect x="166" y="675" width="55" height="38"/>
            <rect x="8" y="713" width="42" height="38"/><rect x="50" y="713" width="60" height="38"/>
            <rect x="116" y="713" width="50" height="38"/><rect x="166" y="713" width="55" height="38"/>

            {/* Quadrant bottom-right */}
            <rect x="460" y="390" width="50" height="42"/><rect x="510" y="390" width="44" height="42"/>
            <rect x="460" y="432" width="38" height="36"/><rect x="498" y="432" width="56" height="36"/>
            <rect x="460" y="485" width="46" height="34"/><rect x="506" y="485" width="48" height="34"/>
            <rect x="460" y="519" width="52" height="30"/><rect x="512" y="519" width="42" height="30"/>
            <rect x="556" y="390" width="44" height="40"/><rect x="600" y="390" width="68" height="40"/>
            <rect x="556" y="430" width="50" height="38"/><rect x="606" y="430" width="62" height="38"/>
            <rect x="556" y="485" width="44" height="35"/><rect x="600" y="485" width="68" height="35"/>
            <rect x="556" y="520" width="50" height="28"/><rect x="606" y="520" width="62" height="28"/>
            <rect x="684" y="390" width="50" height="45"/><rect x="734" y="390" width="55" height="45"/>
            <rect x="684" y="435" width="48" height="38"/><rect x="732" y="435" width="57" height="38"/>
            <rect x="684" y="485" width="50" height="33"/><rect x="734" y="485" width="55" height="33"/>
            <rect x="684" y="518" width="46" height="30"/><rect x="730" y="518" width="59" height="30"/>
            <rect x="460" y="580" width="50" height="38"/><rect x="510" y="580" width="44" height="38"/>
            <rect x="460" y="618" width="38" height="32"/><rect x="498" y="618" width="56" height="32"/>
            <rect x="460" y="675" width="46" height="38"/><rect x="506" y="675" width="48" height="38"/>
            <rect x="460" y="713" width="52" height="38"/><rect x="512" y="713" width="42" height="38"/>
            <rect x="556" y="580" width="44" height="40"/><rect x="600" y="580" width="68" height="40"/>
            <rect x="556" y="620" width="50" height="32"/><rect x="606" y="620" width="62" height="32"/>
            <rect x="556" y="675" width="44" height="38"/><rect x="600" y="675" width="68" height="38"/>
            <rect x="556" y="713" width="50" height="38"/><rect x="606" y="713" width="62" height="38"/>
            <rect x="684" y="580" width="50" height="42"/><rect x="734" y="580" width="55" height="42"/>
            <rect x="684" y="622" width="48" height="32"/><rect x="732" y="622" width="57" height="32"/>
            <rect x="684" y="675" width="50" height="38"/><rect x="734" y="675" width="55" height="38"/>
            <rect x="684" y="713" width="46" height="38"/><rect x="730" y="713" width="59" height="38"/>
          </g>

          {/* Selected parcel */}
          <rect x="337" y="240" width="55" height="42" stroke={ORANGE} strokeWidth="2" fill={`${ORANGE}18`}
            style={{cursor:"pointer"}} onClick={()=>onParcelClick&&onParcelClick(CADASTRE_PARCELS[0])}/>
          <circle cx="364" cy="261" r="5" fill={ORANGE} style={{cursor:"pointer"}}
            onClick={()=>onParcelClick&&onParcelClick(CADASTRE_PARCELS[0])}/>
          <circle cx="364" cy="261" r="9" stroke={`${ORANGE}40`} strokeWidth="1.5" fill="none"/>
          <rect x="310" y="222" width="108" height="16" rx="3" fill="rgba(17,17,16,0.82)"/>
          <text x="321" y="233" fill="white" fontSize="8" fontFamily={FF}>PT-SB-001 · 2 340 m²</text>

          {/* Cadastre parcel dots — listed (orange) and unlisted (grey) */}
          {[
            [47,30,"PT-VC-001",false],[160,55,"PT-VC-002",true],[510,22,"PT-BR-001",false],[640,30,"PT-BR-002",false],[734,44,"PT-BR-003",true],
            [63,115,"PT-VC-003",false],[148,108,"PT-OB-010",true],[500,110,"PT-AL-012",false],[590,120,"PT-AL-013",false],[720,115,"PT-AL-014",true],
            [48,210,"PT-SB-010",false],[158,225,"PT-SB-011",false],[498,205,"PT-LX-001",true],[610,218,"PT-LX-002",false],[740,210,"PT-LX-003",false],
            [55,310,"PT-OB-011",true],[165,305,"PT-OB-012",false],[512,318,"PT-EV-020",false],[598,300,"PT-EV-021",true],[734,315,"PT-EV-022",false],
            [46,420,"PT-GR-010",false],[162,435,"PT-GR-011",false],[506,428,"PT-BE-020",false],[612,418,"PT-BE-021",true],[736,430,"PT-BE-022",false],
            [52,510,"PT-ME-010",true],[156,525,"PT-ME-011",false],[498,515,"PT-FA-001",false],[604,508,"PT-FA-002",false],[730,520,"PT-FA-003",true],
            [48,600,"PT-SE-001",false],[164,615,"PT-SE-002",true],[510,608,"PT-PT-001",false],[598,618,"PT-PT-002",false],[740,605,"PT-PT-003",false],
            [56,700,"PT-VI-001",false],[158,690,"PT-VI-002",false],[504,698,"PT-CB-001",true],[612,705,"PT-CB-002",false],[734,695,"PT-CB-003",false],
            [230,75,"PT-VC-004",false],[300,90,"PT-VC-005",true],[400,60,"PT-BR-004",false],[820,80,"PT-SA-001",false],[860,150,"PT-SA-002",true],
            [230,200,"PT-SB-012",true],[300,220,"PT-SB-013",false],[400,195,"PT-LX-004",false],[820,210,"PT-SA-003",false],[860,300,"PT-SA-004",false],
            [230,310,"PT-OB-013",false],[300,330,"PT-EV-023",true],[400,295,"PT-EV-024",false],[820,320,"PT-SA-005",true],[860,420,"PT-SA-006",false],
            [230,440,"PT-GR-012",false],[300,450,"PT-BE-023",false],[400,435,"PT-BE-024",true],[820,440,"PT-SA-007",false],[860,510,"PT-SA-008",false],
            [230,560,"PT-ME-012",true],[300,575,"PT-FA-004",false],[400,560,"PT-PT-004",false],[820,570,"PT-SA-009",false],[860,650,"PT-SA-010",true],
            [230,680,"PT-VI-003",false],[300,695,"PT-CB-004",false],[400,685,"PT-CB-005",true],[820,690,"PT-SA-011",false],[860,740,"PT-SA-012",false],
          ].map(([x,y,ref,listed],i)=>(
            <g key={i} style={{cursor:"pointer"}} onClick={()=>onParcelClick&&onParcelClick({
              id:`CAD-MAP-${i}`, ref, zone:"Rústico", pdm:"Espaço Agrícola",
              area:`${(Math.floor(i*317+800))} m²`, owner: listed?"Private":"Private",
              listed, plotId: listed ? "PT-0182" : null,
              score: listed ? Math.floor(65+i*7)%35+65 : null,
              verdict: listed ? (i%3===0?"great_match":i%3===1?"good_match":"consider") : null,
            })}>
              <circle cx={x} cy={y} r={listed ? 4 : 3}
                fill={listed ? ORANGE : "#8a8680"}
                opacity={listed ? 0.9 : 0.55}/>
              {listed && <circle cx={x} cy={y} r="7" stroke={`${ORANGE}30`} strokeWidth="1" fill="none"/>}
            </g>
          ))}
        </svg>
      )}

      {/* Canvas lasso layer */}
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:25}}/>

      {/* Grey-map listings: blue cluster bubbles (multi) · white price tags (single) */}
      {showPlots&&!cadastreMode&&plotClusters.map((cl,i)=>{
        const group = cl.plots;
        const isCluster = group.length > 1;
        const cx = cl.cx;
        const cy = cl.cy;
        const primary = group.find((q)=>q.id===activePin) || group[0];
        const p = primary;
        const active = !drawMode && group.some((q)=>q.id===activePin);
        const selected = group.some((q)=>selection.includes(q.id));
        const probHigh = GREEN_BRIGHT;
        const probMid = "#2563eb";
        const maxScore = Math.max(...group.map((g)=>g.score));
        const tierColor = maxScore>=85?probHigh:maxScore>=70?probMid:MID;
        const glow = maxScore>=85?"22,163,74":maxScore>=70?"37,99,235":"107,107,104";
        const dim = selection.length>0&&!selected&&!active;
        return(
          <div key={`cl-${i}-${group.map((g)=>g.id).join("-")}`}
            style={{position:"absolute",left:`${cx}%`,top:`${cy}%`,transform:isCluster?"translate(-50%,-50%)":"translate(-50%,calc(-100% - 2px))",cursor:drawMode?"crosshair":"pointer",zIndex:active?20:selected?15:10,opacity:dim?0.35:1,transition:"opacity 0.25s, transform 0.15s",animation:`pinDrop 0.4s cubic-bezier(.34,1.56,.64,1) both`,animationDelay:`${i*0.06}s`}}
            onClick={e=>{ if(drawMode) return; e.stopPropagation(); setActivePin(active?null:p.id); }}>

            {isCluster ? (
              <div style={{
                minWidth:38,height:38,padding:"0 10px",borderRadius:999,
                background:tierColor,color:WHITE,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:FF,fontSize:14,fontWeight:700,
                border:selected||active?"3px solid #fff":"2px solid rgba(255,255,255,0.95)",
                boxShadow:active||selected?`0 0 0 3px rgba(${glow},0.35), 0 4px 14px rgba(${glow},0.45)`:`0 2px 10px rgba(${glow},0.35)`,
                lineHeight:1,
              }}>{group.length}</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{
                  background:WHITE,borderRadius:8,padding:"5px 10px",
                  border:"1px solid rgba(0,0,0,0.08)",
                  borderLeft:`4px solid ${tierColor}`,
                  boxShadow:active||selected?"0 3px 14px rgba(0,0,0,0.14)":"0 2px 10px rgba(0,0,0,0.1)",
                  fontFamily:FF,fontSize:12,fontWeight:600,color:INK,whiteSpace:"nowrap",
                  outline:active||selected?`2px solid ${tierColor}`:"none",outlineOffset:1,
                  display:"flex",alignItems:"center",gap:6,
                }}>
                  <span>{p.price}</span>
                  <span style={{fontSize:10,fontWeight:700,color:tierColor,opacity:0.9}}>{p.score}</span>
                </div>
                <div style={{width:0,height:0,marginTop:-1,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:"7px solid #fff",filter:"drop-shadow(0 1px 1px rgba(0,0,0,0.06))"}}/>
              </div>
            )}
          </div>
        );
      })}

      {/* Dropped pin marker (user-placed; not a listing cluster) */}
      {pinMarker&&showPlots&&!cadastreMode&&(
        <div style={{position:"absolute",left:`${pinMarker.x}%`,top:`${pinMarker.y}%`,transform:"translate(-50%,calc(-100% - 4px))",zIndex:45,pointerEvents:"none",animation:"pinDrop 0.35s cubic-bezier(.34,1.56,.64,1) both"}} aria-hidden>
          <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
            <path d="M14 0C6.3 0 0 6.1 0 13.6c0 9.6 14 22.4 14 22.4S28 23.2 28 13.6C28 6.1 21.7 0 14 0z" fill={ORANGE}/>
            <circle cx="14" cy="13" r="5" fill={WHITE}/>
          </svg>
        </div>
      )}

      {/* Empty state */}
      {!showPlots&&(
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <div style={{background:"rgba(248,247,244,0.96)",backdropFilter:"blur(10px)",borderRadius:8,padding:"20px 28px",textAlign:"center",border:`1px solid ${LIGHTER}`}}>
            <div style={{fontFamily:FF,fontSize:15,color:INK,marginBottom:3}}>Start a search</div>
            <div style={{fontSize:12,color:MID,fontFamily:FF}}>Plots appear as you chat · or draw an area to select</div>
          </div>
        </div>
      )}

      {/* Draw + pin — top-left */}
        <div data-map-chrome onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} style={{position:"absolute",top:10,left:10,zIndex:40,display:"flex",gap:6}}>
        <button onClick={()=>{ setPinMode&&setPinMode(false); setDrawMode(m=>!m); if(drawMode) clearDraw(); setActivePin(null); }}
          style={{display:"flex",alignItems:"center",gap:6,background:drawMode?ORANGE:WHITE,border:`1px solid ${drawMode?ORANGE:LIGHTER}`,borderRadius:99,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:500,color:drawMode?WHITE:MID,fontFamily:FF,boxShadow:"0 1px 4px rgba(0,0,0,0.1)",transition:"all 0.15s"}}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 11 C3 8 5 5 7 3 C9 1 11 1.5 11 3.5 C11 5.5 9 7 7 8 C5 9 3.5 10 3 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="3" cy="11" r="1.5" fill="currentColor"/>
          </svg>
          {drawMode ? "Drawing…" : "Area research"}
        </button>
        {setPinMode&&onPinPlaced&&!cadastreMode&&(
        <button onClick={()=>{ if(drawMode){ isDrawing.current=false; clearDraw(); } setDrawMode(false); setPinMode(m=>!m); setActivePin(null); }}
          style={{display:"flex",alignItems:"center",gap:6,background:pinMode?`${ORANGE}18`:WHITE,border:`1px solid ${pinMode?ORANGE:LIGHTER}`,borderRadius:99,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:500,color:pinMode?ORANGE:MID,fontFamily:FF,boxShadow:"0 1px 4px rgba(0,0,0,0.1)",transition:"all 0.15s"}}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 1.5c-2.1 0-3.8 1.7-3.8 3.8 0 2.8 3.8 6.9 3.8 6.9s3.8-4.1 3.8-6.9c0-2.1-1.7-3.8-3.8-3.8z" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="8" cy="5.2" r="1.2" fill="currentColor"/>
          </svg>
          {pinMode ? "Tap map…" : "Drop pin"}
        </button>
        )}
        {drawMode&&selection.length===0&&(
          <div style={{background:"rgba(17,17,16,0.75)",backdropFilter:"blur(8px)",borderRadius:99,padding:"6px 12px",fontSize:12,color:"rgba(255,255,255,0.85)",fontFamily:FF,display:"flex",alignItems:"center",pointerEvents:"none"}}>
            Draw an area on the map (click and drag)
          </div>
        )}
        {drawMode&&selection.length>0&&(
          <button onClick={clearDraw} style={{background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",cursor:"pointer",fontSize:12,color:MID,fontFamily:FF,boxShadow:"0 1px 4px rgba(0,0,0,0.1)"}}>✕ Clear</button>
        )}
      </div>

      {/* Map controls + Layers button */}
      <div data-map-chrome onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} style={{position:"absolute",top:10,right:10,display:"flex",flexDirection:"column",gap:4,zIndex:50}}>
        {/* Layers toggle */}
        <button onClick={()=>setLayersOpen(o=>!o)}
          style={{display:"flex",alignItems:"center",gap:5,background:layersOpen?INK:WHITE,border:`1px solid ${layersOpen?INK:LIGHTER}`,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:500,color:layersOpen?WHITE:INK,fontFamily:FF,boxShadow:"0 1px 4px rgba(0,0,0,0.1)",whiteSpace:"nowrap",transition:"all 0.15s"}}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="1" width="11" height="3" rx="1" fill="currentColor" opacity="0.9"/>
            <rect x="1" y="5" width="11" height="3" rx="1" fill="currentColor" opacity="0.6"/>
            <rect x="1" y="9" width="11" height="3" rx="1" fill="currentColor" opacity="0.3"/>
          </svg>
          Layers{activeCount>0&&<span style={{background:ORANGE,color:WHITE,borderRadius:99,padding:"0 5px",fontSize:10,fontWeight:700,marginLeft:2}}>{activeCount}</span>}
        </button>
        {/* Zoom */}
        {["＋","－"].map((c,i)=>(
          <button key={i} style={{width:28,height:28,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:6,cursor:"pointer",fontSize:15,color:MID,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FF}}>{c}</button>
        ))}
      </div>

      {/* Layers panel */}
      {layersOpen&&(
        <div data-map-chrome onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} style={{position:"absolute",top:10,right:90,zIndex:50,width:260,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",overflow:"hidden",animation:"fadeIn 0.15s ease both"}}>
          {/* Panel header */}
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${LIGHTER}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:FF,fontSize:12,fontWeight:600,color:INK}}>Map layers</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {activeCount>0&&(
                <button onClick={()=>setActiveLayers({})}
                  style={{fontSize:11,color:ORANGE,background:"none",border:"none",cursor:"pointer",fontFamily:FF,padding:0}}>
                  Clear all
                </button>
              )}
              <button onClick={()=>setLayersOpen(false)}
                style={{fontSize:14,color:LIGHT,background:"none",border:"none",cursor:"pointer",lineHeight:1,padding:0}}>✕</button>
            </div>
          </div>

          {/* Scrollable layer list */}
          <div style={{maxHeight:360,overflowY:"auto"}}>
            {LAYER_GROUPS.map(({group,color,items})=>(
              <div key={group}>
                {/* Group header */}
                <div style={{padding:"7px 14px 3px",display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:2,background:color,flexShrink:0}}/>
                  <span style={{fontSize:10,fontWeight:600,color:MID,fontFamily:FF,textTransform:"uppercase",letterSpacing:"0.07em"}}>{group}</span>
                </div>
                {/* Layer items */}
                {items.map(({id,label})=>{
                  const on = !!activeLayers[id];
                  return(
                    <div key={id} onClick={()=>toggleLayer(id)}
                      style={{padding:"6px 14px 6px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:on?`${color}08`:WHITE,transition:"background 0.1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=on?`${color}12`:BG}
                      onMouseLeave={e=>e.currentTarget.style.background=on?`${color}08`:WHITE}>
                      <span style={{fontSize:12,color:on?INK:MID,fontFamily:FF,lineHeight:1.3}}>{label}</span>
                      {/* Toggle pill */}
                      <div style={{width:28,height:16,borderRadius:99,background:on?color:LIGHTER,flexShrink:0,position:"relative",transition:"background 0.2s",marginLeft:8}}>
                        <div style={{width:12,height:12,borderRadius:"50%",background:WHITE,position:"absolute",top:2,left:on?14:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{padding:"8px 14px",borderTop:`1px solid ${LIGHTER}`,background:BG}}>
            <div style={{fontSize:11,color:LIGHT,fontFamily:FF}}>Live data layers available on full map</div>
          </div>
        </div>
      )}

      {/* Match score legend — hidden in cadastre mode */}
      {!cadastreMode&&(
        <div data-map-chrome onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:10,left:12,background:"rgba(247,245,242,0.92)",backdropFilter:"blur(8px)",borderRadius:6,padding:"7px 10px",border:`1px solid ${LIGHTER}`,zIndex:selection.length>0?0:10}}>
          <div style={{fontFamily:FF,fontSize:11,color:LIGHT,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:5}}>Match score</div>
          {[[GREEN,"85+"],[ORANGE,"70–84"],[MID,"< 70"]].map(([c,r])=>(
            <div key={r} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:c}}/><span style={{fontSize:12,color:INK,fontFamily:FF}}>{r}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes dash { to { stroke-dashoffset: -18; } }
        @keyframes progressBar { from { width:0% } to { width:100% } }
      `}</style>
    </div>
  );
}

// ── MAP LIST VIEW ─────────────────────────────────────────────────────────────
function MapListView({showPlots,plots,headlineCount,contextLabel,onOpenListing,onListingFocus,onAddToProject,projectPlots,upgraded,onUpgrade,listingFilterActive,mapTotal}){
  const [savedAll,setSavedAll]=useState(false);
  useEffect(()=>{setSavedAll(false);},[headlineCount,contextLabel,plots.length]);
  function saveAll(){plots.forEach(p=>onAddToProject(plotListingOpenId(p)));setSavedAll(true);}
  const sampleHint = showPlots && headlineCount > plots.length && !listingFilterActive;
  const statNumber = listingFilterActive ? plots.length : sampleHint ? headlineCount : plots.length;
  const contextualList = showPlots && !sampleHint && plots.length > 0 && !listingFilterActive;
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"9px 12px 8px",borderBottom:`1px solid ${LIGHTER}`,background:WHITE,flexShrink:0,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
        {showPlots?(
          <div style={{minWidth:0}}>
            <div style={{fontFamily:FF,fontSize:22,fontWeight:700,color:INK,letterSpacing:"-0.02em",lineHeight:1.15}}>{statNumber.toLocaleString()}</div>
            <div style={{fontFamily:FF,fontSize:12,color:MID,marginTop:3,lineHeight:1.35}}>{contextLabel}</div>
            {sampleHint&&(
              <div style={{...TC.label,marginTop:4,color:LIGHT}}>Map & list · {plots.length} sample plots</div>
            )}
            {contextualList&&(
              <div style={{...TC.label,marginTop:3,color:LIGHT}}>{plots.length} listings in this view — same as map</div>
            )}
            {listingFilterActive && mapTotal != null && (
              <div style={{...TC.label,marginTop:3,color:LIGHT}}>{plots.length} match filters · {mapTotal} in current map result</div>
            )}
          </div>
        ):(
          <span style={{fontFamily:FF,fontSize:15,color:LIGHT,letterSpacing:"0.06em",textTransform:"uppercase"}}>No results yet</span>
        )}
        {showPlots&&plots.length>0&&(
          <button onClick={saveAll}
            style={{background:"none",border:"none",padding:"2px 0 0",cursor:"pointer",fontSize:15,color:savedAll?GREEN:MID,fontFamily:FF,display:"flex",alignItems:"center",gap:4,transition:"color 0.1s",flexShrink:0,whiteSpace:"nowrap"}}
            onMouseEnter={e=>{if(!savedAll)e.currentTarget.style.color=ORANGE;}}
            onMouseLeave={e=>{if(!savedAll)e.currentTarget.style.color=MID;}}>
            {savedAll?"✓ All saved":"Save all →"}
          </button>
        )}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>
        {!showPlots?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:LIGHT,height:"100%"}}>
            <div style={{fontFamily:FF,fontSize:15,color:MID}}>Start a search</div>
          </div>
        ):(
          <div className="ye-map-list-grid">
            {plots.map((p,i)=>{
              const lid=plotListingOpenId(p);
              const v=VERDICT[p.aiVerdict]; const inProj=projectPlots.includes(lid);
              return(
                <div
                  key={`${p.id}-${i}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();(onListingFocus||(()=>onOpenListing(lid)))(p);}}}
                  onClick={()=>(onListingFocus?onListingFocus(p):onOpenListing(lid))}
                  style={{background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,overflow:"hidden",animation:"fadeIn 0.2s ease both",animationDelay:`${i*0.03}s`,display:"flex",flexDirection:"column",minWidth:0,boxShadow:"0 1px 2px rgba(0,0,0,0.04)",cursor:"pointer",textAlign:"left"}}
                >
                  {/* Image strip — swap PlotImage for photo when available */}
                  <div title={p.name} style={{position:"relative",width:"100%",aspectRatio:"5 / 3",maxHeight:108,minHeight:72,background:BG2}}>
                    <PlotImage plot={p} type={p.type} index={i%3} style={{width:"100%",height:"100%",display:"block",pointerEvents:"none"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 55%,rgba(17,17,16,0.12) 100%)",pointerEvents:"none"}}/>
                    <div style={{position:"absolute",top:7,left:7,background:WHITE,borderRadius:6,padding:"2px 7px",fontFamily:FF,fontSize:12,fontWeight:600,color:INK,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.06)",pointerEvents:"none"}}>{p.price}</div>
                    <div style={{position:"absolute",bottom:6,right:6,background:"rgba(17,17,16,0.72)",borderRadius:4,padding:"1px 6px",fontFamily:FF,fontSize:11,color:WHITE,fontWeight:600,pointerEvents:"none"}}>{p.score}</div>
                  </div>
                  <div style={{padding:"8px 10px 10px",display:"flex",flexDirection:"column",gap:5,flex:1,minWidth:0}}>
                    <div style={{fontFamily:FFM,fontSize:10,color:ACCENT,letterSpacing:"0.04em"}}>{p.id}</div>
                    <div style={{fontWeight:600,fontSize:13,color:INK,fontFamily:FF,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</div>
                    <div style={{fontSize:12,color:MID,fontFamily:FF,lineHeight:1.35}}>{p.region}</div>
                    <div style={{fontSize:11,color:LIGHT,fontFamily:FF}}>{p.area} · {p.type}</div>
                    <span style={{alignSelf:"flex-start",color:v.color,borderRadius:99,padding:"1px 6px",fontSize:10,fontWeight:600,border:`1px solid ${v.color}28`,fontFamily:FF,background:WHITE,marginTop:1}}>{v.label}</span>
                    <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:6}} onClick={e=>e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={e=>{e.stopPropagation();onOpenListing(lid);}}
                        style={{width:"100%",background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 0",fontSize:12,color:INK,cursor:"pointer",fontFamily:FF}}
                      >View listing →</button>
                      <button
                        type="button"
                        onClick={e=>{e.stopPropagation();onAddToProject(lid);}}
                        style={{width:"100%",background:inProj?`${GREEN}0f`:BG2,border:`1px solid ${inProj?`${GREEN}30`:LIGHTER}`,borderRadius:99,padding:"6px 0",fontSize:12,color:inProj?GREEN:MID,cursor:"pointer",fontFamily:FF}}
                      >{inProj?"Saved":"Save"}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PARCEL LIST (cadastre / BUPI) — same grid as listings, parcel-centric rows ─
function ParcelMapListView({showPlots,parcels,headlineCount,contextLabel,selectedParcelId,onParcelClick,onOpenListing,onAddToProject,projectPlots}){
  const [filter,setFilter]=useState("all");
  const [savedAll,setSavedAll]=useState(false);
  useEffect(()=>{setSavedAll(false);},[headlineCount,contextLabel,parcels.length]);
  const filters=[["all","All"],["listed","For sale"],["unlisted","Unlisted"],["ran","RAN"],["ren","REN"]];
  const filtered=parcels.filter(p=>{
    if(filter==="listed")return p.listed;
    if(filter==="unlisted")return !p.listed;
    if(filter==="ran")return p.zone==="RAN";
    if(filter==="ren")return p.zone==="REN";
    return true;
  });
  function saveAll(){parcels.forEach(p=>onAddToProject(p.id));setSavedAll(true);}
  const listStat = filter==="all" ? parcels.length : filtered.length;
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"9px 12px 8px",borderBottom:`1px solid ${LIGHTER}`,background:WHITE,flexShrink:0,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
        {showPlots?(
          <div style={{minWidth:0}}>
            <div style={{fontFamily:FF,fontSize:22,fontWeight:700,color:INK,letterSpacing:"-0.02em",lineHeight:1.15}}>{listStat.toLocaleString()}</div>
            <div style={{fontFamily:FF,fontSize:12,color:MID,marginTop:3,lineHeight:1.35}}>{contextLabel}</div>
            {filter!=="all"&&(
              <div style={{...TC.label,marginTop:3,color:LIGHT}}>{filtered.length} on screen · {parcels.length} in map result</div>
            )}
            {filter==="all"&&(
              <div style={{...TC.label,marginTop:4,color:LIGHT}}>Parcels · some linked to listings (for sale) · same count as map</div>
            )}
          </div>
        ):(
          <span style={{fontFamily:FF,fontSize:15,color:LIGHT,letterSpacing:"0.06em",textTransform:"uppercase"}}>No results yet</span>
        )}
        {showPlots&&parcels.length>0&&(
          <button onClick={saveAll}
            style={{background:"none",border:"none",padding:"2px 0 0",cursor:"pointer",fontSize:15,color:savedAll?GREEN:MID,fontFamily:FF,flexShrink:0,whiteSpace:"nowrap"}}
            onMouseEnter={e=>{if(!savedAll)e.currentTarget.style.color=ORANGE;}}
            onMouseLeave={e=>{if(!savedAll)e.currentTarget.style.color=MID;}}>
            {savedAll?"✓ All saved":"Save all →"}
          </button>
        )}
      </div>
      {showPlots&&(
        <div style={{padding:"6px 12px",borderBottom:`1px solid ${LIGHTER}`,display:"flex",gap:5,flexShrink:0,overflowX:"auto",background:WHITE}}>
          {filters.map(([k,lbl])=>(
            <button key={k} type="button" onClick={()=>setFilter(k)}
              style={{padding:"4px 11px",borderRadius:99,border:`1px solid ${filter===k?ORANGE:LIGHTER}`,background:filter===k?`${ORANGE}10`:WHITE,color:filter===k?ORANGE:MID,fontSize:11,fontFamily:FF,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {lbl}
            </button>
          ))}
          <span style={{fontSize:11,color:LIGHT,fontFamily:FF,alignSelf:"center",marginLeft:4,flexShrink:0}}>{filtered.length} shown</span>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>
        {!showPlots?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:LIGHT,height:"100%"}}>
            <div style={{fontFamily:FF,fontSize:15,color:MID}}>Start a search or switch to Parcels above</div>
          </div>
        ):(
          <div className="ye-map-list-grid">
            {filtered.map((p,i)=>{
              const zc=ZONE_COLORS[p.zone]||{fill:"#eee",stroke:"#aaa"};
              const active=selectedParcelId===p.id;
              const inProj=projectPlots.includes(p.id);
              const v=p.verdict?VERDICT[p.verdict]:null;
              return(
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onParcelClick(p);}}}
                  onClick={()=>onParcelClick(p)}
                  style={{
                    background:WHITE,
                    border:`1px solid ${active?ORANGE:LIGHTER}`,
                    borderLeft:`4px solid ${zc.stroke}`,
                    borderRadius:10,
                    overflow:"hidden",
                    animation:"fadeIn 0.2s ease both",
                    animationDelay:`${i*0.02}s`,
                    display:"flex",
                    flexDirection:"column",
                    minWidth:0,
                    boxShadow:active?"0 2px 8px rgba(232,82,26,0.15)":"0 1px 2px rgba(0,0,0,0.04)",
                    cursor:"pointer",
                    textAlign:"left",
                  }}
                >
                  <div style={{padding:"8px 10px 10px",display:"flex",flexDirection:"column",gap:5,flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                      <span style={{fontFamily:FFM,fontSize:11,color:ORANGE}}>{p.ref}</span>
                      <span style={{fontSize:10,fontWeight:600,fontFamily:FF,color:p.listed?ORANGE:MID,border:`1px solid ${p.listed?`${ORANGE}35`:LIGHTER}`,borderRadius:99,padding:"1px 6px",background:p.listed?`${ORANGE}0c`:BG2}}>
                        {p.listed?"For sale":"Unlisted"}
                      </span>
                    </div>
                    <div style={{fontSize:11,color:LIGHT,fontFamily:FFM}}>{p.id}</div>
                    <div style={{fontWeight:600,fontSize:13,color:INK,fontFamily:FF,lineHeight:1.3}}>{p.pdm}</div>
                    <div style={{fontSize:12,color:MID,fontFamily:FF}}>{p.zone} · {p.area}</div>
                    {v&&(
                      <span style={{alignSelf:"flex-start",color:v.color,borderRadius:99,padding:"1px 6px",fontSize:10,fontWeight:600,border:`1px solid ${v.color}28`,fontFamily:FF,background:WHITE}}>{v.label}</span>
                    )}
                    <div style={{marginTop:6}} onClick={e=>e.stopPropagation()}>
                      {p.plotId&&(
                        <button type="button" onClick={(e)=>{e.stopPropagation();onOpenListing(p.plotId);}}
                          style={{width:"100%",marginBottom:6,background:INK,border:"none",borderRadius:99,padding:"6px 0",fontSize:12,fontWeight:500,color:WHITE,cursor:"pointer",fontFamily:FF}}>
                          View listing →
                        </button>
                      )}
                      <button type="button" onClick={(e)=>{e.stopPropagation();onAddToProject(p.id);}}
                        style={{width:"100%",background:inProj?`${GREEN}0f`:BG2,border:`1px solid ${inProj?`${GREEN}30`:LIGHTER}`,borderRadius:99,padding:"6px 0",fontSize:12,color:inProj?GREEN:MID,cursor:"pointer",fontFamily:FF}}>
                        {inProj?"Saved":"Save parcel"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function AddToProjectToast({plotId,onConfirm,onClose}){
  return(
    <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:INK,borderRadius:8,padding:"12px 18px",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",zIndex:500,display:"flex",alignItems:"center",gap:12,animation:"slideUp 0.2s ease both",minWidth:300,border:`1px solid rgba(255,255,255,0.06)`}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:500,fontSize:15,color:WHITE,marginBottom:1,fontFamily:FF}}>{plotId} saved to My Plots</div>
        <div style={{fontSize:15,color:"rgba(255,255,255,0.4)",fontFamily:FF}}>Open dashboard to manage</div>
      </div>
      <button onClick={onConfirm} style={{background:ORANGE,border:"none",borderRadius:99,padding:"6px 14px",fontSize:15,fontWeight:500,color:WHITE,cursor:"pointer",flexShrink:0,fontFamily:FF}}>View →</button>
      <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:15}}>✕</button>
    </div>
  );
}

// ── INPUT BAR ─────────────────────────────────────────────────────────────────
function InputBar({input,setInput,send,activePlot,activeICP,analysisState,runAnalysis,onOpenListing,onAddToProject,onClearPlot,onBrowseCadastre,projectPlots,upgraded,onUpgrade,plotType,plotVerdict}){
  const [plusOpen,setPlusOpen]=useState(false);
  const [tooltip,setTooltip]=useState(false);
  const plusRef=useRef(null);
  const fileInputRef=useRef(null);

  useEffect(()=>{
    function handle(e){if(plusRef.current&&!plusRef.current.contains(e.target))setPlusOpen(false);}
    document.addEventListener("mousedown",handle);
    return()=>document.removeEventListener("mousedown",handle);
  },[]);

  const activeListingId = activePlot ? plotListingOpenId(activePlot) : null;
  const saved = activeListingId ? projectPlots?.includes(activeListingId) : false;
  const pinContext = activePlot && isExplorerPinPlot(activePlot);

  // + menu — plot-centric when selected (map toolbar owns area research & drop pin)
  const menuItems = activePlot ? [
    {icon:"⊕", label: pinContext ? "Deep analysis (needs listing ref)" : "Land agent + analysis", highlight:true, upgrade:!upgraded&&!pinContext, fn:()=>{setPlusOpen(false); pinContext ? runAnalysis() : upgraded ? runAnalysis() : onUpgrade();}},
    {icon:"✦", label: pinContext ? "Add pin to pipeline…" : "Add plot to pipeline…", active:saved, fn:()=>{setPlusOpen(false);onAddToProject(activeListingId);}},
    {divider:true},
    {icon:"⎗", label:"Attach file or photo (demo)", fn:()=>{setPlusOpen(false);fileInputRef.current?.click();}},
    {icon:"↗", label:"Open listing page", disabled:pinContext||!onOpenListing, fn:()=>{setPlusOpen(false);if(activeListingId)onOpenListing(activeListingId);}},
    {divider:true},
    {icon:"⊟", label:"Browse parcels (cadastre)", fn:()=>{setPlusOpen(false);onBrowseCadastre&&onBrowseCadastre();}},
  ] : [
    {icon:"⊟", label:"Browse parcels (cadastre)", fn:()=>{setPlusOpen(false);onBrowseCadastre&&onBrowseCadastre();}},
  ];

  return(
    <div style={{padding:"0 10px 12px",borderTop:`1px solid ${LIGHTER}`,flexShrink:0,background:WHITE}}>

      {/* Status hint — shown when plot is selected */}
      {activePlot&&(
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 2px 6px",animation:"fadeIn 0.2s ease both"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:pinContext?ORANGE:GREEN_BRIGHT,flexShrink:0}}/>
          <span style={{...T.label,color:MID}}>
            {pinContext ? (
              <>Map pin — <span style={{color:INK,fontWeight:500}}>ask anything</span> about this spot, or use <span style={{color:INK,fontWeight:500}}>+</span> for analysis / save</>
            ) : (
              <><span style={{color:INK,fontWeight:500}}>{activeListingId}</span> · On this plot — ask anything or use <span style={{color:INK,fontWeight:500}}>+</span> for actions</>
            )}
          </span>
        </div>
      )}

      <div style={{background:CHROME,borderRadius:10,border:`1px solid rgba(0,0,0,0.1)`,padding:"10px 10px 8px",minHeight:80,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>

        {/* Text input — top */}
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&input.trim()&&send(input.trim())}
          placeholder={activePlot?`Ask anything about ${activeListingId}…`:activeICP?"Ask or pick a suggestion above…":"e.g. rustic land near Porto, 25km from coast…"}
          style={{background:"none",border:"none",outline:"none",...T.body,width:"100%",marginBottom:10}}/>

        {/* Bottom row */}
        <div style={{display:"flex",alignItems:"center",gap:5}}>

          {/* Plot avatar — square, bottom-left */}
          {activePlot&&(
            <div style={{position:"relative",flexShrink:0}}>
              <div
                style={{width:36,height:36,borderRadius:6,overflow:"hidden",border:`1.5px solid ${pinContext?`${ORANGE}55`:"rgba(44,95,45,0.3)"}`,cursor:"default",animation:"fadeIn 0.18s ease both",position:"relative"}}
                onMouseEnter={e=>{
                  setTooltip(true);
                  const b=e.currentTarget.querySelector("button");if(b)b.style.opacity="1";
                }}
                onMouseLeave={e=>{
                  setTooltip(false);
                  const b=e.currentTarget.querySelector("button");if(b)b.style.opacity="0";
                }}>
                <PlotImage plot={activePlot} type={activePlot.type} index={0}/>
                <button onClick={e=>{e.stopPropagation();onClearPlot();}}
                  style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"rgba(17,17,16,0.55)",border:"none",cursor:"pointer",color:WHITE,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.15s"}}>✕</button>
              </div>
              {tooltip&&(
                <div style={{position:"absolute",bottom:36,left:0,background:INK,borderRadius:8,padding:"10px 12px",boxShadow:"0 6px 20px rgba(0,0,0,0.18)",zIndex:300,minWidth:180,animation:"fadeIn 0.12s ease both",pointerEvents:"none"}}>
                  <div style={{fontSize:15,color:"rgba(255,255,255,0.4)",fontFamily:FFM,letterSpacing:"0.05em",marginBottom:3}}>{activeListingId}</div>
                  <div style={{fontSize:15,fontWeight:500,color:WHITE,fontFamily:FF,marginBottom:1}}>{activePlot.region}</div>
                  <div style={{fontSize:15,color:"rgba(255,255,255,0.5)",fontFamily:FF}}>{activePlot.area} · {activePlot.price}</div>
                  <div style={{fontSize:15,color:"rgba(255,255,255,0.28)",fontFamily:FF,marginTop:4}}>Hover to dismiss</div>
                </div>
              )}
            </div>
          )}

          {/* + button */}
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{display:"none"}}
            onChange={e=>{
              const f=e.target.files?.[0];
              e.target.value="";
              if(!f)return;
              setInput(s=>`${s}${s&&!s.endsWith(" ")?" ":""}[Attached: ${f.name}]`);
            }}/>
          {activePlot&&(
            <button type="button" title="Attach file or photo (demo)"
              onClick={()=>fileInputRef.current?.click()}
              style={{width:28,height:28,borderRadius:6,background:"transparent",border:`1px solid ${LIGHTER}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:MID}}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M8.5 2.5 4 7a2 2 0 102.8 2.8L12 4.5a3 3 0 00-4.2-4.2L3.2 5a4 4 0 105.6 5.6l5.7-5.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          <div style={{position:"relative",flexShrink:0}} ref={plusRef}>
            <button onClick={()=>setPlusOpen(v=>!v)}
              style={{width:28,height:28,borderRadius:6,background:plusOpen?INK:"transparent",border:`1px solid ${plusOpen?INK:LIGHTER}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.1s",color:plusOpen?WHITE:MID}}
              onMouseEnter={e=>{if(!plusOpen){e.currentTarget.style.borderColor=INK;e.currentTarget.style.color=INK;}}}
              onMouseLeave={e=>{if(!plusOpen){e.currentTarget.style.borderColor=LIGHTER;e.currentTarget.style.color=MID;}}}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {plusOpen&&(
              <div style={{position:"absolute",bottom:36,left:0,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"6px",boxShadow:"0 8px 28px rgba(0,0,0,0.12)",zIndex:200,minWidth:220,animation:"fadeIn 0.15s ease both"}}>
                {activePlot&&(
                  <div style={{padding:"6px 10px 8px",borderBottom:`1px solid ${LIGHTER}`,marginBottom:4}}>
                    <div style={{...TC.labelUC,marginBottom:2}}>Selected plot</div>
                    <div style={{...TC.body,fontWeight:600,color:INK}}>{activePlot.id} · {activePlot.region}</div>
                  </div>
                )}
                {!activePlot&&(
                  <div style={{padding:"6px 10px 8px",borderBottom:`1px solid ${LIGHTER}`,marginBottom:4}}>
                    <div style={{...TC.secondary,lineHeight:1.45,color:MID}}>Area research & drop pin: use the toolbar on the map.</div>
                  </div>
                )}
                {menuItems.map((item,i)=>
                  item.divider
                    ? <div key={i} style={{height:1,background:LIGHTER,margin:"4px 0"}}/>
                    : (
                      <div key={i} onClick={item.disabled?undefined:item.fn}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,cursor:item.disabled?"default":"pointer",...TC.body,transition:"background 0.1s",
                          opacity:item.disabled?0.4:1,
                          color:INK}}
                        onMouseEnter={e=>{if(!item.disabled)e.currentTarget.style.background=BG;}}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <span style={{fontSize:13,width:18,textAlign:"center",flexShrink:0,color:item.highlight?ACCENT:MID}}>{item.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{...TC.body,fontWeight:item.highlight?600:400,color:INK}}>{item.label}</div>
                        </div>
                        {item.upgrade&&<span style={{fontSize:11,color:ACCENT,background:"rgba(37,99,235,0.08)",border:`1px solid rgba(37,99,235,0.22)`,borderRadius:99,padding:"2px 8px",flexShrink:0,fontFamily:FF,fontWeight:600}}>Upgrade</span>}
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          <div style={{flex:1}}/>

          {/* Send */}
          <button onClick={()=>input.trim()&&send(input.trim())}
            style={{background:input.trim()?INK:LIGHTER,border:"none",borderRadius:6,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.15s"}}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 10V2M2 6l4-4 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function VerdictMessage({p, projectPlots, onOpenListing, handleAddToProject, hideHeader=false}){
  const [expanded,setExpanded]=useState(false);
  const [legalSent,setLegalSent]=useState(false);
  const v=VERDICT[p.aiVerdict];
  const shell = p.aiVerdict==="great_match"
    ? { bg:CARD_POS_BG, bd:CARD_POS_BD }
    : p.aiVerdict==="good_match"
    ? { bg:CARD_GOOD_BLUE_BG, bd:CARD_GOOD_BLUE_BD }
    : { bg:CARD_NOTE_BG, bd:CARD_NOTE_BD };

  const inner = (
    <div style={{
      flex:1,
      background:WHITE,
      border: hideHeader?"none":`1px solid rgba(0,0,0,0.07)`,
      borderRadius: hideHeader?"0":"12px",
      overflow:"hidden",
      boxShadow: hideHeader?"none":"0 1px 3px rgba(0,0,0,0.04)",
    }}>

        {/* Compact header — ref-style white card */}
        <div style={{padding:"12px 14px 10px",borderBottom:`1px solid rgba(0,0,0,0.06)`}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...TC.labelUC,marginBottom:4}}>Location analysis</div>
              <div style={{...TC.body,fontWeight:600,color:INK}}>{p.id}</div>
              <div style={{...TC.label,color:MID,marginTop:2}}>{p.region}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:FF,fontSize:22,fontWeight:700,color:v.color,lineHeight:1}}>{p.score}<span style={{fontSize:11,fontWeight:600,color:MID,marginLeft:2}}>/100</span></div>
              <div style={{...TC.label,color:v.color,fontWeight:600,marginTop:3}}>{v.label}</div>
            </div>
          </div>
          <div style={{...TC.label,color:MID,marginTop:8}}>{p.type} · {p.area}</div>
        </div>

        {/* Single soft summary box */}
        <div style={{padding:"10px 14px",borderBottom:`1px solid rgba(0,0,0,0.05)`}}>
          <div style={{...TC.labelUC,marginBottom:5}}>Summary</div>
          <div style={{
            padding:"10px 11px",
            borderRadius:8,
            background:shell.bg,
            border:`1px solid ${shell.bd}`,
            ...TC.secondary,
            lineHeight:1.58,
            color:INK,
          }}>{p.aiSummary}</div>
        </div>

        {/* Key findings — one line + tooltip (less visual weight) */}
        <div style={{padding:"8px 14px 10px",borderBottom:`1px solid rgba(0,0,0,0.05)`}}>
          <div style={{...TC.labelUC,marginBottom:5}}>Key findings</div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {p.signals.map((s,si)=>(
              <div
                key={si}
                title={s.detail}
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:8,
                  padding:"5px 0 5px 8px",
                  borderLeft:`2px solid ${s.ok?GREEN_BRIGHT:"#d97706"}`,
                  cursor:"default",
                }}
              >
                <span style={{fontSize:10,color:s.ok?GREEN_BRIGHT:"#b45309",flexShrink:0,width:12}}>{s.ok?"✓":"!"}</span>
                <span style={{...TC.body,fontWeight:500,color:INK,lineHeight:1.35}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full data — quiet */}
        <div style={{borderBottom:`1px solid rgba(0,0,0,0.05)`}}>
          <div onClick={()=>setExpanded(x=>!x)}
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px",cursor:"pointer",transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background=ROW_HOVER}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{...TC.body,fontWeight:500,color:MID}}>Full plot data</span>
              <span style={{...TC.label,color:MID,opacity:0.9}}>Pro</span>
            </div>
            <span style={{...TC.label,color:LIGHT}}>{expanded?"▲":"▼"}</span>
          </div>
          {expanded&&(
            <div style={{padding:"0 14px 10px",animation:"fadeIn 0.2s ease both"}}>
              {Object.entries(p.technical).map(([k,val])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"4px 0",borderBottom:`1px solid rgba(0,0,0,0.06)`}}>
                  <span style={{...TC.labelUC}}>{k}</span>
                  <span style={{...TC.body,textAlign:"right",maxWidth:"58%"}}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions — text links */}
        <div style={{padding:"4px 10px 8px",display:"flex",flexWrap:"wrap",gap:2}}>
          {[
            {label:"View listing", fn:()=>onOpenListing(plotListingOpenId(p)), color:ACCENT, disabled:false},
            {label:projectPlots.includes(plotListingOpenId(p))?"Saved":"Save", fn:()=>handleAddToProject(plotListingOpenId(p)), color:projectPlots.includes(plotListingOpenId(p))?GREEN:MID, disabled:false},
            {label:legalSent?"Legal check sent":"Legal check", fn:()=>setLegalSent(true), color:GREEN, disabled:legalSent},
          ].map((a,ai)=>(
            <button key={ai} type="button" onClick={a.disabled?undefined:a.fn}
              style={{
                ...TC.body,
                fontWeight:500,
                color:a.color,
                background:"none",
                border:"none",
                cursor:a.disabled?"default":"pointer",
                padding:"6px 8px",
                borderRadius:6,
                opacity:a.disabled?0.55:1,
              }}
              onMouseEnter={e=>{if(!a.disabled)e.currentTarget.style.background=ROW_HOVER;}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
              {a.label}
            </button>
          ))}
        </div>
    </div>
  );

  return(
    <div style={{width:"100%",animation:"fadeIn 0.25s ease both"}}>
      {inner}
    </div>
  );
}
function ChatMapView({upgraded,setShowUpgradeModal,onAddToProject,onCommitPlotsToPipeline,projectPlots,onGoToDashboard,onOpenListing,listingSavedScans,persistListingScan,pipelineFocusCanonicalId,onPipelineFocusConsumed}){
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(()=>{
    const onResize = ()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",onResize);
    return()=>window.removeEventListener("resize",onResize);
  },[]);

  const [mobileTab, setMobileTab] = useState("chat"); // chat | map

  const [sidebarW, setSidebarW] = useState(400);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  useEffect(()=>{
    function onMove(e){
      if(!isResizing.current) return;
      const dx = e.clientX - startX.current;
      setSidebarW(Math.min(560, Math.max(300, startW.current + dx)));
    }
    function onUp(){ isResizing.current = false; document.body.style.cursor=""; document.body.style.userSelect=""; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return()=>{ window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  },[]);

  function startResize(e){
    isResizing.current = true;
    startX.current = e.clientX;
    startW.current = sidebarW;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [mapResults,setMapResults]=useState(()=>initialNationwideMapResults());
  const lastListingsMapResultsRef = useRef(initialNationwideMapResults());
  useEffect(()=>{
    if(mapResults.kind==="listings") lastListingsMapResultsRef.current=mapResults;
  },[mapResults]);
  const [showPlots,setShowPlots]=useState(true);
  const [activePin,setActivePin]=useState(null);
  const [activePlot,setActivePlot]=useState(null);
  const [mapPinMode,setMapPinMode]=useState(false);
  const [mapPinMarker,setMapPinMarker]=useState(null);
  const [drawAreaSelection,setDrawAreaSelection]=useState(null);
  const [lassoClearSeq,setLassoClearSeq]=useState(0);
  const [pipelineModal,setPipelineModal]=useState(null);
  const [pipelineNameInput,setPipelineNameInput]=useState("");
  const [drawBulkRunning,setDrawBulkRunning]=useState(false);
  const [drawBulkDone,setDrawBulkDone]=useState(false);
  const [listingMapFilters,setListingMapFilters]=useState({});
  const listingPlotsFiltered=useMemo(()=>{
    if(mapResults.kind!=="listings")return[];
    let arr=mapResults.plots.filter(p=>passesListingMapFilters(p,listingMapFilters));
    const sb=listingMapFilters?.sortBy||"match";
    arr=[...arr];
    if(sb==="score-desc")arr.sort((a,b)=>(b.score||0)-(a.score||0));
    else if(sb==="price-asc")arr.sort((a,b)=>(parseListingPriceEuro(a)||0)-(parseListingPriceEuro(b)||0));
    else if(sb==="price-desc")arr.sort((a,b)=>(parseListingPriceEuro(b)||0)-(parseListingPriceEuro(a)||0));
    return arr;
  },[mapResults.kind,mapResults.plots,listingMapFilters]);
  useEffect(()=>{
    if(mapResults.kind!=="listings"||!activePlot)return;
    if(isExplorerPinPlot(activePlot)) return;
    if(!listingPlotsFiltered.some(p=>p.id===activePlot.id)){
      setActivePlot(null);
      setActivePin(null);
      setMapPinMarker(null);
      setAnalysisState("idle");
    }
  },[mapResults.kind,listingPlotsFiltered,activePlot]);
  const [analysisState,setAnalysisState]=useState("idle"); // idle | thinking | done
  const [expandedData,setExpandedData]=useState(false);
  const [isTyping,setIsTyping]=useState(false);
  const [searchCount,setSearchCount]=useState(0);
  const [mapMode,setMapMode]=useState("map");
  const [cadastreMode,setCadastreMode]=useState(false);
  const [selectedParcel,setSelectedParcel]=useState(null);
  const [toast,setToast]=useState(null);
  const [activeICP,setActiveICP]=useState(null);
  const messagesEndRef=useRef(null);
  const FREE_LIMIT=10;

  const drawAreaEntities=useMemo(()=>{
    if(!drawAreaSelection?.ids?.length)return[];
    if(drawAreaSelection.lens==="parcels"){
      return (mapResults.parcels||[]).filter((p)=>drawAreaSelection.ids.includes(p.id));
    }
    return listingPlotsFiltered.filter((p)=>drawAreaSelection.ids.includes(p.id));
  },[drawAreaSelection,mapResults.parcels,listingPlotsFiltered,mapResults.kind]);

  const hasDrawArea=drawAreaEntities.length>0;
  const listPrimaryPlots=hasDrawArea&&!cadastreMode&&mapResults.kind==="listings"?drawAreaEntities:listingPlotsFiltered;
  const listContextLabel=hasDrawArea&&!cadastreMode&&mapResults.kind==="listings"
    ?`Selected area · ${drawAreaEntities.length} listings`
    :mapResults.contextLabel;

  useEffect(()=>{messagesEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages,isTyping,activePlot,analysisState]);

  const onDrawAreaSelectionChange=useCallback((payload)=>{
    if(!payload?.ids?.length){
      setDrawAreaSelection(null);
      setDrawBulkDone(false);
      return;
    }
    setDrawAreaSelection({ ids:payload.ids, lens:payload.lens });
    setDrawBulkDone(false);
  },[]);

  function queueSaveToPipeline(rawIds){
    const idArr=(Array.isArray(rawIds)?rawIds:[rawIds]).map(String);
    const toAdd=idArr.filter((id)=>!projectPlots.some((p)=>canonicalPipelineId(p)===canonicalPipelineId(id)));
    if(toAdd.length===0){
      idArr.forEach((id)=>onAddToProject(id));
      return;
    }
    setPipelineModal({ ids:toAdd });
    setPipelineNameInput("");
  }

  function confirmPipelineSave(mode,namedLabel){
    if(!pipelineModal?.ids?.length){setPipelineModal(null);return;}
    if(onCommitPlotsToPipeline) onCommitPlotsToPipeline(pipelineModal.ids);
    else pipelineModal.ids.forEach((id)=>onAddToProject(id));
    const label=mode==="my"?`My listings`:namedLabel||"Pipeline";
    setToast({ text:`${pipelineModal.ids.length} saved · ${label}`, mode });
    setPipelineModal(null);
    setTimeout(()=>setToast(null),4500);
  }

  function handleExplorerAdd(id){queueSaveToPipeline([id]);}

  function runDrawAreaBulkAnalysis(){
    if(!drawAreaEntities.length||!drawAreaSelection)return;
    const bulkPlots=drawAreaSelection.lens==="parcels"?drawAreaEntities.map(parcelToBulkPlot):drawAreaEntities;
    const parcelsSubset=drawAreaSelection.lens==="parcels"?drawAreaEntities:null;
    const listingsSubset=drawAreaSelection.lens==="listings"?drawAreaEntities:null;
    setDrawBulkRunning(true);
    const regions=[...new Set(bulkPlots.map((p)=>p.region||p.pdm))];
    const thinkId="drawbulk-"+Date.now();
    setMessages((m)=>[...m,{role:"user",text:`Analyse area: ${bulkPlots.length} ${drawAreaSelection.lens==="parcels"?"parcels (cadastre)":"listings"} across ${regions.join(", ")}`}]);
    setMessages((m)=>[...m,{role:"assistant",isThinking:true,id:thinkId,steps:[]}]);
    const steps=["Fetching cadastre records…","Cross-referencing PDM zones…","Checking fire risk & slope data…","Running AI scoring model…","Ranking by match score…"];
    steps.forEach((s,i)=>{ setTimeout(()=>{ setMessages((m)=>m.map((msg)=>msg.id===thinkId?{...msg,steps:[...msg.steps,s]}:msg)); },(i+1)*550); });
    setTimeout(()=>{
      if(parcelsSubset?.length>0){
        setMapResults({kind:"parcels",headlineCount:parcelsSubset.length,contextLabel:"Drawn area · parcels",plots:[],parcels:[...parcelsSubset]});
      }else if(listingsSubset?.length>0){
        setListingMapFilters({});
        setMapResults({kind:"listings",headlineCount:listingsSubset.length,contextLabel:"Drawn area · listings",plots:[...listingsSubset],parcels:[]});
      }
      setMessages((m)=>m.map((msg)=>msg.id===thinkId?{role:"assistant",isBulkResult:true,bulkPlots}:msg));
      setDrawBulkRunning(false);
      setDrawBulkDone(true);
      setMobileTab("chat");
    },steps.length*550+600);
  }

  function clearPlotFocus(){
    setActivePlot(null);
    setActivePin(null);
    setMapPinMarker(null);
    setMapPinMode(false);
    setAnalysisState("idle");
  }

  function startICP(id){
    const s=CHAT_ICPS.find(i=>i.id===id);
    setActiveICP(id);
    clearPlotFocus();
    setMessages([{role:"assistant",text:`${s.label} — what are you looking for?`,showChips:true,icpId:id}]);
    setShowPlots(false);
  }

  function selectPlot(plot){
    setLassoClearSeq((s)=>s+1);
    setDrawAreaSelection(null);
    setDrawBulkDone(false);
    setMapPinMode(false);
    setActivePlot(plot);
    setActivePin(plot.id);
    setAnalysisState("idle");
    setExpandedData(false);
    if(isExplorerPinPlot(plot)) setMapPinMarker({x:plot.x,y:plot.y});
    else setMapPinMarker(null);
  }

  function handleMapPinPlaced(x,y){
    setMapPinMode(false);
    selectPlot(makeExplorerPinPlot(x,y));
    setMobileTab("chat");
  }

  function enterMapPinMode(){
    setCadastreMode(false);
    setMapResults(lastListingsMapResultsRef.current);
    setShowPlots(true);
    setMapPinMode(true);
    setMobileTab("map");
  }

  function switchToListingsLens(){
    setCadastreMode(false);
    setMapResults(lastListingsMapResultsRef.current);
    setActivePin(null);
    setActivePlot(null);
    setSelectedParcel(null);
    setMapPinMarker(null);
    setMapPinMode(false);
    setLassoClearSeq((s)=>s+1);
    setDrawAreaSelection(null);
    setDrawBulkDone(false);
  }

  function switchToParcelsLens(){
    setCadastreMode(true);
    setMapResults(parcelCatalogResults());
    setActivePin(null);
    setActivePlot(null);
    setSelectedParcel(null);
    setMapPinMarker(null);
    setMapPinMode(false);
    setLassoClearSeq((s)=>s+1);
    setDrawAreaSelection(null);
    setDrawBulkDone(false);
  }

  function browseCadastreFromMenu(){
    switchToParcelsLens();
    setMobileTab("map");
  }

  useEffect(()=>{
    if(!pipelineFocusCanonicalId)return;
    const canon=pipelineFocusCanonicalId;
    const fromMap=mapResults.kind==="listings"?mapResults.plots.find(p=>plotListingOpenId(p)===canon):null;
    const base=CHAT_PLOTS.find(p=>p.id===canon);
    const resolved=fromMap||(base?{...base}:null);
    if(resolved){
      setActivePlot(resolved);
      setActivePin(resolved.id);
      setAnalysisState("idle");
      if(isExplorerPinPlot(resolved)) setMapPinMarker({ x: resolved.x, y: resolved.y });
      else setMapPinMarker(null);
    }
    setMapMode("map");
    setMobileTab("map");
    setCadastreMode(false);
    onPipelineFocusConsumed?.();
  },[pipelineFocusCanonicalId]);

  function sendPlotToChat(plot,{mode,recap:recapArg}){
    const cid=plotListingOpenId(plot);
    const recap=recapArg||listingRecapFromStore(listingSavedScans,cid);
    const label=plot.name||cid;
    if(mode==="deep"){
      const summary=recap?`**${recap.verdictLabel}** — ${recap.verdictSummary}`:`No saved land-agent scan yet — run **Land agent + analysis** in chat first, then the recap appears on the sidebar and here. You can still ask anything from listing details.`;
      setMessages(m=>[...m,
        {role:"user",text:`Deep dive / full analysis — ${label} (${cid})`},
        {role:"assistant",text:`${summary}\n\nThis thread is for follow-ups. A **saved recap** only exists after a completed land-agent run in chat — it stays on the listing sidebar and in your browser.`},
      ]);
    }else{
      setMessages(m=>[...m,
        {role:"user",text:`Question about ${label} (${cid})`},
        {role:"assistant",text:`Context: **${label}** · ${plot.region||""}. Ask anything — zoning, price, risks, or next steps.`},
      ]);
    }
    setMobileTab("chat");
  }

  function runAnalysis(){
    if(!activePlot) return;
    if(isExplorerPinPlot(activePlot)){
      setMobileTab("chat");
      setMessages((m)=>[
        ...m,
        { role: "user", text: `Full land analysis — map pin (${activePlot.ref || activePlot.id})` },
        {
          role: "assistant",
          text: "A **dropped pin** is not a listing yet. Search in chat or tap a plot on the map, then run the land agent for zoning, RAN/REN, and a saved report.",
        },
      ]);
      return;
    }
    if(!upgraded){
      setShowUpgradeModal(true);
      return;
    }
    const plot = activePlot;
    const listingId = plotListingOpenId(plot);
    const resolvedPlot = CHAT_PLOTS.find((pl) => pl.id === listingId) || plot;
    setAnalysisState("thinking");
    setMobileTab("chat");

    const label=resolvedPlot.name||listingId;
    setMessages(m=>[...m, {role:"user", text:`Full land analysis — ${label} (${listingId})`}]);

    const landAgentSteps=[
      "Land agent: fetching listing & cadastre pointers…",
      "Land agent: querying geographic layers (PDM, RAN, REN)…",
      "Land agent: interpreting municipality & location context…",
      "Land agent: attaching plot — handing off to regulatory analyst…",
    ];
    const regulatorySteps=[
      "Checking zoning classification and PDM articles…",
      "Cross-referencing cadastre registry (BUPI)…",
      "Evaluating RAN and REN restrictions…",
      "Reviewing IMT transaction history…",
      "Checking encumbrances and title chain…",
      "Assessing buildability and permitted uses…",
      "Consolidating match score & risk flags…",
    ];

    const agentThinkId=Date.now();
    const deepThinkId=agentThinkId+1;
    setMessages(m=>[...m, {role:"assistant", isThinking:true, id:agentThinkId, steps:[]}]);

    const landMs=420;
    landAgentSteps.forEach((step,i)=>{
      setTimeout(()=>{
        setMessages(m=>m.map(msg=>msg.id===agentThinkId?{...msg, steps:[...msg.steps, step]}:msg));
      },(i+1)*landMs);
    });

    const afterLand=(landAgentSteps.length+1)*landMs+400;
    setTimeout(()=>{
      setMessages(m=>m.map(msg=>msg.id===agentThinkId
        ? {role:"assistant", text:`**Land agent** — location, layers, and listing context are ready. Starting the full regulatory pass below.`}
        : msg));
      setMessages(m=>[...m, {role:"assistant", isThinking:true, id:deepThinkId, steps:[]}]);

      regulatorySteps.forEach((step,j)=>{
        setTimeout(()=>{
          setMessages(m=>m.map(msg=>msg.id===deepThinkId?{...msg, steps:[...msg.steps, step]}:msg));
          if(j===regulatorySteps.length-1){
            setTimeout(()=>{
              setAnalysisState("done");
              setMessages((m)=>m.map((msg)=>msg.id===deepThinkId
                ? {role:"assistant", isVerdict:true, plotId:resolvedPlot.id, plot:resolvedPlot}
                : msg));
              setTimeout(()=>{
                persistListingScan(listingId,buildListingRecapData(resolvedPlot));
              },0);
            },650);
          }
        },(j+1)*480);
      });
    },afterLand);
  }

  function send(text){
    const isSearch=!!text.match(/find|show|search|plot|land|ha\b|€|eur|ruin|solar|eco|cabin/i);
    if(!upgraded&&searchCount>=FREE_LIMIT){
      setMessages(m=>[...m,{role:"user",text},{role:"assistant",text:"You've reached your free search limit.",showUpgrade:true}]);
      setInput("");return;
    }
    if(isSearch)setSearchCount(c=>c+1);
    clearPlotFocus();
    setMessages(m=>[...m.filter(x=>!x.isPlotCtx),{role:"user",text}]);
    setInput("");setIsTyping(true);
    if(isSearch)setCadastreMode(false);
    setTimeout(()=>{
      setIsTyping(false);
      if(!isSearch){
        setMessages(m=>[...m,{role:"assistant",text:"Describe what you're looking for — location, type, size or use.",showResults:false}]);
        return;
      }
      const n = 20 + Math.floor(Math.random() * 280);
      const ql = text.length > 44 ? text.slice(0, 41) + "…" : text;
      const plots = expandPlotsForSearchResults(CHAT_PLOTS, n, text);
      setMessages(m=>[...m,{
        role:"assistant",
        text:`Found ${plots.length} plots matching your criteria.`,
        showResults:true,
        resultCount:plots.length,
      }]);
      setMapResults({
        kind:"listings",
        headlineCount:plots.length,
        contextLabel:`Search · ${ql}`,
        plots,
        parcels:[],
      });
      setListingMapFilters({});
      setShowPlots(true);
      setActivePin(null);
    },900);
  }

  // Analysis messages — streamed in one by one
  const ANALYSIS_STEPS = [
    "Checking zoning classification and PDM article…",
    "Cross-referencing cadastre registry (BUPI)…",
    "Evaluating RAN and REN restrictions…",
    "Reviewing IMT transaction history…",
    "Checking encumbrances and title chain…",
    "Assessing buildability and use rights…",
    "Calculating match score…",
  ];

  return(
    <div style={{flex:1,minHeight:0,display:"flex",overflow:"hidden"}}>
      <PipelineSaveModal
        open={!!pipelineModal}
        count={pipelineModal?.ids?.length||0}
        pipelineName={pipelineNameInput}
        setPipelineName={setPipelineNameInput}
        onClose={()=>setPipelineModal(null)}
        onSaveMyListings={()=>confirmPipelineSave("my")}
        onSaveNamed={(name)=>confirmPipelineSave("named",name)}
      />
      {toast&&(
        <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:INK,borderRadius:8,padding:"11px 18px",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",zIndex:500,display:"flex",alignItems:"center",gap:12,minWidth:280}}>
          <span style={{flex:1,fontSize:15,color:WHITE,fontFamily:FF}}>{typeof toast==="object"&&toast?.text?toast.text:`${toast} saved`}</span>
          <button onClick={()=>{setToast(null);onGoToDashboard();}} style={{background:ORANGE,border:"none",borderRadius:99,padding:"5px 12px",fontSize:15,fontWeight:500,color:WHITE,cursor:"pointer",fontFamily:FF}}>View →</button>
          <button onClick={()=>setToast(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:15}}>✕</button>
        </div>
      )}

      {/* ── LEFT: CHAT ── */}
      <div style={{width:sidebarW,flexShrink:0,background:PANEL,display:"flex",flexDirection:"column",height:"100%",position:"relative",boxShadow:"1px 0 0 rgba(0,0,0,0.06)"}}>

        {/* Header */}
        <div style={{height:44,padding:"0 14px",borderBottom:`1px solid ${LIGHTER}`,display:"flex",alignItems:"center",gap:8,flexShrink:0,background:CHROME}}>
          <div style={{flex:1,...TC.body,fontWeight:600,fontSize:14}}>Yonder</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:ONLINE}}/>
            <span style={{...TC.label,color:MID}}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="ye-scroll" style={{flex:1,overflowY:"auto",padding:"14px 12px",background:SUBTLE}}>

          {/* Empty state */}
          {messages.length===0&&(
            <div style={{animation:"fadeIn 0.3s ease both"}}>
              <div style={{...TC.title,marginBottom:4}}>
                Find land in <span style={{color:ACCENT}}>Portugal</span>
              </div>
              <p style={{...TC.secondary,margin:0,marginBottom:14,lineHeight:1.5,color:MID}}>
                Search freely below — or tap a focus for suggested prompts <span style={{opacity:0.75}}>(hover for more)</span>.
              </p>

              <div style={{...TC.labelUC,marginBottom:8}}>Starting points</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8}}>
                {CHAT_ICPS.map((icp2,idx)=>(
                  <button
                    key={icp2.id}
                    type="button"
                    title={`${icp2.label}: ${icp2.desc}`}
                    aria-label={`${icp2.label}. ${icp2.desc}`}
                    onClick={()=>startICP(icp2.id)}
                    style={{
                      margin:0,
                      padding:"10px 6px 8px",
                      borderRadius:12,
                      border:`1px solid ${LIGHTER}`,
                      background:WHITE,
                      cursor:"pointer",
                      display:"flex",
                      flexDirection:"column",
                      alignItems:"center",
                      gap:5,
                      transition:"background 0.12s, border-color 0.12s, box-shadow 0.12s",
                      animation:`fadeIn 0.25s ease ${idx*0.04}s both`,
                      WebkitTapHighlightColor:"transparent",
                    }}
                    onMouseEnter={e=>{
                      e.currentTarget.style.background="var(--explorer-active-row)";
                      e.currentTarget.style.borderColor="rgba(37,99,235,0.25)";
                      e.currentTarget.style.boxShadow="0 1px 3px rgba(37,99,235,0.08)";
                    }}
                    onMouseLeave={e=>{
                      e.currentTarget.style.background=WHITE;
                      e.currentTarget.style.borderColor=LIGHTER;
                      e.currentTarget.style.boxShadow="none";
                    }}
                  >
                    <span style={{fontSize:17,lineHeight:1,color:MID}} aria-hidden>{icp2.icon}</span>
                    <span style={{fontFamily:FF,fontSize:10,fontWeight:600,color:INK,letterSpacing:"0.02em",textAlign:"center",lineHeight:1.2}}>{icp2.short}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg,i)=>(
            <div key={i} style={{marginBottom:10,display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",animation:"fadeIn 0.2s ease both"}}>

              {msg.role==="assistant"&&msg.isThinking&&(
                <div style={{display:"flex",gap:8,width:"100%",alignItems:"flex-start"}}>
                  <div style={{width:20,height:20,borderRadius:999,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <span style={{fontFamily:FF,fontSize:11,fontWeight:600,color:WHITE,lineHeight:1}}>Y</span>
                  </div>
                  <div style={{flex:1,background:CHAT_THINK_BG,border:`1px solid ${CHAT_THINK_BD}`,borderRadius:14,padding:"10px 12px",display:"flex",flexDirection:"column",gap:6}}>
                    {msg.steps.map((step,si)=>(
                      <div key={si} style={{display:"flex",alignItems:"center",gap:8,animation:"fadeIn 0.2s ease both"}}>
                        <div style={{width:4,height:4,borderRadius:"50%",background:ACCENT,flexShrink:0,animation:`pulse 1.2s ease ${si*0.1}s infinite`}}/>
                        <span style={{...TC.body,color:MID}}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.role==="assistant"&&msg.isVerdict&&msg.plot&&(
                <div style={{width:"100%"}}>
                  <VerdictMessage p={msg.plot} projectPlots={projectPlots} onOpenListing={onOpenListing} handleAddToProject={handleExplorerAdd}/>
                </div>
              )}

              {msg.role==="assistant"&&msg.isBulkResult&&msg.bulkPlots&&(
                <div style={{width:"100%"}}>
                  <BulkResultCard plots={msg.bulkPlots} onOpenListing={onOpenListing} onAddToProject={handleExplorerAdd} onQueueSaveMany={queueSaveToPipeline} projectPlots={projectPlots}/>
                </div>
              )}

              {msg.role==="assistant"&&!msg.isThinking&&!msg.isVerdict&&!msg.isBulkResult&&(
                <div style={{display:"flex",gap:8,width:"100%",alignItems:"flex-start"}}>
                  <div style={{width:20,height:20,borderRadius:999,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <span style={{fontFamily:FF,fontSize:11,fontWeight:600,color:WHITE,lineHeight:1}}>Y</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{background:WHITE,borderRadius:14,padding:"10px 12px",...TC.body,border:`1px solid rgba(0,0,0,0.06)`,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>{msg.text}</div>
                    {msg.showResults&&(
                      <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,...TC.label,color:MID}}>
                          <div style={{width:5,height:5,borderRadius:"50%",background:ACCENT,flexShrink:0}}/>
                          <span><span style={{fontWeight:600,color:INK}}>{msg.resultCount} listings</span> on the map — tap to open</span>
                        </div>
                        {mapResults.kind==="listings"&&mapResults.plots[0]&&(
                        <div onClick={()=>{ const p=mapResults.plots[0]; if(p){selectPlot(p); setTimeout(()=>runAnalysis(),300);} }}
                          style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"var(--explorer-active-row)",border:`1px solid rgba(37,99,235,0.2)`,borderRadius:12,cursor:"pointer",transition:"background 0.1s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,99,235,0.12)";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="var(--explorer-active-row)";}}>
                          <span style={{fontSize:14,color:ACCENT,flexShrink:0}}>⊕</span>
                          <div>
                            <div style={{...TC.body,fontWeight:500,color:INK}}>Run land agent + analysis (top result)</div>
                            <div style={{...TC.secondary,marginTop:1}}>Chat: agent → full pass → Q&amp;A; report saves on listing</div>
                          </div>
                          <span style={{...TC.label,color:ACCENT,marginLeft:"auto",flexShrink:0}}>→</span>
                        </div>
                        )}
                      </div>
                    )}
                    {msg.showUpgrade&&(
                      <button onClick={()=>setShowUpgradeModal(true)} style={{marginTop:6,background:"none",border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"5px 12px",...TC.label,color:ACCENT,cursor:"pointer",fontFamily:FF,display:"block",fontWeight:500}}>View plans →</button>
                    )}
                    {msg.showChips&&msg.icpId&&(()=>{
                      const ic=CHAT_ICPS.find(x=>x.id===msg.icpId);
                      return ic?(
                        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:0,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:12,overflow:"hidden"}}>
                          {ic.prompts.map((pr,pi)=>(
                            <div key={pi} onClick={()=>send(pr)}
                              style={{padding:"8px 11px",borderBottom:pi<ic.prompts.length-1?`1px solid ${LIGHTER}`:"none",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",...TC.body,transition:"background 0.1s"}}
                              onMouseEnter={e=>{e.currentTarget.style.background="var(--explorer-active-row)";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                              <span>{pr}</span><span style={{color:ACCENT,flexShrink:0,marginLeft:8}}>→</span>
                            </div>
                          ))}
                        </div>
                      ):null;
                    })()}
                  </div>
                </div>
              )}

              {msg.role==="user"&&(
                <div style={{background:CHAT_USER_BG,border:`1px solid ${CHAT_USER_BD}`,borderRadius:14,padding:"8px 12px",...TC.body,maxWidth:"88%",lineHeight:1.55,color:INK}}>{msg.text}</div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping&&(
            <div style={{display:"flex",gap:8,alignItems:"flex-start",animation:"fadeIn 0.2s ease both",marginBottom:10}}>
              <div style={{width:20,height:20,borderRadius:999,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontFamily:FF,fontSize:11,fontWeight:600,color:WHITE,lineHeight:1}}>Y</span>
              </div>
              <div style={{background:CHAT_THINK_BG,border:`1px solid ${CHAT_THINK_BD}`,borderRadius:14,padding:"10px 12px",display:"flex",gap:4,alignItems:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
                {[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:"50%",background:ACCENT,opacity:0.45,animation:`bounce 1s ease ${i*0.15}s infinite`}}/>)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef}/>
        </div>

        {/* Input area */}
        <InputBar
          input={input} setInput={setInput} send={send}
          activePlot={activePlot} activeICP={activeICP}
          analysisState={analysisState} runAnalysis={runAnalysis}
          onOpenListing={onOpenListing} onAddToProject={handleExplorerAdd}
          projectPlots={projectPlots} upgraded={upgraded}
          onUpgrade={()=>setShowUpgradeModal(true)}
          onClearPlot={()=>clearPlotFocus()}
          onBrowseCadastre={browseCadastreFromMenu}
          plotType={activePlot?.type}
          plotVerdict={activePlot?.aiVerdict}
        />
      </div>

      {/* ── RESIZE HANDLE ── */}
      {!isMobile&&<div
        onMouseDown={startResize}
        style={{width:5,flexShrink:0,background:LIGHTER,cursor:"col-resize",position:"relative",zIndex:10,transition:"background 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.background=ACCENT}
        onMouseLeave={e=>e.currentTarget.style.background=LIGHTER}
      />}

      {/* ── RIGHT: MAP + LIST ── */}
      <div style={{flex:1,display:isMobile&&mobileTab!=="map"?"none":"flex",flexDirection:"column",minWidth:0,paddingBottom:isMobile?52:0}}>
        {/* Toolbar — v4 titlebar chrome */}
        <div style={{height:44,borderBottom:`1px solid rgba(0,0,0,0.06)`,background:CHROME,display:"flex",alignItems:"center",padding:"0 12px",gap:8,flexShrink:0}}>
          <div style={{display:"flex",background:SUBTLE,borderRadius:99,padding:3,border:`1px solid ${LIGHTER}`}}>
            {[["map","Map"],["list","List"]].map(([m,lbl])=>(
              <button key={m} onClick={()=>setMapMode(m)}
                style={{
                  background:mapMode===m?ACCENT:"transparent",
                  border:"1px solid transparent",
                  borderRadius:99,
                  padding:"4px 14px",
                  ...TC.label,
                  fontWeight:mapMode===m?600:500,
                  color:mapMode===m?WHITE:MID,
                  cursor:"pointer",
                  transition:"all 0.1s",
                }}>{lbl}</button>
            ))}
          </div>
          {/* Map lens: listings (for sale) vs parcels (cadastre / BUPI) */}
          <div style={{display:"flex",background:SUBTLE,borderRadius:99,padding:3,border:`1px solid ${LIGHTER}`}}>
            <button type="button" onClick={switchToListingsLens}
              style={{
                background:!cadastreMode?ACCENT:"transparent",
                border:"1px solid transparent",
                borderRadius:99,
                padding:"4px 12px",
                ...TC.label,
                fontWeight:!cadastreMode?600:500,
                color:!cadastreMode?WHITE:MID,
                cursor:"pointer",
                transition:"all 0.1s",
              }}>Listings</button>
            <button type="button" onClick={switchToParcelsLens}
              style={{
                background:cadastreMode?ORANGE:"transparent",
                border:"1px solid transparent",
                borderRadius:99,
                padding:"4px 12px",
                ...TC.label,
                fontWeight:cadastreMode?600:500,
                color:cadastreMode?WHITE:MID,
                cursor:"pointer",
                transition:"all 0.1s",
              }}>Parcels            </button>
          </div>
          {hasDrawArea&&(
            <button type="button" onClick={()=>setMapMode("list")}
              style={{
                ...TC.label,
                fontWeight:600,
                background:`${ORANGE}14`,
                border:`1px solid ${ORANGE}35`,
                borderRadius:99,
                padding:"4px 12px",
                color:ORANGE,
                cursor:"pointer",
                whiteSpace:"nowrap",
              }}>
              Area ({drawAreaEntities.length})
            </button>
          )}
          <span style={{...T.label,color:LIGHT,whiteSpace:"nowrap"}}>
            {cadastreMode
              ? `${mapResults.parcels.length.toLocaleString()} parcels`
              : showPlots && mapResults.kind==="listings" && listingPlotsFiltered.length < mapResults.plots.length
                ? `${listingPlotsFiltered.length.toLocaleString()} of ${mapResults.plots.length.toLocaleString()} listings`
                : showPlots
                  ? `${listingsCountForMapAndList(mapResults).toLocaleString()} listings`
                  : ""}
          </span>
        </div>

        {!cadastreMode && mapResults.kind==="listings" && showPlots && (
          <MapFilters
            filters={listingMapFilters}
            setFilters={setListingMapFilters}
            resultCount={listingPlotsFiltered.length}
            totalCount={mapResults.plots.length}
          />
        )}

        {/* Map or List */}
        <div style={{flex:1,position:"relative",minHeight:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {mapMode==="map"
            ?<PortugalMap plots={mapResults.kind==="listings"?listingPlotsFiltered:[]} activePin={activePin}
                setActivePin={(id)=>{if(id){const p=listingPlotsFiltered.find(pl=>pl.id===id);if(p)selectPlot(p);}else setActivePin(null);}}
                showPlots={showPlots} onOpenListing={onOpenListing}
                cadastreMode={cadastreMode}
                cadastreParcels={cadastreMode?mapResults.parcels:[]}
                selectedParcelId={selectedParcel?.id}
                onParcelClick={(parcel)=>setSelectedParcel(p=>p?.id===parcel.id?null:parcel)}
                pinMode={mapPinMode&&!cadastreMode}
                setPinMode={setMapPinMode}
                pinMarker={!cadastreMode&&mapResults.kind==="listings"?mapPinMarker:null}
                onPinPlaced={handleMapPinPlaced}
                onDrawAreaSelectionChange={onDrawAreaSelectionChange}
                lassoClearSeq={lassoClearSeq}
                onLayerToggle={(id, on)=>{ if(id==="boundaries"||id==="crus"){ setCadastreMode(on); setMapPinMode(false); if(on) setMapResults(parcelCatalogResults()); else { setMapResults(lastListingsMapResultsRef.current); setSelectedParcel(null);} } }}/>
            : cadastreMode
              ? <ParcelMapListView showPlots={showPlots}
                  parcels={mapResults.parcels}
                  headlineCount={mapResults.headlineCount}
                  contextLabel={mapResults.contextLabel}
                  selectedParcelId={selectedParcel?.id}
                  onParcelClick={(parcel)=>setSelectedParcel(p=>p?.id===parcel.id?null:parcel)}
                  onOpenListing={onOpenListing}
                  onAddToProject={handleExplorerAdd}
                  projectPlots={projectPlots}/>
              : <MapListView showPlots={showPlots}
                  plots={listPrimaryPlots}
                  headlineCount={hasDrawArea&&!cadastreMode&&mapResults.kind==="listings"?drawAreaEntities.length:listingsCountForMapAndList(mapResults)}
                  contextLabel={listContextLabel}
                  onOpenListing={onOpenListing}
                  onListingFocus={selectPlot}
                  onAddToProject={handleExplorerAdd} projectPlots={projectPlots} upgraded={upgraded} onUpgrade={()=>setShowUpgradeModal(true)}
                  listingFilterActive={!hasDrawArea&&(listingPlotsFiltered.length < mapResults.plots.length || listingFiltersActive(listingMapFilters))}
                  mapTotal={mapResults.plots.length}/>
          }
          {hasDrawArea&&drawAreaSelection&&(
            <DrawAreaSelectionSidebar
              lens={drawAreaSelection.lens}
              rows={drawAreaEntities}
              onClose={()=>{ setLassoClearSeq((s)=>s+1); setDrawAreaSelection(null); setDrawBulkDone(false); }}
              onInspectListing={(p)=>selectPlot(p)}
              onInspectParcel={(par)=>{ setLassoClearSeq((s)=>s+1); setDrawAreaSelection(null); setDrawBulkDone(false); setSelectedParcel(par); }}
              onSaveAll={()=>{
                const ids=drawAreaSelection.lens==="parcels"?drawAreaEntities.map((p)=>p.id):drawAreaEntities.map((p)=>plotListingOpenId(p));
                queueSaveToPipeline(ids);
              }}
              onAnalyseAll={runDrawAreaBulkAnalysis}
              bulkRunning={drawBulkRunning}
              bulkDone={drawBulkDone}
              projectPlots={projectPlots}
            />
          )}
          {!cadastreMode&&mapResults.kind==="listings"&&activePlot&&!hasDrawArea&&(
            <ListingInsightSidebar
              plot={activePlot}
              onClose={()=>{ clearPlotFocus(); setMessages((m)=>m.filter((x)=>!x.isPlotCtx)); }}
              onOpenListing={onOpenListing}
              onAddToProject={handleExplorerAdd}
              inProject={projectPlots.includes(plotListingOpenId(activePlot))}
              upgraded={upgraded}
              onUpgrade={()=>setShowUpgradeModal(true)}
              savedRecap={listingRecapFromStore(listingSavedScans, plotListingOpenId(activePlot))}
              onStartLandAgentInChat={()=>{setMobileTab("chat");setTimeout(()=>runAnalysis(),120);}}
              onSendToChat={sendPlotToChat}
            />
          )}
          {/* Cadastre side panel — floats over map or list */}
          {cadastreMode&&selectedParcel&&(
            <CadastreSidePanel
              parcel={selectedParcel}
              onClose={()=>setSelectedParcel(null)}
              onAddToProject={handleExplorerAdd}
              inProject={projectPlots.includes(selectedParcel.id)}
              onOpenListing={onOpenListing}
              onAnalyse={(parcel)=>{
                const thinkId="cad-"+Date.now();
                setMessages(m=>[...m,
                  {role:"user", text:`Analyse cadastre parcel ${parcel.ref} — ${parcel.pdm}, ${parcel.area}`},
                  {role:"assistant", isThinking:true, id:thinkId, steps:[]}
                ]);
                const steps=["Looking up cadastre ref…","Checking PDM classification…","Reviewing RAN/REN restrictions…","Running AI buildability score…","Generating report…"];
                steps.forEach((s,i)=>{ setTimeout(()=>{ setMessages(m=>m.map(msg=>msg.id===thinkId?{...msg,steps:[...msg.steps,s]}:msg)); },(i+1)*500); });
                setTimeout(()=>{
                  const base = CHAT_PLOTS.find(p=>p.id===parcel.plotId)||CHAT_PLOTS[Math.floor(Math.random()*CHAT_PLOTS.length)];
                  const syntheticPlot = {...base, id:parcel.ref, name:(parcel.pdm||"Cadastre parcel")+" — "+parcel.ref, region: parcel.ref.split("-").slice(0,2).join("-")};
                  setMessages(m=>m.map(msg=>msg.id===thinkId?{role:"assistant",isVerdict:true,plotId:syntheticPlot.id,plot:syntheticPlot}:msg));
                  handleExplorerAdd(parcel.id);
                  setSelectedParcel(null);
                }, steps.length*500+600);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}


// ── PROJECTS DATA ─────────────────────────────────────────────────────────────
const INIT_PROJECTS = [
  { id:"p1", name:"Eco Tourism Alentejo", icon:"◍", desc:"Rustic plots for glamping and eco lodge development", color:"#2C5F2D", plotIds:[1,3,5], created:"Jan 2025" },
  { id:"p2", name:"Hotel Site Search",    icon:"⊞", desc:"Urban and mixed-use land for boutique hotel development", color:"#e8521a", plotIds:[2,4],   created:"Feb 2025" },
  { id:"p3", name:"Solar Portfolio",      icon:"◈", desc:"Large-format flat land near grid infrastructure", color:"#1A5276", plotIds:[5],     created:"Mar 2025" },
];

// ── PROJECTS VIEW ─────────────────────────────────────────────────────────────
function resolveChatPlot(pid){
  return CHAT_PLOTS.find(p=>p.id===pid) || CHAT_PLOTS.find(p=>p.ref===pid) || null;
}
function canonicalPipelineId(pid){
  return resolveChatPlot(pid)?.id ?? pid;
}

function ProjectsView({onOpenListing, upgraded, onUpgrade, projectPlots, onAddToProject, setActiveNav, listingSavedScans, onInspectPlotInSearch}){
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [activeProject, setActiveProject] = useState(null);
  const [view, setView] = useState("list"); // list | kanban
  const [selected, setSelected] = useState([]); // selected plot ids
  const [bulkState, setBulkState] = useState("idle"); // idle | running | done
  const [detailPlot, setDetailPlot] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("suitability");
  const [showNewProject, setShowNewProject] = useState(false);
  const [newName, setNewName] = useState("");

  const plots = activeProject
    ? MOCK_PLOTS.filter(p => activeProject.plotIds.includes(p.id))
    : MOCK_PLOTS;

  const filtered = plots
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.region.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==="suitability" ? b.suitability-a.suitability : sortBy==="price" ? parseInt(b.price.replace(/\D/g,""))-parseInt(a.price.replace(/\D/g,"")) : 0);

  function toggleSelect(id){
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  }
  function selectAll(){ setSelected(filtered.map(p=>p.id)); }
  function clearSelect(){ setSelected([]); }

  function runBulkAnalysis(){
    setBulkState("running");
    setTimeout(()=>setBulkState("done"), 3200);
  }

  function createProject(){
    if(!newName.trim()) return;
    const icons = ["⊞","◫","◈","⬡","◍","◉"];
    const colors = [GREEN, ORANGE, "#1A5276", MID];
    setProjects(p=>[...p, {
      id:`p${Date.now()}`, name:newName.trim(), icon:icons[Math.floor(Math.random()*icons.length)],
      desc:"", color:colors[Math.floor(Math.random()*colors.length)], plotIds:[], created:"Mar 2025"
    }]);
    setNewName(""); setShowNewProject(false);
  }

  const anySelected = selected.length > 0;

  return(
    <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",overflow:"hidden",background:WHITE,position:"relative",fontFamily:FF}}>

      {/* ── Bulk action bar — sticky, appears on selection ── */}
      {anySelected&&(
        <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:200,background:INK,borderRadius:10,padding:"10px 14px",boxShadow:"0 8px 32px rgba(0,0,0,0.22)",display:"flex",alignItems:"center",gap:8,minWidth:440,maxWidth:"calc(100% - 32px)",flexWrap:"wrap",animation:"slideUp 0.2s ease both"}}>
          <span style={{...TP.secondary,color:"rgba(255,255,255,0.55)",marginRight:2}}>{selected.length} selected</span>
          <button type="button" onClick={selectAll} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",cursor:"pointer",...TP.body,color:"rgba(255,255,255,0.45)",padding:0}}>Select all</button>
          <div style={{width:1,height:14,background:"rgba(255,255,255,0.12)"}}/>
          {bulkState==="idle"&&(
            <>
              <button type="button" onClick={runBulkAnalysis} style={{background:ORANGE,border:"none",borderRadius:8,padding:"6px 12px",...TP.body,fontWeight:600,color:WHITE,cursor:"pointer"}}>⊕ Run AI analysis</button>
              <button type="button" style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"6px 12px",...TP.body,color:WHITE,cursor:"pointer"}}>✉ Outreach</button>
              <button type="button" style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"6px 12px",...TP.body,color:WHITE,cursor:"pointer"}}>⊞ Add to project</button>
              <button type="button" style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"6px 12px",...TP.body,color:WHITE,cursor:"pointer"}}>↓ Export</button>
            </>
          )}
          {bulkState==="running"&&(
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:200}}>
              <div style={{flex:1,height:3,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",background:ORANGE,width:"60%",borderRadius:99,animation:"pulse 1.2s ease infinite"}}/>
              </div>
              <span style={{...TP.secondary,color:"rgba(255,255,255,0.55)",whiteSpace:"nowrap"}}>Analysing {selected.length}…</span>
            </div>
          )}
          {bulkState==="done"&&(
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1,flexWrap:"wrap"}}>
              <span style={{...TP.body,color:GREEN_BRIGHT,fontWeight:600}}>✓ Done — {selected.length} scored</span>
              <button type="button" onClick={()=>{setBulkState("idle");}} style={{background:"none",border:`1px solid ${GREEN_BRIGHT}`,borderRadius:8,padding:"4px 10px",...TP.body,color:GREEN_BRIGHT,cursor:"pointer",fontWeight:500}}>Dismiss</button>
            </div>
          )}
          <button type="button" onClick={clearSelect} style={{background:"none",border:"none",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:14,marginLeft:"auto",padding:0}}>✕</button>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{padding:"14px 24px 0",flexShrink:0,borderBottom:`1px solid ${LIGHTER}`,background:WHITE}}>
        {/* Breadcrumb */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
          {activeProject&&(
            <button type="button" onClick={()=>{setActiveProject(null);setSelected([]);setDetailPlot(null);}}
              style={{background:"none",border:"none",padding:0,cursor:"pointer",...TP.crumb,display:"flex",alignItems:"center",gap:4}}>
              Projects
            </button>
          )}
          {activeProject&&<span style={{color:LIGHTER,...TP.crumb}}>›</span>}
          <span style={{...TP.body,color:INK,fontWeight:activeProject?600:500}}>
            {activeProject?activeProject.name:"Pipeline"}
          </span>
        </div>

        {/* Project list view header */}
        {!activeProject&&(
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16,gap:12,flexWrap:"wrap"}}>
            <div>
              <div style={{...TP.pageTitle}}>{projects.length} projects</div>
              <div style={{...TP.secondary,marginTop:4}}>{MOCK_PLOTS.length} demo plots in workspace</div>
            </div>
            <button type="button" onClick={()=>setShowNewProject(true)}
              style={{background:INK,border:"none",borderRadius:99,padding:"7px 14px",...TP.body,fontWeight:600,color:WHITE,cursor:"pointer"}}>
              + New project
            </button>
          </div>
        )}

        {/* Inside project header */}
        {activeProject&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:8,background:`${activeProject.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,border:`1px solid ${LIGHTER}`}}>{activeProject.icon}</div>
              <div>
                <div style={{...TP.sectionTitle}}>{activeProject.name}</div>
                {activeProject.desc&&<div style={{...TP.secondary,marginTop:2,maxWidth:420}}>{activeProject.desc}</div>}
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{position:"relative"}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
                  style={{padding:"6px 12px 6px 28px",border:`1px solid ${LIGHTER}`,borderRadius:99,background:SUBTLE,...TP.body,color:INK,outline:"none",width:168,fontFamily:FF}}/>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:LIGHT,...TP.label,pointerEvents:"none"}}>⌕</span>
              </div>
              <button type="button" onClick={()=>setView(v=>v==="list"?"kanban":"list")}
                style={{background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",...TP.body,color:MID,cursor:"pointer",fontWeight:500}}>
                {view==="list"?"Board":"List"}
              </button>
              <button type="button" onClick={()=>{selectAll();}}
                style={{background:SUBTLE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",...TP.body,color:MID,cursor:"pointer",fontWeight:500}}>
                Select all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Project list ── */}
      {!activeProject&&(
        <div className="ye-scroll" style={{flex:1,minHeight:0,overflowY:"auto",padding:"12px 24px 28px",background:SUBTLE}}>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8,gap:12}}>
              <span style={{...TP.labelUC}}>Your pipeline</span>
              <span style={{...TP.label,color:MID}}>{projectPlots.length} saved</span>
            </div>
            {projectPlots.length===0 ? (
              <div style={{...TP.secondary,lineHeight:1.55,padding:"12px 14px",background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10}}>
                No plots saved yet. Go to <button type="button" onClick={()=>setActiveNav&&setActiveNav("Search")} style={{background:"none",border:"none",padding:0,cursor:"pointer",color:ACCENT,fontWeight:600,fontFamily:FF,textDecoration:"underline",fontSize:"inherit"}}>Search</button>
                {" "}and use <strong style={{color:INK,fontWeight:600}}>Save</strong> on the map or in a listing.
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {projectPlots.map(pid=>{
                  const p = resolveChatPlot(pid);
                  const canon = canonicalPipelineId(pid);
                  const hasAiReport = !!listingRecapFromStore(listingSavedScans, canon);
                  if (p) return(
                    <div key={pid} style={{display:"flex",alignItems:"center",gap:12,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"10px 14px"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:2}}>
                          <span style={{...TP.body,fontWeight:600,color:INK}}>{p.name}</span>
                          {hasAiReport&&(
                            <span style={{...TP.labelUC,color:GREEN,background:`${GREEN}12`,border:`1px solid ${GREEN}35`,borderRadius:99,padding:"2px 8px"}}>AI report</span>
                          )}
                        </div>
                        <span style={{...TP.mono,display:"block",marginTop:2}}>{p.id} · {p.region}</span>
                        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                          <button type="button" onClick={()=>onInspectPlotInSearch&&onInspectPlotInSearch(canon)} style={{background:INK,border:"none",borderRadius:99,padding:"6px 12px",...TP.body,fontWeight:600,color:WHITE,cursor:"pointer"}}>Open in search</button>
                          <button type="button" onClick={()=>onOpenListing(p.id)} style={{background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",...TP.body,color:MID,cursor:"pointer",fontWeight:500}}>Full listing</button>
                        </div>
                      </div>
                      <button type="button" onClick={()=>onAddToProject(pid)} style={{background:"none",border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",...TP.body,color:MID,cursor:"pointer",flexShrink:0,fontWeight:500}}>Remove</button>
                    </div>
                  );
                  return(
                    <div key={pid} style={{display:"flex",alignItems:"center",gap:12,background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"10px 14px"}}>
                      <div style={{flex:1}}>
                        <div style={{...TP.body,fontWeight:600,color:INK}}>{pid}</div>
                        <div style={{...TP.secondary,marginTop:2}}>Cadastre or reference — open Search to continue</div>
                      </div>
                      <button type="button" onClick={()=>onAddToProject(pid)} style={{background:"none",border:`1px solid ${LIGHTER}`,borderRadius:99,padding:"6px 12px",...TP.body,color:MID,cursor:"pointer",fontWeight:500}}>Remove</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* New project input */}
          {showNewProject&&(
            <div style={{background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"12px 14px",marginBottom:10,display:"flex",gap:8,alignItems:"center",animation:"fadeIn 0.2s ease both"}}>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")createProject();if(e.key==="Escape"){setShowNewProject(false);setNewName("");}}}
                placeholder="Project name…"
                style={{flex:1,background:"none",border:"none",outline:"none",...TP.body,color:INK,fontFamily:FF}}/>
              <button type="button" onClick={createProject}
                style={{background:INK,border:"none",borderRadius:8,padding:"6px 12px",...TP.body,fontWeight:600,color:WHITE,cursor:"pointer"}}>Create</button>
              <button type="button" onClick={()=>{setShowNewProject(false);setNewName("");}}
                style={{background:"none",border:"none",color:LIGHT,cursor:"pointer",...TP.label}}>✕</button>
            </div>
          )}

          {projects.map((proj,i)=>{
            const projPlots = MOCK_PLOTS.filter(p=>proj.plotIds.includes(p.id));
            const avgScore = projPlots.length ? Math.round(projPlots.reduce((a,p)=>a+p.suitability,0)/projPlots.length) : 0;
            return(
              <div key={proj.id} onClick={()=>setActiveProject(proj)}
                style={{background:WHITE,border:`1px solid ${LIGHTER}`,borderRadius:10,padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"border-color 0.1s",animation:`fadeIn 0.2s ease ${i*0.04}s both`}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=proj.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=LIGHTER}>
                <div style={{width:40,height:40,borderRadius:10,background:`${proj.color}12`,border:`1px solid ${LIGHTER}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{proj.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{...TP.body,fontWeight:600,color:INK,marginBottom:2}}>{proj.name}</div>
                  <div style={{...TP.secondary}}>{proj.desc||"No description"}</div>
                </div>
                <div style={{display:"flex",gap:12,alignItems:"center",flexShrink:0}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{...TP.stat}}>{projPlots.length}</div>
                    <div style={{...TP.statCap}}>plots</div>
                  </div>
                  {projPlots.length>0&&(
                    <div style={{textAlign:"right"}}>
                      <div style={{...TP.stat,color:avgScore>=85?GREEN:avgScore>=70?ACCENT:MID}}>{avgScore}</div>
                      <div style={{...TP.statCap}}>avg</div>
                    </div>
                  )}
                  <span style={{color:LIGHT,...TP.secondary}}>›</span>
                </div>
              </div>
            );
          })}

          <div role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==="Enter"||e.key===" ") setActiveProject({id:"all",name:"All plots",icon:"⊟",desc:"Every plot across all projects",color:MID,plotIds:MOCK_PLOTS.map(p=>p.id),created:""});}} onClick={()=>setActiveProject({id:"all",name:"All plots",icon:"⊟",desc:"Every plot across all projects",color:MID,plotIds:MOCK_PLOTS.map(p=>p.id),created:""})}
            style={{background:WHITE,border:`1px dashed ${LIGHTER}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"opacity 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <div style={{width:40,height:40,borderRadius:10,background:SUBTLE,border:`1px solid ${LIGHTER}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,color:MID}}>⊟</div>
            <div style={{flex:1}}>
              <div style={{...TP.body,fontWeight:600,color:MID}}>All plots</div>
              <div style={{...TP.secondary}}>{MOCK_PLOTS.length} plots across demo projects</div>
            </div>
            <span style={{color:LIGHT,...TP.secondary}}>›</span>
          </div>
        </div>
      )}

      {/* ── Inside project: plots ── */}
      {activeProject&&(
        <div style={{flex:1,display:"flex",overflow:"hidden",background:SUBTLE}}>
          <div className="ye-scroll" style={{flex:1,overflowY:"auto",padding:"12px 24px 60px"}}>

            <div style={{display:"flex",gap:12,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${LIGHTER}`,flexWrap:"wrap",alignItems:"center"}}>
              {[
                {label:"Plots", value:filtered.length},
                {label:"Avg score", value:filtered.length?Math.round(filtered.reduce((a,p)=>a+p.suitability,0)/filtered.length):0},
                {label:"Total value", value:"€"+Math.round(filtered.reduce((a,p)=>a+parseInt(p.price.replace(/\D/g,"")),0)/1000)+"K"},
              ].map(s=>(
                <div key={s.label} style={{display:"flex",gap:8,alignItems:"baseline",paddingRight:14,borderRight:`1px solid ${LIGHTER}`}}>
                  <span style={{...TP.stat}}>{s.value}</span>
                  <span style={{...TP.statCap}}>{s.label}</span>
                </div>
              ))}
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                {["suitability","price"].map(s=>(
                  <button type="button" key={s} onClick={()=>setSortBy(s)}
                    style={{background:sortBy===s?INK:WHITE,border:`1px solid ${sortBy===s?INK:LIGHTER}`,borderRadius:99,padding:"4px 10px",...TP.label,color:sortBy===s?WHITE:MID,cursor:"pointer",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s}</button>
                ))}
              </div>
            </div>

            {view==="list"&&filtered.length===0&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"64px 16px",gap:12,textAlign:"center"}}>
                <div style={{width:44,height:44,borderRadius:10,background:WHITE,border:`1px solid ${LIGHTER}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:LIGHT}}>⊟</div>
                <div style={{...TP.sectionTitle}}>No plots in this project yet</div>
                <div style={{...TP.secondary,maxWidth:300}}>Search for land and save plots here to start building your pipeline.</div>
                <button type="button" onClick={()=>setActiveNav&&setActiveNav("Search")} style={{marginTop:4,background:INK,border:"none",borderRadius:99,padding:"8px 18px",...TP.body,color:WHITE,cursor:"pointer",fontWeight:600}}>Search land →</button>
              </div>
            )}
            {view==="list"&&filtered.length>0&&(
              <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 4px"}}>
                <thead>
                  <tr>{["","Name","Region","Size","Price","Score","Stage","Projects",""].map((h,i)=>(
                    <th key={i} style={{textAlign:"left",...TP.tableHead,padding:"0 10px 6px",fontWeight:600}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(plot=>{
                    const isSel = selected.includes(plot.id);
                    const plotProjects = INIT_PROJECTS.filter(pr=>pr.plotIds.includes(plot.id));
                    return(
                      <tr key={plot.id} style={{background:isSel?`${ORANGE}08`:detailPlot?.id===plot.id?`${ACCENT}08`:WHITE,transition:"background 0.1s",boxShadow:`0 0 0 1px ${LIGHTER}`,borderRadius:8}}>
                        <td style={{padding:"8px 10px",borderRadius:"8px 0 0 8px",width:28}}>
                          <div role="presentation" onClick={()=>toggleSelect(plot.id)}
                            style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${isSel?ORANGE:LIGHTER}`,background:isSel?ORANGE:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.1s"}}>
                            {isSel&&<span style={{color:WHITE,fontSize:11,lineHeight:1}}>✓</span>}
                          </div>
                        </td>
                        <td style={{padding:"8px 10px",minWidth:140}} onClick={()=>setDetailPlot(detailPlot?.id===plot.id?null:plot)}>
                          <div style={{...TP.body,fontWeight:600,color:INK,marginBottom:2}}>{plot.name}</div>
                          <div style={{...TP.mono,color:LIGHT}}>{plot.ref}</div>
                        </td>
                        <td style={{padding:"8px 10px",...TP.secondary}}>{plot.region}</td>
                        <td style={{padding:"8px 10px",...TP.mono}}>{plot.size}</td>
                        <td style={{padding:"8px 10px",...TP.body,fontWeight:600,color:INK}}>{plot.price}</td>
                        <td style={{padding:"8px 10px"}}>
                          <span style={{...TP.body,fontWeight:700,color:plot.suitability>=85?GREEN:plot.suitability>=70?ACCENT:MID}}>{plot.suitability}</span>
                        </td>
                        <td style={{padding:"8px 10px"}}><StagePill stage={plot.stage}/></td>
                        <td style={{padding:"8px 10px"}}>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {plotProjects.map(pr=>(
                              <span key={pr.id} style={{...TP.label,color:pr.color,background:`${pr.color}12`,borderRadius:99,padding:"2px 6px",whiteSpace:"nowrap",fontWeight:600}}>{pr.name.split(" ")[0]}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{padding:"8px 10px",borderRadius:"0 8px 8px 0"}}>
                          <button type="button" onClick={()=>setDetailPlot(detailPlot?.id===plot.id?null:plot)}
                            style={{background:detailPlot?.id===plot.id?SUBTLE:INK,border:`1px solid ${detailPlot?.id===plot.id?LIGHTER:"transparent"}`,borderRadius:99,padding:"5px 12px",...TP.body,color:detailPlot?.id===plot.id?MID:WHITE,cursor:"pointer",fontWeight:600}}>
                            {detailPlot?.id===plot.id?"Close":"Open →"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {view==="kanban"&&(
              <div style={{display:"flex",gap:10,alignItems:"flex-start",overflowX:"auto",paddingBottom:16}}>
                {STAGES.map(stage=>{
                  const sp=filtered.filter(p=>p.stage===stage);
                  const c=STAGE_COLORS[stage];
                  return(
                    <div key={stage} style={{width:188,flexShrink:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,padding:"4px 0"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:c}}/>
                        <span style={{...TP.tableHead,color:c,letterSpacing:"0.06em",fontWeight:600}}>{stage}</span>
                        <span style={{...TP.label,color:MID,marginLeft:"auto",background:WHITE,borderRadius:99,padding:"2px 8px",border:`1px solid ${LIGHTER}`}}>{sp.length}</span>
                      </div>
                      {sp.map(plot=>{
                        const isSel=selected.includes(plot.id);
                        return(
                          <div key={plot.id}
                            style={{background:WHITE,border:`1px solid ${isSel?ORANGE:LIGHTER}`,borderRadius:8,padding:"10px",marginBottom:6,cursor:"pointer",transition:"border-color 0.1s"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                              <div role="presentation" onClick={()=>toggleSelect(plot.id)}
                                style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${isSel?ORANGE:LIGHTER}`,background:isSel?ORANGE:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                {isSel&&<span style={{color:WHITE,fontSize:10,lineHeight:1}}>✓</span>}
                              </div>
                              <div style={{...TP.mono}}>{plot.ref}</div>
                            </div>
                            <div onClick={()=>setDetailPlot(detailPlot?.id===plot.id?null:plot)}>
                              <div style={{...TP.body,fontWeight:600,color:INK,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{plot.name}</div>
                              <div style={{...TP.secondary,marginBottom:8}}>{plot.region}</div>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                <span style={{...TP.body,fontWeight:600,color:INK}}>{plot.price}</span>
                                <span style={{...TP.body,fontWeight:700,color:plot.suitability>=85?GREEN:plot.suitability>=70?ACCENT:MID}}>{plot.suitability}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {sp.length===0&&<div style={{border:`1px dashed ${LIGHTER}`,borderRadius:8,padding:"14px",textAlign:"center",...TP.secondary}}>Empty</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {detailPlot&&(
            <div style={{width:320,flexShrink:0,overflow:"hidden",animation:"slideIn 0.18s ease both",boxShadow:"-4px 0 20px rgba(0,0,0,0.06)"}}>
              <DetailPanel plot={detailPlot} onClose={()=>setDetailPlot(null)} onToggleFav={()=>{}}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── GLOBAL NAV ────────────────────────────────────────────────────────────────
function NavTooltip({label, children}){
  const [show, setShow] = useState(false);
  return(
    <div style={{position:"relative"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&(
        <div style={{position:"absolute",left:"calc(100% + 10px)",top:"50%",transform:"translateY(-50%)",background:INK,color:WHITE,borderRadius:6,padding:"5px 10px",whiteSpace:"nowrap",fontFamily:FF,fontSize:13,pointerEvents:"none",zIndex:999,animation:"fadeIn 0.12s ease both"}}>
          {label}
          <div style={{position:"absolute",right:"100%",top:"50%",transform:"translateY(-50%)",width:0,height:0,borderTop:"5px solid transparent",borderBottom:"5px solid transparent",borderRight:`5px solid ${INK}`}}/>
        </div>
      )}
    </div>
  );
}

function GlobalNav({ activeNav, setActiveNav, upgraded, onBackToLanding }:{
  activeNav:string;
  setActiveNav:(v:string)=>void;
  upgraded:boolean;
  onBackToLanding:()=>void;
}){
  const navItems = [
    {
      id:"Search",
      tooltip:"Search",
      shortLabel:"Search",
      icon:(active)=>(
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke={active?INK:SVG_MUTED} strokeWidth="1.6"/>
          <line x1="12.5" y1="12.5" x2="16" y2="16" stroke={active?INK:SVG_MUTED} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id:"Projects",
      tooltip:"My Projects",
      shortLabel:"Projects",
      icon:(active)=>(
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1.5" stroke={active?INK:SVG_MUTED} strokeWidth="1.6"/>
          <rect x="10" y="2" width="6" height="6" rx="1.5" stroke={active?INK:SVG_MUTED} strokeWidth="1.6"/>
          <rect x="2" y="10" width="6" height="6" rx="1.5" stroke={active?INK:SVG_MUTED} strokeWidth="1.6"/>
          <rect x="10" y="10" width="6" height="6" rx="1.5" stroke={active?ORANGE:SVG_MUTED} strokeWidth="1.6" fill={active?`${ORANGE}15`:"none"}/>
        </svg>
      )
    },
  ];

  return(
    <div style={{width:64,background:PANEL,borderRight:`1px solid ${LIGHTER}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 0 16px",gap:2,flexShrink:0,alignSelf:"stretch",minHeight:0}}>
      {/* Logo */}
      <NavTooltip label="Home">
        <div onClick={onBackToLanding} style={{marginBottom:16,width:32,height:32,borderRadius:4,background:INK,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:2}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{display:"block"}}>
            <rect x="2" y="2" width="4" height="4" fill="#ffffff"/>
            <rect x="8" y="2" width="4" height="4" fill="#4a4a4a"/>
            <rect x="2" y="8" width="4" height="4" fill="#a8a8a8"/>
            <rect x="8" y="8" width="4" height="4" fill={BRAND_ORANGE}/>
          </svg>
        </div>
      </NavTooltip>

      {navItems.map(item=>{
        const active = activeNav===item.id;
        return(
          <NavTooltip key={item.id} label={item.tooltip}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,marginBottom:6}}>
            <button type="button" onClick={()=>setActiveNav(item.id)} aria-label={item.tooltip}
              style={{width:38,height:38,borderRadius:8,background:active?BG2:"none",border:`1px solid ${active?LIGHTER:"transparent"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>
              {item.icon(active)}
            </button>
            <span style={{fontSize:10,fontWeight:500,color:active?INK:MID,fontFamily:FF,letterSpacing:"0.02em",lineHeight:1,textAlign:"center",maxWidth:56}}>{item.shortLabel}</span>
            </div>
          </NavTooltip>
        );
      })}

      <div style={{marginTop:"auto"}}>
        <NavTooltip label={upgraded?"Pro plan":"Free plan"}>
          <div style={{width:32,height:32,borderRadius:99,background:upgraded?`${GREEN}12`:BG2,border:`1px solid ${upgraded?`${GREEN}30`:LIGHTER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"default"}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5.5" r="2.5" stroke={upgraded?GREEN:LIGHT} strokeWidth="1.4"/>
              <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={upgraded?GREEN:LIGHT} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
        </NavTooltip>
      </div>
    </div>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({ onEnterApp }) {
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const featureRefs = useRef([]);

  useEffect(() => {
    const onMove = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity="1"; e.target.style.transform="translateY(0)"; }});
    }, { threshold: 0.1 });
    featureRefs.current.forEach(el => { if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const features = [
    { n:"01", title:"All data layers ingested, not just one.", body:"Zoning plans, PDM, building regulations, cadastre, land registries, GIS land-use data — Yonder pulls from every source, not just the easy ones." },
    { n:"02", title:"Cross-connected and AI-reasoned.", body:"The hard part isn't collecting data — it's making it talk to itself. Yonder cross-references every layer and lets AI reason across the full regulatory picture." },
    { n:"03", title:"From 500-page PDFs to a plain verdict.", body:"Municipal planning docs, RAN and REN restrictions, registry status — AI reads and interprets them all, condensing weeks of manual diligence into a clear answer." },
    { n:"04", title:"Listed and unlisted, in one search.", body:"7 in 10 land transactions happen off-market. Yonder surfaces unlisted plots alongside listed stock — search by intent, draw an area, or query by use case." },
    { n:"05", title:"Predictive, not just descriptive.", body:"As more plots are structured, the engine becomes predictive — matching land to demand before it's ever listed, and getting smarter with every query." },
    { n:"06", title:"Full due diligence, on demand.", body:"Deep-dive reports combining AI analysis with expert review. What used to take a €2K architect study and four weeks now takes 48 hours." },
  ];

  const whoItems = [
    { icon:"⊞", name:"Land Owners", desc:"Know what you own, what you can build, and what it's worth." },
    { icon:"◫", name:"Buyers & Realtors", desc:"Search listed and unlisted plots together. Share reports before the first visit." },
    { icon:"◍", name:"Eco Tourism & Cabins", desc:"Find rural plots with the right access, zoning, and permits for retreats and cabins." },
    { icon:"◈", name:"Energy & Data", desc:"Site solar and data infrastructure by grid access, zoning class, and viability score." },
    { icon:"⬡", name:"Property Developers", desc:"Screen portfolios at scale and run feasibility fast." },
  ];

  const coverage = [
    { name:"Portugal", status:"live" },
    { name:"Spain", status:"soon" },
    { name:"Italy · Greece · Balkans", status:"plan" },
    { name:"France · Germany · Benelux", status:"plan" },
    { name:"Scandinavia", status:"plan" },
  ];

  const B = `rgba(0,0,0,0.08)`;

  return (
    <div style={{ fontFamily:FF, background:BG, color:INK, overflowX:"hidden" }}>
      {/* Cursor */}
      <div style={{ position:"fixed", left:cursor.x, top:cursor.y, transform:"translate(-50%,-50%)", pointerEvents:"none", zIndex:9999 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="8" y1="1" x2="8" y2="6" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="10" x2="8" y2="15" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="1" y1="8" x2="6" y2="8" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="10" y1="8" x2="15" y2="8" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="6.5" y="6.5" width="3" height="3" stroke={ORANGE} strokeWidth="1"/>
        </svg>
      </div>

      {/* Nav */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:54, display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", padding:"0 32px", background:"rgba(249,249,249,0.92)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${LIGHTER}` }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:9, fontSize:15, fontWeight:600, letterSpacing:"-0.02em", color:INK, textDecoration:"none" }}>
          <div style={{ width:26, height:26, background:INK, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="4" fill="#f0ede6"/>
              <rect x="8" y="2" width="4" height="4" fill="#f0ede6" opacity="0.6"/>
              <rect x="2" y="8" width="4" height="4" fill="#f0ede6" opacity="0.6"/>
              <rect x="8" y="8" width="4" height="4" fill={ORANGE}/>
            </svg>
          </div>
          Yonder
        </Link>
        <ul style={{ display:"flex", listStyle:"none", gap:2 }}>
          {[
            { label:"Product", href:"/#product" },
            { label:"For who", href:"/#who" },
            { label:"Coverage", href:"/#coverage" },
            { label:"Pricing", href:"/#pricing" },
          ].map(({label:l,href})=>(
            <li key={l}><Link href={href} style={{ display:"block", fontSize:15, color:MID, textDecoration:"none", padding:"6px 14px", borderRadius:6, transition:"color 0.12s" }}
              onMouseEnter={e=>e.currentTarget.style.color=INK} onMouseLeave={e=>e.currentTarget.style.color=MID}>{l}</Link></li>
          ))}
        </ul>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8 }}>
          <button onClick={onEnterApp} style={{ fontSize:15, color:MID, background:"transparent", border:`1px solid ${LIGHTER}`, padding:"6px 14px", borderRadius:99, cursor:"pointer", fontFamily:FF, transition:"all 0.12s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=LIGHT} onMouseLeave={e=>e.currentTarget.style.borderColor=LIGHTER}>Sign in</button>
          <button onClick={onEnterApp} style={{ fontSize:15, fontWeight:500, color:BG, background:INK, border:"none", padding:"7px 18px", borderRadius:99, cursor:"pointer", fontFamily:FF, letterSpacing:"-0.01em" }}>Get access ↓</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:"130px 48px 0", maxWidth:1200, margin:"0 auto" }}>
        <h1 style={{ fontFamily:FF, fontSize:"clamp(46px,5.8vw,80px)", fontWeight:400, lineHeight:1.08, letterSpacing:"-0.025em", maxWidth:700, marginBottom:32, animation:"fadeUp 0.6s ease both" }}>
          Find land.<br/>Understand <em>everything</em><br/>about it.
        </h1>
        <p style={{ fontSize:18, color:MID, maxWidth:460, lineHeight:1.6, marginBottom:32, animation:"fadeUp 0.6s 0.1s ease both" }}>
          Search millions of plots across Europe — listed and unlisted. Get instant answers on zoning, regulations, buildability, and use rights.
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:12, animation:"fadeUp 0.6s 0.18s ease both" }}>
          <button onClick={onEnterApp} style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:15, fontWeight:500, background:INK, color:BG, padding:"12px 24px", borderRadius:99, border:"none", cursor:"pointer", letterSpacing:"-0.01em", fontFamily:FF }}>
            Search land
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={onEnterApp} style={{ fontSize:15, color:MID, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:FF }}>See how it works →</button>
        </div>

        {/* App screenshot */}
        <div style={{ marginTop:64 }}>
          <div style={{ borderRadius:"12px 12px 0 0", overflow:"hidden", border:`1px solid ${B}`, borderBottom:"none", boxShadow:"0 0 0 1px rgba(0,0,0,0.06), 0 32px 80px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.07)", background:"#c8bfb0" }}>
            {/* Chrome bar */}
            <div style={{ background:"rgba(240,237,230,0.96)", borderBottom:`1px solid ${B}`, height:42, display:"flex", alignItems:"center", padding:"0 16px", gap:8, position:"relative" }}>
              <div style={{ display:"flex", gap:6 }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{ width:11, height:11, borderRadius:"50%", background:c }}/>)}
              </div>
              <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", fontSize:15, color:MID }}>Yonder — Land Search</div>
            </div>
            {/* UI */}
            <div style={{ display:"grid", gridTemplateColumns:"240px 1fr 1fr", height:480, background:"rgba(247,245,242,0.97)" }}>
              {/* Sidebar list */}
              <div style={{ borderRight:`1px solid ${B}` }}>
                <div style={{ padding:"10px 14px 8px", fontSize:15, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:LIGHT, borderBottom:`1px solid ${B}` }}>847 results · Portugal</div>
                {[["Évora — Turístico","2.4 ha","PT-ALT-3812-0047 · €180K",true],["Beja — Rural Agrícola","5.1 ha","PT-ALT-2211-0018 · €320K",false],["Setúbal — Uso Misto","1.2 ha","PT-SET-0042-0391 · Est. €95K",false],["Faro — Zona Turística","3.8 ha","PT-FAR-1102-0077 · Est. —",false],["Braga — Solo Urbano","0.8 ha","PT-BRG-3301-0114 · €210K",false],["Lisboa — Misto Urbano","0.3 ha","PT-LIS-0244-1120 · €540K",false]].map(([name,area,meta,active])=>(
                  <div key={name} style={{ padding:"10px 14px", borderBottom:`1px solid ${B}`, background:active?`${ORANGE}06`:"none", borderLeft:active?`2px solid ${ORANGE}`:"2px solid transparent", paddingLeft:active?12:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:3 }}>
                      <span style={{ fontSize:15, fontWeight:500, color:INK }}>{name}</span>
                      <span style={{ fontFamily:FF, fontSize:15, color:INK }}>{area}</span>
                    </div>
                    <div style={{ fontSize:15, color:LIGHT, letterSpacing:"0.02em" }}>{meta}</div>
                  </div>
                ))}
              </div>
              {/* Detail */}
              <div style={{ borderRight:`1px solid ${B}`, padding:20, overflow:"hidden" }}>
                <div style={{ fontSize:15, letterSpacing:"0.1em", color:LIGHT, textTransform:"uppercase", marginBottom:8, fontFamily:FFM }}>PT-ALT-3812-0047 · Alentejo</div>
                <div style={{ fontFamily:FF, fontSize:22, color:INK, marginBottom:4 }}>Évora</div>
                <div style={{ fontSize:15, color:MID, marginBottom:20 }}>Uso Turístico · 2.4 hectares · unlisted</div>
                <div style={{ height:1, background:B, marginBottom:16 }}/>
                {[["Zoning class","Solo Urbano — Turístico"],["Area","2.4 ha"],["Build index max","0.3 m²/m²"],["RAN restriction","None detected"],["REN restriction","Partial · 18%"],["Tourism licence","Permitted"],["Solar viability","High"]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"6px 0", borderBottom:`1px solid ${B}` }}>
                    <span style={{ fontSize:15, color:LIGHT }}>{k}</span>
                    <span style={{ fontSize:15, color:v==="High"?GREEN:v==="2.4 ha"?ORANGE:INK, fontWeight:v==="High"||v==="2.4 ha"?500:400 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop:18, background:`${ORANGE}08`, border:`1px solid ${ORANGE}20`, borderRadius:6, padding:"11px 13px" }}>
                  <div style={{ fontSize:15, letterSpacing:"0.08em", textTransform:"uppercase", color:ORANGE, marginBottom:5 }}>AI verdict</div>
                  <div style={{ fontSize:15, color:MID, lineHeight:1.5 }}>Suitable for rural tourism. No RAN restrictions. Partial REN — confirm boundary. Build index supports cabins up to ~720m².</div>
                </div>
              </div>
              {/* Map */}
              <div style={{ background:"#ddd9d0", position:"relative", overflow:"hidden" }}>
                <svg viewBox="0 0 500 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                  <rect width="500" height="480" fill="#ddd9d0"/>
                  <path d="M0,150 Q120,135 250,148 Q380,161 500,145" stroke="#ccc8be" strokeWidth="1.5" fill="none"/>
                  <path d="M0,220 Q120,205 250,218 Q380,231 500,215" stroke="#ccc8be" strokeWidth="1.5" fill="none"/>
                  <path d="M0,290 Q120,275 250,288 Q380,301 500,285" stroke="#ccc8be" strokeWidth="1.5" fill="none"/>
                  <line x1="0" y1="240" x2="500" y2="240" stroke="#c8c3b8" strokeWidth="6"/>
                  <line x1="250" y1="0" x2="250" y2="480" stroke="#c8c3b8" strokeWidth="5"/>
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#d0ccc2" strokeWidth="3"/>
                  <line x1="125" y1="0" x2="125" y2="480" stroke="#d0ccc2" strokeWidth="2.5"/>
                  <line x1="375" y1="0" x2="375" y2="480" stroke="#d0ccc2" strokeWidth="2.5"/>
                  <g stroke="#bdb9ae" strokeWidth="0.9" fill="none">
                    <rect x="18" y="135" width="60" height="55"/><rect x="78" y="135" width="40" height="105"/>
                    <rect x="118" y="135" width="50" height="50"/><rect x="168" y="135" width="70" height="105"/>
                    <rect x="258" y="135" width="65" height="60"/><rect x="258" y="195" width="65" height="45"/>
                    <rect x="323" y="135" width="45" height="105"/><rect x="368" y="135" width="70" height="55"/>
                    <rect x="438" y="135" width="58" height="105"/><rect x="18" y="255" width="75" height="70"/>
                    <rect x="93" y="255" width="55" height="70"/><rect x="148" y="255" width="80" height="70"/>
                    <rect x="288" y="255" width="80" height="70"/><rect x="368" y="255" width="65" height="70"/>
                  </g>
                  <rect x="258" y="135" width="65" height="60" stroke={ORANGE} strokeWidth="2.5" fill={`${ORANGE}12`}/>
                  <circle cx="290" cy="165" r="7" fill={ORANGE}/>
                  <circle cx="290" cy="165" r="12" stroke={`${ORANGE}30`} fill="none"/>
                  <rect x="248" y="119" width="98" height="20" rx="4" fill="rgba(17,17,16,0.82)"/>
                  <text x="260" y="133" fill="white" fontSize="10" fontFamily={FF}>PT-ALT · 2.4 ha</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="product" style={{ maxWidth:1200, margin:"0 auto", padding:"100px 48px" }}>
        <h2 style={{ fontFamily:FF, fontSize:"clamp(32px,3.8vw,48px)", fontWeight:400, letterSpacing:"-0.025em", lineHeight:1.05, maxWidth:560, marginBottom:64 }}>
          Every data layer.<br/>One <em>connected</em> picture.
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"48px 64px" }}>
          {features.map((f,i)=>(
            <div key={i} ref={el=>featureRefs.current[i]=el} style={{ opacity:0, transform:"translateY(12px)", transition:`opacity 0.5s ease ${i%3*0.08}s, transform 0.5s ease ${i%3*0.08}s` }}>
              <div style={{ fontSize:15, letterSpacing:"0.1em", color:LIGHT, marginBottom:14, fontWeight:500 }}>{f.n}</div>
              <div style={{ fontSize:18, fontWeight:500, color:INK, marginBottom:10, letterSpacing:"-0.01em", lineHeight:1.3 }}>{f.title}</div>
              <div style={{ fontSize:15, color:MID, lineHeight:1.65 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who */}
      <section id="forwho" style={{ borderTop:`1px solid ${LIGHTER}`, borderBottom:`1px solid ${LIGHTER}`, background:BG2 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 48px" }}>
          <h2 style={{ fontFamily:FF, fontSize:"clamp(32px,3.8vw,48px)", fontWeight:400, letterSpacing:"-0.025em", lineHeight:1.05, marginBottom:16 }}>
            Built for everyone<br/>who works with <em>land.</em>
          </h2>
          <p style={{ fontSize:18, color:MID, maxWidth:480, lineHeight:1.65, marginBottom:48, fontFamily:FF }}>From individual buyers to large developers — Yonder adapts to how you work with land.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:LIGHTER, border:`1px solid ${LIGHTER}`, borderRadius:8, overflow:"hidden" }}>
            {whoItems.map((w,i)=>(
              <div key={i} style={{ background:BG2, padding:"32px 24px", transition:"background 0.12s", cursor:"default" }}
                onMouseEnter={e=>e.currentTarget.style.background=BG}
                onMouseLeave={e=>e.currentTarget.style.background=BG2}>
                <div style={{ fontSize:18, marginBottom:16, color:MID }}>{w.icon}</div>
                <div style={{ fontSize:18, fontWeight:500, letterSpacing:"-0.01em", marginBottom:10, lineHeight:1.3 }}>{w.name}</div>
                <div style={{ fontSize:15, color:MID, lineHeight:1.65 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" style={{ maxWidth:1200, margin:"0 auto", padding:"100px 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:100, alignItems:"start" }}>
        <div>
          <h2 style={{ fontFamily:FF, fontSize:"clamp(32px,3.8vw,48px)", fontWeight:400, letterSpacing:"-0.025em", lineHeight:1.05, marginBottom:16 }}>
            Portugal live.<br/><em>Europe</em> next.
          </h2>
          <p style={{ fontSize:15, color:MID, lineHeight:1.65, marginBottom:40, maxWidth:400 }}>We're building the cadastral intelligence layer market by market — starting where data is most fragmented and demand is highest.</p>
          {coverage.map((c,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${LIGHTER}` }}>
              <div style={{ width:6, height:6, borderRadius:"50%", flexShrink:0, background: c.status==="live"?ORANGE:c.status==="soon"?`${ORANGE}50`:"transparent", border:c.status==="plan"?`1.5px solid ${LIGHTER}`:"none" }}/>
              <div style={{ fontSize:15, color:INK, flex:1, fontFamily:FF }}>{c.name}</div>
              <span style={{ fontSize:13, color:c.status==="live"?ORANGE:c.status==="soon"?MID:LIGHT, fontFamily:FF }}>
                {c.status==="live"?"Live now":c.status==="soon"?"Next up":"2025–26"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg viewBox="60 35 290 320" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", maxWidth:360 }}>
            <path d="M198,46 L234,40 L246,58 L242,82 L236,104 L218,110 L203,107 L198,88 L194,68 Z" fill="none" stroke={LIGHTER} strokeWidth="1.2"/>
            <path d="M128,90 L146,84 L151,98 L145,114 L130,118 L122,106 Z" fill="none" stroke={LIGHTER} strokeWidth="1"/>
            <path d="M180,108 L222,102 L232,116 L226,138 L206,146 L186,144 L180,124 Z" fill="none" stroke={LIGHTER} strokeWidth="1.2"/>
            <path d="M146,118 L180,124 L186,144 L176,163 L156,170 L136,160 L130,142 Z" fill="none" stroke={LIGHTER} strokeWidth="1.2"/>
            <path d="M98,160 L136,160 L156,170 L161,190 L146,208 L120,216 L96,208 L86,190 L90,173 Z" fill={`${ORANGE}06`} stroke={`${ORANGE}35`} strokeWidth="1.2"/>
            <path d="M86,173 L98,160 L101,174 L104,193 L100,213 L92,224 L83,216 L80,200 Z" fill={`${ORANGE}15`} stroke={ORANGE} strokeWidth="2"/>
            <circle cx="91" cy="193" r="6" fill={ORANGE}/>
            <circle cx="91" cy="193" r="11" stroke={`${ORANGE}25`} fill="none"/>
            <circle cx="126" cy="188" r="4" fill={`${ORANGE}45`}/>
            <text x="62" y="246" fill={ORANGE} fontSize="10" fontFamily={FF} fontWeight="500">Portugal</text>
            <text x="65" y="258" fill={`${ORANGE}70`} fontSize="8" fontFamily={FFM}>LIVE</text>
            <text x="110" y="230" fill={`${ORANGE}60`} fontSize="9.5" fontFamily={FF}>Spain</text>
            <text x="112" y="241" fill={`${ORANGE}45`} fontSize="8" fontFamily={FFM}>NEXT</text>
          </svg>
        </div>
      </section>

      {/* Partner */}
      <section style={{ background:INK, padding:"100px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 48px", display:"grid", gridTemplateColumns:"1fr auto", gap:80, alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:FF, fontSize:"clamp(32px,3.8vw,48px)", fontWeight:400, color:"#e8e4dc", letterSpacing:"-0.025em", lineHeight:1.05, marginBottom:16 }}>
              Looking for local<br/><em style={{ color:ORANGE }}>partners</em> across<br/>Europe.
            </h2>
            <p style={{ fontSize:18, color:"rgba(232,228,220,0.45)", maxWidth:500, lineHeight:1.65, fontFamily:FF }}>We co-build the land intelligence layer market by market. If you have cadastral data access and know your country's land market — let's talk.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, flexShrink:0 }}>
            <a href="mailto:hello@liveyonder.co" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:500, background:"#e8e4dc", color:INK, padding:"11px 24px", borderRadius:99, textDecoration:"none", whiteSpace:"nowrap", fontFamily:FF, letterSpacing:"-0.01em" }}>Become a partner</a>
            <a href="mailto:hello@liveyonder.co" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"rgba(232,228,220,0.45)", padding:"11px 24px", borderRadius:99, border:"1px solid rgba(232,228,220,0.15)", textDecoration:"none", whiteSpace:"nowrap", fontFamily:FF }}>hello@liveyonder.co</a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth:1200, margin:"0 auto", padding:"100px 48px" }}>
        <h2 style={{ fontFamily:FF, fontSize:"clamp(32px,3.8vw,48px)", fontWeight:400, letterSpacing:"-0.025em", lineHeight:1.05, marginBottom:16 }}>
          Pay for outcomes,<br/>not <em>infrastructure.</em>
        </h2>
        <p style={{ fontSize:18, color:MID, maxWidth:480, lineHeight:1.65, marginBottom:48 }}>Land intelligence runs on tokens — spend them on exactly what you need. Browse and filter everything for free.</p>

        {/* Landowner banner */}
        <div style={{ borderRadius:8, padding:"20px 26px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, marginBottom:32, flexWrap:"wrap", background:BG2, border:`1px solid ${LIGHTER}`, borderLeft:`3px solid ${GREEN}` }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:GREEN, flexShrink:0 }}/>
              <div style={{ fontSize:15, letterSpacing:"0.08em", textTransform:"uppercase", color:GREEN, fontFamily:FF, fontWeight:500 }}>Free for land owners</div>
            </div>
            <div style={{ fontFamily:FF, fontSize:18, color:INK, marginBottom:4 }}>You own land. Find out what it's worth.</div>
            <div style={{ fontSize:15, color:MID, lineHeight:1.55, maxWidth:500, fontFamily:FF }}>Free plot analysis — zoning, building rights, permitted uses. We only earn when your land sells.</div>
          </div>
          <button onClick={onEnterApp} style={{ background:"none", color:GREEN, padding:"8px 20px", borderRadius:99, fontSize:15, fontWeight:500, border:`1.5px solid ${GREEN}40`, whiteSpace:"nowrap", flexShrink:0, cursor:"pointer", fontFamily:FF, letterSpacing:"-0.01em" }}>Analyse my land →</button>
        </div>

        {/* Tiers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:LIGHTER, border:`1px solid ${LIGHTER}`, borderRadius:8, overflow:"hidden" }}>
          {[
            { tier:"Explorer", price:"€49", tokens:50, hl:false, items:["Browse & filter all listed plots","Zoning status (Urban vs. Rustic)","Basic AI feasibility checks","Limited report previews"], cta:"Start with Explorer" },
            { tier:"Tracker", price:"€199", tokens:250, hl:true, badge:"Most popular", items:["Everything in Explorer","Full AI feasibility reports","Interactive Project Space","Automated alerts on status changes","Buyer lead capture for realtors","Shareable plot links"], cta:"Start with Tracker" },
            { tier:"Enterprise", price:"€999", tokens:1500, hl:false, items:["Everything in Tracker","Cadastre map engine (off-market)","White-label PDF exports","Bulk area search add-on","API access","Token top-ups at 20% off"], cta:"Talk to us" },
          ].map(p=>(
            <div key={p.tier} style={{ background:p.hl?INK:BG, padding:"32px 28px", display:"flex", flexDirection:"column" }}>
              <div style={{ height:24, display:"flex", alignItems:"center", marginBottom:18 }}>
                {p.badge&&<div style={{ fontSize:15, letterSpacing:"0.1em", textTransform:"uppercase", color:ORANGE, fontFamily:FF }}>{p.badge}</div>}
              </div>
              <div style={{ fontSize:15, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", color:p.hl?"rgba(232,228,220,0.4)":MID, marginBottom:20, fontFamily:FF }}>{p.tier}</div>
              <div style={{ fontFamily:FF, fontSize:52, letterSpacing:"-0.03em", lineHeight:1, color:p.hl?"#e8e4dc":INK, marginBottom:4 }}>{p.price}</div>
              <div style={{ fontSize:15, color:p.hl?"rgba(232,228,220,0.3)":LIGHT, marginBottom:24, fontFamily:FF }}>per month</div>
              <div style={{ background:p.hl?"rgba(255,255,255,0.06)":BG2, borderRadius:6, padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, border:`1px solid ${p.hl?"rgba(255,255,255,0.08)":LIGHTER}` }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:600, color:p.hl?"#e8e4dc":INK, fontFamily:FF }}>{p.tokens}</div>
                  <div style={{ fontSize:15, color:p.hl?"rgba(232,228,220,0.4)":LIGHT, marginTop:2, fontFamily:FF }}>tokens / month</div>
                </div>
              </div>
              <ul style={{ listStyle:"none", flex:1, display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                {p.items.map(item=>(
                  <li key={item} style={{ fontSize:15, color:p.hl?"rgba(232,228,220,0.5)":MID, display:"flex", gap:8, lineHeight:1.4, fontFamily:FF }}>
                    <span style={{ color:p.hl?"rgba(232,228,220,0.2)":LIGHTER, flexShrink:0, fontSize:15 }}>—</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={onEnterApp} style={{ display:"block", textAlign:"center", fontSize:15, fontWeight:500, padding:"10px 16px", borderRadius:99, border:p.hl?"none":`1px solid ${LIGHTER}`, background:p.hl?"#e8e4dc":"transparent", color:p.hl?INK:MID, cursor:"pointer", fontFamily:FF, letterSpacing:"-0.01em" }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop:`1px solid ${LIGHTER}` }}>
        <footer style={{ maxWidth:1200, margin:"0 auto", padding:"48px", display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:15, fontWeight:600, letterSpacing:"-0.02em", color:INK, marginBottom:10, fontFamily:FF }}>
              <div style={{ width:24, height:24, background:INK, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="4" height="4" fill="#f0ede6"/><rect x="8" y="2" width="4" height="4" fill="#f0ede6" opacity="0.6"/><rect x="2" y="8" width="4" height="4" fill="#f0ede6" opacity="0.6"/><rect x="8" y="8" width="4" height="4" fill={ORANGE}/></svg>
              </div>
              Yonder
            </div>
            <div style={{ fontSize:15, color:MID, lineHeight:1.6, marginBottom:12, fontFamily:FF }}>Find land. Know land.<br/>The land operating system for Europe.</div>
            <div style={{ fontSize:15, color:LIGHT, fontFamily:FF }}>liveyonder.co · © 2025</div>
          </div>
          {[["Product",["Search land","Browse cadastre","Draw search","Reports"]],["Company",["About","Partners","Pricing","Blog"]],["Contact",["hello@liveyonder.co","LinkedIn","Privacy","Terms"]]].map(([title,links])=>(
            <div key={title}>
              <div style={{ fontSize:15, fontWeight:500, letterSpacing:"0.04em", textTransform:"uppercase", color:MID, marginBottom:14, fontFamily:FF }}>{title}</div>
              {links.map(l=><a key={l} href="#" style={{ display:"block", fontSize:15, color:MID, textDecoration:"none", marginBottom:8, fontFamily:FF }}
                onMouseEnter={e=>e.currentTarget.style.color=INK} onMouseLeave={e=>e.currentTarget.style.color=MID}>{l}</a>)}
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function YonderExplorerAppInner({
  embed = false,
  skipLanding = false,
}: { embed?: boolean; skipLanding?: boolean }){
  const router = useRouter();
  const openAppFirst = embed || skipLanding;
  const [view, setView] = useState(openAppFirst ? "app" : "landing");
  const [activeNav,setActiveNav]=useState("Search");
  const [upgraded,setUpgraded]=useState(false);
  const [showUpgradeModal,setShowUpgradeModal]=useState(false);
  const [projectPlots,setProjectPlots]=useState<string[]>([]);
  const [listingPlot,setListingPlot]=useState<string|null>(null);
  const [listingSavedScans,setListingSavedScans]=useState(null);
  const [pipelineFocusCanonicalId,setPipelineFocusCanonicalId]=useState(null);

  useEffect(()=>{setListingSavedScans(loadListingScansFromStorage());},[]);
  useEffect(()=>{
    if(listingSavedScans===null)return;
    try{localStorage.setItem(LISTING_SCAN_LS_KEY,JSON.stringify(listingSavedScans));}catch{}
  },[listingSavedScans]);

  function persistListingScan(canonicalId,recapData){
    setListingSavedScans((s)=>({...(s||{}),[canonicalId]:wrapLandAgentListingScan(recapData)}));
  }

  function handleAddToProject(plotId:string){
    const id = canonicalPipelineId(plotId);
    setProjectPlots(p=>{
      const i = p.findIndex(x => canonicalPipelineId(x) === id);
      if (i >= 0) return p.filter((_, j) => j !== i);
      return [...p, id];
    });
  }

  function commitPlotsToPipeline(plotIds:string[]){
    setProjectPlots((p)=>{
      const canon=(x:string)=>canonicalPipelineId(x);
      const set=new Set(p.map(canon));
      plotIds.forEach((raw)=>set.add(canon(raw)));
      return Array.from(set);
    });
  }
  function openListing(plotId:string){setListingPlot(plotId);}
  function closeListing(){setListingPlot(null);}
  function enterApp(){setView("app");setActiveNav("Search");}
  function goHome(){
    closeListing();
    if (openAppFirst) router.push("/");
    else setView("landing");
  }

  if(view==="landing"){
    return(
      <>
        <style>{`
          .yonder-explorer-app,.yonder-explorer-app *{box-sizing:border-box}
          @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          .yonder-explorer-app .ye-scroll{scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.2) transparent}
          .yonder-explorer-app .ye-scroll::-webkit-scrollbar{width:6px;height:6px}
          .yonder-explorer-app .ye-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}
        `}</style>
        <LandingPage onEnterApp={enterApp}/>
      </>
    );
  }

  return(
    <div
      className="yonder-explorer-app"
      style={{
        display: "flex",
        height: embed ? "calc(100dvh - 3.5rem)" : "100dvh",
        minHeight: embed ? 520 : "100dvh",
        maxHeight: embed ? "calc(100dvh - 3.5rem)" : "100dvh",
        background: BG,
        fontFamily: FF,
        WebkitFontSmoothing: "antialiased",
        overflow: "hidden",
      }}
    >
      <style>{`
        .yonder-explorer-app .ye-keyframes{contain:content}
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pinDrop{from{opacity:0;transform:translate(-50%,-70%)}to{opacity:1;transform:translate(-50%,-50%)}}
        @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(18px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        .yonder-explorer-app select{appearance:none}
        .yonder-explorer-app .ye-scroll{scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.2) transparent}
        .yonder-explorer-app .ye-scroll::-webkit-scrollbar{width:6px;height:6px}
        .yonder-explorer-app .ye-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}
        .yonder-explorer-app button{transition:opacity 0.12s}
        .yonder-explorer-app button:hover{opacity:0.88}
      `}</style>

      {showUpgradeModal&&<UpgradeModal onClose={()=>setShowUpgradeModal(false)} onUpgrade={()=>{setUpgraded(true);setShowUpgradeModal(false);}}/>}

      <GlobalNav activeNav={activeNav} setActiveNav={v=>{setActiveNav(v);closeListing();}} upgraded={upgraded} onBackToLanding={goHome}/>

      <div style={{flex:1,minHeight:0,display:"flex",overflow:"hidden",position:"relative"}}>
        {!!listingPlot&&(
          <div className="ye-scroll" style={{position:"absolute",inset:0,zIndex:100,animation:"slideIn 0.2s ease both",background:WHITE,display:"flex",flexDirection:"column",overflowY:"auto"}}>
            <PlotListingPage plotId={listingPlot} upgraded={upgraded} onUpgrade={()=>setShowUpgradeModal(true)} onBack={closeListing} onAddToProject={handleAddToProject} inProject={projectPlots.includes(listingPlot)} savedAiRecap={listingRecapFromStore(listingSavedScans, canonicalPipelineId(listingPlot))}/>
          </div>
        )}
        {activeNav==="Search"&&<ChatMapView upgraded={upgraded} setShowUpgradeModal={setShowUpgradeModal} onAddToProject={handleAddToProject} onCommitPlotsToPipeline={commitPlotsToPipeline} projectPlots={projectPlots} onGoToDashboard={()=>setActiveNav("Projects")} onOpenListing={openListing} listingSavedScans={listingSavedScans} persistListingScan={persistListingScan} pipelineFocusCanonicalId={pipelineFocusCanonicalId} onPipelineFocusConsumed={()=>setPipelineFocusCanonicalId(null)}/>}
        {activeNav==="Projects"&&<ProjectsView onOpenListing={openListing} upgraded={upgraded} onUpgrade={()=>setShowUpgradeModal(true)} projectPlots={projectPlots} onAddToProject={handleAddToProject} setActiveNav={setActiveNav} listingSavedScans={listingSavedScans} onInspectPlotInSearch={(id)=>{setPipelineFocusCanonicalId(id);setActiveNav("Search");}}/>}
      </div>
    </div>
  );
}
