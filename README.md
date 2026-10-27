# CV-EXTRACTOR

A Claude-powered CV parser that turns resumes into 26 structured, editable fields with Excel/TSV export.

Built in about an hour with Claude Code as an internal tool for a management consultancy, and in production use since for referred-candidate intake: a colleague hands over the CV of someone they know and refer for a role, and the parser turns it into structured, keyword-tagged entries in the recruitment tracker, cutting entry from 15+ minutes to about 30 seconds per document. The build speed is part of the point; the care went into the prompt.

## What is worth reading

The interesting part is the prompt design in `lib/claudePrompt.ts`:

- **Anti-hallucination by default.** Every field must come directly from the CV text. Only three fields allow inference (right to work, experience level, years of experience), each with explicit rules.
- **Human-in-the-loop.** Output lands in an editable review table before export, so the reviewer stays in charge of every record.
- **Neutral by design.** The notes field is restricted to factual content: no evaluative language, no fit assessments, exact certification names only.

## Stack

Next.js, TypeScript, Tailwind, Claude API. Two run modes: `npm run dev`, or open `cv-extractor.html` directly in a browser (no build step; your API key stays in your browser's localStorage).

## Quick start

You only need an Anthropic API key ([get one here](https://console.anthropic.com/settings/keys)).

**No build:** download `cv-extractor.html`, open it in a browser, paste your key when prompted. Accepts PDF, DOCX and legacy DOC.

**Next.js:**

```bash
npm install
cp .env.example .env.local   # then paste your key into ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

No model configuration needed: the app tries current Claude models in order and, if they have all been retired, asks the API for the newest one available to your key.

## Context

My production work (a live AI career platform with payments, and a full recruitment ATS) lives in private repositories. This repo is the public sample of how I build with LLMs: guardrails first, shipped fast, reviewed by humans.

- Live product: [yourjobremote.com](https://yourjobremote.com/en)
- LinkedIn: [dimitris-chatz](https://www.linkedin.com/in/dimitris-chatz/)
