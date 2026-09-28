import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EnterprisePilot — procurement-ready enterprise pilots",
  description:
    "Turn startup context into a proposal structure, risk controls, procurement checklist, ROI framing, and buyer outreach draft. Prototype software, not a live buyer network.",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight text-white">EnterprisePilot</p>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
          Prototype
        </span>
      </div>

      <section className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Package a procurement-ready enterprise pilot.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
            Turn startup context into a proposal structure, risk controls, procurement checklist, ROI framing, and buyer outreach draft.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/planner"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              Generate a pilot package
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-200"
            >
              Open saved runs
            </Link>
          </div>
        </div>

        <PilotDossierVisual />
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[
          ["Proposal", "Structure the pilot so a buyer can evaluate it."],
          ["Risk", "Name the controls that procurement will ask for."],
          ["Checklist", "Walk the security and legal gates in order."],
          ["ROI case", "Frame value without inventing customer numbers."],
          ["Outreach", "Draft the buyer note — labeled unsent."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-[#0d1824] p-4">
            <h2 className="text-sm font-semibold text-cyan-100">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
          </article>
        ))}
      </section>

      <p className="mt-12 text-center text-xs text-slate-500">
        EnterprisePilot · prototype packaging software · not a live enterprise buyer network
      </p>
    </main>
  );
}

function PilotDossierVisual() {
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1824] p-5 shadow-2xl shadow-black/40">
      <figcaption className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>Pilot dossier</span>
        <span>Draft · not sent</span>
      </figcaption>
      <svg viewBox="0 0 480 320" className="h-auto w-full" role="img" aria-label="Enterprise pilot package with proposal, risk, and procurement sections">
        <rect width="480" height="320" rx="18" fill="#10202c" />
        <rect x="20" y="20" width="280" height="280" rx="12" fill="#0b1620" stroke="#1f3a4d" />
        <text x="36" y="52" fill="#67e8f9" fontSize="12" fontFamily="ui-sans-serif, system-ui">F100 PILOT PACK</text>
        <text x="36" y="86" fill="#f8fafc" fontSize="22" fontFamily="ui-sans-serif, system-ui" fontWeight="600">Security controls</text>
        <text x="36" y="112" fill="#94a3b8" fontSize="13" fontFamily="ui-sans-serif, system-ui">Procurement checklist</text>
        <rect x="36" y="136" width="210" height="10" rx="5" fill="#164e63" />
        <rect x="36" y="156" width="168" height="10" rx="5" fill="#155e75" />
        <rect x="36" y="176" width="188" height="10" rx="5" fill="#0e7490" />
        <rect x="36" y="208" width="88" height="28" rx="8" fill="#22d3ee" />
        <text x="48" y="227" fill="#082f49" fontSize="11" fontFamily="ui-sans-serif, system-ui" fontWeight="700">ROI case</text>
        <rect x="320" y="20" width="140" height="80" rx="12" fill="#123044" stroke="#164e63" />
        <text x="334" y="48" fill="#67e8f9" fontSize="11">Risk gate</text>
        <text x="334" y="72" fill="#e2e8f0" fontSize="16" fontWeight="600">Open</text>
        <rect x="320" y="116" width="140" height="80" rx="12" fill="#123044" stroke="#164e63" />
        <text x="334" y="144" fill="#67e8f9" fontSize="11">Buyer note</text>
        <text x="334" y="168" fill="#e2e8f0" fontSize="16" fontWeight="600">Drafted</text>
        <rect x="320" y="212" width="140" height="88" rx="12" fill="#123044" stroke="#164e63" />
        <text x="334" y="240" fill="#67e8f9" fontSize="11">Outreach</text>
        <text x="334" y="264" fill="#e2e8f0" fontSize="16" fontWeight="600">Ready</text>
      </svg>
    </figure>
  );
}
