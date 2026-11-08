import { z } from "zod";

export const analysisSchema = z.object({
  title: z.string(),
  summary: z.string(),
  reward: z.string(),
  deadline: z.string(),
  eligibility: z.enum(["Likely eligible", "Potentially eligible", "Not enough information", "Likely ineligible"]),
  requirements: z.array(z.string()),
  missing_requirements: z.array(z.string()),
  recommended_actions: z.array(z.string()),
  submission_checklist: z.array(z.string()),
  content_ideas: z.array(z.string()),
});

export type OpportunityAnalysis = z.infer<typeof analysisSchema>;
