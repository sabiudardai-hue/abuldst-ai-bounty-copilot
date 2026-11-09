 "use client";

import { useState } from "react";
import type { OpportunityAnalysis } from "@/lib/analysis-schema";

const example = `We are looking for community ambassadors to support our Web3 ecosystem.
Requirements: an active X account, publish two original posts per week, join our Discord,
and participate in community discussions. Selected ambassadors may receive monthly token
rewards. Applications close on December 15. Applicants should submit their social profile
and a short explanation of how they will contribute.`;

export default function Analyzer() {
  const [text, setText] = useState("");
  const [profile, setProfile] = useState("");
  const [analysis, setAnalysis] = useState<OpportunityAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            opportunityText: text,
              profile: profile,
              }),
      });
      const raw = await response.text();

      if (!raw.trim()) {
        throw new Error(`API returned an empty response (HTTP ${response.status}).`);
        }

        let data: { analysis?: OpportunityAnalysis; error?: string };

        try {
          data = JSON.parse(raw);
          } catch {
            throw new Error(`API returned invalid JSON (HTTP ${response.status}): ${raw.slice(0, 200)}`);
            }
      if (!response.ok) throw new Error(data.error ?? "Analysis failed.");
      setAnalysis(data.analysis as OpportunityAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <div className="rounded-2xl border border-white/10 bg-[#111522] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-300">OPPORTUNITY ANALYZER</p>
            <h2 className="mt-1 text-xl font-semibold">Paste a campaign brief</h2>
          </div>
          <span className="rounded-full border border-violet-400/30 px-3 py-1 text-xs text-violet-200">Gemini AI</span>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste a bounty, ambassador campaign, grant or Web3 job description..."
          className="min-h-64 w-full resize-y rounded-xl border border-white/10 bg-[#090d17] p-4 text-sm leading-6 text-white outline-none transition focus:border-violet-400"
        />
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-white">
              Your Web3 Profile
                </label>
                  <textarea
                      value={profile}
                          onChange={(event) => setProfile(event.target.value)}
                              placeholder="Enter your skills, experience, achievements, and social links..."
                                  className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-[#090d17] p-4 text-sm leading-6 text-white outline-none transition focus:border-violet-400"
                                    />
                                      <p className="mt-2 text-xs text-slate-500">
                                          Add your real skills and experience for accurate opportunity matching.
                                            </p>
                                            </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <button onClick={() => setText(example)} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
            Load sample
          </button>
          <button onClick={runAnalysis} disabled={loading || text.trim().length < 40} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Analyzing..." : "Analyze opportunity →"}
          </button>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
        <p className="mt-4 text-xs text-slate-500">Do not paste passwords, private keys, wallet seed phrases or other secrets.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111522] p-5">
        <p className="text-sm font-semibold text-cyan-300">AI RESULTS</p>
        {!analysis ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-2xl">✦</div>
            <h3 className="font-semibold">Your campaign intelligence appears here</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">Paste an opportunity and run the analyzer to extract requirements, eligibility signals and next steps.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold">{analysis.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{analysis.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-violet-400/10 px-3 py-1 text-violet-200">Eligibility: {analysis.eligibility}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">Reward: {analysis.reward}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">Deadline: {analysis.deadline}</span>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-500/10 p-4">
              <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Opportunity Score</h4>
                      <span className="text-2xl font-bold text-violet-300">
                            {analysis.opportunity_score}/100
                                </span>
                                  </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                              className="h-full rounded-full bg-violet-500"
                                                    style={{ width: `${analysis.opportunity_score}%` }}
                                                        />
                                                          </div>
                                                            <p className="mt-2 text-sm text-slate-300">
                                                                {analysis.score_reason}
                                                                  </p>
                                                                  </div>
            <ResultList title="Requirements" items={analysis.requirements} />
            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
              <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Opportunity Match</h4>
                      <span className="text-xl font-bold text-cyan-300">
                            {analysis.match_percentage}%
                                </span>
                                  </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                              className="h-full rounded-full bg-cyan-400"
                                                    style={{ width: `${analysis.match_percentage}%` }}
                                                        />
                                                          </div>

                                                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                                                <ResultList title="Matched Skills" items={analysis.matched_skills} />
                                                                    <ResultList title="Skill Gaps" items={analysis.skill_gaps} />
                                                                      </div>
                                                                      </div>
            <ResultList title="Missing information" items={analysis.missing_requirements} />
            <ResultList title="Recommended actions" items={analysis.recommended_actions} />
            <ResultList title="Submission checklist" items={analysis.submission_checklist} />
            <ResultList title="Content ideas" items={analysis.content_ideas} />
          </div>
        )}
      </div>
    </section>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-white">{title}</h4>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item, index) => <li key={`${title}-${index}`} className="flex gap-2 text-sm leading-5 text-slate-300"><span className="text-violet-300">•</span>{item}</li>)}
        </ul>
      ) : <p className="text-sm text-slate-500">No items identified.</p>}
    </div>
  );
}
