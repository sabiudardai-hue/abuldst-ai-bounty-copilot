import { GoogleGenAI } from "@google/genai";
import { analysisSchema, type OpportunityAnalysis } from "./analysis-schema";

const apiKey = process.env.GEMINI_API_KEY;

async function generateWithRetry(ai: GoogleGenAI, prompt: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 1200,
          temperature: 0.2,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const temporary = /503|504|429|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand/i.test(message);

      if (!temporary || attempt === 3) throw error;

      await new Promise(resolve => setTimeout(resolve, attempt * 3000));
    }
  }

  throw new Error("Gemini is temporarily unavailable. Please try again.");
}

export async function analyzeOpportunity(
  sourceText: string
): Promise<OpportunityAnalysis> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to .env.local.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are Abuldst AI Bounty Copilot, an assistant for Web3 creators.

Analyze the opportunity text below. Do not invent facts.
If a detail is absent, write "Not specified".

Separate explicit campaign requirements from your recommendations.
Do not claim that a user is eligible without enough profile information.

Return valid JSON with exactly these keys:
title, summary, reward, deadline, eligibility, requirements,
missing_requirements, recommended_actions, submission_checklist,
content_ideas.

All list fields must be arrays of strings.
Eligibility must be one of:
Likely eligible, Potentially eligible, Not enough information, Likely ineligible.

OPPORTUNITY TEXT:
${sourceText}
`;

  const response = await generateWithRetry(ai, prompt);
  const raw = response.text;

  if (!raw) throw new Error("Gemini returned an empty response.");

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned invalid JSON. Please try again.");
  }

  return analysisSchema.parse(parsed);
}
