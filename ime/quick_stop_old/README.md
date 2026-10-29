# QUICK STOP — website handover notes

One file with everything: what was built, how to use it, what to check before showing the owner, how to put it online, and the notes from the build sessions.

Last updated: 19 Sep 2026.

---

## 1. What this is

A static website (plain HTML, CSS and JavaScript — **no server, no database**) for **QUICK STOP**, one brand with two branches:

| Branch | Address | Phone / WhatsApp | Hours (from Google Maps) |
|---|---|---|---|
| **Quick Stop News & Booze** | 43 Linden Drive, Lostock Hall, Preston PR5 5AR | +44 7899 219303 | Open daily, closes 10:00 PM |
| **Quick Stop Essentials** | 5 Station Road, Bamber Bridge, Preston PR5 6QR | +44 7352 934356 | Open daily, closes 11:00 PM |

Customers browse both shops, add items to one basket, and **send the order on WhatsApp**. If the basket has items from both shops, checkout gives **two separate WhatsApp buttons, one per shop**. No payment is taken on the site.

---

## 2. What's on the site

**Pages**

| Page | Purpose |
|---|---|
| `index.html` | Home: search bar, offers and featured products, shop-by-category tiles, the two branches |
| `shop.html` | Full catalogue. Left sidebar filters (shop, category, brand, price, hide 18+), search, sort, removable filter pills |
| `contact.html` | Each branch separately: address, phone, hours, WhatsApp button, directions, embedded Google Map |
| `about.html` | Our Story (energetic layout: animated hero, counters, photo collage, reviews strip) |
| `how-it-works.html` | The four ordering steps and good-to-know notes |
| `reviews.html` | Customer reviews from the Google listings |

**Features**

- Basket saved in the browser, works across pages; small toast when something is added.
- Two WhatsApp order messages when both shops are in the basket.
- 18+ age confirmation before alcohol can be added; "Hide 18+" filter.
- Offers: red "% OFF" badge, old price crossed out, "Offer ends" date; expired offers switch off by themselves.
- Slim promotion banner on every page and a one-time popup on Home (editable, can be switched off).
- Floating WhatsApp button on every page (pick a branch to message).
- SEO: `sitemap.xml`, `robots.txt`, page titles, meta descriptions, Open Graph tags, LocalBusiness data for both shops.
- Mobile friendly (hamburger menu, stacked filters).

---

## 3. Folder map

```
index.html, shop.html, contact.html, about.html, how-it-works.html, reviews.html
robots.txt, sitemap.xml
css/styles.css                 all styling
js/data.js                     THE PRODUCT LIST + shop details + promotion (edited by the admin tool)
js/shared.js                   basket, checkout, WhatsApp, age gate, banner, floating WhatsApp
js/catalogue.js                shop page filters and grid
js/home.js                     home page sections
js/about.js                    Our Story animations
images/categories/             placeholder category photos (+ ATTRIBUTIONS.md, _meta.json)
images/products/               created automatically when you add product photos in the admin tool
admin/                         PRIVATE product manager (do NOT upload) — see section 5
ZZZ/                           archive of the original Google Maps text files (do NOT upload)
README.md                      this file (do NOT upload, optional)
```

**Upload to the web host:** everything except `admin/`, `ZZZ/` and `README.md`.

---

## 4. Before showing it to the owner — things to confirm

The site is finished but some content is **placeholder or assumed**. Please check with the owner:

1. **Products and prices** — the catalogue (77 items) is a *representative sample*, not real stock or prices. Replace with real ones using the admin tool (section 5).
2. **Photos** — product cards use generic free stock photos per *category* (11 categories; 5 categories show an icon tile instead). Real photos of the shops' products should be added per product. Some photos are from Openverse under CC licences, credited in `images/categories/ATTRIBUTIONS.md`.
3. **Sample offers** — `data.js` currently contains demo offers: Carlsberg 20% (to 31 Oct 2026), Foster's 10% (to 21 Sep 2026), Semi-skimmed milk 15% (no end date), Heinz beans £0.85 (to 15 Oct 2026). Remove or replace with real ones.
4. **Promotion banner text** — currently "Now taking orders on WhatsApp…". It is an announcement, not a discount. Change it in the admin tool (Promotion banner tab).
5. **Opening hours** — only the closing times from Google Maps are known (10 PM / 11 PM). Structured data assumes 08:00 opening — **confirm real opening times** and update `index.html` and `contact.html` (search for `openingHours`) and the hours text in `js/data.js`.
6. **WhatsApp numbers** — the Google Maps phone numbers are used as the WhatsApp order numbers. Confirm both numbers are on WhatsApp and who will monitor them.
7. **Delivery** — checkout offers "Local Delivery". Confirm whether delivery is really offered, the area, minimum order and charges; otherwise remove the option (in `js/shared.js`, checkout form).
8. **Age-restricted sales** — the site asks customers to confirm they're 18+ and says ID may be requested. Owner should confirm this suits their licence conditions and how they handle alcohol orders/collection. Tobacco and vapes are deliberately **not** listed.
9. **Reviews** — quotes are public Google reviews from the two listings. Reviewer first/last names are shown as on Google; shorten to first names if preferred.
10. **Wording** — the site says "two branches of the QUICK STOP family". All "family-owned / same owners" wording was removed on request.

---

## 5. Updating products — the private Product Manager

Open **`admin/admin.html`** by double-clicking it (Chrome or Edge recommended). It works on your own computer, no internet or server needed.

