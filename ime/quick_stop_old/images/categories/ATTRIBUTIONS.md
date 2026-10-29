# Image credits

These are temporary, free-to-use category placeholder photos (sourced via
Openverse from CC0/CC-BY/CC-BY-SA content) — **not real photos of either
shop's actual products.** Swap them out for real photos from the shops
whenever you're ready; see the note at the bottom of this file for how.

Five categories (Soft Drinks & Mixers, Milk/Eggs/Dairy, Household &
Cleaning, Toiletries — wait see below, Frozen Foods, Store Cupboard &
Groceries) had no relevant, brand-free candidate photo, so those product
cards use a plain colour/icon tile instead of a stock photo.

## CC0 / Public Domain (no attribution legally required)

- **Beers, Ciders & Alcopops** — "Free beer bottle image", rawpixel.com
- **Wines** — "Wine Bottles" by Markus Spiske, via StockSnap
- **Snacks & Confectionery** — "Free potato chips image", rawpixel.com
- **Newspapers & Magazines** — "Newspaper Magazine" by Patryk Dziejma, via StockSnap
- **Greetings Cards & Gifts** — "Gift Box", via StockSnap
- **Fresh Bread & Bakery** — "Sourdough bread fresh from the oven" by Nutrition, Food Safety & Health, via Flickr
- **Fruit & Veg** — "Food Fruits" by Lukas Budimaier, via StockSnap
- **Toiletries & Health** — "Skincare bottles, Location unknown, Aug", rawpixel.com

## CC BY 2.0 / CC BY-SA 2.0 (attribution required by license)

- **Spirits** — "Vodka Bottle" by espensorvik (Flickr), CC BY 2.0 — https://www.flickr.com/photos/28478778@N05/5729020694
- **Snacks & Soft Drinks** — "Tortilla chips" by Valters Krontals (Flickr), CC BY 2.0 — https://www.flickr.com/photos/53442856@N06/7217270626
- **Baby & Pet Care** — "Dog Food Bowl" by JnL (Flickr), CC BY-SA 2.0 — https://www.flickr.com/photos/27503925@N00/48331634

Full machine-readable details are in `_meta.json` in this folder.

## Replacing with real photos later

Each product in [js/data.js](../../js/data.js) can have its own `image`
field (a path to a photo, e.g. `images/products/carlsberg-4pack.jpg`).
If a product has no `image` set, it falls back to its category photo in
this folder, and if the category has no photo either, the site shows a
plain icon tile automatically — so you can replace these one at a time,
whenever real photos are ready, without breaking anything.
