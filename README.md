# CV Extractor

AI-powered CV parser. Upload a PDF or DOCX, and Claude extracts the content into 26 structured fields ready to paste into a Resource Pool tracker or export as `.xlsx`.

## What it does

- Accepts PDF and DOCX CVs
- Extracts text locally (pdf-parse / mammoth)
- Sends the text to Claude with a strict, anti-hallucination system prompt
- Returns validated JSON matching a 26-column schema (identity, contact, skills, experience, availability, etc.)
- Renders an editable form grouped into 7 categories
- Exports as TSV (copy-paste directly into Excel / Google Sheets) or `.xlsx` download

The prompt is the interesting part — it's explicitly told to **never infer or embellish**. Only three fields allow inference (right-to-work status, experience level, years of experience). Everything else must come verbatim from the CV or stay empty. The `notes` field has tight constraints to keep it purely factual.

## Tech stack

- **Next.js 16** (App Router) + TypeScript
- **Claude Sonnet 4** via the official `@anthropic-ai/sdk`
- **pdf-parse** + **mammoth** for text extraction
- **Tailwind CSS** + **react-dropzone**
- **exceljs** for one-row XLSX exports

## Run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your Anthropic API key
npm run dev
```

Open http://localhost:3000, drop a CV, review, copy or download.

## No-build variant

There's also a single-file `cv-extractor.html` at the project root. Double-click to open — it runs entirely in the browser using CDN-loaded pdf.js, mammoth, and SheetJS, and calls the Anthropic API directly with `anthropic-dangerous-direct-browser-access`. Your API key is stored in `localStorage`, never in the file itself.

Use this when you want zero setup and don't need the Next.js server.

## Project layout

```
app/
  page.tsx          — main UI (upload → loading → results)
  api/extract/      — POST endpoint: parses file, calls Claude, returns JSON
components/         — Header, CVUploader, ExtractionForm, CategorySection, FieldInput, CopyBar
lib/
  schema.ts         — 26-field TypeScript schema + category groupings
  claudePrompt.ts   — system prompt with anti-hallucination rules
  claudeClient.ts   — Anthropic SDK wrapper
  defaults.ts       — post-extraction auto-fill (today's date, filename, etc.)
  exportTSV.ts      — tab-separated export for clipboard
  exportExcel.ts    — single-row .xlsx builder
cv-extractor.html   — self-contained browser-only variant
```

## Schema snapshot

The 26 fields cover: resource ID, full name, job title, email, phone, location, right to work, status, availability, day rate, rate flexibility, subject-matter knowledge, technical skills, systems, experience level, years of experience, source, source notes, date added, interview notes, client-fit tags, contract history, last contacted, next follow-up, CV filename, free-form notes.

Categorical fields (status, right to work, experience level, source, rate flexibility) use strict enums. See `lib/schema.ts` for the full list.

## Why it's interesting

- **Prompt engineering matters more than the model.** The schema is easy — "parse a CV" is a solved problem. The hard part is stopping the model from making things up. This prompt demonstrates one approach: tight field-by-field rules, explicit bad-examples, and a top-level "no assumptions" constraint.
- **Structured output, not chat.** The endpoint returns typed JSON that maps 1:1 to a spreadsheet. No free-form text to parse.
- **Minimal surface area.** One API route, no database, no auth. File in, JSON out.

## License

Personal portfolio project. If you find the prompt useful, feel free to adapt it.
