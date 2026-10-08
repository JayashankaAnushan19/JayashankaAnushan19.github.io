/* =====================================================================
   CARA 2 — Daily Notes index
   One object per note. The note's text lives in its own page:
     daily/YYYY-MM-DD.html      (second note same day: seq: 2 → YYYY-MM-DD-2.html)
   Copy daily/_template.html to start a new page. This file holds the
   metadata the site needs for lists, filters, prev/next and the gallery,
   plus the note's media (photos / YouTube / short clips), which the note
   page and the Gallery both render from here.

   Fields:
     date        'YYYY-MM-DD'                     (required)
     seq         2, 3 …  only for a 2nd/3rd note on the same day
     title       one line                         (required)
     summary     1–2 sentences for lists and the home page
     tags        free words, e.g. ['gsm','power']
     experiments ids from data/experiments.js, e.g. ['EXP-03']
     media       [{type:'image', src:'media/daily/2026-10-12/01-x.jpg', caption:'…'},
                  {type:'youtube', id:'VIDEO_ID', caption:'…'},
                  {type:'video', src:'media/daily/…/clip.mp4', caption:'…'}]
                 src paths are relative to /CARA2/. See AUTHORING.md.
   ===================================================================== */
window.CARA2_DAILY = [
  {
    date: '2026-10-08',
    title: 'V2.0 opens: inheriting the platform and auditing the record',
    summary: 'First V2.0 session. Full audit of everything carried over from V1, repository made safe to publish, and three findings that change how V1 results should be read.',
    tags: ['kickoff', 'audit', 'repository', 'documentation'],
    experiments: ['EXP-01', 'EXP-04'],
    media: [
      { type: 'image', src: '../CARA/assets/images/cara-final-assembly.jpg', caption: '<b>Starting point.</b> CARA as completed at the end of V1 — the platform V2.0 inherits.' },
      { type: 'image', src: '../CARA/assets/images/System Architecture Block Diagram.drawio.png', caption: '<b>V1 system architecture.</b> Arduino Mega for real-time control and GSM; Jetson Nano for perception and the web dashboard.' }
    ]
  }
];
