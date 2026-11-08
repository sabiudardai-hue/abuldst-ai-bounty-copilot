import { GoogleGenAI } from "@google/genai";
import { analysisSchema, type OpportunityAnalysis } from "./analysis-schema";

const apiKey = process.env.GEMINI_API_KEY;

export async function analyzeOpportunity(sourceText: string): Promise<OpportunityAnalysis> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to .env.local.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are Abuldst AI Bounty Copilot, an assistant for Web3 creators.
Analyze the opportunity text below. Do not invent facts. If a detail is absent, write "Not specified".
Separate explicit campaign requirements from your recommendations. Do not claim that a user is eligible without enough profile information.
Return valid JSON with exactly these keys:
title, summary, reward, deadline, eligibility, requirements, missing_requirements,
recommended_actions, submission_checklist, content_ideas.
eligibility must be one of: Likely eligible, Potentially eligible, Not enough information, Likely ineligible.
All list fields must be arrays of strings.

OPPORTUNITY TEXT:
${sourceText}`;
const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
      contents: prompt,
        config: {
            responseMimeType: "application/json",
                maxOutputTokens: 250,
                    temperature: 0.2,
                      },
                      });

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
