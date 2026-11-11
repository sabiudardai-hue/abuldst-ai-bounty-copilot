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
    sourceText: string,
      profile: string = ""
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
content_ideas, opportunity_score, score_reason, match_percentage, matched_skills, skill_gaps.

All list fields must be arrays of strings.
opportunity_score must be an integer from 0 to 100.
score_reason must briefly explain the score using facts in the opportunity brief.

Score the opportunity itself, not the user's personal eligibility.
match_percentage must be an integer from 0 to 100.
matched_skills and skill_gaps must be arrays of strings.
Use only skills explicitly supported by the opportunity text; do not invent user skills.
Use this rubric:
- Clear requirements and eligibility: 0-25
- Reward value and transparency: 0-25
- Feasibility and time available: 0-25
- Credibility and clarity of the opportunity: 0-25
Do not invent missing facts. Give lower scores when important details are missing.
A high opportunity score does not mean the user is eligible.
Eligibility must be one of:
Likely eligible, Potentially eligible, Not enough information, Likely ineligible.

USER PROFILE:
${profile || "Not provided"}

Use this profile only to assess the user's skill match.
Do not invent skills or experience.
Explain which skills match and which skills are missing.

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

export async function generateCampaignContent(
  sourceText: string,
  profile: string = ""
) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are Abuldst AI Bounty Copilot, a professional Web3 content strategist.

Create useful campaign content using only the facts provided below.
STRICT FACT-CHECKING RULES:
- Use only facts explicitly stated in the campaign brief.
- Never invent job openings, hiring announcements, contact emails,
  Discord links, websites, rewards, deadlines, or partnerships.
  - Never create or guess URLs, usernames, or contact information.
  - Do not claim a project is hiring unless the brief explicitly says so.
  - If important information is missing, omit it or write "Not specified".
  - Do not turn suggestions or assumptions into confirmed facts.
  - Preserve the exact meaning of the original campaign brief.
  - Make promotional content engaging without exaggerating claims.
  - Before returning JSON, verify every factual claim against the brief.
Never invent campaign details, rewards, deadlines, or completed tasks.

CAMPAIGN BRIEF:
${sourceText}

USER PROFILE:
${profile || "Not provided"}

Return valid JSON with exactly these keys:
{
  "x_post": "One engaging ready-to-publish X post",
  "thread": ["Thread post 1", "Thread post 2", "Thread post 3", "Thread post 4"],
  "meme_ideas": ["Meme idea 1", "Meme idea 2", "Meme idea 3"]
}

Rules:
- Include all mandatory campaign tags, hashtags and token symbols.
- Keep the X post concise and engaging.
- Make the thread informative and natural.
- Make meme ideas relevant to the campaign.
- Do not claim the user completed tasks they have not completed.
- Do not make financial promises or guarantee rewards.
- Return JSON only.
`;

  const response = await generateWithRetry(ai, prompt);
  const raw = response.text;

  if (!raw) {
    throw new Error("Gemini returned an empty content response.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned invalid content JSON.");
  }
}
