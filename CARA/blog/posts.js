/* CARA Blog — posts.js
   ─────────────────────────────────────────────────────────
   To add a new post:
     1. Copy blog/template.html  →  blog/week-XX.html
     2. Fill in your content and update the subject line in the form
     3. Add ONE entry at the TOP of the POSTS array below
   ───────────────────────────────────────────────────────── */

var POSTS = [
  {
    file:    'week-05.html',
    week:    'Week 05',
    date:    '09 Jun 2026',
    title:   'Person Following — Tuning the Two-Layer Identity System',
    excerpt: 'Implementing the HSV orange-band tracking for Layer 2 of the person-lock system. Challenges with indoor lighting variation and the tuning approach that achieved reliable tracking across different room conditions.',
    tags:    [['Software','green'],['Computer Vision','teal'],['In Progress','high']]
  },
  {
    file:    'week-04.html',
    week:    'Week 04',
    date:    '02 Jun 2026',
    title:   'MediaPipe Fall Detection Running at 15fps on Jetson Nano',
    excerpt: 'Fall detection node is live. MediaPipe Pose Estimation running with CUDA acceleration at 12–15 fps. Calibrating the hip/shoulder threshold values and the 2-second confirmation window to minimise false positives from bending and sitting postures.',
    tags:    [['AI / Vision','teal'],['ROS','blue'],['Complete','green']]
  },
  {
    file:    'week-03.html',
    week:    'Week 03',
    date:    '26 May 2026',
    title:   'SIM800L GSM Power Problem — Root Cause and Fix',
    excerpt: 'The SIM800L kept resetting during SMS transmission. Root cause: 2A+ TX bursts exceed Arduino 5V rail capacity. Solution: dedicated LM2596 buck converter at 4.0V + 1000µF capacitor. Reliable SMS delivery confirmed after fix.',
    tags:    [['Hardware','orange'],['GSM','green'],['Complete','green']]
  },
  {
    file:    'week-02.html',
    week:    'Week 02',
    date:    '19 May 2026',
    title:   'System Architecture Finalised — Dual-Controller Split Decision',
    excerpt: 'Finalised the core architectural decision: Jetson Nano handles all AI and ROS work, Arduino Mega handles all real-time peripherals via a 5-state machine. UART serial at 9600 baud as the inter-controller communication bridge.',
    tags:    [['Architecture','blue'],['Complete','green']]
  },
  {
    file:    'week-01.html',
    week:    'Week 01',
    date:    '12 May 2026',
    title:   'Project Kick-Off — Requirements, Literature, and Research Gap',
    excerpt: 'First week of the thesis. Defined five research objectives, reviewed 53 sources on assistive robotics, fall detection, GSM alerting, and HRI. Identified the core research gap: no affordable, Wi-Fi-free, passive eldercare robot currently exists for developing countries.',
    tags:    [['Planning','blue'],['Research','amber'],['Complete','green']]
  }
];
