import type { ClientPreset } from './model';

export const presetStudioEUR: ClientPreset = {
  id: 'preset-studio-eur-v1',
  label: 'Studio Default (EUR)',
  currency: 'EUR',

  pmPercent: 0.05,

  resolutionCurve: { 1: 0.5, 2: 0.75, 3: 1, 4: 1.35, 5: 1.8, 6: 2.5, 7: 3.3 },
  confidenceBuffer: { high: 0, medium: 0.08, low: 0.18 },
  complexityMultiplier: { simple: 0.75, standard: 1.0, complex: 1.35 },

  unitRates: {
    system: 520,
    template: 480,
    pageInstance: 210,
    integration: 560,
    content: 160,
    motion: 540,
    qa: 280,
  },

  cohesion: {
    enabled: true,
    coreFloorDelta: 2,
    utilityFloorDelta: 4,
    minCoreFloor: 3,
    minUtilityFloor: 2,
    debtFactorPerNotch: 0.12,
    debtPricingMode: 'itemBase',
  },
};