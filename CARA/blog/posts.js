/* CARA Blog — posts.js
   ─────────────────────────────────────────────────────────
   To add a new post:
     1. Copy blog/template.html  →  blog/week-XX.html
     2. Fill in your content and update the subject line in the form
     3. Add ONE entry at the TOP of the POSTS array below
     4. Use the full week's date range, not a single day
        (e.g. '17–23 Jul 2026', matching PROJECT_START in timeline.html)
   ───────────────────────────────────────────────────────── */

var POSTS = [
  {
    file:    'week-13.html',
    week:    'Week 13',
    date:    '4–10 Sep 2026',
    title:   'Week 13 — Coming Soon',
    excerpt: 'This week\'s write-up is still being put together. Check back soon for the next update on the CARA build.',
    tags:    [['Coming Soon','amber']]
  },
  {
    file:    'week-12.html',
    week:    'Week 12',
    date:    '28 Aug–3 Sep 2026',
    title:   'From Report Audit to a Big Engineering Day — LCD Fixed, Obstacle Fusion Built, Pipeline Verified Live',
    excerpt: 'Started with a Thesis Report structural audit and a full LaTeX/IEEEtran rebuild re-scoped to a verified 4-page submission doc. Then engineering took over: LCD power resolved, obstacle fusion built and live-tested, and the full autonomous pipeline drove and turned the real robot for the first time. A faulty battery cell was found, turning got parked as a hardware limit, person-following and camera tilt came online, a full medicine reminder system shipped with RFID/keypad acknowledge, and a robot clock surfaced a real timezone bug. Still in progress.',
    tags:    [['Hardware','orange'],['Software','green'],['In Progress','high']]
  },
  {
    file:    'week-11.html',
    week:    'Week 11',
    date:    '21–27 Aug 2026',
    title:   'Jetson Drives, Displays Its IP, ROS2 Nodes Go Live',
    excerpt: 'Real Jetson firmware landed with a live-caught STOP safety bug fixed, the full autonomous pipeline ran live end to end for the first time, and turn speed went proportional to fix jitter. A dark LCD got root-caused to a power issue, a near-incident with a stray test sketch was caught in time, and a sensor-fusion obstacle-detection idea was designed but not yet built.',
    tags:    [['Software','green'],['Complete','green']]
  },
  {
    file:    'week-10.html',
    week:    'Week 10',
    date:    '14–20 Aug 2026',
    title:   'Remote Control Hardened, and the RFID Mystery from Week 09 Finally Solved',
    excerpt: 'remote_control.py made robust for systemd: real network-interface enumeration and camera/serial auto-reconnect. The Mega\'s hardware I2C pin was found damaged and fixed with a bit-banged LCD driver, and along the way the RFID module was replaced and confirmed working.',
    tags:    [['Hardware','orange'],['Software','green'],['Complete','green']]
  },
  {
    file:    'week-09.html',
    week:    'Week 09',
    date:    '7–13 Aug 2026',
    title:   'Full Integration Test Finds RFID & Motor Issues, Perception Pipeline Scaffolding Begins',
    excerpt: 'A full-system integration sketch brought every chassis module (bar GSM and the drive motors) onto one board, surfacing an unresponsive RFID reader and underpowered drive motors. The cara_jetson ROS2 package grew a real camera, two-tier patient-tracking, and enrollment pipeline.',
    tags:    [['Hardware','orange'],['AI / Vision','teal'],['Complete','green']]
  },
  {
    file:    'week-08.html',
    week:    'Week 08',
    date:    '31 Jul–6 Aug 2026',
    title:   'Camera Tower Complete — Full Assembly Testing Next',
    excerpt: 'Camera tower assembly and the remaining chassis wire connections finished, plus a reprinted camera pan gear fitted and tested. Full assembly testing is next. This week is still in progress — post will be filled in further as the week continues.',
    tags:    [['Hardware','orange'],['In Progress','high']]
  },
  {
    file:    'week-07.html',
    week:    'Week 07',
    date:    '24–30 Jul 2026',
    title:   'GSM Bring-Up Continues, Camera Tower Assembly Begins',
    excerpt: 'A7670C GSM module re-tested on the full breadboard wiring, then confirmed working end-to-end with a real SMS send and network registration test. Camera tower assembly started, with sensor logic integrated and tested as it went together.',
    tags:    [['Hardware','orange'],['Complete','green']]
  },
  {
    file:    'week-06.html',
    week:    'Week 06',
    date:    '17–23 Jul 2026',
    title:   'Jetson Online via SSH, ROS Jazzy Installed & GSM Module A7670C Received',
    excerpt: 'Jetson reached over SSH for the first time and ROS Jazzy installed on it. The A7670C (4G/LTE) GSM module ordered after the SIM800L dead end arrived along with capacitors and JST connectors, and bench testing started — powers on and responds to AT commands.',
    tags:    [['Hardware','orange'],['Complete','green']]
  },
  {
    file:    'week-05.html',
    week:    'Week 05',
    date:    '10–16 Jul 2026',
    title:   'Milestone M3 Reached — Hardware Ready, Jetson Nano In Hand and ROS Setup Begins',
    excerpt: 'Chassis, motors, and sensors integrated and running on the Arduino Mega state machine — Milestone M3 (Hardware Ready) reached on schedule. Jetson Nano is in hand and ROS Jazzy setup has started on it. SIM7600 4G module still awaiting delivery — GSM wiring stays queued until it arrives.',
    tags:    [['Hardware','orange'],['Milestone','high']]
  },
  {
    file:    'week-04.html',
    week:    'Week 04',
    date:    '3–9 Jul 2026',
    title:   'Fall Detection Live on Laptop, Flask UI Built & SIM800L 2G Issue Found',
    excerpt: 'Fall detection tested on laptop — 60.6% confidence on a test video. Flask web UI built and tested on mobile via local network. SolidWorks 3D prototype finalised. Arduino Mega received. SIM800L failed: 2G not supported by UAE networks. SIM7600 (4G) ordered.',
    tags:    [['AI / Vision','teal'],['Hardware','orange'],['Complete','green']]
  },
  {
    file:    'week-03.html',
    week:    'Week 03',
    date:    '26 Jun – 2 Jul 2026',
    title:   'Hardware Build — From Unit Testing to a Moving Robot',
    excerpt: 'Every module unit tested first (LCD, HC-SR04, PIR — all good). Replacement motors for the Week 02 DIY kit finally arrived: loose wiring found and fixed, L298N integrated, full 4-state machine (Active/Monitoring/Alert/Reset) running with LCD showing live state. A PLA-printed chassis plate was tried next and also fell short, so an aluminium chassis was adopted.',
    tags:    [['Hardware','orange'],['Complete','green']]
  },
  {
    file:    'week-02.html',
    week:    'Week 02',
    date:    '19–25 Jun 2026',
    title:   'Architecture Done — System, Software & Hardware Designs Finalised',
    excerpt: 'All three architecture layers completed: system block diagram, software architecture (7 ROS nodes, all topics mapped), and hardware architecture (5-state machine). Dual-controller split decided: Jetson Nano for AI, Arduino for real-time peripherals. First physical design sketched, and a DIY kit chassis assembled to test it — gear motors found broken.',
    tags:    [['Architecture','blue'],['Complete','green']]
  },
  {
    file:    'week-01.html',
    week:    'Week 01',
    date:    '12–18 Jun 2026',
    title:   'Project Kick-Off — Requirements, Literature, and the Research Gap',
    excerpt: 'First week of the CARA thesis. Reviewed 53 sources on assistive robotics, fall detection, GSM alerting, and HRI. Defined five research objectives. Core gap confirmed: no affordable, Wi-Fi-independent, passive eldercare robot exists for developing countries.',
    tags:    [['Planning','blue'],['Research','amber'],['Complete','green']]
  }
];
