"use client";

import { useMemo, useState } from "react";

export default function SubmissionAssistant() {
  const [campaign, setCampaign] = useState("");
  const [tasks, setTasks] = useState(
    "Join the official community\nCreate and publish the required post\nTag the official project accounts\nComplete all campaign page tasks\nSubmit proof of participation"
  );
  const [completed, setCompleted] = useState<number[]>([]);
  const [proof, setProof] = useState("");
  const [profile, setProfile] = useState("");

  const items = useMemo(
    () => tasks.split("\n").map((item) => item.trim()).filter(Boolean),
    [tasks]
  );

  const progress = items.length
    ? Math.round((completed.length / items.length) * 100)
    : 0;

  const message = `Hello ${campaign || "Campaign Team"},

I am submitting my participation for this campaign.

Completed tasks:
${items.filter((_, i) => completed.includes(i)).map((item) => "- " + item).join("\n") || "- No tasks marked complete yet"}

Proof links:
${proof || "Not provided"}

Profile:
${profile || "Not provided"}

Thank you for reviewing my submission.
`;

  async function copyMessage() {
    await navigator.clipboard.writeText(message);
    alert("Submission message copied!");
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#111522] p-5 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          Submission workspace
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">
          Submission Assistant
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Track campaign tasks, organize proof links and prepare your submission.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Campaign name</label>
        <input
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          placeholder="Enter campaign or project name..."
          className="w-full rounded-lg border border-white/10 bg-[#080c16] p-3 text-sm text-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Campaign task checklist (one task per line)
        </label>
        <textarea
          value={tasks}
          onChange={(e) => {
            setTasks(e.target.value);
            setCompleted([]);
          }}
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-[#080c16] p-3 text-sm text-white"
        />
      </div>

      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-white">Completion progress</span>
          <span className="font-bold text-cyan-300">{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {completed.length} of {items.length} tasks completed
        </p>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-white">Your tasks</h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <label key={`${index}-${item}`} className="flex items-start gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={completed.includes(index)}
                onChange={(e) =>
                  setCompleted((old) =>
                    e.target.checked
                      ? [...old, index]
                      : old.filter((id) => id !== index)
                  )
                }
                className="mt-1 accent-cyan-400"
              />
              <span className={completed.includes(index) ? "line-through text-slate-500" : ""}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Proof links (X post, screenshots, campaign page)
        </label>
        <textarea
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          rows={3}
          placeholder="Paste your proof links here..."
          className="w-full rounded-lg border border-white/10 bg-[#080c16] p-3 text-sm text-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Your profile or social link
        </label>
        <input
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          placeholder="https://x.com/yourusername"
          className="w-full rounded-lg border border-white/10 bg-[#080c16] p-3 text-sm text-white"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="font-semibold text-white">Submission message preview</h3>
        <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-300">
          {message}
        </pre>
        <button
          onClick={copyMessage}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Copy submission message
        </button>
      </div>
    </section>
  );
}
