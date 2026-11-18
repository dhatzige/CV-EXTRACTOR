// ============================================================
// Evidence check — deterministic rules applied after extraction
// ============================================================
//
// The model is told to use only the CV's own words, but it follows that rule
// most of the time, not every time. These checks run in code, so they hold on
// every run:
//   1. A sector, domain or tag is removed when no word supporting it appears
//      anywhere in the CV text (e.g. "Investment Banking" for a CV that never
//      says investment banking).
//   2. years_experience is counted from the earliest start date in the
//      contract history, not left to the model's arithmetic.
//   3. Notes over the 900-character cap are flagged (never truncated).
// Every change is reported back as a warning so the reviewer can see it.
//
// Keep in sync with the copy in cv-extractor.html (between the
// "BEGIN evidence-check" / "END evidence-check" markers).

import { ResourceEntry } from "./schema";

const FINANCE =
  /\bfinance\b|financial control|financial reporting|financial planning|planning (?:&|and) analysis|\bCFO\b|\bFP&A\b|controllership|financial controller/i;

// Lower-case category or tag name → evidence the CV text must contain.
// Names not listed here (the CV's own wording) are left alone.
const EVIDENCE: Record<string, RegExp> = {
  "investment banking": /investment bank/i,
  "capital markets": /capital markets?|global markets|\bFICC\b|\bDCM\b|\bECM\b|sales (?:&|and) trading|trading desk/i,
  "retail banking": /retail/i,
  "commercial banking": /commercial bank/i,
  banking: /\bbank/i,
  "financial services": /financial services|\bbank|insur|asset manag|wealth|capital markets|fintech|payments|brokerage|securities|investment/i,
  "wealth management": /wealth/i,
  "asset management": /asset manag|fund manag|investment manag/i,
  insurance: /insur/i,
  "trade finance": /trade financ/i,
  payments: /payment/i,
  treasury: /treasury/i,
  derivatives: /derivativ|\bswaps?\b|\boptions\b|\bfutures\b/i,
  "fixed income": /fixed income|\bbonds?\b|\bFICC\b|\brates\b/i,
  fx: /\bFX\b|foreign exchange/i,
  commodities: /commodit/i,
  "business transformation": /transform/i,
  transformation: /transform/i,
  "digital transformation": /digital/i,
  "finance & financial control": FINANCE,
  finance: FINANCE,
  accounting: /accountan|accounting|\bACCA\b|\bICAEW\b|\bCIMA\b|\bCPA\b|\bIFRS\b|\bGAAP\b/i,
  governance: /governance/i,
  "financial crime": /financial crime|\bAML\b|anti[- ]money|money laundering|\bKYC\b|sanctions|\bCTF\b|fincrime/i,
  fraud: /fraud/i,
  conduct: /conduct/i,
  surveillance: /surveillance/i,
  controls: /control/i,
  "controls & assurance": /control|assurance/i,
  audit: /audit/i,
  "internal audit": /internal audit/i,
  compliance: /complian/i,
  regulatory: /regulat/i,
  "regulatory compliance": /regulat|complian/i,
  risk: /risk/i,
  "risk management": /risk/i,
  "operational risk": /operational risk/i,
  "non-financial risk": /non[- ]financial risk|\bNFR\b/i,
  operations: /operation/i,
  "middle office": /middle office/i,
  "back office": /back office/i,
  "front office": /front office/i,
  "data & analytics": /\bdata\b|analytics/i,
  technology: /technolog|software|\bsystems?\b|\bIT\b|digital|\bdata\b|cloud|platform/i,
};

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const NOTES_MAX = 900;

// Split "A, B (x, y), C" on top-level commas only, so bracketed qualifiers stay whole.
function splitList(value: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      items.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) items.push(current.trim());
  return items.filter(Boolean);
}

function unsupportedItems(value: string, cvText: string): { kept: string; removed: string[] } {
  const kept: string[] = [];
  const removed: string[] = [];
  for (const item of splitList(value)) {
    const base = item.replace(/\s*\(.*$/, "").trim().toLowerCase();
    const pattern = EVIDENCE[base];
    if (pattern && !pattern.test(cvText)) removed.push(item);
    else kept.push(item);
  }
  return { kept: kept.join(", "), removed };
}

// Earliest "(Mon YYYY–" or "(YYYY–" start date in the contract history.
function earliestStart(history: string): { year: number; month: number; label: string } | null {
  let best: { year: number; month: number; label: string } | null = null;
  const re = /\((?:([A-Za-z]{3,9})\.?\s+)?((?:19|20)\d{2})\s*[–—-]/g;
  for (const m of history.matchAll(re)) {
    const month = m[1] ? MONTHS[m[1].slice(0, 3).toLowerCase()] ?? 0 : 0;
    const year = Number(m[2]);
    if (!best || year < best.year || (year === best.year && month < best.month)) {
      best = { year, month, label: m[1] ? `${m[1]} ${m[2]}` : m[2] };
    }
  }
  return best;
}

export function enforceEvidence(
  entry: ResourceEntry,
  cvText: string,
  today: Date = new Date()
): { entry: ResourceEntry; warnings: string[] } {
  const out = { ...entry };
  const warnings: string[] = [];

  // 1. Domains and tags must have supporting words in the CV.
  for (const [field, label] of [
    ["subject_matter_knowledge", "Subject Matter"],
    ["client_fit_tags", "Client Fit Tags"],
  ] as const) {
    const { kept, removed } = unsupportedItems(out[field], cvText);
    if (removed.length) {
      out[field] = kept;
      for (const item of removed) {
        warnings.push(`Removed "${item}" from ${label}: the CV never mentions it.`);
      }
    }
  }

  // 2. Years of experience counted in code from the earliest role.
  const start = earliestStart(out.contract_history);
  if (start) {
    const months =
      (today.getFullYear() - start.year) * 12 + (today.getMonth() - start.month);
    const years = Math.floor(months / 12);
    const claimed = Number(out.years_experience);
    if (years >= 0 && years <= 60 && years !== claimed) {
      out.years_experience = years;
      out.notes = out.notes.replace(
        new RegExp(`\\b${claimed}(\\+)? years`),
        `${years}$1 years`
      );
      warnings.push(
        `Years of experience set to ${years}, counted from the earliest role (${start.label}); Claude said ${claimed}.`
      );
    }
  }

  // 3. Notes length cap: flag only, a person decides what to cut.
  if (out.notes.length > NOTES_MAX) {
    warnings.push(
      `Notes are ${out.notes.length} characters, over the ${NOTES_MAX} limit: trim before pasting.`
    );
  }

  return { entry: out, warnings };
}
