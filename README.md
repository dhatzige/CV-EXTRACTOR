# CV-EXTRACTOR

A Claude-powered CV parser that turns resumes into 26 structured, editable fields with Excel/TSV export.

Built in about an hour with Claude Code as an internal tool for a management consultancy, and in production use since: it cut CV data entry from 15+ minutes to about 30 seconds per document. The build speed is part of the point; the care went into the prompt.

## What is worth reading

The interesting part is the prompt design in `lib/claudePrompt.ts`:

- **Anti-hallucination by default.** Every field must come directly from the CV text. Only three fields allow inference (right to work, experience level, years of experience), each with explicit rules.
- **Human-in-the-loop.** Output lands in an editable review table before export, so the reviewer stays in charge of every record.
- **Neutral by design.** The notes field is restricted to factual content: no evaluative language, no fit assessments, exact certification names only.

## Stack

Next.js, TypeScript, Tailwind, Claude API. Two run modes: `npm run dev`, or open `cv-extractor.html` directly in a browser (no build step; your API key stays in your browser's localStorage).

## Context

My production work (a live AI career platform with payments, and a full recruitment ATS) lives in private repositories. This repo is the public sample of how I build with LLMs: guardrails first, shipped fast, reviewed by humans.

- Live product: [yourjobremote.com](https://yourjobremote.com/en)
- LinkedIn: [dimitris-chatz](https://www.linkedin.com/in/dimitris-chatz/)
