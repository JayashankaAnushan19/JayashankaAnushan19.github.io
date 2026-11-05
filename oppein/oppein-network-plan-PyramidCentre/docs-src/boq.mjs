// BOQ, functional descriptions and market product suggestions.
// Rates: AED excl. VAT, budget estimates from UAE web listings seen 17 Oct 2026.
import { CAMERAS, CCTV_TOTAL_M, CCTV_ROLLS, PSU, PSU_LOAD, REC, recDays, DEVICES, RUNS, OUTLETS, BOXES, TOTAL_M, POE, CASING_SIZES, CASING_M, CONDUIT_M, PANEL, LOCAL, SWITCHES, SPARE, SPARE_U, SPARE_RANGE, inCabinet } from './data.mjs';

export const VAT_PCT = 5;
export const CONTINGENCY_PCT = 10;
export const CURRENCY = 'AED';
export const PRICE_DATE = '17 Oct 2026';

const CEIL = DEVICES.filter(d => d.ceil).length;
const WALL = OUTLETS - CEIL;
const RUN_N = RUNS.length;
// cable ends that terminate beside a switch (runs leaving a switch + runs arriving at a switch)
const LINKS = SWITCHES.filter(s => s.from).length; // router → SW2, router → SW1 (patch cords in the cabinet)
const UNPATCHED = DEVICES.filter(d => d.unpatched).length;
const feeds = id => DEVICES.filter(d => d.on === id).map(d => d.id).concat(SWITCHES.filter(s => s.from === id).map(s => s.id)).join(', ');
const casing = size => CASING_SIZES.find(c => c.size === size) || { lengths: 0, m: 0 };
const C25 = casing('25 × 16 mm'), C40 = casing('40 × 25 mm');

// The user's plan sheet "Network - Oud Metha.xlsx" (2026-11-05): the items, links and notes exactly as given there.
export const SHEET_URL = {
  cabinet: 'https://www.amazon.ae/Server-Cabinet-Network-Networking-Equipment/dp/B0HLG46875',
  panel: 'https://www.amazon.ae/VENTION-Cat-6-Loaded-Network-Distribution/dp/B0B7MJD9S2',
  cm: 'https://www.amazon.ae/dp/B0H1TD5X57',
  tags: 'https://www.amazon.ae/Waterproof-Organisation-Self-Adhesive-Compatible-Handwriting/dp/B0G51WPDD6',
  pdu: 'https://www.amazon.ae/rack-mounted-Network-Extension-BlackColor-aluminum/dp/B0BPCT9LVB',
  shelf: 'https://www.amazon.ae/GeeekPi-Cantilever-Network-Equipment-RackMate/dp/B0D5XGSPXD',
};
// [sheet item, sheet link / note, where it is in the BOQs, what changed and why]
export const SHEET = [
  ['12U Network Cabinet', SHEET_URL.cabinet, 'SYS-03 Cabinet A.1', 'As in the sheet.'],
  ['Patch Panel 24 Port (fully loaded)', SHEET_URL.panel, 'SYS-03 Cabinet A.2', 'As in the sheet (VENTION Cat.6 UTP).'],
  ['1U Cable Manager', SHEET_URL.cm, 'SYS-03 Cabinet A.3', 'As in the sheet (Taradhin 24-slot).'],
  ['Tags - Wire labelling', SHEET_URL.tags, 'SYS-03 Cabinet A.4', 'As in the sheet (540 pcs, 9 colours).'],
  ['PDU - 1U', SHEET_URL.pdu, 'SYS-03 Cabinet A.5', 'Qty 2, not 1: 8 plugs need more than one 6-way strip. Second PDU goes in the empty U1.'],
  ['1U Server Rack Shelf', SHEET_URL.shelf, 'SYS-03 Cabinet A.6', 'Qty 3 (DVR, router + ONT, switches). The linked GeeekPi shelf is for 10-inch racks — buy the 19″ version of a 1U cantilever shelf.'],
  ['Router', 'Exists', 'SYS-03 Cabinet B.1', 'Priced 0.'],
  ['ONT', 'Exists', 'SYS-03 Cabinet B.2', 'Priced 0.'],
  ['Switch-01 | Switch-02', 'Exists', 'SYS-03 Cabinet B.3, B.4', 'Priced 0.'],
  ['DVR', 'Exists', 'SYS-03 Cabinet B.5', 'Priced 0 (also in the CCTV BOQ at 0).'],
  ['Camera', 'Qty-???', 'SYS-02 CCTV A.1', 'Quantity not given in the sheet: 4 used (the camera plan). Change the quantity there.'],
];

