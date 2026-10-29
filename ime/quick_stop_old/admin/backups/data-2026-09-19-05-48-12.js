/* ============================================================
   QUICK STOP — shop & product data
   Edit this file to update shop details or the product catalogue.
   Prices are illustrative starting points — update them to match
   real in-store prices whenever you like.

   Images: each product can set its own `image` (a path, e.g.
   "images/products/my-photo.jpg"). If left out, the product falls
   back to its category's photo in images/categories/ (see
   CATEGORY_IMAGES below and images/categories/ATTRIBUTIONS.md),
   and if that category has no photo either, the site shows a
   plain icon tile automatically. Swap in real shop photos any time
   by adding an `image` field — nothing else needs to change.

   Discounts: `price` is always the regular price. To put an item on offer
   add EITHER `discountPercent: 20` OR `salePrice: 3.99`, and optionally
   `discountUntil: "2026-12-31"` (the offer switches itself off after that
   date; leave it out for an open-ended offer). The site shows the new
   price, the old price crossed out and a "% OFF" badge automatically.
   ============================================================ */

/* Site-wide promotion, shown as a dismissible top banner (all pages) and
   as a one-time popup on the Home page. Set active:false to turn it off.
   This is example copy, not a real discount — replace with a real offer,
   or just leave it announcing the WhatsApp ordering service. */
const PROMOTION = {
  active: true,
  id: "wa-ordering-launch",
  message: "🎉 Now taking orders on WhatsApp — browse both shops and get your order sent in minutes.",
  ctaLabel: "Shop Now",
  ctaLink: "shop.html"
};

const SHOPS = {
  newsbooze: {
    id: "newsbooze",
    name: "Quick Stop News & Booze",
    shortName: "News & Booze",
    tagline: "Newsagent, off-licence & convenience store",
    address: "43 Linden Drive, Lostock Hall, Preston PR5 5AR",
    phone: "+44 7899 219303",
    phoneHref: "tel:+447899219303",
    whatsapp: "447899219303",
    hours: "Open daily · Closes 10:00 PM",
    rating: 4.8,
    reviewCount: 17,
    mapsUrl: "https://maps.app.goo.gl/mcHyCLfmzwwK3g8X8",
    badgeClass: "badge-nb",
    hasAgeRestricted: true
  },
  essentials: {
    id: "essentials",
    name: "Quick Stop Essentials",
    shortName: "Essentials",
    tagline: "Everyday groceries & household essentials",
    address: "5 Station Road, Bamber Bridge, Preston PR5 6QR",
    phone: "+44 7352 934356",
    phoneHref: "tel:+447352934356",
    whatsapp: "447352934356",
    hours: "Open daily · Closes 11:00 PM",
    rating: 5.0,
    reviewCount: 1,
    mapsUrl: "https://maps.app.goo.gl/uR9Lv4xmFRnTzmke6w",
    badgeClass: "badge-es",
    hasAgeRestricted: false
  }
};

/* Category -> placeholder photo (temporary, free-licensed stock photos;
   see images/categories/ATTRIBUTIONS.md). Categories left out here show
   a plain icon tile instead — no bad/irrelevant photo is better than one. */
const CATEGORY_IMAGES = {
  "Beers, Ciders & Alcopops": "images/categories/beers-ciders.jpg",
  "Wines": "images/categories/wines.jpg",
  "Spirits": "images/categories/spirits.jpg",
  "Snacks & Confectionery": "images/categories/snacks-confectionery.jpg",
  "Newspapers & Magazines": "images/categories/newspapers-magazines.jpg",
  "Greetings Cards & Gifts": "images/categories/greeting-cards.jpg",
  "Fresh Bread & Bakery": "images/categories/bakery.jpg",
  "Fruit & Veg": "images/categories/fruit-veg.jpg",
  "Toiletries & Health": "images/categories/toiletries.jpg",
  "Snacks & Soft Drinks": "images/categories/snacks-drinks.jpg",
  "Baby & Pet Care": "images/categories/baby-pet.jpg"
  /* No photo yet: Soft Drinks & Mixers, Milk/Eggs & Dairy,
     Store Cupboard & Groceries, Household & Cleaning, Frozen Foods */
};

