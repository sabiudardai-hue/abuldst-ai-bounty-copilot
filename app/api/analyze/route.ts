import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeOpportunity } from "@/lib/openai";

const requestSchema = z.object({
  opportunityText: z.string().trim().min(40, "Paste at least 40 characters.").max(12000),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const analysis = await analyzeOpportunity(parsed.data.opportunityText);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("ANALYZE ERROR:", error);

    const message = error instanceof Error ? error.message : "Unexpected server error.";
    const status = message.includes("OPENAI_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
