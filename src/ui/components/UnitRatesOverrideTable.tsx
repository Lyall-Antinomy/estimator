'use client';

import React from 'react';
import type { UnitRateTable } from '@/lib/estimator/model';
import { Panel } from '@/ui/components/Panel';
import { Button } from '@/ui/components/Button';
import { Badge } from '@/ui/components/Badge';

type UnitKey = keyof UnitRateTable;

const LABELS: Record<UnitKey, { label: string; hint: string }> = {
  system: { label: 'System', hint: 'Design system + component foundations' },
  template: { label: 'Template', hint: 'Key page type work' },
  pageInstance: { label: 'Instance', hint: 'Repeatable page variants / adaptations' },
  integration: { label: 'Integration', hint: 'Technical wiring / CMS / APIs' },
  content: { label: 'Content', hint: 'Population / migration / admin throughput' },
  motion: { label: 'Motion', hint: 'Motion direction / animation systems' },
  qa: { label: 'QA', hint: 'Review, edge cases, polish checks' },
};

function isNumberLike(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function clampMoney(n: number) {
  // Avoid 0/negative accidental values
  return Math.max(0, Math.round(n));
}

export function UnitRatesOverrideTable({
  presetUnitRates,
  overrides,
  onChange,
  currency = 'EUR',
}: {
  presetUnitRates: UnitRateTable;
  overrides?: Partial<UnitRateTable>;
  onChange: (next?: Partial<UnitRateTable>) => void;
  currency?: string;
}) {
  const keys = Object.keys(presetUnitRates) as UnitKey[];

  function setOverride(key: UnitKey, enabled: boolean) {
    const next = { ...(overrides ?? {}) };

    if (!enabled) {
      delete next[key];
    } else {
      // initialize override to preset value if not set
      next[key] = presetUnitRates[key];
    }

    // If empty, collapse to undefined
    onChange(Object.keys(next).length ? next : undefined);
  }

  function setOverrideValue(key: UnitKey, value: number) {
    const next = { ...(overrides ?? {}) };
    next[key] = clampMoney(value);
    onChange(next);
  }

  function resetAll() {
    onChange(undefined);
  }

  return (
    <Panel className="p-0">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Unit rates</div>
          <div className="text-xs opacity-70">
            Defaults come from the preset. Overrides apply to this project only.
          </div>
        </div>
        <Button variant="ghost" onClick={resetAll} disabled={!overrides || Object.keys(overrides).length === 0}>
          Reset overrides
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs opacity-70">
            <tr className="border-b border-[var(--border)]">
              <th className="text-left font-medium px-4 py-2 min-w-[220px]">Unit</th>
              <th className="text-right font-medium px-2 py-2 min-w-[120px]">Preset</th>
              <th className="text-center font-medium px-2 py-2 min-w-[110px]">Override</th>
              <th className="text-right font-medium px-4 py-2 min-w-[160px]">Value</th>
            </tr>
          </thead>

          <tbody>
            {keys.map((key) => {
              const preset = presetUnitRates[key];
              const overridden = overrides && Object.prototype.hasOwnProperty.call(overrides, key);
              const overrideVal = overridden ? overrides?.[key] : undefined;

              return (
                <tr key={key} className="border-b border-[var(--border)]">
                  <td className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <div className="font-medium">{LABELS[key].label}</div>
                        <div className="text-xs opacity-70">{LABELS[key].hint}</div>
                      </div>
                      {overridden ? <Badge tone="truth">Overridden</Badge> : <Badge tone="spec">Preset</Badge>}
                    </div>
                  </td>

                  <td className="px-2 py-3 text-right tabular-nums opacity-80">
                    {preset.toLocaleString()} {currency}
                  </td>

                  <td className="px-2 py-3 text-center">
                    <button
                      type="button"
                      className={[
                        'bureau-focus inline-flex items-center gap-2 rounded-[999px] border px-3 py-1 text-xs transition',
                        overridden
                          ? 'border-[var(--bureau-green)] text-[var(--bureau-green)] bg-[var(--bureau-green-10)]'
                          : 'border-[var(--border)] text-[var(--foreground)] bg-transparent hover:bg-white/5',
                      ].join(' ')}
                      onClick={() => setOverride(key, !overridden)}
                    >
                      <span
                        className={[
                          'inline-block h-2 w-2 rounded-full',
                          overridden ? 'bg-[var(--bureau-green)]' : 'bg-[var(--border)]',
                        ].join(' ')}
                      />
                      {overridden ? 'On' : 'Off'}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <input
                      className={[
                        'bureau-focus w-[140px] rounded-[999px] border bg-transparent px-3 py-2 text-sm tabular-nums text-right',
                        overridden ? 'border-[var(--border)]' : 'border-[var(--border)] opacity-40',
                      ].join(' ')}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={10}
                      disabled={!overridden}
                      value={isNumberLike(overrideVal) ? overrideVal : preset}
                      onChange={(e) => setOverrideValue(key, Number(e.target.value))}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}