// [description, unit, qty, rate, function (what it does here), rate basis, guide anchor, plan-sheet link]
export const BOQ = [
  { code: 'A', title: 'Cabling & casing', items: [
    ['Cat6 U/UTP cable, 23 AWG solid bare copper, LSZH — 305 m box', 'box', BOXES, 480,
      `Carries data from the router and switches to every device. ${TOTAL_M} m needed for ${RUN_N} runs.`, 'Amazon.ae / noon: AED 342 – 480 for bare-copper boxes', 'cable'],
    ['Cat6 keystone jack (device end)', 'pc', RUNS.length, 15, 'Terminates the far end of every run in its surface box (the cabinet end punches down on the fully loaded panel).', 'CableCreation 10-pack on Amazon.ae', 'outlets'],
    ['Surface box 1× RJ45 (device end)', 'pc', OUTLETS, 15, `One at each device: ${WALL} on the casing at desks, ${CEIL} next to the APs.`, 'Trade price', 'outlets'],
    ['PVC casing (trunking) 25 × 16 mm, screw-fix, 2 m lengths', 'length', C25.lengths, 12, `Main route, branches and AP drops along the walls (${Math.round(C25.m)} m + 10 % offcuts). Holds up to 4 Cat6.`, 'Trade price, Dubai', 'casing'],
    ['PVC casing (trunking) 40 × 25 mm, 2 m lengths', 'length', Math.max(1, C40.lengths), 22, 'Main casing run from mark 2 along the desks, where up to 8 cables share one casing, and the drop behind the wall at mark 2.', 'Trade price, Dubai', 'casing'],
    ['PVC conduit 20 mm, 3 m lengths, with bends, couplers and saddles (ceiling)', 'length', Math.ceil(CONDUIT_M * 1.1 / 3), 12, `Cabinet → mark 2 and mark 2 → AP2 above the ceiling (${Math.round(CONDUIT_M)} m). Set to 0 if the existing pipe is reused.`, 'Trade price, Dubai', 'casing'],
    ['Casing fittings: internal / external corners, tees, end caps, flat bends', 'lot', 1, 120, 'Keeps the bend radius at corners and closes the ends neatly.', 'Allowance', 'casing'],
    ['Screws, plugs & sundries for casing (fix every 500 mm)', 'lot', 1, 60, 'Adhesive alone does not hold on painted walls in the heat.', '', 'casing'],

    ['Velcro ties & sundries', 'lot', 1, 50, 'Bundling inside the cabinet and along the shelves.', '', 'casing'],
  ]},
  { code: 'B', title: 'Active equipment', items: [
    ['Router (existing — plan sheet: exists)', 'pc', 1, 0, 'On the U6 shelf; feeds Switch-02 (L1) and Switch-01 (L2), and IT PC 3 / 4 (L3, L4).', 'Existing', 'switch'],
    ['ONT (existing — plan sheet: exists)', 'pc', 1, 0, 'Stacked on the router; TEL1 port feeds the phone line C-14.', 'Existing', 'switch'],
    ['Switch-01 — 5-port Gigabit desktop switch, unmanaged (existing)', 'pc', 1, 0, `On the U5 shelf. Fed from router L2; feeds ${feeds('SW1')}.`, 'Existing', 'switch'],
    ['Switch-02 — 8-port Gigabit desktop switch, unmanaged (existing)', 'pc', 1, 0, `On the U5 shelf. Fed from router L1; feeds ${feeds('SW2')}.`, 'Existing', 'switch'],
    ['Wi-Fi 6 ceiling access point, PoE (e.g. UniFi U6 Lite / U6+)', 'pc', 2, 450, 'Wireless coverage for laptops and phones in Showroom (AP1) and Design (AP2).', 'Amazon.ae U6 Lite AED 400 – 555', 'ap'],
    ['PoE+ injector, Gigabit, 802.3at (30 W)', 'pc', POE, 45, 'Powers each AP over its cable, because SW1 and SW2 give no PoE. Not needed if the AP comes with its own PoE adapter.', 'Trade price; check the AP box first', 'injector'],
  ]},
  { code: 'C', title: 'Patching', items: [
    ['Cat6 patch cord 0.5 m (cabinet)', 'pc', PANEL.length - 1 - UNPATCHED + LINKS + POE + LOCAL.length, 15, 'Panel port → switch / router port for every patched cable, router → both switches, switch → PoE injector, and DVR → Switch-01.', 'D-Link 0.5 m AED 19.90 on Amazon.ae', 'patch'],
    ['Cat6 patch cord 2 m (devices)', 'pc', WALL - 1, 20, 'Surface box → PC / printer / mobile at each desk.', '', 'patch'],
    ['RJ11 – RJ45 phone cord', 'pc', 2, 10, 'ONT TEL1 → phone-line panel port, and the phone socket at desk 5 → the phone.', '', 'patch'],

    ['Cat6 patch cord 1 m (injector → patch panel)', 'pc', POE, 15, 'PoE injector out → the AP cable on the patch panel.', '', 'patch'],
    ['Cat6 patch cord 0.5 m — spares', 'pc', 4, 15, 'For moves and fault-finding.', '', 'patch'],
  ]},
  { code: 'D', title: 'Labour & services', items: [
    ['Install, lay, terminate & label Cat6 run (both ends)', 'run', RUN_N, 100, 'Installer labour per cable run (casing work is separate).', 'Typical small-office contractor rate', 'labour'],
    ['Fix PVC casing incl. fittings and lids', 'm', Math.ceil(CASING_M), 15, 'Measure, cut, screw-fix and fit lids along the route.', '', 'labour'],
    ['Ceiling conduit: fix or check, pull draw wire', 'm', Math.ceil(CONDUIT_M), 12, 'Ceiling access, fixing above the tiles. Lower if the existing pipe is reused.', '', 'labour'],
    ['Test every link + test report', 'run', RUN_N, 30, 'Wire map and length test with a written record (DOC 09).', 'Certification is item F.2', 'labour'],
    ['Configure router & Wi-Fi; fit switches and injectors; commissioning', 'lot', 1, 450, 'IP plan, SSIDs, firmware, passwords; every device checked online.', '', 'labour'],
    ['As-built documentation & handover', 'lot', 1, 250, 'Updates this pack with real positions and measured lengths.', '', 'labour'],
  ]},
  { code: 'F', title: 'Optional items', optional: true, items: [
    ['UPS 1000 VA line-interactive, pure sine (e.g. APC SMC1000I)', 'pc', 1, 1340, 'Keeps the whole cabinet (ONT, router, switches, PoE injectors, DVR) running through short power cuts. Same UPS as the Rack & Cabinet BOQ C.1 — tick it in one BOQ only.', 'Amazon.ae AED 1,340. Decision D-05', 'ups'],
    ['Cat6 certification test (Fluke DSX) per link', 'run', RUN_N, 25, 'Certified Cat6 report, needed for a manufacturer warranty.', '', 'labour'],
    ['Upgrade: one 16-port PoE+ switch (e.g. TP-Link TL-SG1218MPE) to replace SW1 + SW2 + injectors', 'pc', 1, 500, 'One switch, PoE for the APs, VLAN for guest Wi-Fi and spare ports. Decision D-03.', 'Amazon.ae AED 469 – 505', 'upgrade'],
  ]},
];

