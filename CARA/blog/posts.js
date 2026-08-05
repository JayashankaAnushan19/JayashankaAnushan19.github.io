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
    file:    'week-09.html',
    week:    'Week 09',
    date:    '7–13 Aug 2026',
    title:   'Week 09 — Coming Soon',
    excerpt: 'This week\'s write-up is still being put together. Check back soon for the next update on the CARA build.',
    tags:    [['Coming Soon','amber']]
  },
  {
    file:    'week-08.html',
    week:    'Week 08',
    date:    '31 Jul–6 Aug 2026',
    title:   'Camera Tower Complete — Full Assembly Testing Next',
    excerpt: 'Camera tower assembly and the remaining chassis wire connections finished. Full assembly testing is next. This week is still in progress — post will be filled in further as the week continues.',
    tags:    [['Hardware','orange'],['In Progress','high']]
  },
  {
    file:    'week-07.html',
    week:    'Week 07',
    date:    '24–30 Jul 2026',
    title:   'GSM Bring-Up Continues, Camera Tower Assembly Begins',
    excerpt: 'A7670C GSM module re-tested on the full breadboard wiring — still solid on AT commands, SMS/network registration still open. Camera tower assembly started, with sensor logic integrated and tested as it went together.',
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
