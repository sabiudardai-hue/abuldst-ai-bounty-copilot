import Link from "next/link";
import Analyzer from "@/components/Analyzer";

const stats = [
  ["01", "Paste an opportunity", "Bounties, ambassador campaigns, grants or Web3 jobs"],
  ["02", "Understand the brief", "Extract requirements, rewards and deadlines"],
  ["03", "Plan your submission", "Get actionable next steps and content ideas"],
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <header className="mb-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-lg font-black">A</span>
          <span className="font-semibold tracking-tight">ABULDST <span className="text-violet-300">COPILOT</span></span>
        </Link>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">Web3 opportunity intelligence</span>
      </header>

      <section className="mb-10 max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[.22em] text-violet-300">Your Web3 opportunity workspace</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">Turn opportunities into <span className="text-violet-300">action.</span></h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">Analyze bounty and ambassador campaigns, understand what matters, and build a clear plan for your next submission with AI.</p>
      </section>

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        {stats.map(([number, title, description]) => (
          <div key={number} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
            <p className="text-xs font-semibold text-violet-300">{number}</p>
            <h2 className="mt-2 font-semibold">{title}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-400">{description}</p>
          </div>
        ))}
      </div>

      <Analyzer />

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
        Abuldst AI Bounty Copilot · AI-generated guidance should be checked against the original campaign rules.
      </footer>
    </main>
  );
}
