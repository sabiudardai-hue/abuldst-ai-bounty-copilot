"use client";

import { useState } from "react";

type Content = {
  x_post: string;
  thread: string[];
  meme_ideas: string[];
};

export default function ContentGenerator() {
  const [brief, setBrief] = useState("");
  const [profile, setProfile] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (brief.trim().length < 40) {
      setError("Please enter at least 40 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setContent(null);

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityText: brief,
          profile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Content generation failed.");
      }

      setContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <section className="mt-8 rounded-2xl border border-violet-400/20 bg-[#111522] p-5 space-y-5">
      <div>
        <p className="text-xs font-semibold text-violet-300">AI CONTENT STUDIO</p>
        <h2 className="mt-2 text-xl font-bold text-white">Create campaign content</h2>
        <p className="mt-2 text-sm text-slate-400">
          Generate X posts, threads and meme ideas with Gemini AI.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-white">
          Campaign brief
        </label>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Paste your campaign details here..."
          className="min-h-36 w-full rounded-xl border border-white/10 bg-[#080c16] p-3 text-sm text-white outline-none focus:border-violet-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-white">
          Your Web3 profile
        </label>
        <textarea
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          placeholder="Your skills, X handle, portfolio and experience..."
          className="min-h-24 w-full rounded-xl border border-white/10 bg-[#080c16] p-3 text-sm text-white outline-none focus:border-violet-400"
        />
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate content →"}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {content && (
        <div className="space-y-5">
          <div className="rounded-xl border border-white/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-white">X Post</h3>
              <button onClick={() => copy(content.x_post)} className="text-sm text-violet-300">Copy</button>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{content.x_post}</p>
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-white">X Thread</h3>
              <button onClick={() => copy(content.thread.join("\n\n"))} className="text-sm text-violet-300">Copy all</button>
            </div>
            {content.thread.map((post, index) => (
              <div key={index} className="mb-3 border-b border-white/10 pb-3 text-sm text-slate-300">
                <p className="mb-1 text-violet-300">Post {index + 1}</p>
                <p className="whitespace-pre-wrap">{post}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-white">Meme Ideas</h3>
              <button onClick={() => copy(content.meme_ideas.join("\n"))} className="text-sm text-violet-300">Copy all</button>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              {content.meme_ideas.map((idea, index) => <li key={index}>{idea}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
