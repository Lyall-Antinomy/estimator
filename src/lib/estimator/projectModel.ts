// src/lib/estimator/projectModel.ts

import type { ClientPreset, UnitRateTable, Estimate } from './model';

export type ProjectStatus = 'draft' | 'shared' | 'locked';

export interface ProjectMeta {
  id: string;
  name: string;
  clientName: string;
  currency: string;
  createdAtISO: string;
  updatedAtISO: string;
  status: ProjectStatus;
  validityDays: number;
}

export interface ProjectOverrides {
  /**
   * Per-project PM override (if unset, use preset.pmPercent)
   */
  pmPercent?: number;

  /**
   * Per-project unit rate overrides. Only include keys you override.
   * e.g. { template: 520, motion: 600 }
   */
  unitRates?: Partial<UnitRateTable>;

  /**
   * Optional: cohesion tuning per project (keep minimal for MVP)
   */
  cohesion?: Partial<ClientPreset['cohesion']>;
}

export interface Project {
  meta: ProjectMeta;

  /**
   * Which preset this project uses as the baseline.
   */
  presetId: string;

  /**
   * Project-specific overrides.
   */
  overrides?: ProjectOverrides;

  /**
   * The estimate (line items, locks, client changes).
   */
  estimate: Estimate;

  /**
   * Optional: share token for client link (MVP can skip).
   */
  shareToken?: string;
}

/**
 * Merge preset + project overrides into an "effective preset" for compute.
 * This avoids mutating your preset files and keeps estimates stable.
 */
export function getEffectivePreset(preset: ClientPreset, overrides?: ProjectOverrides): ClientPreset {
  const unitRates = overrides?.unitRates
    ? { ...preset.unitRates, ...overrides.unitRates }
    : preset.unitRates;

  const cohesion = overrides?.cohesion
    ? { ...preset.cohesion, ...overrides.cohesion }
    : preset.cohesion;

  return {
    ...preset,
    pmPercent: overrides?.pmPercent ?? preset.pmPercent,
    unitRates,
    cohesion,
  };
}