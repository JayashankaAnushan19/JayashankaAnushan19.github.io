# Office 14 Network — project notes for Claude

Read this first when continuing on another PC. It records what was built, how it is built, and what is still open.

## What this project is
Documentation site for the **Office 14 structured cabling & network** job at **Pyramid Centre** (OPPEIN, Dubai).
It is the next project for the OPPEIN project hub on GitHub Pages: https://jayashankaanushan19.github.io/oppein/
(hub repo `oppein`: one folder per project, dark / amber style, Space Grotesk + IBM Plex fonts).
The hub repo is **not** in this folder. The finished site folder gets copied into it (see "Publishing").

Owner: Jayashanka (OPPEIN IT). Status: **Rev D — final, for approval** (2026-10-23; started 2026-10-16).

## Layout
```
Office 14 Network Cabling.md            text summary of the original plan
Office 14 Network Cabling               empty file (created by the user; left as is)
Office 14 Network Cabling.html          identical copy of docs-src/interactive-plan.src.html (restored by the user; not used by the build)
docs-src/                               SOURCE — edit here
  data.mjs      devices, ports, positions, tray route, rack units, IP plan, assumptions, decisions, risks.
                Cable lengths are CALCULATED here (tray + drops + 10 % slack).
  boq.mjs       BOQ sections A–F (desc, unit, qty, rate AED, function, rate basis, guide id),
                GUIDE (function, must-haves, Amazon.ae / noon product picks, avoid), BOQ_SOURCES, VAT, contingency.
  build.mjs     page template + all 11 pages + SVG drawings (floor plan, topology, rack).
  plan-raw.svg  traced floor plan art (emitted as assets/plan-art.js)
  interactive-plan.src.html  the ORIGINAL interactive planner (was "Office 14 Network Cabling.html", then index.html).
                Build re-themes it (dark/amber token override + back links) → site/interactive-plan.html.
                Its DEFAULTS array is where data.mjs device positions came from.
  style.css     all styles (screen + print; BOQ letterhead print rules at the end)
  site.js       floor-plan pan/zoom, device highlight, loads plan art
  boq.js        editable BOQ: live totals, contingency, VAT, amount in words, localStorage, print/reset
  lab.js        Device lab: model search, capability cards, Wi-Fi heatmap, desk signal, PoE budget, cable loss
  models.js     device library (APs, PoE switches, cable types) — typical datasheet values
  README.md     short build/publish instructions
oppein-pyramid-centre-network/          GENERATED site — do not hand-edit, rebuild instead
```

Build: `node docs-src/build.mjs` (Node 18+; developed on Node 24). No npm dependencies.

## Pages (DOC numbers)
00 Overview (`index.html` — the project entry page the hub card opens: key figures, links to every doc, scope,
areas served, status, revision history; there is no separate landing page outside the site folder) · 01 Floor plan & routes · 02 Topology & ports · 03 Rack layout · 04 Cable schedule ·
05 BOQ & estimate (`materials.html`) · 06 Equipment & buying guide (`equipment.html`) · 07 Device lab (`device-lab.html`) ·
08 Installation method · 09 Testing & handover · 10 Open items. Plus `drawing.html` (code DWG, after 01): the bare floor-plan
drawing full size, with layer toggles (casing route / cables / devices & switches / Wi-Fi), all off by default.
Use `docRef('file.html')` in build.mjs for cross-links so DOC numbers stay right if pages move.
Never give a section the id `plan` — site.js pans/zooms `#plan` (the floor-plan svg).

## Key facts — Rev D FINAL (2026-10-23, "Final — for approval")
- The user marked the real positions on the drawing; `mark` in DEVICES = that number. Screenshot px → svg mapping used:
  svg = (526 + (px−58)·2.52, 434 + (py−155)·2.52) for a Drawing-page screenshot at fit zoom (approximate).
- ALL switches are in the IT Room cabinet (mark 1) — final user decision. 9U wall cabinet (user rejected 16U):
  U9 24-port patch panel · U8 shelf with SW0 (NEW 8-port; user rejected 16-port) + SW1 (existing 5-port) + SW2 (existing 8-port) ·
  U7–U6 shelf ONT + router + 2 PoE injectors · U5–U2 spare (user asked for ≥ 4U) · U1 8-way PDU.
