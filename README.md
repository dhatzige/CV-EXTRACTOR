# CV Parser

A CV extraction tool powered by Claude API that parses uploaded CVs into structured, editable data.

**Live:** [cv-extractor-zeta.vercel.app](https://cv-extractor-zeta.vercel.app/)

## What it does

Upload a CV (PDF or image) and the tool extracts structured fields using Claude's vision and text capabilities:

- Personal details, work experience, education, skills
- Field-level inline editing after extraction
- Export to Excel (.xlsx) or TSV
- Copy individual fields or full structured output

## Stack

- **Framework:** Next.js 15 (App Router)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Simple token-based authentication
- **Deployment:** Vercel

## How it works

1. User uploads a CV (PDF or image)
2. The file is sent to Claude API with a structured extraction prompt
3. Claude returns parsed data matching a predefined schema
4. User can edit any field inline before exporting
5. Export as Excel, TSV, or copy to clipboard

## Built with

Built using Claude Code by someone with no formal programming background, as a production tool for [Example Consultancy](https://www.example.com/).
