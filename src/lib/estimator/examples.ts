// src/lib/estimator/examples.ts
import type { Estimate } from './model';
import { presetStudioEUR } from './presets';

/**
 * Client pitch replication:
 * - Visual concept direction
 * - Modular component library in Figma
 * - Template library (up to 5 key page types) across 2 audience types
 * - Interactive prototype
 * - High-fidelity 1:1 screen designs (desktop + mobile) -> treated as implicit in template resolution
 * - Annotated Figma file (components, breakpoints, variants)
 *
 * Note:
 * We keep the export name `exampleEstimateMarketingSite` so the demo page compiles unchanged.
 */
export const exampleEstimateMarketingSite: Estimate = {
  meta: {
    id: 'est-pitch-client-0002',
    title: 'Website + Design System + 5 Page Types (2 Audiences)',
    clientName: 'Collins | Google RCS',
    createdAtISO: new Date().toISOString(),
    updatedAtISO: new Date().toISOString(),
    currency: presetStudioEUR.currency,
    validityDays: 14,
  },
  presetId: presetStudioEUR.id,
  items: [
    // 1) Visual concept direction
    {
      id: 'li-concept-direction',
      type: 'extra',
      cohesionTag: 'core',
      title: 'Visual Concept Direction',
      description: 'Direction-setting route and design direction.',
      lockState: 'spec',
      resolution: 4, // Polished
      confidence: 'high',
      pricing: [
        // using "template" units here as general craft units for design direction
        { unitType: 'template', units: 8 },
        { unitType: 'qa', units: 0 },
      ],
    },

    // 2) Modular component library in Figma
    {
      id: 'li-component-library-figma',
      type: 'foundation',
      cohesionTag: 'core',
      title: 'Component Library (Figma)',
      description: 'Modular component library, states, and breakpoints.',
      lockState: 'spec',
      resolution: 4, // Polished
      confidence: 'high',
      pricing: [
        { unitType: 'system', units: 14 },
        { unitType: 'qa', units: 2 },
      ],
    },

    // 3) Template library: up to five key page types (Audience A)
    {
      id: 'li-template-page-01',
      type: 'template',
      cohesionTag: 'core',
      title: 'Hero Template 1',
      description: 'Desktop + mobile at the selected Resolution.',
      lockState: 'spec',
      resolution: 4, // Polished
      confidence: 'high',
      minResolution: 3,
      pricing: [
        { unitType: 'template', units: 11 },
        { unitType: 'qa', units: 2 },
      ],
    },
    {
      id: 'li-template-page-02',
      type: 'template',
      cohesionTag: 'core',
      title: 'Hero Template 2',
      description: 'Desktop + mobile at the selected Resolution.',
      lockState: 'spec',
      resolution: 4, // Polished
      confidence: 'high',
      minResolution: 3,
      pricing: [
        { unitType: 'template', units: 11 },
        { unitType: 'qa', units: 1 },
      ],
    },
    {
      id: 'li-template-page-03',
      type: 'template',
      cohesionTag: 'core',
      title: 'Hero Template 3',
      description: 'Desktop + mobile at the selected Resolution.',
      lockState: 'spec',
      resolution: 4, // Polished
      confidence: 'high',
      minResolution: 3,
      pricing: [
        { unitType: 'template', units: 10 },
        { unitType: 'qa', units: 1 },
      ],
    },
    {
        id: 'li-template-page-04',
        type: 'template',
        cohesionTag: 'utility',
        title: 'Key Template 4',
        description: 'Desktop + mobile at the selected Resolution.',
        lockState: 'spec',
        resolution: 4, // Polished
        confidence: 'high',
        minResolution: 3,
        pricing: [
          { unitType: 'template', units: 10 },
          { unitType: 'qa', units: 1 },
        ],
      },
      {
        id: 'li-template-page-05',
        type: 'template',
        cohesionTag: 'utility',
        title: 'Key Template 5',
        description: 'Desktop + mobile at the selected Resolution.',
        lockState: 'spec',
        resolution: 4, // Polished
        confidence: 'high',
        minResolution: 3,
        pricing: [
          { unitType: 'template', units: 10 },
          { unitType: 'qa', units: 0 },
        ],
      },
    // 4) Audience B variants (one additional instance per page type)
    // These are NOT full new templates — they are controlled adaptations of the A template.
    {
      id: 'li-instance-page-01-b',
      type: 'instance',
      cohesionTag: 'utility',
      title: 'Template Instances',
      description: 'Secondary template instances.',
      lockState: 'spec',
      resolution: 4, // Polished
      confidence: 'high',
      minResolution: 3,
      count: 1,
      complexity: 'standard',
      pricing: { unitType: 'pageInstance', unitsPerInstance: 3.2 },
    },
     // 5) Interactive prototype
    {
      id: 'li-interactive-prototype',
      type: 'extra',
      cohesionTag: 'utility',
      title: 'Interactive Prototype',
      description: 'Prototype flows and interactions across page types.',
      lockState: 'spec',
      resolution: 4, // Standard
      confidence: 'high',
      pricing: [
        { unitType: 'template', units: 8 },
        { unitType: 'qa', units: 0 },
      ],
    },

    // 6) Annotated Figma file
    {
      id: 'li-figma-annotation-pass',
      type: 'extra',
      cohesionTag: 'utility',
      title: 'Annotated Figma File',
      description: 'Components, breakpoints, variants, and handover notes.',
      lockState: 'spec',
      resolution: 4, // Standard
      confidence: 'high',
      pricing: [
        { unitType: 'qa', units: 0 },
        { unitType: 'system', units: 1 },
      ],
    },
  ],
};