**Products tab**
- **+ Add product:** name, shop, category, brand, size, regular price, tick "Feature on Home" / "18+".
- **Offers:** choose *% off* or *New price* and type one number; it calculates the rest ("Regular £2.00 → customers pay £1.50, saving £0.50 · 25% off"). Set an end date (1 week / 2 weeks / end of month / none). Expired offers hide themselves on the site.
- **Photo:** drop, choose or paste (Ctrl+V). It is resized to 900 px, compressed and **renamed automatically** (e.g. `images/products/news-booze-carlsberg-lager.jpg`). A live preview shows the product card as customers will see it.
- **Edit / Copy / Delete** per row; **tick several rows** for bulk "Set % offer", "Clear offers" or delete.
- Filters and sorting help find things; the top shows counts (products, on offer, with own photo).

**Promotion banner tab** — message, button text and destination, with a live preview.

**Publishing your changes**
1. Your edits are saved as a *draft* in the browser automatically.
2. Press **Publish to website** (Chrome/Edge). First time: choose the website folder (the one containing `index.html`). It writes the new `js/data.js` and any new photos, and keeps a backup of the old file in `admin/backups/`.
3. No Chrome/Edge? Press **Download update (ZIP)**, unzip, copy the `js` and `images` folders over the website folder (replace).
4. Upload the changed files to your host (not `admin/`).

Notes: product IDs stay the same when editing, so customers' saved baskets keep working. Deleting a product does not delete its photo file. Hand-editing `js/data.js` is still possible (see the comment at the top of that file).

> **Moving the project to a new folder:** the admin tool remembers the old folder. After moving, open `admin/admin.html`, press **Change folder** (shown under the top bar after first publish) and select the new location. Unpublished drafts live in the browser — publish before moving, or they stay tied to the old file location.

---

## 6. Putting the site online (when the owner approves)

1. **Choose hosting** — any static host works (Netlify, Cloudflare Pages, GitHub Pages, or normal web hosting). Upload the files listed in section 3.
2. **Set the real domain.** The text `https://your-domain-here.com` appears in `robots.txt`, `sitemap.xml` and inside `index.html`, `shop.html`, `contact.html`, `about.html`, `how-it-works.html`, `reviews.html` (canonical link, Open Graph URL, structured data). Do a find-and-replace across the project with the real address, e.g. `https://www.quickstop-preston.co.uk`.
3. **Search engines** — add the site to Google Search Console and submit `https://<domain>/sitemap.xml`.
4. **Google Business Profile** — add the website link to both Google Maps listings (both currently show "Add website"). This is the biggest local-search boost.
5. **Optional later:** analytics, a social-sharing image (`og:image`), a proper logo.
6. Keep `admin/` and `ZZZ/` **off the server** — `admin` is the private editor; `ZZZ` holds raw Google Maps text with reviewer names.

---

## 7. Editing other things

| To change | Where |
|---|---|
| Shop names, addresses, phones, WhatsApp numbers, hours, ratings | top of `js/data.js` (`SHOPS`) — also the contact page and footer text in the HTML files |
| Promotion banner | admin tool, or `PROMOTION` in `js/data.js` |
| Colours and look | `:root` variables at the top of `css/styles.css` |
| Wording on pages | the `.html` files directly |
| Price ranges in the filter | `PRICE_RANGES` in `js/catalogue.js` |
| WhatsApp order message format | `buildWhatsAppMessage` in `js/shared.js` |

---

## 8. Session notes (what was decided and why)

- **Brand:** mother brand "QUICK STOP"; shops are "Quick Stop News & Booze" and "Quick Stop Essentials". Details came from the Google Maps text files (now archived in `ZZZ/`). Web search added little beyond those (Essentials has almost no web presence).
- **Catalogue:** no product list was supplied, so a realistic sample was created. Tobacco/vapes and lottery items intentionally left out (age/licence rules).
- **Images:** an automated image download was tried first and rejected — many results were irrelevant (old book scans) or showed other companies' logos (Jack Daniel's, Coca-Cola, Campbell's). Only clean, generic, freely-licensed photos were kept; anything doubtful became an icon tile. Real photos should replace these.
- **Design direction (from the owner-side requests):** plain, business-like banner (no fluffy copy); e-commerce style Home showing products first; nav aligned right next to the basket; filters moved to a **left sidebar** on desktop; Amazon/eBay-style filtering with **shop as the "seller" filter**; simple toast instead of a big tick when adding to basket; home search bar; discounts with highlighted "% OFF".
- **Content moved off Home** into their own landing pages (Our Story, How Ordering Works, Reviews) and linked in the footer, for local-SEO value.
- **No database:** products live in `js/data.js`. The private admin tool edits that file. Because the site is static, "not public" means *keeping `admin/` off the host* — a static site cannot truly lock a page.
- **Wording rule:** don't describe the business as owned/run by the same person or family; say two branches of the QUICK STOP family.
- **Our Story** was restyled to be energetic (animated hero, ribbon, counters, collage, colourful shop panels, moving reviews).

---

## 9. Ideas for later (not built)

- **Partners section** — reserved space for neighbouring shops that don't have a website, to collaborate and show their products. *(The owner asked to keep this as a note and be reminded when improving the site.)*
- Real product photos and a real, complete catalogue.
- Opening hours per day, bank-holiday notices, delivery area/charges.
- Order tracking or payments (would need a backend or a service such as a hosted checkout).
- Editing from a phone with instant publishing (would need a small backend or a Google Sheet as the product list).
- Analytics, a logo, social links, a social-share image.

---

## 10. Known limitations

- Static site: changes go live only after you publish `js/data.js` (and photos) and upload.
- The basket and age confirmation are stored in each visitor's browser only.
- Prices in the basket are calculated on the visitor's device; the shop confirms the final order on WhatsApp.
- Google Maps embeds need an internet connection.
- The admin tool's one-click publish needs Chrome or Edge; other browsers use the ZIP route.
- Placeholder domain `your-domain-here.com` must be replaced before going live (section 6).
