import { NextResponse } from "next/server";
import { z } from "zod";
import { generateCampaignContent } from "@/lib/gemini";

const requestSchema = z.object({
  opportunityText: z.string().trim().min(40).max(12000),
  profile: z.string().max(5000).optional().default(""),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid campaign brief." },
        { status: 400 }
      );
    }

    const content = await generateCampaignContent(
      parsed.data.opportunityText,
      parsed.data.profile
    );

    return NextResponse.json({ content });
  } catch (error) {
    console.error("CONTENT GENERATOR ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
