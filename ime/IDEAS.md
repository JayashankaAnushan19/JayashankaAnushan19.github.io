# Ideas for Ime

Things to build next. When one is built, move it to the Projects table in [README.md](README.md).

## Build queue (decided, built one by one)

Life Twins is locked behind the date lock, like Special Day. Linner Clock is open. See the README.

The wording and labels for these live in each page's own code, not here.

| Order | Folder | Project | Status |
| --- | --- | --- | --- |
| 1 | `linner_clock/` | **Linner Clock**: a playful world clock for Dubai and Preston, plus one line for which time-of-day "mode" it is in Preston. | Built, waiting for review |
| 2 | `weather_twin/` | **Weather Twin**: live weather for Dubai and Preston side by side, plus a small note that changes with the conditions. | Built, waiting for review |

### 3. Life Twins (added later, built, rebuilt as a nameless memory collection)
- Two halves, "me" on the left and "you" on the right, with the same rows on both sides so every difference lines up: Time, Mode, Sky, Temp, Air, Sun.
- The background is a live sky per half. Each half's colours, stars, sun or moon follow that side's real local time, and rain falls when it rains there.
- A thread between the two sides shows the distance and carries hugs (a counter is saved in the browser). Funny compare lines sit between the halves.
- **Special days** section: dates as month and day only, with no year and no age, counted down as yearly dates. Each has a coded title and a short line. The birthday is date-only. The entries are in the `SPECIAL_DAYS` list at the top of the script (a missing `d` makes it month-only).
- **Memory sky**: stars to tap, each a word or two that hints at a memory, revealing one short line. It counts how many she has remembered (saved in the browser). The entries are in the `MARKS` list.
- No names, photos, ages, years or places on the page. The only place names left are the time-zone settings the clocks and weather need.
- The Preston side uses her real routine (`MODES`). The Dubai side uses a plain day-shape (`MODES_L`), because her routine isn't his. Replace `MODES_L` with the real Dubai routine when you have it.
- Locked behind the date lock, like Special Day.
- Ideas to add later: a "behavior" row with real habits per side, a shared sunrise and sunset bar, a week view, or more memory stars.
- `life_twins/` is self-contained, so it repeats the mode and weather code from the other pages. If those get changed, change this one too.

### 1. Linner Clock
- Two clocks side by side, Dubai (`Asia/Dubai`) and Preston (`Europe/London`).
- The day is split into labelled blocks that follow her real routine (Preston time), down to the minute. One line under the clocks shows the current block. The blocks are in the `MODES` list in the page's script, each with a `from` time in minutes since midnight. To fix a time, change that number.
- One block (08:00-09:00) is a filler, because it wasn't in her list.
- Dark theme, soft animated background, a playful font.
- Made to raise a smile: a big animated emoji per mode, a rotating funny line per mode, tap the emoji for a confetti burst (with a tap counter and jokes), a "new mode unlocked" toast when the mode changes, floating emojis in the background, a tab title that follows the mode, and cards and flags that react to touch.
- Pure HTML, CSS and JS with no libraries. Time zones come from `Intl.DateTimeFormat`, so daylight saving is handled by the browser.

### 2. Weather Twin
- Two cards side by side, Dubai on the left and Preston on the right. Each shows city, temperature, condition with an emoji, humidity and wind speed.
- A bottom line changes with the conditions: sunny on both sides, rain in Preston, extreme heat in Dubai (above 38°C), cold in Preston (below 5°C), night on both sides.
- Data from Open-Meteo (free, no key): `https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current_weather=true&hourly=relativehumidity_2m,windspeed_10m`
- Coordinates: Dubai 25.2048, 55.2708. Preston 53.7632, -2.7031.
- Weather codes map to emoji: 0 clear, 1-3 partly cloudy, 45-48 fog, 51-67 rain, 71-77 snow, 80-82 showers, 95 storm.
- Dark theme matching the main page. Refreshes every 10 minutes.
- Things to watch: humidity and wind come back as hourly lists, so pick the entry for the current hour. The night check should use Open-Meteo's `is_day` flag, not the clock.
- As built: the request adds `timezone=auto&forecast_days=1` so the hourly list is small and lines up with each city's local time. Clear sky at night shows 🌙. If several notes apply, the order is Preston rain, Preston cold, Dubai heat, night on both sides, sunny on both sides. Each card also gets a funny line for its weather, and tapping the emoji gives it a bounce and a new line. If one city fails to load, the other still shows, and the page retries after a minute.

The real names, places and moments stay off this file. It sits in a folder that can be published, so it only holds the shape of each idea. The personal content gets added at build time.

## The list

| # | Idea | What it is |
| --- | --- | --- |
| 1 | **Piano Page** | A page with an animated keyboard that plays a soft melody, with a short note beside it. |
| 2 | **Memory Jar** | Little memory cards pop up one by one. Each card is a shared moment, and she opens one at a time. |
| 3 | **Countdown** | A quiet countdown page to a date you choose. Calm wording, no pressure. |
| 4 | **Playlist Page** | A mixtape of songs, each with a small note about why it's there. |
| 5 | **Things I Know About You** | Warm and funny facts, in a short list. Small habits and quirks. |
| 6 | **Letter Page** | Simple and elegant. Just words, no animations, on a page she can come back to. |

## Open questions

- Which one to build first, and in what order after that?
- Tone: the main page is cool and techy. These pages are warm, so decide whether each one keeps its own soft look (like `special_day/` and `coming_soon/`) or all match the main page.
- Privacy: this folder is part of a GitHub Pages site, so anything committed can be opened by anyone with the link. Personal pages can get a date lock like Special Day, but the lock is only a playful gate and is not real security.
- Things to gather at build time: photos, song titles and notes, the countdown date, the melody, and the letter text.