- Router L1 → SW0 P1; SW0 P2 → SW1 P1; SW0 P3 → SW2 P1 (patch cords in the cabinet). SW1/SW2 unmanaged, no PoE, owned (BOQ rate 0).
  SW0: P4–P7 IT1–IT4, P8 spare. SW1: P2 PC2, P3 PC3, P4 AP1 (user: AP1 on SW1 port 4), P5 spare.
  SW2: P2 AP2 (user), P3 PC4, P4 PC5, P5 PRN, P6 MOB, P7 PC6, P8 spare. Router L2–L4 spare.
- Every device is a home run from the cabinet patch panel (14 runs incl. the phone line). Route (user): cabinet → up into the
  ceiling → PVC conduit to MARK 2 → down behind the wall → wall casing to desks 2–6 and up to AP1. AP2 stays in the ceiling
  from mark 2 (`viaCeiling`, no mark-2 drop). IT Room PCs (positions NOT marked yet, A-03) run along the IT Room walls.
  Lengths = (route + start drop + 2.8 m mark-2 drop + end drop) × 1.10.
- Separate phone line C-14: ONT TEL1 → patch panel → conduit/casing → RJ45 socket at desk 5 (RJ11 fits). MOB data cable kept (A-06).
- 14 runs, 235 m → 1 box; ceiling conduit ≈ 16 m (32 mm for the 10-cable bundle; existing pipe may be reused — check its size);
  wall casing ≈ 21 m (40×25 mm main run, 25×16 mm branches).
- AP3 (Kitchen / Samples) was dropped on 2026-10-17 — not required. Don't re-add it.
- BOQ grand total ≈ AED 8,309 incl. 10 % contingency + 5 % VAT (optional F items excluded by default). SW0 priced as a trade estimate.
- The interactive planner is the ORIGINAL Rev A design (tray, one switch) — kept for reference, marked superseded.
- History of layouts (don't revert to these): Rev B switches at desks + casing; Rev C SW1 at desk 3 / SW2 at desk 5 chained.

## Decisions made with the user
- Site follows the hub's look; static files only (GitHub Pages), no backend.
- BOQ: every qty / rate / letterhead field is an editable input; edits persist per browser (localStorage key `o14-boq-v9`; bump it whenever BOQ rows change);
  Every line has a tick (section ticks + Tick all / Untick all); only ticked lines are numbered (renumbered live), totalled,
  printed and exported. Users can add custom lines per section (+ Add a line) and remove them; saved with the rest.
  Print button prints only the letterhead estimate (A4). Export to Word builds a Word-compatible HTML .doc in the browser
  (no library; named after the estimate no.). Company address/tel/email/TRN left blank as placeholders.
- Prices: AED excl. VAT, from Amazon.ae / noon / Dubai supplier listings seen 17 Oct 2026, rounded to trade price.
  Product links are real listings found by web search — re-check before ordering; never invent product URLs.
- Device lab can't fetch specs for arbitrary models online (static site). It uses a built-in library (models.js)
  plus "Add a model from its datasheet" (saved in localStorage `o14-lab-v1`).
  Wi-Fi model: log-distance path loss, EIRP capped 20 dBm (2.4) / 23 dBm (5), adjustable n and wall loss.
  Cable model: TIA-568.2-D insertion-loss formula + PoE I²R loss at 50 V.
- IP plan, SSIDs, UPS, AP models are PROPOSALS tied to open decisions D-01…D-07 (open-items page).

## Publishing
This whole folder now lives in the hub as `oppein/oppein-network-plan-PyramidCentre/`, and the hub `index.html` has a card
pointing straight to `oppein-pyramid-centre-network/index.html` (DOC 00 Overview) (done 2026-10-17). Paths assume that nesting:
doc pages reach the hub at `../../index.html` and the logo at `../../assets/oppein-logo.webp`.
Rebuild (`node docs-src/build.mjs`) and commit; nothing needs copying.

## Ideas / next steps discussed
- Close open items A-01…A-05 after a site visit; update positions in data.mjs, rebuild (lengths + BOQ follow).
- Replace estimated rates with supplier quotations (boq.mjs), bump revision in data.mjs META.
- Possibly add more models to models.js, and a real Wi-Fi walk-test results page after installation.

## Verify after changes
Rebuild, then open the pages (headless Edge screenshots were used during development):
`msedge --headless=new --screenshot=out.png --window-size=1400,2000 file:///.../oppein-pyramid-centre-network/<page>.html`
Check: BOQ totals/words compute, print preview of materials.html (only the letterhead estimate), lab heatmap renders.
