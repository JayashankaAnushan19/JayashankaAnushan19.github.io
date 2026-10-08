/* =====================================================================
   CARA 2 — Experiment index
   One object per research thread; the full write-up (question, evidence,
   method, measures, status history) lives in experiments/exp-NN.html —
   copy experiments/_template.html for a new one. Daily notes and journal
   entries link here by id, and each experiment page lists them
   automatically.
   status: 'Proposed' | 'Active' | 'Paused' | 'Closed'
   ===================================================================== */
window.CARA2_EXPERIMENTS = [
  { id: 'EXP-01', title: 'Platform state reconciliation',                   area: 'Systems integration',       status: 'Active',   opened: '2026-10-08',
    question: 'What firmware and software is actually running on the robot, and does the repository reproduce it exactly?' },
  { id: 'EXP-02', title: 'Peripheral power architecture',                   area: 'Power & embedded',          status: 'Proposed', opened: '2026-10-08',
    question: 'How does supply topology — Arduino 5 V rail, dedicated regulator, or the Jetson’s USB port — affect RFID, servo and ultrasonic reliability?' },
  { id: 'EXP-03', title: 'GSM alert delivery under a constrained supply',   area: 'Low-connectivity alerting', status: 'Proposed', opened: '2026-10-08',
    question: 'What supply margin and retry policy give reliable SMS alert delivery within 30 seconds of a confirmed event?' },
  { id: 'EXP-04', title: 'Vision-based fall detection in realistic conditions', area: 'Perception',            status: 'Proposed', opened: '2026-10-08',
    question: 'How accurate and how fast is pose-based fall detection on the robot itself under realistic lighting, framing and occupancy?' },
  { id: 'EXP-05', title: 'Patient identification and following',           area: 'Perception & HRI',          status: 'Proposed', opened: '2026-10-08',
    question: 'Can a low-cost single-camera pipeline keep the right person framed and at a comfortable distance in a shared home?' },
  { id: 'EXP-06', title: 'Drive train and in-place turning',                area: 'Locomotion',                status: 'Proposed', opened: '2026-10-08',
    question: 'What limits in-place turning on this chassis, and can it be fixed mechanically or with closed-loop control?' },
  { id: 'EXP-07', title: 'Secure remote access over low-cost links',        area: 'Connectivity & security',   status: 'Proposed', opened: '2026-10-08',
    question: 'Can family abroad reach the robot securely without port forwarding, a fixed IP, or a paid service?' },
  { id: 'EXP-08', title: 'Single-owner software architecture',              area: 'Software architecture',     status: 'Proposed', opened: '2026-10-08',
    question: 'Does giving the serial port and camera a single owning process remove the contention faults seen in V1?' },
  { id: 'EXP-09', title: 'A reusable fault-diagnosis protocol for low-cost robots', area: 'Methodology',        status: 'Proposed', opened: '2026-10-08',
    question: 'Can the systematic-elimination method used throughout V1 be formalised into a protocol that measurably shortens time-to-root-cause?' }
];