/* Each product: id, shop, category, name, unit, price (GBP), brand, age18 (optional), image (optional) */
const PRODUCTS = [
  // ---------------- QUICK STOP NEWS & BOOZE ----------------
  // Beers, Ciders & Alcopops
  { id: "nb-b1", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "Carlsberg Lager", unit: "4x440ml", price: 5.50, brand: "Carlsberg", age18: true, discountPercent: 20, discountUntil: "2026-10-31" },
  { id: "nb-b2", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "Foster's Lager", unit: "10x440ml", price: 11.00, brand: "Foster's", age18: true },
  { id: "nb-b3", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "Heineken Lager", unit: "4x330ml", price: 5.00, brand: "Heineken", age18: true, featured: true },
  { id: "nb-b4", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "Strongbow Original Cider", unit: "4x440ml", price: 5.75, brand: "Strongbow", age18: true },
  { id: "nb-b5", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "Kopparberg Mixed Fruit", unit: "500ml", price: 2.50, brand: "Kopparberg", age18: true },
  { id: "nb-b6", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "WKD Blue", unit: "700ml", price: 4.00, brand: "WKD", age18: true },
  { id: "nb-b7", shop: "newsbooze", category: "Beers, Ciders & Alcopops", name: "Guinness Draught", unit: "4x440ml", price: 6.50, brand: "Guinness", age18: true },

  // Wines
  { id: "nb-w1", shop: "newsbooze", category: "Wines", name: "Blossom Hill Rosé", unit: "75cl", price: 6.50, brand: "Blossom Hill", age18: true },
  { id: "nb-w2", shop: "newsbooze", category: "Wines", name: "Hardys Shiraz", unit: "75cl", price: 7.00, brand: "Hardys", age18: true },
  { id: "nb-w3", shop: "newsbooze", category: "Wines", name: "Echo Falls White Zinfandel", unit: "75cl", price: 6.00, brand: "Echo Falls", age18: true },
  { id: "nb-w4", shop: "newsbooze", category: "Wines", name: "Freixenet Prosecco", unit: "75cl", price: 9.00, brand: "Freixenet", age18: true, featured: true },

  // Spirits
  { id: "nb-s1", shop: "newsbooze", category: "Spirits", name: "Smirnoff Vodka", unit: "70cl", price: 16.00, brand: "Smirnoff", age18: true },
  { id: "nb-s2", shop: "newsbooze", category: "Spirits", name: "Famous Grouse Whisky", unit: "70cl", price: 18.50, brand: "Famous Grouse", age18: true },
  { id: "nb-s3", shop: "newsbooze", category: "Spirits", name: "Gordon's Gin", unit: "70cl", price: 16.50, brand: "Gordon's", age18: true },
  { id: "nb-s4", shop: "newsbooze", category: "Spirits", name: "Bacardi Rum", unit: "70cl", price: 16.00, brand: "Bacardi", age18: true },

  // Soft Drinks & Mixers
  { id: "nb-sd1", shop: "newsbooze", category: "Soft Drinks & Mixers", name: "Coca-Cola", unit: "500ml", price: 1.40, brand: "Coca-Cola" },
  { id: "nb-sd2", shop: "newsbooze", category: "Soft Drinks & Mixers", name: "Diet Coke", unit: "500ml", price: 1.40, brand: "Coca-Cola" },
  { id: "nb-sd3", shop: "newsbooze", category: "Soft Drinks & Mixers", name: "Fanta Orange", unit: "500ml", price: 1.30, brand: "Fanta" },
  { id: "nb-sd4", shop: "newsbooze", category: "Soft Drinks & Mixers", name: "Schweppes Tonic Water", unit: "1L", price: 1.80, brand: "Schweppes" },
  { id: "nb-sd5", shop: "newsbooze", category: "Soft Drinks & Mixers", name: "Red Bull", unit: "250ml", price: 1.60, brand: "Red Bull" },
  { id: "nb-sd6", shop: "newsbooze", category: "Soft Drinks & Mixers", name: "Still Water", unit: "500ml", price: 0.80, brand: "Generic" },

  // Snacks & Confectionery
  { id: "nb-sn1", shop: "newsbooze", category: "Snacks & Confectionery", name: "Walkers Crisps Variety", unit: "6 pack", price: 2.20, brand: "Walkers" },
  { id: "nb-sn2", shop: "newsbooze", category: "Snacks & Confectionery", name: "Cadbury Dairy Milk", unit: "200g", price: 2.50, brand: "Cadbury", featured: true },
  { id: "nb-sn3", shop: "newsbooze", category: "Snacks & Confectionery", name: "Haribo Starmix", unit: "160g", price: 1.50, brand: "Haribo" },
  { id: "nb-sn4", shop: "newsbooze", category: "Snacks & Confectionery", name: "Mars Bar", unit: "single", price: 0.75, brand: "Mars" },
  { id: "nb-sn5", shop: "newsbooze", category: "Snacks & Confectionery", name: "Pringles Original", unit: "165g", price: 2.00, brand: "Pringles" },

  // Newspapers & Magazines
  { id: "nb-n1", shop: "newsbooze", category: "Newspapers & Magazines", name: "Daily Mail", unit: "daily", price: 0.90, brand: "Daily Mail" },
  { id: "nb-n2", shop: "newsbooze", category: "Newspapers & Magazines", name: "The Sun", unit: "daily", price: 0.85, brand: "The Sun" },
  { id: "nb-n3", shop: "newsbooze", category: "Newspapers & Magazines", name: "Local Weekly Gazette", unit: "weekly", price: 1.20, brand: "Local Press" },
  { id: "nb-n4", shop: "newsbooze", category: "Newspapers & Magazines", name: "Puzzle Magazine", unit: "each", price: 2.50, brand: "Generic" },

  // Greetings Cards & Gifts
  { id: "nb-g1", shop: "newsbooze", category: "Greetings Cards & Gifts", name: "Birthday Card", unit: "each", price: 2.50, brand: "Generic" },
  { id: "nb-g2", shop: "newsbooze", category: "Greetings Cards & Gifts", name: "Anniversary Card", unit: "each", price: 2.75, brand: "Generic" },
  { id: "nb-g3", shop: "newsbooze", category: "Greetings Cards & Gifts", name: "Gift Wrap Roll", unit: "each", price: 1.50, brand: "Generic" },

  // ---------------- QUICK STOP ESSENTIALS ----------------
  // Fresh Bread & Bakery
  { id: "es-bk1", shop: "essentials", category: "Fresh Bread & Bakery", name: "Warburtons Toastie White", unit: "800g", price: 1.35, brand: "Warburtons", featured: true },
  { id: "es-bk2", shop: "essentials", category: "Fresh Bread & Bakery", name: "Bakery Bread Rolls", unit: "6 pack", price: 1.20, brand: "In-store Bakery" },
  { id: "es-bk3", shop: "essentials", category: "Fresh Bread & Bakery", name: "Croissants", unit: "4 pack", price: 1.80, brand: "In-store Bakery" },

  // Milk, Eggs & Dairy
  { id: "es-d1", shop: "essentials", category: "Milk, Eggs & Dairy", name: "Semi-Skimmed Milk", unit: "2L", price: 1.65, brand: "Generic", discountPercent: 15 },
  { id: "es-d2", shop: "essentials", category: "Milk, Eggs & Dairy", name: "Whole Milk", unit: "1L", price: 1.05, brand: "Generic" },
  { id: "es-d3", shop: "essentials", category: "Milk, Eggs & Dairy", name: "Free Range Eggs", unit: "6 pack", price: 2.00, brand: "Generic" },
  { id: "es-d4", shop: "essentials", category: "Milk, Eggs & Dairy", name: "Cheddar Cheese", unit: "400g", price: 3.00, brand: "Generic" },
  { id: "es-d5", shop: "essentials", category: "Milk, Eggs & Dairy", name: "Butter", unit: "250g", price: 2.20, brand: "Generic" },

  // Fruit & Veg
  { id: "es-fv1", shop: "essentials", category: "Fruit & Veg", name: "Bananas", unit: "5 pack", price: 1.00, brand: "Generic" },
  { id: "es-fv2", shop: "essentials", category: "Fruit & Veg", name: "Apples", unit: "6 pack", price: 1.80, brand: "Generic" },
  { id: "es-fv3", shop: "essentials", category: "Fruit & Veg", name: "Potatoes", unit: "2.5kg bag", price: 2.30, brand: "Generic" },
  { id: "es-fv4", shop: "essentials", category: "Fruit & Veg", name: "Onions", unit: "1kg", price: 1.10, brand: "Generic" },
  { id: "es-fv5", shop: "essentials", category: "Fruit & Veg", name: "Salad Bag", unit: "200g", price: 1.20, brand: "Generic" },

  // Store Cupboard & Groceries
  { id: "es-g1", shop: "essentials", category: "Store Cupboard & Groceries", name: "Heinz Baked Beans", unit: "415g", price: 1.10, brand: "Heinz", featured: true, salePrice: 0.85, discountUntil: "2026-10-15" },
  { id: "es-g2", shop: "essentials", category: "Store Cupboard & Groceries", name: "Pasta", unit: "500g", price: 0.95, brand: "Generic" },
  { id: "es-g3", shop: "essentials", category: "Store Cupboard & Groceries", name: "Rice", unit: "1kg", price: 1.60, brand: "Generic" },
  { id: "es-g4", shop: "essentials", category: "Store Cupboard & Groceries", name: "Tomato Ketchup", unit: "460g", price: 1.90, brand: "Heinz" },
  { id: "es-g5", shop: "essentials", category: "Store Cupboard & Groceries", name: "Cornflakes", unit: "500g", price: 2.40, brand: "Kellogg's" },
  { id: "es-g6", shop: "essentials", category: "Store Cupboard & Groceries", name: "Sugar", unit: "1kg", price: 1.30, brand: "Generic" },
  { id: "es-g7", shop: "essentials", category: "Store Cupboard & Groceries", name: "Tea Bags", unit: "80 pack", price: 2.80, brand: "Yorkshire Tea" },
  { id: "es-g8", shop: "essentials", category: "Store Cupboard & Groceries", name: "Instant Coffee", unit: "100g", price: 3.20, brand: "Nescafé" },

  // Household & Cleaning
  { id: "es-h1", shop: "essentials", category: "Household & Cleaning", name: "Washing Up Liquid", unit: "500ml", price: 1.20, brand: "Fairy" },
  { id: "es-h2", shop: "essentials", category: "Household & Cleaning", name: "Kitchen Roll", unit: "2 pack", price: 1.80, brand: "Plenty" },
  { id: "es-h3", shop: "essentials", category: "Household & Cleaning", name: "Bin Bags", unit: "20 pack", price: 1.50, brand: "Generic" },
  { id: "es-h4", shop: "essentials", category: "Household & Cleaning", name: "Multi-Surface Spray", unit: "each", price: 1.90, brand: "Cif" },
  { id: "es-h5", shop: "essentials", category: "Household & Cleaning", name: "Laundry Pods", unit: "12 pack", price: 4.00, brand: "Ariel" },

  // Toiletries & Health
  { id: "es-t1", shop: "essentials", category: "Toiletries & Health", name: "Toothpaste", unit: "75ml", price: 1.60, brand: "Colgate" },
  { id: "es-t2", shop: "essentials", category: "Toiletries & Health", name: "Shower Gel", unit: "250ml", price: 1.80, brand: "Generic" },
  { id: "es-t3", shop: "essentials", category: "Toiletries & Health", name: "Shampoo", unit: "250ml", price: 2.00, brand: "Generic" },
  { id: "es-t4", shop: "essentials", category: "Toiletries & Health", name: "Toilet Roll", unit: "9 pack", price: 4.50, brand: "Andrex" },
  { id: "es-t5", shop: "essentials", category: "Toiletries & Health", name: "Paracetamol", unit: "16 tablets", price: 1.00, brand: "Generic" },

  // Snacks & Soft Drinks
  { id: "es-sn1", shop: "essentials", category: "Snacks & Soft Drinks", name: "Crisps Multipack", unit: "6 pack", price: 2.00, brand: "Walkers" },
  { id: "es-sn2", shop: "essentials", category: "Snacks & Soft Drinks", name: "Chocolate Bar Selection", unit: "each", price: 2.20, brand: "Generic" },
  { id: "es-sn3", shop: "essentials", category: "Snacks & Soft Drinks", name: "Coca-Cola", unit: "1.5L", price: 1.80, brand: "Coca-Cola" },
  { id: "es-sn4", shop: "essentials", category: "Snacks & Soft Drinks", name: "Orange Juice", unit: "1L", price: 1.60, brand: "Generic" },
  { id: "es-sn5", shop: "essentials", category: "Snacks & Soft Drinks", name: "Digestive Biscuits", unit: "400g", price: 1.30, brand: "McVitie's" },

  // Frozen Foods
  { id: "es-fr1", shop: "essentials", category: "Frozen Foods", name: "Frozen Peas", unit: "900g", price: 1.50, brand: "Birds Eye" },
  { id: "es-fr2", shop: "essentials", category: "Frozen Foods", name: "Fish Fingers", unit: "10 pack", price: 2.20, brand: "Birds Eye", featured: true },
  { id: "es-fr3", shop: "essentials", category: "Frozen Foods", name: "Oven Chips", unit: "1kg", price: 1.80, brand: "McCain" },
  { id: "es-fr4", shop: "essentials", category: "Frozen Foods", name: "Ice Cream Tub", unit: "500ml", price: 2.50, brand: "Generic" },

  // Baby & Pet Care
  { id: "es-bp1", shop: "essentials", category: "Baby & Pet Care", name: "Nappies Size 4", unit: "30 pack", price: 6.50, brand: "Pampers" },
  { id: "es-bp2", shop: "essentials", category: "Baby & Pet Care", name: "Baby Wipes", unit: "56 pack", price: 1.20, brand: "Generic" },
  { id: "es-bp3", shop: "essentials", category: "Baby & Pet Care", name: "Dog Food Tin", unit: "400g", price: 0.90, brand: "Generic" },
  { id: "es-bp4", shop: "essentials", category: "Baby & Pet Care", name: "Cat Food Pouches", unit: "4 pack", price: 1.60, brand: "Generic" }
];
