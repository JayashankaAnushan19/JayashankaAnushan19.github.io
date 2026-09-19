# ime

Home for the projects I'm making for Ime. Everything lives inside this folder.

`index.html` is the main page. It has a dark, techy look (grid, drifting network lines, cyan and violet accents, monospace labels). Each project is a row with a status chip (Live, Locked or Soon), **newest first**, that leads to that project's folder.

## Projects

Listed newest first, the same order as the main page.

| Card | Folder | What it is | Status |
| --- | --- | --- | --- |
| Next drop | [coming_soon/](coming_soon/) | A decorated "coming soon" page (moon, lanterns, fireflies, a growing sprout, hopeful messages). It is the teaser for what's next. | Available |
| Quick Stop | [quick_stop/](quick_stop/) | Website for QUICK STOP, two shops in Preston. Browse, fill a basket, order on WhatsApp. Has its own [README](quick_stop/README.md). | Available |
| The Special Day | [special_day/](special_day/) | A small surprise page, with a photo (`ime.jpeg`) | Locked, see below |

## Special Day lock

That day has passed, so clicking the card doesn't open the page straight away. It shows a "This day has passed" dialog and asks for the date as `ddmmyyyy`. Only the right date opens `special_day/`. A wrong date shakes the dialog and asks again.

- The date is set in the `CODE` variable in the script at the bottom of `index.html`.
- This is a playful lock, not real security. The code is readable in the page source, and anyone who types the `special_day/` URL directly skips it.

## Structure

```
ime/
├── index.html        main page, links to every project
├── README.md         this file
├── coming_soon/      teaser page ("more coming soon" links here)
│   └── index.html
├── quick_stop/       project 2, the QUICK STOP shop website (own README inside)
└── special_day/      project 1 (behind the date lock)
    ├── index.html
    └── ime.jpeg
```

## Adding a new project

1. Create a new folder in `ime/`, e.g. `ime/my_project/`, with its own `index.html`.
2. Open `ime/index.html` and copy a `<li>` row inside `<ul class="doors">`.
3. Put the new row **right below the "Next drop" row**, so the newest is first and the teaser stays pinned at the top. Change `href`, the number (`03`, etc.), the title, the text and the status chip (`live`, `lock` or `soon`).
4. Add a delay for it in the `.doors li:nth-child(n) .door` rules in the CSS, or it appears with no stagger.
5. Add a row to the Projects table above.

## Notes

- Each project is self-contained: keep its images and files in its own folder and use relative paths.
- The main page has its own techy look. `coming_soon/` (night sky, gold and rose) and `special_day/` (soft rose and cream) keep their own softer looks.
- `index.html` and `ime.jpeg` used to sit directly in `ime/`. They now live in `special_day/`.
