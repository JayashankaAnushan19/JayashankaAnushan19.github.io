/* =====================================================================
   CARA 2 — Journal entry index
   One object per published entry. The entry itself is a standalone HTML
   file in /CARA2/journal/ (copy journal/_template.html). IDs are
   sequential and never reused: JE-001, JE-002 …
   type: 'Technical Report' | 'Research Article' | 'Short Communication'
         | 'Negative Result' | 'Method Note' | 'Review'
   ===================================================================== */
window.CARA2_JOURNAL = [
  {
    id: 'JE-001',
    file: 'je-001-v2-baseline.html',
    type: 'Technical Report',
    title: 'CARA V2.0 Baseline: State of a Low-Cost Assistive Robot Platform at the Start of Independent Development',
    published: '2026-10-08',
    summary: 'Documents the platform inherited from V1 — hardware, software, verified capabilities and characterised faults — corrects two points in how V1 results should be read, and sets out the research agenda for V2.0.',
    keywords: ['assistive robotics', 'baseline', 'fall detection', 'GSM alerting', 'embedded reliability'],
    experiments: ['EXP-01', 'EXP-04']
  }
];
