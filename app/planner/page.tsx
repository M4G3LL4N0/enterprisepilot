"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { generatePilot } from "@/lib/engine";
import {
  BUYER_TYPES,
  DATA_EXPOSURE_LEVELS,
  PILOT_DURATIONS,
  SECURITY_POSTURES,
  STAKEHOLDER_ROLES,
  STARTUP_CATEGORIES,
  USE_CASES,
  type PilotInput,
} from "@/lib/types";

const defaultForm: PilotInput = {
  startupProduct: "Agent-powered workflow copilot",
  startupCategory: "AI / automation",
  buyerType: "CIO / IT",
  useCase: "Workflow automation",
  pilotDuration: "4 weeks",
  securityPosture: "moderate",
  dataExposure: "Synthetic / anonymized",
  stakeholders: ["Executive sponsor", "Security", "Procurement"],
  roiAssumptions: {
    hoursSavedPerWeek: 12,
    hourlyCost: 85,
    errorReductionPercent: 15,
    contractValue: 120000,
  },
};

export default function PlannerPage() {
  const router = useRouter();
  const [form, setForm] = useState<PilotInput>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReturnType<typeof generatePilot> | null>(null);

  function toggleStakeholder(role: (typeof STAKEHOLDER_ROLES)[number]) {
    setForm((f) => {
      const has = f.stakeholders.includes(role);
      const stakeholders = has ? f.stakeholders.filter((r) => r !== role) : [...f.stakeholders, role];
      return { ...f, stakeholders: stakeholders.length ? stakeholders : [role] };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const preview = generatePilot(form);
    setDraft(preview);
    try {
      const res = await fetch("/api/pilot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return;
      if (data.id) router.push(`/dashboard/runs/${data.id}`);
    } catch {
      // The draft package remains on the page.
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">Pilot proposal generator</h1>
      <p className="mt-2 text-sm text-slate-400">Enter startup and buyer context to generate enterprise-ready pilot materials.</p>
      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs text-slate-500">Startup product</span>
          <input
            value={form.startupProduct}
            onChange={(e) => setForm((f) => ({ ...f, startupProduct: e.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Category</span>
          <select value={form.startupCategory} onChange={(e) => setForm((f) => ({ ...f, startupCategory: e.target.value as PilotInput["startupCategory"] }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
            {STARTUP_CATEGORIES.map((o) => (
              <option key={o} value={o} className="bg-slate-900">
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Buyer type</span>
          <select value={form.buyerType} onChange={(e) => setForm((f) => ({ ...f, buyerType: e.target.value as PilotInput["buyerType"] }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
            {BUYER_TYPES.map((o) => (
              <option key={o} value={o} className="bg-slate-900">
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Use case</span>
          <select value={form.useCase} onChange={(e) => setForm((f) => ({ ...f, useCase: e.target.value as PilotInput["useCase"] }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
            {USE_CASES.map((o) => (
              <option key={o} value={o} className="bg-slate-900">
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Pilot duration</span>
          <select value={form.pilotDuration} onChange={(e) => setForm((f) => ({ ...f, pilotDuration: e.target.value as PilotInput["pilotDuration"] }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
            {PILOT_DURATIONS.map((o) => (
              <option key={o} value={o} className="bg-slate-900">
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Security posture</span>
          <select value={form.securityPosture} onChange={(e) => setForm((f) => ({ ...f, securityPosture: e.target.value as PilotInput["securityPosture"] }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
            {SECURITY_POSTURES.map((o) => (
              <option key={o} value={o} className="bg-slate-900">
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500">Data exposure</span>
          <select value={form.dataExposure} onChange={(e) => setForm((f) => ({ ...f, dataExposure: e.target.value as PilotInput["dataExposure"] }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
            {DATA_EXPOSURE_LEVELS.map((o) => (
              <option key={o} value={o} className="bg-slate-900">
                {o}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="space-y-2 sm:col-span-2">
          <legend className="text-xs text-slate-500">Stakeholders</legend>
          <div className="flex flex-wrap gap-2">
            {STAKEHOLDER_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleStakeholder(role)}
                className={`rounded-full px-3 py-1.5 text-xs ${form.stakeholders.includes(role) ? "bg-cyan-400/20 text-cyan-200 ring-1 ring-cyan-400/40" : "border border-slate-700 text-slate-400"}`}
              >
                {role}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <button disabled={loading} className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50">
            {loading ? "Generating..." : "Generate pilot package"}
          </button>
          {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        </div>
      </form>
      {draft ? (
        <aside className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Draft package</p>
          <p className="mt-3 text-2xl font-semibold text-white">Readiness {draft.enterpriseReadinessScore}/100</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{draft.buyerSummary}</p>
        </aside>
      ) : null}
    </main>
  );
}
