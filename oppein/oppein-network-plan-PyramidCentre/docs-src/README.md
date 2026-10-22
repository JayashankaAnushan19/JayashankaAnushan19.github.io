# Office 14 Network — documentation source

The site in `../oppein-pyramid-centre-network/` is **generated**. Edit the files here, then rebuild:

```
node docs-src/build.mjs
```

| File | What it holds |
|---|---|
| `data.mjs` | All facts: devices, ports, positions, rack units, BOM, IP plan, open items. Cable lengths are calculated from here. |
| `build.mjs` | Page template and the content of all 9 pages, plus the floor-plan / topology / rack drawings. |
| `plan-raw.svg` | Traced Office 14 floor plan (taken from `Office 14 Network Cabling.html`). |
| `boq.mjs` | BOQ items and rates, the equipment guide with Amazon.ae / noon product links, rate sources. |
| `style.css`, `site.js`, `boq.js`, `lab.js`, `models.js` | Copied to `assets/` on build. `plan-art.js` is generated from `plan-raw.svg`. |

See `../CLAUDE.md` for the full project notes.

## Publishing to the project hub

Already published: this project sits in the hub as `oppein/oppein-network-plan-PyramidCentre/` and the hub
`index.html` card links straight to `oppein-pyramid-centre-network/index.html` (DOC 00 Overview, with the sidebar).
Doc pages reach the hub logo/index via `../../`.
Just rebuild and commit.
