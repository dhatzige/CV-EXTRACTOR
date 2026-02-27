// ============================================================
// POST /api/extract — Upload CV, extract text, call Claude, return JSON
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { callClaude } from "@/lib/claudeClient";
import { buildPrompt } from "@/lib/claudePrompt";
import { applyDefaults } from "@/lib/defaults";
import { ResourceEntry } from "@/lib/schema";

// pdf-parse v1.1.1 — import the lib directly to avoid its test-file bug
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = file.name;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Extract text based on file type
    let extractedText: string;

    if (filename.toLowerCase().endsWith(".pdf")) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (filename.toLowerCase().endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload a PDF or DOCX file.",
        },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract meaningful text from the file. The PDF may be image-based — please try a text-based PDF or DOCX.",
        },
        { status: 422 }
      );
    }

    // Step 2: Call Claude API
    const { systemPrompt, userMessage } = buildPrompt(extractedText);
    const claudeResponse = await callClaude(systemPrompt, userMessage);

    // Step 3: Parse JSON from response
    let parsed: Partial<ResourceEntry>;
    try {
      const jsonStr = claudeResponse
        .replace(/^```json?\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse extraction results. Please try again." },
        { status: 500 }
      );
    }

    // Step 4: Apply auto-fill defaults (overrides Claude for operational fields)
    const result = applyDefaults(parsed, filename);

    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    console.error("Extraction error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
