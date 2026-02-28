'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Panel } from '@/ui/components/Panel';
import { Button } from '@/ui/components/Button';
import { UnitRatesOverrideTable } from '@/ui/components/UnitRatesOverrideTable';

import { presetStudioEUR } from '@/lib/estimator/presets';

type SetupConfig = {
  projectName: string;
  clientName: string;
  validityDays: number;
  pmPercent: number; // e.g. 0.15
  unitRateOverrides?: Partial<typeof presetStudioEUR.unitRates>;
};

const SETUP_KEY = 'estimator_setup_v1';

export default function SetupPage() {
  const router = useRouter();
  const preset = presetStudioEUR;

  const [cfg, setCfg] = useState<SetupConfig>(() => {
    // Try hydrate setup so you can tweak and re-run quickly
    try {
      const raw = localStorage.getItem(SETUP_KEY);
      if (raw) return JSON.parse(raw) as SetupConfig;
    } catch {}
    return {
      projectName: 'New estimate',
      clientName: 'Pitch Client',
      validityDays: 14,
      pmPercent: preset.pmPercent,
      unitRateOverrides: undefined,
    };
  });

  const pmPctDisplay = useMemo(() => Math.round(cfg.pmPercent * 100), [cfg.pmPercent]);

  function persist(next: SetupConfig) {
    setCfg(next);
    try {
      localStorage.setItem(SETUP_KEY, JSON.stringify(next));
    } catch {}
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <div className="text-xl font-semibold tracking-tight">Estimator — Project setup</div>
          <div className="text-sm opacity-70">Internal configuration for this estimate.</div>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            try {
              localStorage.setItem(SETUP_KEY, JSON.stringify(cfg));
            } catch {}
            router.push('/estimator/demo');
          }}
        >
          Start project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        {/* Meta */}
        <Panel>
          <div className="text-sm font-semibold">Project</div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-1">
              <div className="text-xs opacity-70">Project name</div>
              <input
                className="bureau-focus w-full rounded-[999px] border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
                value={cfg.projectName}
                onChange={(e) => persist({ ...cfg, projectName: e.target.value })}
              />
            </div>

            <div className="grid gap-1">
              <div className="text-xs opacity-70">Client name</div>
              <input
                className="bureau-focus w-full rounded-[999px] border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
                value={cfg.clientName}
                onChange={(e) => persist({ ...cfg, clientName: e.target.value })}
              />
            </div>

            <div className="grid gap-1">
              <div className="text-xs opacity-70">Validity (days)</div>
              <input
                className="bureau-focus w-full rounded-[999px] border border-[var(--border)] bg-transparent px-3 py-2 text-sm tabular-nums"
                type="number"
                min={1}
                step={1}
                value={cfg.validityDays}
                onChange={(e) => persist({ ...cfg, validityDays: Math.max(1, Number(e.target.value || 14)) })}
              />
            </div>
          </div>
        </Panel>

        {/* Pricing profile */}
        <Panel>
          <div className="text-sm font-semibold">Pricing profile</div>

          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xs opacity-70">Preset</div>
              <div className="text-xs opacity-80">{preset.label}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs opacity-70">Currency</div>
              <div className="text-xs opacity-80">{preset.currency}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs opacity-70">PM%</div>
              <input
                className="bureau-focus w-[120px] rounded-[999px] border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-right tabular-nums"
                type="number"
                min={0}
                max={40}
                step={1}
                value={pmPctDisplay}
                onChange={(e) => {
                  const pct = Number(e.target.value || 0);
                  persist({ ...cfg, pmPercent: Math.max(0, pct) / 100 });
                }}
              />
            </div>

            <div className="text-xs opacity-60">
              Overrides apply to this project only. Preset remains unchanged.
            </div>
          </div>
        </Panel>
      </div>

      {/* Unit rates */}
      <div className="mt-4">
        <UnitRatesOverrideTable
          presetUnitRates={preset.unitRates}
          overrides={cfg.unitRateOverrides}
          onChange={(next) => persist({ ...cfg, unitRateOverrides: next })}
          currency={preset.currency}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            const next: SetupConfig = {
              projectName: 'New estimate',
              clientName: 'Pitch Client',
              validityDays: 14,
              pmPercent: preset.pmPercent,
              unitRateOverrides: undefined,
            };
            persist(next);
          }}
        >
          Reset setup
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            try {
              localStorage.removeItem(SETUP_KEY);
            } catch {}
          }}
        >
          Clear saved setup
        </Button>
      </div>
    </div>
  );
}