// SYS-02 CCTV BOQ — 4 HD analog cameras on siamese cable (coax + power), DVR and 12 V power supply in the cabinet.
// [description, unit, qty, rate, function, rate basis, guide anchor (none for these sections)]
const NCAM = CAMERAS.length;
export const BOQ_CCTV = [
  { code: 'A', title: 'Cameras & recording', items: [
    ['HD analog dome camera 2 MP (AHD/TVI), IR night vision, 2.8 mm (≈ 90°), 12 V DC, ceiling mount', 'pc', NCAM, 150, `Plan sheet: qty ??? — ${NCAM} used, from the camera plan: ${CAMERAS.map(c => `${c.id} ${c.name}`).join(' · ')}. Change the quantity when confirmed.`, 'Typical trade price (Hikvision Turbo HD / Dahua HDCVI class)', ''],
    ['DVR 4-channel HD analog (AHD/TVI/CVI), 1080p, H.265+ (existing — plan sheet: exists)', 'pc', 1, 0, 'Records the cameras from their coax; sits on the U11 shelf; LAN to Switch-01 port 5 for viewing.', 'Existing (plan sheet)', ''],
    [`Surveillance hard disk ${REC.rec} TB`, 'pc', 1, 300, `About ${recDays(REC.rec)} days of continuous recording from ${NCAM} cameras (see Recording & storage).`, 'Typical trade price', ''],
  ]},
  { code: 'B', title: 'Camera power', items: [
    [`CCTV power supply ${PSU.volts} V DC ${PSU.amps} A, ${PSU.outputs}-way, individually fused, metal box`, 'pc', 1, 120, `Feeds every camera through the power pair of its siamese cable. Load ${PSU_LOAD} A of ${PSU.amps} A.`, 'Typical trade price', ''],
    ['DC power pigtail (male) at each camera', 'pc', NCAM, 5, 'Connects the power pair to the camera.', '', ''],
    ['Camera junction / mounting box (ceiling)', 'pc', NCAM, 40, 'Neat fixing of each camera and its cable end.', '', ''],
  ]},
  { code: 'C', title: 'Cabling & containment', items: [
    ['Siamese cable RG59 coax + 2 × 0.75 mm² power, 100 m roll', 'roll', CCTV_ROLLS, 180, `${CCTV_TOTAL_M} m for ${NCAM} camera runs (+10 % for terminations and offcuts).`, 'Typical trade price', ''],
    ['BNC compression connectors (camera end + DVR end)', 'pc', NCAM * 2, 6, 'Two per camera run.', '', ''],
    ['Ceiling conduit / flexible conduit and fixings for the camera drops', 'lot', 1, 150, 'Shares the cabinet → mark 2 conduit; short new runs above the ceiling to each camera.', '', ''],
    ['Cat6 patch cord, DVR → Switch-01 P5', 'pc', 1, 15, 'Connects the DVR to the office network for phone-app viewing.', '', ''],
  ]},
  { code: 'D', title: 'Labour & services', items: [
    ['Install, terminate (BNC + DC) and aim camera', 'pc', NCAM, 150, 'Per camera, including ceiling work.', '', ''],
    ['DVR set-up: recording, motion events, users, phone-app viewing, password hardening', 'lot', 1, 350, 'Configuration and secure remote access.', '', ''],
    ['Testing, handover and as-built camera plan', 'lot', 1, 250, 'Day / night image and voltage check at every camera.', '', ''],
  ]},
  { code: 'F', title: 'Optional items', optional: true, items: [
    ['Monitor 22″ (HDMI) for live viewing', 'pc', 1, 450, 'Live view at reception, straight from the DVR.', '', ''],
    ['Upgrade disk to 4 TB', 'pc', 1, 150, `Extra over the ${REC.rec} TB: about ${recDays(4)} days in total.`, '', ''],
    ['CCTV warning signs', 'set', 1, 60, 'Notice at the entrance and kitchen.', '', ''],
  ]},
];

