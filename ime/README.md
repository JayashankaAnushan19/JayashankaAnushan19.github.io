# ime

Home for the projects I'm making for Ime. Everything lives inside this folder.

`index.html` is the main page. It has a dark, techy look (grid, drifting network lines, cyan and violet accents, monospace labels). Each project is a row with a status chip (Live, Locked or Soon), **newest first**, that leads to that project's folder.

## Projects

Listed newest first, the same order as the main page.

| Card | Folder | What it is | Status |
| --- | --- | --- | --- |
| Next drop | [coming_soon/](coming_soon/) | A decorated "coming soon" page (moon, lanterns, fireflies, a growing sprout, hopeful messages). It is the teaser for what's next. | Available |
| Life Twins | [life_twins/](life_twins/) | A nameless memory collection for two people. Two halves ("me" and "you"), each with a live sky that follows its own local time, and the same rows on both sides: time, daily mode, weather, air, sunrise and sunset. A thread between them shows the distance and carries hugs. Also a Special days section (dates without years) and a Memory sky of tappable stars with coded hints. | Locked |
| Weather Twin | [weather_twin/](weather_twin/) | Live weather for Dubai and Preston side by side, with a small note that changes with the conditions. Data from Open-Meteo (free, no key), refreshes every 10 minutes. | Available |
| Linner Clock | [linner_clock/](linner_clock/) | A playful world clock: Dubai and Preston side by side, with one line for what part of her day it is in Preston. Pure HTML, CSS and JS. | Available |
| Quick Stop | [quick_stop/](quick_stop/) | Website for QUICK STOP, two shops in Preston. Browse, fill a basket, order on WhatsApp. Has its own [README](quick_stop/README.md). | Available |
| The Special Day | [special_day/](special_day/) | A small surprise page, with a photo (`ime.jpeg`) | Locked, see below |

## The lock

Two pages are locked: **Special Day** and **Life Twins**. Clicking one on the main page opens a dialog that asks for a special date as `ddmmyyyy`. The right date opens the page. A wrong date shakes the dialog and asks again. After one correct entry, the other locked page opens freely too, but only for 30 minutes in that browser tab. Then the doors lock again by themselves. While unlocked, the chip on each locked door reads "Unlocked" and a "lock again" button appears at the top of the main page.

- Only a hash of the date is kept, in the `HASH` variable in the script at the bottom of `index.html`, so the date can't be read straight from the source. The date itself is not written in these notes either.
- To change the date: in the browser console on the main page, run `h53('ime:' + 'ddmmyyyy')` with the new date and paste the result into `HASH`.
- Each locked page (`special_day/` and `life_twins/`) has a small script at the top of its `<head>` that sends anyone who arrives without unlocking back to the main page.
- This is a playful lock, not real security. There are only so many dates to try, and the page code is still readable to anyone who views the source. Keep truly private things off the pages.

## Structure

```
ime/
├── index.html        main page, links to every project
├── README.md         this file
├── IDEAS.md          ideas for what to build next
├── coming_soon/      teaser page ("more coming soon" links here)
│   └── index.html
├── life_twins/       project 5, nameless memory collection, split screen (locked)
│   └── index.html
├── weather_twin/     project 4, live weather for Dubai and Preston
│   └── index.html
├── linner_clock/     project 3, world clock for Dubai and Preston
│   └── index.html
├── quick_stop/       project 2, the QUICK STOP shop website (own README inside)
└── special_day/      project 1 (locked)
    ├── index.html
    └── ime.jpeg
```

## Adding a new project

1. Create a new folder in `ime/`, e.g. `ime/my_project/`, with its own `index.html`.
2. Open `ime/index.html` and copy a `<li>` row inside `<ul class="doors">`.
3. Put the new row **right below the "Next drop" row**, so the newest is first and the teaser stays pinned at the top. Change `href`, the number (`03`, etc.), the title, the text and the status chip (`live`, `lock` or `soon`). For a locked page, add `data-locked` to the `<a class="door">` and put the guard script from another locked page at the top of its `<head>`.
4. Add a delay for it in the `.doors li:nth-child(n) .door` rules in the CSS, or it appears with no stagger (rules exist up to the 6th row).
5. Add a row to the Projects table above.

## Notes

- Each project is self-contained: keep its images and files in its own folder and use relative paths.
- The main page has its own techy look. `coming_soon/` (night sky, gold and rose) and `special_day/` (soft rose and cream) keep their own softer looks.
- `index.html` and `ime.jpeg` used to sit directly in `ime/`. They now live in `special_day/`.
