// ============================================================
// Anthropic SDK wrapper — server-side only
// ============================================================

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Ordered preference list. CLAUDE_MODEL in .env.local (optional) is tried
// first, then each current-generation model. If every entry has been retired,
// the newest model available to this API key is discovered live via
// /v1/models — so a model retirement can never break extraction again.
const MODEL_CANDIDATES: string[] = [
  process.env.CLAUDE_MODEL,
  "claude-fable-5",
  "claude-sonnet-5",
  "claude-opus-4-8",
  "claude-haiku-4-5",
].filter((m): m is string => Boolean(m));

// The model that last succeeded — tried first on subsequent calls so the
// fallback walk only ever happens once per process (or again if it retires).
let resolvedModel: string | null = null;

async function newestAvailableModel(): Promise<string> {
  const page = await anthropic.models.list({ limit: 1 });
  const id = page.data[0]?.id;
  if (!id) {
    throw new Error(
      "No Claude models are available to this API key. Check https://console.anthropic.com."
    );
  }
  return id;
}

async function extractWith(
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  // No `temperature`: Claude 5+ models reject it as deprecated. No `thinking`
  // config: newer models reason adaptively by default, and those tokens count
  // toward max_tokens — hence the generous cap for a ~1K-token JSON answer.
  const response = await anthropic.messages.create({
    model,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error(
      "Claude's response was cut off before the JSON was complete. Please try again."
    );
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}

function toFriendlyError(error: unknown): Error {
  if (error instanceof Anthropic.AuthenticationError) {
    return new Error(
      "The Anthropic API key was rejected (401). Issue a new key at " +
        "https://console.anthropic.com/settings/keys and update ANTHROPIC_API_KEY in .env.local."
    );
  }
  if (error instanceof Anthropic.PermissionDeniedError) {
    return new Error(
      "The Anthropic API key does not have permission for this request (403)."
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    return new Error("Rate limit reached (429). Wait a minute and try again.");
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return new Error(
      "Could not reach the Anthropic API. Check the internet connection and try again."
    );
  }
  if (error instanceof Anthropic.InternalServerError) {
    return new Error(
      "The Anthropic API is temporarily overloaded or unavailable. Try again shortly."
    );
  }
  return error instanceof Error ? error : new Error(String(error));
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const candidates = [
    ...new Set([resolvedModel, ...MODEL_CANDIDATES].filter((m): m is string => Boolean(m))),
  ];

  // One extra iteration past the static list: ask the API what exists.
  for (let i = 0; i <= candidates.length; i++) {
    try {
      const model =
        i < candidates.length ? candidates[i] : await newestAvailableModel();
      const text = await extractWith(model, systemPrompt, userMessage);
      resolvedModel = model;
      return text;
    } catch (error) {
      if (error instanceof Anthropic.NotFoundError) {
        resolvedModel = null; // model retired or mistyped — try the next one
        continue;
      }
      throw toFriendlyError(error);
    }
  }

  throw new Error(
    "No usable Claude model was found. Set CLAUDE_MODEL in .env.local to a current model ID " +
      "(see https://docs.anthropic.com/en/docs/about-claude/models)."
  );
}