// SYS-03 Rack & Cabinet BOQ — every item from the plan sheet ("Network - Oud Metha.xlsx"), in the sheet's order, with the
// sheet's links; then what the shared cabinet needs on top (UPS, cooling, fit-out). Not repeated in the SYS-01 BOQ.
export const BOQ_CAB = [
  { code: 'A', title: 'Cabinet & hardware (plan sheet)', items: [
    ['12U network cabinet, 19″ wall-mount', 'pc', 1, 450, 'Holds the ONT, router, both switches, DVR, patch panel and PDUs in the IT Room.', 'Plan sheet item — rate is an estimate, check the listing', '', SHEET_URL.cabinet],
    ['Patch panel 24-port, fully loaded — VENTION Cat.6 UTP, 1U', 'pc', 1, 150, `Fixed end for the ${PANEL.length} cables that start in the cabinet (${PANEL.map(p => p.run.toId).join(', ')}).`, 'Plan sheet item — rate is an estimate', '', SHEET_URL.panel],
    ['1U cable manager — Taradhin 24-slot horizontal, metal', 'pc', 1, 45, 'Below the switch shelf: keeps the patch cords between panel and switches tidy.', 'Plan sheet item — rate is an estimate', '', SHEET_URL.cm],
    ['Tags — wire-labelling kit, 540 pcs, 9 colours, self-adhesive', 'kit', 1, 35, `Labels both ends of every cable (${RUNS[0].cable} … ${RUNS.at(-1).cable}), panel ports and switches.`, 'Plan sheet item — rate is an estimate', '', SHEET_URL.tags],
    ['PDU 1U — XForm 6-way, 13 A UK sockets, 1.8 m lead', 'pc', 2, 80, 'Sheet: 1. Two are needed for 8 plugs (ONT, router, 2 switches, 2 PoE injectors, DVR, camera supply): U2 and U1.', 'Plan sheet item — rate is an estimate', '', SHEET_URL.pdu],
    ['1U server rack shelf, cantilever, vented — 19″', 'pc', 3, 60, 'U11 DVR + camera supply · U6 router with the ONT on it · U5 both switches + PoE injectors. The sheet\'s GeeekPi link is a 10-inch shelf: order the 19″ size.', 'Plan sheet item (19″ size) — rate is an estimate', '', SHEET_URL.shelf],
  ]},
  { code: 'B', title: 'Existing equipment (plan sheet: exists)', items: [
    ['Router (existing)', 'pc', 1, 0, 'U6 shelf, with the ONT on top. Feeds Switch-02 (L1), Switch-01 (L2) and IT PC 3 / 4.', 'Plan sheet: exists', ''],
    ['ONT (existing, ISP)', 'pc', 1, 0, 'Stacked on the router (U7). TEL1 feeds the phone line.', 'Plan sheet: exists', ''],
    ['Switch-01 — 5-port (existing)', 'pc', 1, 0, 'U5 shelf.', 'Plan sheet: exists', ''],
    ['Switch-02 — 8-port (existing)', 'pc', 1, 0, 'U5 shelf.', 'Plan sheet: exists', ''],
    ['DVR (existing)', 'pc', 1, 0, 'U11 shelf, with the 12 V camera supply.', 'Plan sheet: exists', ''],
  ]},
  { code: 'C', title: 'Power protection', items: [
    ['UPS 1–1.5 kVA line-interactive, tower (beside / under the cabinet)', 'pc', 1, 1400, 'Backs up internet, the phone line and recording through power cuts.', 'Typical trade price', ''],
  ]},
  { code: 'D', title: 'Cooling & care', items: [
    ['Roof fan unit with thermostat for the 12U cabinet (if not included)', 'pc', 1, 150, 'DVR, router, switches and supplies in one closed cabinet.', 'Check whether the cabinet listing includes a fan', ''],
    ['Blank panels 1U for the free U', 'pc', SPARE_U, 15, `Closes ${SPARE_RANGE} at the front so the air goes through the equipment.`, '', ''],
  ]},
  { code: 'E', title: 'Labour & services', items: [
    ['Cabinet fit-out: mount the cabinet, shelves, patch panel, cable manager, PDUs; dress and label cables', 'lot', 1, 300, 'Builds the 12U cabinet as laid out in the plan sheet.', '', ''],
    ['As-built cabinet drawing and maintenance checklist (all systems)', 'lot', 1, 250, '', '', ''],
  ]},
  { code: 'F', title: 'Optional items', optional: true, items: [
    ['Environment sensor (temperature / door) with alerts', 'pc', 1, 350, 'Warns if the cabinet overheats.', '', ''],
  ]},
];

