# CARA² — Authoring Guide

CARA2 is the documentation site for CARA V2.0 (my independent development),
built like the V1 `CARA/` site but with **Daily Notes** and **Journal
entries** instead of a weekly blog. Plain static files — no build step.

```
CARA2/
├── index.html               Home
├── about.html               Project: problem, users, versions, aims, author
├── objectives.html          Project: constraints, objectives O1–O7 → experiments
├── architecture.html        System: two-tier design, protocol, alert logic
├── hardware.html            System: components, pin map, power, cost
├── features.html            System: every feature + current status
├── gallery.html             All daily-note media (automatic)
│
├── daily/
│   ├── index.html           list of notes (automatic, with filters)
│   ├── _template.html       copy for a new note
│   └── 2026-10-08.html      one page per note
├── journal/
│   ├── index.html           list of entries (automatic)
│   ├── _template.html       copy for a new entry
│   └── je-001-v2-baseline.html
├── experiments/
│   ├── index.html           register table (automatic)
│   ├── _template.html       copy for a new experiment
│   └── exp-01.html … exp-09.html
│
├── data/                    indexes: daily.js · journal.js · experiments.js
├── media/daily/YYYY-MM-DD/  photos / short clips per note
├── media/journal/je-NNN/    figures per journal entry
└── assets/                  css/cara2.css · js/cara2.js
```

Files starting with `_` are not published by GitHub Pages (Jekyll skips them).

## The three record types

| Type | When | Page | Index |
|---|---|---|---|
| **Daily Note** `DN-YYYYMMDD` | Any day something notable was built, measured, broken or understood. Not every day. | `daily/YYYY-MM-DD.html` | `data/daily.js` |
| **Experiment** `EXP-NN` | When a new line of investigation starts — *before* results. | `experiments/exp-NN.html` | `data/experiments.js` |
| **Journal Entry** `JE-NNN` | When an experiment produces a real result — positive or negative. | `journal/je-NNN-slug.html` | `data/journal.js` |

## Adding a daily note

1. Copy `daily/_template.html` → `daily/2026-10-12.html` (a second note the same day: `2026-10-12-2.html` and `seq: 2` below).
2. Write the note in the page (fill the `[[…]]` placeholders).
3. Put photos in `media/daily/2026-10-12/` and add the note to `data/daily.js`:

```js
{
  date: '2026-10-12',
  title: 'GSM rail sags to 6.1 V during transmit',
  summary: 'Measured at the module pins: …',
  tags: ['gsm', 'power', 'measurement'],
  experiments: ['EXP-03'],
  media: [
    { type: 'image',   src: 'media/daily/2026-10-12/01-scope-trace.jpg', caption: '<b>Rail during send.</b> …' },
    { type: 'youtube', id: 'VIDEO_ID', caption: 'Full test run (unlisted).' },
    { type: 'video',   src: 'media/daily/2026-10-12/02-short-clip.mp4', caption: '…' }
  ]
}
```

Media listed here appears in the note's **Media** section and in the Gallery automatically. The note page also gets its experiment links, tags and older/newer links automatically. **Print this note** produces a lab-notebook printout.

## Adding an experiment

1. Copy `experiments/_template.html` → `experiments/exp-10.html` (ids are never reused).
2. Fill question, why, evidence (every line cites a log date, file or test ID), method, measures.
3. Add `{ id, title, area, status, opened, question }` to `data/experiments.js`.
4. Status changes (`Proposed` → `Active` → `Paused` / `Closed`): update `data/experiments.js` **and** add a dated line under "Status history" on the page. When closing, say why (answered in JE-NNN, or abandoned because …).

Linked daily notes and journal entries show up on the experiment page by themselves.

## Adding a journal entry

1. Copy `journal/_template.html` → `journal/je-002-short-slug.html`.
2. Fill every `[[…]]` placeholder; delete the `noindex` meta line.
3. Add the entry to `data/journal.js`.
4. Mention it in that day's daily note; update the linked experiment's status.
5. Check **Print / Save PDF** (Chrome/Edge): A4, running header, two-column body, page numbers. `class="wide"` on a figure, or on a table *and* its `.tab-cap`, spans both columns.

Corrections after publication: bump the version, add a revision-history line, add a dated `callout warn` where it applies. Never silently change a published number.

## Updating the documentation pages

About / Objectives / Architecture / Hardware / Features describe the system **as it is now**. When a daily note changes the hardware, firmware or a feature's status, update the matching page in the same commit and mention the note.

## Writing rules

- V2.0 is personal, independent development. V1's origin is described once, on the About page — don't repeat or expand it anywhere else (no institution, supervisor, course or ID details).
- Claims trace to evidence; reconstructed information is labelled as reconstructed.
- Failed and partial results are reported, not removed.
- No enrolled person's face images, phone numbers, IP addresses or passwords in text or screenshots.

## Media rules

- **Photos:** JPEG, longest side ≤ 1600 px, ideally < 500 KB, named `NN-what-it-shows.jpg`.
- **Video:** upload to YouTube (unlisted is fine) and embed by ID. Only short compressed clips (< 20 MB) go in `media/`.
- **Unused media:** never delete — move to `media/_unused/` (gitignored, kept locally); decide at project completion.
- V1 images can be reused by path from `../CARA/assets/images/`.
- The V1 `CARA/` site does not link to CARA2 yet — don't add one until decided.

## Publishing

The repository owner runs every `git commit` / `git push`. Assistants stage changes and hand back the command; no AI attribution lines in commit messages.
