'use client';

import { useEffect, useMemo, useState } from 'react';

import { Panel } from '@/ui/components/Panel';
import { Button } from '@/ui/components/Button';
import { Badge } from '@/ui/components/Badge';
import { Segmented } from '@/ui/components/Segmented';
import { getEffectivePreset } from '@/lib/estimator/projectModel';

import type {
  Estimate,
  LineItem,
  ResolutionLevel,
  Confidence,
} from '@/lib/estimator/model';

import { withAutoItems, computeTotals, resolveRename } from '@/lib/estimator/model';
import { presetStudioEUR } from '@/lib/estimator/presets';
import { exampleEstimateMarketingSite } from '@/lib/estimator/examples';

type Mode = 'studio' | 'client';

const RESOLUTION_OPTIONS: Array<{ value: ResolutionLevel; label: string }> = [
    { value: 3, label: 'MVP' },
    { value: 4, label: 'Advanced' },
    { value: 5, label: 'Premium' },
  ];

const CONFIDENCE_OPTIONS: Confidence[] = ['high', 'medium', 'low'];

const LS_KEY = 'thebureau_estimator_demo_v2';
const SETUP_KEY = 'estimator_setup_v1';



function LockedPadlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 7V5a4 4 0 1 1 8 0v2h1a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 13 15H3A1.5 1.5 0 0 1 1.5 13.5v-5A1.5 1.5 0 0 1 3 7h1zm2-2v2h4V5a2 2 0 1 0-4 0z"
        fill="currentColor"
      />
    </svg>
  );
}

function fmtCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(0)} ${currency}`;
  }
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export default function Page() {
  const preset = presetStudioEUR;

  const [setup, setSetup] = useState<{
    projectName?: string;
    clientName?: string;
    validityDays?: number;
    pmPercent?: number;
    unitRateOverrides?: Partial<typeof presetStudioEUR.unitRates>;
  } | null>(null);

  const effectivePreset = useMemo(() => {
    return getEffectivePreset(preset, {
      pmPercent: setup?.pmPercent,
      unitRates: setup?.unitRateOverrides,
    });
  }, [preset, setup?.pmPercent, setup?.unitRateOverrides]);

  const [mode, setMode] = useState<Mode>('studio');

  const [estimate, setEstimate] = useState<Estimate>(() => deepClone(exampleEstimateMarketingSite));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETUP_KEY);
      if (!raw) return;
      const cfg = JSON.parse(raw);
      setSetup(cfg);

      setEstimate((prev) => {
        const next = deepClone(prev);
        if (cfg.clientName) next.meta.clientName = String(cfg.clientName);
        if (cfg.validityDays) next.meta.validityDays = Number(cfg.validityDays);
        if (cfg.projectName) next.meta.title = String(cfg.projectName);
        return next;
      });
    } catch {
      // ignore
    }
  }, []);

  const estimateWithAuto = useMemo(() => withAutoItems(estimate, effectivePreset), [estimate, effectivePreset]);

  const totals = useMemo(() => computeTotals(estimateWithAuto, effectivePreset), [estimateWithAuto, effectivePreset]);

  const truthTotal = totals.grandTotalTruth;
  const specTotal = totals.grandTotalSpec;
  const delta = specTotal - truthTotal;
  const currentTotal = totals.truthSubtotal + totals.specSubtotal;
  const rawDelta = currentTotal - totals.truthSubtotal;
  const lockedTotal = totals.truthSubtotal;
  const changeVsLocked = currentTotal - lockedTotal;

  function clampResolutionToDemoBand(r: ResolutionLevel): ResolutionLevel {
    if (r <= 3) return 3;
    if (r >= 5) return 5;
    return r; // 4
  }

  function updateItem(itemId: string, updater: (item: LineItem) => LineItem) {
    setEstimate((prev) => {
      const next = deepClone(prev);

      // Only non-auto items are stored in state. Auto items are derived.
      const idx = next.items.findIndex((i: any) => i.id === itemId);
      if (idx === -1) return prev;

      const current = next.items[idx] as LineItem;
      let updated = updater(current);

      // Client edits always remain Spec (never lock).
      if (mode === 'client') updated = { ...updated, lockState: 'spec' };

      next.items[idx] = updated as any;
      next.meta.updatedAtISO = new Date().toISOString();
      return next;
    });
  }

  function resetDemo() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
    setEstimate(deepClone(exampleEstimateMarketingSite));
    setMode('studio');
  }

  function setAllLocks(state: 'truth' | 'spec') {
    if (mode !== 'studio') return;

    setEstimate((prev) => {
      const next = deepClone(prev);
      next.items = next.items.map((i: any) => {
        if (i.type === 'auto') return i;
        return { ...i, lockState: state };
      });
      next.meta.updatedAtISO = new Date().toISOString();
      return next;
    });
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        {/* Top bar: only in first column so its right edge aligns with line items table */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/as.jpg" alt="27b" width={100} height={100} className="opacity-90 shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="text-xl font-semibold tracking-tight">Estimator</div>
              <div className="text-sm opacity-70">
                {estimateWithAuto.meta.clientName} · Validity {estimateWithAuto.meta.validityDays} days
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Badge tone={mode === 'studio' ? 'truth' : 'spec'}>
                {mode === 'studio' ? 'Studio Mode' : 'Client Mode'}
              </Badge>

              <div className="inline-flex rounded-[var(--radius)] border border-[var(--border)] p-1">
                <button
                  type="button"
                  className={[
                    'bureau-focus px-3 py-1 text-xs rounded-[calc(var(--radius)-6px)] transition',
                    mode === 'studio'
                      ? 'bg-[var(--bureau-green)] text-white'
                      : 'bg-transparent hover:bg-white/5',
                  ].join(' ')}
                  onClick={() => setMode('studio')}
                >
                  Studio
                </button>
                <button
                  type="button"
                  className={[
                    'bureau-focus px-3 py-1 text-xs rounded-[calc(var(--radius)-6px)] transition',
                    mode === 'client'
                      ? 'bg-[var(--bureau-green)] text-white'
                      : 'bg-transparent hover:bg-white/5',
                  ].join(' ')}
                  onClick={() => setMode('client')}
                >
                  Client
                </button>
              </div>
            </div>

            <Button variant="ghost" onClick={() => setAllLocks('truth')} disabled={mode !== 'studio'}>
              Lock all
            </Button>
            <Button variant="ghost" onClick={() => setAllLocks('spec')} disabled={mode !== 'studio'}>
              Unlock all
            </Button>
            <Button variant="ghost" onClick={resetDemo}>
              Reset demo
            </Button>
          </div>
        </div>

        {/* Row 1 col 2: empty so grid columns align */}
        <div className="hidden md:block" />

        {/* Left: table */}
        <Panel className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div className="text-sm font-semibold">Line Items</div>
            <div className="text-xs opacity-70">
              Currency: {preset.currency} · PM {Math.round(preset.pmPercent * 100)}%
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs opacity-70">
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left font-medium px-4 py-2 min-w-[260px]">Deliverable</th>
                  <th className="text-left font-medium px-2 py-2 min-w-[120px]">Type</th>
                  <th className="text-left font-medium px-2 py-2 min-w-[340px]">Scope</th>
                  <th className="text-left font-medium px-2 py-2 min-w-[120px]">Set</th>
                  <th className="text-right font-medium px-4 py-2 min-w-[140px]">Price</th>
                </tr>
              </thead>

              <tbody>
                {estimateWithAuto.items.map((item) => {
                  const renamed = resolveRename(item as any);
                  const isAuto = item.type === 'auto';
                  const isInstance = item.type === 'instance';

                  const breakdown =
                    item.lockState === 'truth'
                      ? totals.truthItems.find((b) => b.itemId === item.id)
                      : totals.specItems.find((b) => b.itemId === item.id);

                  const price = breakdown?.total ?? 0;

                  return (
                    <tr
                      key={item.id}
                      className={[
                        'border-b border-[var(--border)] align-top',
                        isAuto ? 'bg-white/3' : '',
                      ].join(' ')}
                    >
                      {/* Deliverable */}
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="font-medium">{renamed.title}</div>
                            {renamed.description ? (
                              <div className="text-xs opacity-70 leading-snug">{renamed.description}</div>
                            ) : null}

                            {isAuto && item.type === 'auto' ? (
                              <div className="mt-1 text-xs opacity-70">
                                Derived from cohesion mismatches ·{' '}
                                <span className="opacity-80">
                                  Max core: {item.derivedFrom.maxCoreResolution}, core floor: {item.derivedFrom.coreFloor},
                                  utility floor: {item.derivedFrom.utilityFloor}
                                </span>
                              </div>
                            ) : null}

                            {/* Instance controls */}
                            {isInstance ? (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <div className="text-xs opacity-70">Pages</div>

                                <div className="inline-flex items-center gap-1 rounded-[999px] border border-[var(--border)] px-2 py-1">
                                  <button
                                    type="button"
                                    className="bureau-focus px-2 text-xs opacity-80 hover:opacity-100"
                                    onClick={() =>
                                      updateItem(item.id, (it) => {
                                        if (it.type !== 'instance') return it;
                                        return { ...it, count: Math.max(0, it.count - 1) };
                                      })
                                    }
                                  >
                                    –
                                  </button>

                                  <div className="text-xs tabular-nums min-w-[18px] text-center">
                                    {(item as any).count}
                                  </div>

                                  <button
                                    type="button"
                                    className="bureau-focus px-2 text-xs opacity-80 hover:opacity-100"
                                    onClick={() =>
                                      updateItem(item.id, (it) => {
                                        if (it.type !== 'instance') return it;
                                        return { ...it, count: it.count + 1 };
                                      })
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>

                          {isAuto ? <Badge tone="derived">Derived</Badge> : null}
                        </div>
                      </td>

                      {/* Tag */}
                      <td className="px-2 py-3">
                        <Badge
                          tone={
                            item.cohesionTag === 'core'
                              ? 'core'
                              : item.cohesionTag === 'utility'
                              ? 'utility'
                              : 'optional'
                          }
                        >
                          {item.cohesionTag}
                        </Badge>
                      </td>

                      {/* Resolution */}
                      <td className="px-2 py-3 w-full min-w-0">
                        <div className="flex flex-col gap-2 w-full min-w-[200px]">
                          <Segmented
                            value={clampResolutionToDemoBand(item.resolution)}
                            options={RESOLUTION_OPTIONS}
                            onChange={(v) =>
                              updateItem(item.id, (it) => {
                                if (it.type === 'auto') return it;
                                const nextRes = clampResolutionToDemoBand(v as ResolutionLevel);
                                const min = it.minResolution ?? 1;
                                const clamped = Math.max(min, nextRes) as ResolutionLevel;
                                return { ...it, resolution: clamped };
                              })
                            }
                            className="w-full"
                          />

                          {/* Confidence (studio only) */}
                          {mode === 'studio' && item.type !== 'auto' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-70">Confidence</span>
                              <select
                                className="bureau-focus rounded-[999px] border border-[var(--border)] bg-transparent px-2 py-1 text-xs"
                                value={item.confidence}
                                onChange={(e) =>
                                  updateItem(item.id, (it) => {
                                    if (it.type === 'auto') return it;
                                    return { ...it, confidence: e.target.value as Confidence };
                                  })
                                }
                              >
                                {CONFIDENCE_OPTIONS.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* State */}
                      <td className="px-2 py-3">
                        {mode === 'studio' && item.type !== 'auto' ? (
                          <button
                            type="button"
                            className={[
                              'bureau-focus flex h-8 w-8 shrink-0 items-center justify-center rounded-[calc(var(--radius)-6px)] transition',
                              item.lockState === 'truth'
                                ? 'bg-[var(--bureau-green)] text-white'
                                : 'border border-[var(--bureau-green)] bg-[var(--background)] text-black/80',
                            ].join(' ')}
                            onClick={() =>
                              updateItem(item.id, (it) => {
                                if (it.type === 'auto') return it;
                                return { ...it, lockState: it.lockState === 'truth' ? 'spec' : 'truth' };
                              })
                            }
                            aria-label={item.lockState === 'truth' ? 'Locked' : 'Unlocked'}
                          >
                            <LockedPadlockIcon />
                          </button>
                        ) : (
                          <span
                            className={[
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-[calc(var(--radius)-6px)]',
                              item.lockState === 'truth'
                                ? 'bg-[var(--bureau-green)] text-white'
                                : 'border border-[var(--bureau-green)] bg-[var(--background)] text-black/80',
                            ].join(' ')}
                            aria-hidden
                          >
                            <LockedPadlockIcon />
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <div className="font-semibold tabular-nums min-w-[10ch] text-right">
                            {fmtCurrency(price, preset.currency)}
                          </div>
                          {breakdown ? (
                            <div className="mt-1 text-xs opacity-60 tabular-nums min-w-[10ch] text-right">
                              pm {fmtCurrency(breakdown.pmAmount, preset.currency)}
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Right: totals - fixed so top never passes viewport */}
        <div className="relative">
          <Panel className="h-fit w-full md:fixed md:top-4 md:right-6 md:w-[360px] md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
  <div className="flex items-start justify-between gap-3">
    <div className="flex flex-col">
      <div className="text-sm font-semibold">
        {mode === 'client' ? 'Total' : 'Locked total'}
      </div>
      <div className="text-xs opacity-70">
        {mode === 'client'
          ? 'Adjust Resolution to match budget.'
          : 'Agreed baseline (Truth).'}
      </div>
    </div>
  </div>

  <div className="mt-4 grid gap-3">
    <div className="flex items-center justify-between">
      <div className="text-xs opacity-70">Total</div>
      <div className="text-lg font-semibold tabular-nums min-w-[10ch] text-right">
        {fmtCurrency(mode === 'client' ? currentTotal : lockedTotal, preset.currency)}
      </div>
    </div>

    <div className="mt-2 border-t border-[var(--border)] pt-3">
      <div className="text-xs font-semibold mb-2">How to demo</div>
      <ul className="text-xs opacity-70 leading-relaxed list-disc pl-4">
        <li>Switch to Client Mode.</li>
        <li>Adjust Resolution on any line item.</li>
        <li>Watch the Total update instantly.</li>
      </ul>
    </div>

    <div className="mt-2 border-t border-[var(--border)] pt-3">
      <div className="text-xs font-semibold mb-2">Assumptions</div>
      <ul className="text-xs opacity-70 leading-relaxed list-disc pl-4">
        <li>Resolution defines finish level, coverage, QA and iteration.</li>
        <li>Changes are draft until explicitly locked.</li>
        <li>Third-party costs excluded unless listed.</li>
      </ul>
    </div>

    <div className="mt-3 flex flex-col gap-2">
      <Button
        variant="primary"
        onClick={() => {
          try {
            const url =
              mode === 'studio'
                ? `${window.location.origin}${window.location.pathname}?mode=client`
                : window.location.href;
            navigator.clipboard.writeText(url);
          } catch {
            // ignore
          }
        }}
      >
        Copy demo link
      </Button>
      <Button variant="ghost" disabled>
        Export PDF (later)
      </Button>
    </div>

    <div className="mt-2">
      <Button variant="ghost" onClick={resetDemo}>
        Reset demo
      </Button>
    </div>
  </div>
</Panel>
        </div>
      </div>
    </div>
  );
}