// Functional guide + where to buy. Prices = what the listing showed on PRICE_DATE (may change).
export const GUIDE = [
  { id: 'cable', title: 'Cat6 cable', icon: 'cable',
    fn: 'The permanent link between the router or a switch and each device, laid in the casing. Each run carries 1 Gbps data, and on the two AP runs it also carries up to 30 W of PoE power from the injector.',
    needs: ['Cat6 U/UTP, 23 AWG', 'Solid bare copper (BC), never CCA', 'LSZH jacket for indoor ceilings', '305 m box (pull-box)'],
    picks: [
      { tag: 'Recommended', name: 'OPTERNET Cat6 23 AWG UTP, LSZH, 100 % bare copper, 305 m', store: 'amazon', price: 'AED 342', url: 'https://www.amazon.ae/OPTERNET-CABLE-0-56MM-COPPER-CAT6LSZH23AWGUTPBC3903/dp/B0DCG5MYVD' },
      { tag: 'Brand', name: 'D-Link Cat6 UTP cable roll, 305 m', store: 'noon', price: 'AED 479.99', url: 'https://www.noon.com/uae-en/cat-6-utp-cable-roll-305-meter-networking-cable/N53387021A/p/' },
      { tag: 'Premium', name: 'Belden 7965E Cat6 UTP, 23 AWG solid bare copper, 305 m', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/BELDEN-7965E-Cable-Solid-Copper/dp/B07S1GFQ89' },
      { tag: 'Premium', name: 'Schneider Cat6 UTP cable, 305 m', store: 'noon', price: 'AED 934.32', url: 'https://www.noon.com/uae-en/schneider-cat6-utp-cable-305mtr/ZDA8F694B46369B982FBBZ/p/' },
    ],
    avoid: 'Boxes marked "CCA" (copper-clad aluminium), e.g. many AED 170 – 300 listings. CCA has about 55 % more resistance, so PoE devices can brown out. It also fails Cat6 certification and is not allowed by the standard.' },
  { id: 'switch', title: 'Switches (Switch-01 5-port, Switch-02 8-port)', icon: 'switch',
    fn: 'The two existing plain unmanaged Gigabit switches, side by side on the U5 shelf of the cabinet. The router feeds each one directly with a patch cord; every device cable lands on the patch panel and is patched to its switch port. Neither gives PoE, so the APs use injectors.',
    needs: ['Gigabit (10/100/1000) on every port', 'Both fit side by side on one 19″ 1U shelf with the PoE injectors', 'Metal case preferred (cabinet heat)', 'Each power adapter on the cabinet PDU', 'Same make for both switches is easiest'],
    picks: [],
    avoid: 'Fast Ethernet (10/100) switches: they cap every PC behind them at 100 Mbps. Do not chain a third switch behind SW2; add ports by replacing a switch instead.' },
  { id: 'injector', title: 'PoE injectors', icon: 'ups',
    fn: 'A small box in the cabinet between the switch and the AP cable. It adds power to the data cable so the AP needs no socket at the ceiling: data in from the switch, data + power out to the AP.',
    needs: ['802.3at (PoE+, 30 W), or whatever the AP datasheet asks for', 'Gigabit', 'Powered from the cabinet PDU, on the shelf next to the router'],
    picks: [],
    avoid: "Passive 24 V injectors with a standard 802.3af/at AP (and the reverse). Match the AP's PoE type exactly. Many UniFi APs ship with their own PoE adapter; check the box before buying." },
  { id: 'ap', title: 'Wi-Fi access points', icon: 'wifi',
    fn: 'Ceiling-mounted radios that give wireless access to laptops, phones and tablets. AP1 covers the Showroom and AP2 the Design area. Each one is powered through its cable by a PoE injector in the cabinet (AP1 on SW1, AP2 on SW2), and both are managed from one app or controller.',
    needs: ['Wi-Fi 6 (802.11ax), dual band', 'PoE powered, ceiling mount kit', 'Same brand for all APs (seamless roaming)', 'Guest SSID with client isolation'],
    picks: [
      { tag: 'Recommended', name: 'Ubiquiti UniFi 6 Lite (U6-Lite) — 2×2 Wi-Fi 6, PoE', store: 'amazon', price: 'AED 400 – 555', url: 'https://www.amazon.ae/Ubiquiti-Networks-Adapter-Included-U6-Lite/dp/B08T6CKG5B' },
      { tag: 'Step up', name: 'Ubiquiti UniFi U6+ — Wi-Fi 6, 300+ clients, ceiling/wall kit', store: 'noon', price: 'check listing', url: 'https://www.noon.com/uae-en/networks-unifi-u6-dual-band-wi-fi-6-access-point-wi-fi-6-standard-up-2402mbps-wpa3-300-clients-ceiling-wall-mount-kit-poe-adapter-not-included-u6-white/N70040300V/p/' },
      { tag: 'Store', name: 'Ubiquiti store on noon UAE (U6 Mesh, U6-IW and others)', store: 'noon', price: 'AED 729 – 899', url: 'https://www.noon.com/uae-en/ubiquiti/' },
    ],
    avoid: 'Check that the listing is the international (not "-US") model, and whether a PoE adapter is in the box (then no separate injector is needed).' },
  { id: 'cabinet', title: 'Cabinet & patch panel', icon: 'rack',
    fn: `The cabinet in the IT Room protects the ONT and router and keeps them locked. The ${PANEL.length} cables that start there end on a small patch panel, so changes are made with patch cords, not by re-terminating cables.`,
    needs: ['19″ 12U wall-mount cabinet (the one linked in the plan sheet)', '≥ 450 mm deep so the router and switches fit on the shelves', 'Vented / fan', '24-port Cat6 patch panel, fully loaded (VENTION, as in the sheet)', '19″ 1U shelves — not 10-inch ones'],
    picks: [
      { tag: 'Plan sheet', name: '12U network cabinet', store: 'amazon', price: 'check listing', url: SHEET_URL.cabinet },
      { tag: 'Plan sheet', name: 'VENTION Cat.6 UTP fully loaded patch panel, 24-port', store: 'amazon', price: 'check listing', url: SHEET_URL.panel },
      { tag: 'Plan sheet', name: 'Taradhin 1U 24-slot horizontal cable manager', store: 'amazon', price: 'check listing', url: SHEET_URL.cm },
      { tag: 'Plan sheet', name: 'XForm 1U 6-way 13 A UK PDU, 1.8 m', store: 'amazon', price: 'check listing', url: SHEET_URL.pdu },
      { tag: 'Plan sheet', name: '540 pcs wire-labelling kit, 9 colours', store: 'amazon', price: 'check listing', url: SHEET_URL.tags },
      { tag: 'Plan sheet · 10-inch', name: 'GeeekPi 1U cantilever shelf — this listing is for 10-inch racks; pick the 19″ size', store: 'amazon', price: 'check listing', url: SHEET_URL.shelf },
    ],
    avoid: 'FTP / STP (shielded) patch panels with UTP cable. Shielding only works if the whole system is shielded and earthed.' },
  { id: 'outlets', title: 'Outlets: keystones & surface boxes', icon: 'outlet',
    fn: 'The socket at each end of a run. The keystone jack terminates the Cat6 cable; the surface box holds it at the end of the casing, so no wall box is needed. It must be Cat6-rated, or the whole link drops to the lower grade.',
    needs: ['Cat6 keystone, T568B', 'Surface-mount box, 1-port (2-port at desk 5 if preferred), with label window', 'Same brand as cable if possible'],
    picks: [
      { tag: 'Recommended', name: 'CableCreation Cat6 keystone jacks, 10-pack (UL listed)', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/CableCreation-Keystone-10-Pack-Ethernet-Connectors/dp/B01FHC1HXO' },
      { tag: 'Kit', name: 'LEENUE Cat6 single faceplate with keystone jack', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/LEENUE-Ethernet-Faceplate-Network-Keystone/dp/B091D4PMCJ' },
      { tag: 'Kit', name: 'VCELINK Cat6 single wall socket with keystone', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/VCELINK-Ethernet-Keystone-Faceplate-Network/dp/B08JYMGSCM' },
    ],
    avoid: 'Cat5e keystones on Cat6 cable. They cap the link at Cat5e.' },
  { id: 'patch', title: 'Patch cords', icon: 'patch',
    fn: 'Short, flexible factory-made leads: 0.5 m in the cabinet (panel → switch, switch → switch, switch → injector), 1 m from each injector to the panel, and 2 m at the desk (surface box → device).',
    needs: ['Cat6, factory moulded', 'Stranded copper', 'Colour by device type (see DOC 03)'],
    picks: [
      { tag: 'Recommended', name: 'D-Link Cat6 UTP patch cord 0.5 m', store: 'amazon', price: 'AED 19.90', url: 'https://www.amazon.ae/D-Link-Cat6-Patch-Ethernet-Cable/dp/B07MCR3V3L' },
      { tag: 'Search', name: 'Cat6 UTP patch cords — all lengths', store: 'amazon', price: 'various', url: 'https://www.amazon.ae/patch-cord-cable-utp-cat6/s?k=patch+cord+cable+utp+cat6' },
    ],
    avoid: '"0.5 ft" packs. They are 15 cm, too short for patching between the panel and switch.' },
  { id: 'upgrade', title: 'Upgrade option: one 16-port PoE+ switch', icon: 'switch',
    fn: 'Optional (BOQ F.3, decision D-03). One switch in place of SW1 + SW2 + the injectors: it powers the APs over the cable, has spare ports for new desks, and a smart-managed model can separate guest Wi-Fi with a VLAN.',
    needs: ['16 × 1 GbE PoE+ (802.3at, 30 W / port)', `PoE budget ≥ 150 W (${POE} PoE devices + growth)`, 'Rackmount ears (fits a free U in the 12U cabinet)', 'Smart-managed (VLAN) preferred'],
    picks: [
      { tag: 'Recommended', name: 'TP-Link TL-SG1218MPE — 16 PoE+ + 2 GbE + 2 SFP, 250 W, Easy Smart (VLAN)', store: 'amazon', price: 'AED 475 – 505', url: 'https://www.amazon.ae/TP-Link-TL-SG1218MPE-16-Port-Gigabit-Rackmount/dp/B07YL7C6HP' },
      { tag: 'Budget', name: 'TP-Link TL-SG1218MP — 16 PoE+, 250 W, unmanaged', store: 'amazon', price: 'AED 469', url: 'https://www.amazon.ae/TP-Link-TL-SG1218MP-18-Port-Gigabit-Rackmount/dp/B0895VWGF5' },
      { tag: 'Alternative', name: 'TP-Link / Omada switches (incl. SG2218P, 16 PoE+, 150 W, managed)', store: 'noon', price: 'see store', url: 'https://www.noon.com/uae-en/electronics-and-mobiles/computers-and-accessories/networking-products-16523/switches-22460/tp_link/' },
    ],
    avoid: 'A "16-port with 8 PoE" switch only powers half the ports, and an 802.3af-only switch gives 15 W per port, which is not enough for Wi-Fi 6 APs.' },
  { id: 'ups', title: 'UPS (optional)', icon: 'ups',
    fn: 'Battery backup for the cabinet. During a power cut it keeps internet, Wi-Fi and the switch alive for several minutes. It also cleans spikes, which protects the equipment.',
    needs: ['1000 VA line-interactive', 'Pure sine wave', '230 V model (not 120 V)', 'Rack or tower'],
    picks: [
      { tag: 'Recommended', name: 'APC Smart-UPS 1000VA LCD 230 V (SMC1000I)', store: 'amazon', price: 'AED 1,340', url: 'https://www.amazon.ae/APC-Smart-UPS-1000VA-230V-SMC1000I/dp/B07N6PGXBR' },
      { tag: 'Budget', name: 'APC UPS range (incl. Easy UPS BV 1000VA tower ≈ AED 292)', store: 'amazon', price: 'from AED 292', url: 'https://www.amazon.ae/apc-ups/s?k=apc+ups' },
    ],
    avoid: '120 V UPS models (e.g. SMX…-US). They are not for UAE mains.' },
  { id: 'casing', title: 'Cable casing (PVC trunking) & labelling', icon: 'tray',
    fn: 'A plastic channel fixed to the wall with a snap-on lid; the cables lie inside it. Here the cables reach mark 2 through a PVC conduit in the ceiling, come down behind the wall, and the casing carries them along the desk wall to each desk and up the wall to AP1. Labels make every cable traceable.',
    needs: ['25 × 16 mm for up to 4 Cat6, 40 × 25 mm for up to 10–12', 'Screw-fix every 500 mm (adhesive alone falls off)', 'Proper corner and tee fittings, no tight folds', 'Separate (or divided) casing from power, ≥ 300 mm apart', 'Printed labels at both ends'],
    picks: [], avoid: 'Over-filling the casing (keep 30–40 % free for a later cable), cutting the lid short at corners, and mixing data with mains cables in one channel.' },
  { id: 'labour', title: 'Labour & testing', icon: 'tools',
    fn: 'Installation, termination, testing, configuration and handover by an installer. Ask for a line-by-line price against this BOQ.',
    needs: ['Installer used to surface casing work', 'Cable tester (wire map + length) at minimum', 'Certification tester if a warranty is required'], picks: [], avoid: 'Quotes that do not name the cable brand or say whether testing is included.' },
];

export const BOQ_SOURCES = [
  ['Cat6 305 m box', 'OPTERNET bare copper AED 342 (Amazon.ae); D-Link AED 479.99 and Schneider AED 934.32 (noon)', 'https://www.amazon.ae/OPTERNET-CABLE-0-56MM-COPPER-CAT6LSZH23AWGUTPBC3903/dp/B0DCG5MYVD'],
  ['Patch panel', 'D-Link loaded 24-port AED 141.55 (noon); Araneae Dubai AED 159 excl. VAT. A blank 24-port keystone panel costs about the same', 'https://www.noon.com/uae-en/24-port-cat-6-utp-loaded-patch-panel-black/N44149082A/p/'],
  ['16-port PoE+ switch (upgrade F.3)', 'TP-Link TL-SG1218MP AED 469; TL-SG1218MPE AED 475 – 505 (Amazon.ae)', 'https://www.amazon.ae/TP-Link-TL-SG1218MPE-16-Port-Gigabit-Rackmount/dp/B07YL7C6HP'],
  ['12U cabinet', 'Plan sheet listing (Amazon.ae) — price to be checked', SHEET_URL.cabinet],
  ['Patch panel (sheet)', 'VENTION fully loaded 24-port — plan sheet listing', SHEET_URL.panel],
  ['Cable manager', 'Taradhin 1U 24-slot — plan sheet listing', SHEET_URL.cm],
  ['Wire labels', '540 pcs labelling kit — plan sheet listing', SHEET_URL.tags],
  ['PDU', 'XForm 1U 6-way — plan sheet listing', SHEET_URL.pdu],
  ['1U shelf', 'GeeekPi — plan sheet listing (10-inch; buy the 19″ size)', SHEET_URL.shelf],
  ['Access point', 'UniFi 6 Lite AED 400 – 555 (Amazon.ae)', 'https://www.amazon.ae/Ubiquiti-Networks-Adapter-Included-U6-Lite/dp/B08T6CKG5B'],
  ['UPS', 'APC SMC1000I AED 1,340 (Amazon.ae)', 'https://www.amazon.ae/APC-Smart-UPS-1000VA-230V-SMC1000I/dp/B07N6PGXBR'],
  ['Labour per run', 'USD 100 – 350 per point incl. materials (generic guide); UK £60 – £150 supplied & installed', 'https://latestcost.com/network-cabling-cost-per-point/'],
];
