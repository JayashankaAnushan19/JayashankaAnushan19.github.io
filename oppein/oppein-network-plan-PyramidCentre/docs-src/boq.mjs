// BOQ, functional descriptions and market product suggestions.
// Rates: AED excl. VAT, budget estimates from UAE web listings seen 17 Oct 2026.
import { DEVICES, RUNS, OUTLETS, BOXES, TOTAL_M, POE, CASING_SIZES, CASING_M, CONDUIT_M, PANEL, LOCAL, SWITCHES, SPARE, inCabinet } from './data.mjs';

export const VAT_PCT = 5;
export const CONTINGENCY_PCT = 10;
export const CURRENCY = 'AED';
export const PRICE_DATE = '17 Oct 2026';

const CEIL = DEVICES.filter(d => d.ceil).length;
const WALL = OUTLETS - CEIL;
const RUN_N = RUNS.length;
// cable ends that terminate beside a switch (runs leaving a switch + runs arriving at a switch)
const LINKS = SWITCHES.filter(s => s.from).length; // router → SW0, SW0 → SW1, SW0 → SW2 (patch cords in the cabinet)
const feeds = id => DEVICES.filter(d => d.on === id).map(d => d.id).concat(SWITCHES.filter(s => s.from === id).map(s => s.id)).join(', ');
const casing = size => CASING_SIZES.find(c => c.size === size) || { lengths: 0, m: 0 };
const C25 = casing('25 × 16 mm'), C40 = casing('40 × 25 mm');

// [description, unit, qty, rate, function (what it does here), rate basis, guide anchor]
export const BOQ = [
  { code: 'A', title: 'Cabling & casing', items: [
    ['Cat6 U/UTP cable, 23 AWG solid bare copper, LSZH — 305 m box', 'box', BOXES, 480,
      `Carries data from the router and switches to every device. ${TOTAL_M} m needed for ${RUN_N} runs.`, 'Amazon.ae / noon: AED 342 – 480 for bare-copper boxes', 'cable'],
    ['Cat6 keystone jack', 'pc', RUN_N * 2, 15, 'Terminates both ends of every run: in a surface box, or on the cabinet patch panel.', 'CableCreation 10-pack on Amazon.ae', 'outlets'],
    ['Surface box 1× RJ45 (device end)', 'pc', OUTLETS, 15, `One at each device: ${WALL} on the casing at desks, ${CEIL} next to the APs.`, 'Trade price', 'outlets'],
    ['PVC casing (trunking) 25 × 16 mm, screw-fix, 2 m lengths', 'length', C25.lengths, 12, `Main route, branches and AP drops along the walls (${Math.round(C25.m)} m + 10 % offcuts). Holds up to 4 Cat6.`, 'Trade price, Dubai', 'casing'],
    ['PVC casing (trunking) 40 × 25 mm, 2 m lengths', 'length', Math.max(1, C40.lengths), 22, 'Short run beside SW2, where 6 cables share one casing.', 'Trade price, Dubai', 'casing'],
    ['PVC conduit 20 mm, 3 m lengths, with bends, couplers and saddles (ceiling)', 'length', Math.ceil(CONDUIT_M * 1.1 / 3), 12, `Cabinet → mark 2 and mark 2 → AP2 above the ceiling (${Math.round(CONDUIT_M)} m). Set to 0 if the existing pipe is reused.`, 'Trade price, Dubai', 'casing'],
    ['Casing fittings: internal / external corners, tees, end caps, flat bends', 'lot', 1, 120, 'Keeps the bend radius at corners and closes the ends neatly.', 'Allowance', 'casing'],
    ['Screws, plugs & sundries for casing (fix every 500 mm)', 'lot', 1, 60, 'Adhesive alone does not hold on painted walls in the heat.', '', 'casing'],
    ['Cable labels, printed, both ends', 'pc', RUN_N * 2, 2, `Identifies every cable (${RUNS[0].cable} … ${RUNS.at(-1).cable}) for fault-finding.`, '', 'casing'],
    ['Velcro ties & sundries', 'lot', 1, 50, 'Bundling inside the cabinet and behind the switches.', '', 'casing'],
  ]},
  { code: 'B', title: 'Cabinet (router & ONT)', items: [
    ['19″ 9U wall-mount cabinet, glass door, lock, fan', 'pc', 1, 280, 'Secure, ventilated home for the ONT, router and SW0 in the IT Room, with 4U spare.', 'Trade estimate; 16U Digitus is AED 234 on Amazon.ae, 9U is usually less', 'cabinet'],
    ['24-port Cat6 keystone patch panel, 1U (blank, uses keystones from A.2)', 'pc', 1, 80, `Fixed end for the ${PANEL.length} cables that start in the cabinet (${PANEL.map(p => p.run.toId).join(', ')}).`, 'Trade price', 'cabinet'],
    ['1U cantilever shelf', 'pc', 1, 45, 'Holds the non-rackmount ONT and router.', '', 'cabinet'],
    ['PDU 6-way 230 V, 1U', 'pc', 1, 75, 'Distributes power to everything in the cabinet.', '', 'cabinet'],
    ['Blank panel 1U', 'pc', 4, 15, 'Closes the 4 spare slots so the fan airflow works.', '', 'cabinet'],
  ]},
  { code: 'C', title: 'Active equipment', items: [
    ['SW0 — 8-port Gigabit switch, unmanaged, metal (rack ears or on a 1U shelf)', 'pc', 1, 110, `In the cabinet. Fed from router L1; feeds ${feeds('SW0')}. ${SPARE.SW0.length} ports spare.`, 'Trade estimate; confirm with supplier. Decision D-03', 'switch'],
    ['SW1 — 5-port Gigabit desktop switch, unmanaged (existing)', 'pc', 1, 0, `In the cabinet (switch shelf). Fed from SW0; feeds ${feeds('SW1')}.`, 'Existing unit — enter a rate only if buying new', 'switch'],
    ['SW2 — 8-port Gigabit desktop switch, unmanaged (existing)', 'pc', 1, 0, `In the cabinet (switch shelf). Fed from SW0; feeds ${feeds('SW2')}.`, 'Existing unit — enter a rate only if buying new', 'switch'],
    ['Wi-Fi 6 ceiling access point, PoE (e.g. UniFi U6 Lite / U6+)', 'pc', 2, 450, 'Wireless coverage for laptops and phones in Showroom (AP1) and Design (AP2).', 'Amazon.ae U6 Lite AED 400 – 555', 'ap'],
    ['PoE+ injector, Gigabit, 802.3at (30 W)', 'pc', POE, 45, 'Powers each AP over its cable, because SW1 and SW2 give no PoE. Not needed if the AP comes with its own PoE adapter.', 'Trade price; check the AP box first', 'injector'],
  ]},
  { code: 'D', title: 'Patching', items: [
    ['Cat6 patch cord 0.5 m (cabinet)', 'pc', PANEL.length - 1 + LINKS + POE, 15, 'Panel port → switch port for every cable, router → SW0, SW0 → SW1 / SW2, and switch → PoE injector.', 'D-Link 0.5 m AED 19.90 on Amazon.ae', 'patch'],
    ['Cat6 patch cord 2 m (devices)', 'pc', WALL - 1, 20, 'Surface box → PC / printer / mobile at each desk.', '', 'patch'],
    ['RJ11 – RJ45 phone cord', 'pc', 2, 10, 'ONT TEL1 → phone-line panel port, and the phone socket at desk 5 → the phone.', '', 'patch'],
    ['Cat6 patch cord 0.5 m (router L1 → SW0 P1)', 'pc', 1, 15, 'Connects the router to the cabinet switch.', '', 'patch'],
    ['Cat6 patch cord 1 m (injector → patch panel)', 'pc', POE, 15, 'PoE injector out → the AP cable on the patch panel.', '', 'patch'],
    ['Cat6 patch cord 0.5 m — spares', 'pc', 4, 15, 'For moves and fault-finding.', '', 'patch'],
  ]},
  { code: 'E', title: 'Labour & services', items: [
    ['Install, lay, terminate & label Cat6 run (both ends)', 'run', RUN_N, 100, 'Installer labour per cable run (casing work is separate).', 'Typical small-office contractor rate', 'labour'],
    ['Fix PVC casing incl. fittings and lids', 'm', Math.ceil(CASING_M), 15, 'Measure, cut, screw-fix and fit lids along the route.', '', 'labour'],
    ['Ceiling conduit: fix or check, pull draw wire', 'm', Math.ceil(CONDUIT_M), 12, 'Ceiling access, fixing above the tiles. Lower if the existing pipe is reused.', '', 'labour'],
    ['Cabinet fit-out: shelf, patch panel, PDU, dress cables', 'lot', 1, 250, 'Cabinet build for the router and ONT.', '', 'labour'],
    ['Test every link + test report', 'run', RUN_N, 30, 'Wire map and length test with a written record (DOC 09).', 'Certification is item F.2', 'labour'],
    ['Configure router & Wi-Fi; fit switches and injectors; commissioning', 'lot', 1, 450, 'IP plan, SSIDs, firmware, passwords; every device checked online.', '', 'labour'],
    ['As-built documentation & handover', 'lot', 1, 250, 'Updates this pack with real positions and measured lengths.', '', 'labour'],
  ]},
  { code: 'F', title: 'Optional items', optional: true, items: [
    ['UPS 1000 VA line-interactive, pure sine (e.g. APC SMC1000I)', 'pc', 1, 1340, 'Keeps the router and ONT running through short power cuts. The desk switches and injectors need their own small UPS to stay up too.', 'Amazon.ae AED 1,340. Decision D-05', 'ups'],
    ['Cat6 certification test (Fluke DSX) per link', 'run', RUN_N, 25, 'Certified Cat6 report, needed for a manufacturer warranty.', '', 'labour'],
    ['Upgrade: one 16-port PoE+ switch (e.g. TP-Link TL-SG1218MPE) to replace SW1 + SW2 + injectors', 'pc', 1, 500, 'One switch, PoE for the APs, VLAN for guest Wi-Fi and spare ports. Decision D-03.', 'Amazon.ae AED 469 – 505', 'upgrade'],
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
  { id: 'switch', title: 'Switches (SW0 rack, SW1 5-port, SW2 8-port)', icon: 'switch',
    fn: 'Plain unmanaged Gigabit switches, all on one shelf in the cabinet. The router feeds SW0 (new 8-port); SW0 feeds the existing SW1 (5-port) and SW2 (8-port) with short patch cords. Every device cable lands on the patch panel and is patched to its switch port. None of them give PoE, so the APs use injectors.',
    needs: ['Gigabit (10/100/1000) on every port', 'All three fit side by side on one 1U shelf (about 440 mm wide in total)', 'Metal case preferred (cabinet heat)', 'Each power adapter on the cabinet PDU', 'Same make for both switches is easiest'],
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
    needs: ['19″ 9U wall-mount (holds everything + 4U spare), glass door, lock', '≥ 450 mm deep (600 mm if the router is large)', 'Fan + vented sides', '24-port Cat6 patch panel (keystone or loaded)'],
    picks: [
      { tag: 'Recommended', name: 'D-Link 24-port Cat6 UTP loaded patch panel (NPP-C61BLK241)', store: 'noon', price: 'AED 141.55', url: 'https://www.noon.com/uae-en/24-port-cat-6-utp-loaded-patch-panel-black/N44149082A/p/' },
      { tag: 'Alternative', name: 'VENTION Cat6 UTP 24-port keystone patch panel (KGCB0)', store: 'noon', price: 'AED 123.55', url: 'https://www.noon.com/uae-en/vention-cat-6-utp-24-ports-keystone-patch-panel-black-model-kgcb0/Z37C3524980E8232FBC39Z/p/' },
    ],
    avoid: 'FTP / STP (shielded) patch panels with UTP cable. Shielding only works if the whole system is shielded and earthed.' },
  { id: 'outlets', title: 'Outlets: keystones & surface boxes', icon: 'outlet',
    fn: 'The socket at each end of a run. The keystone jack terminates the Cat6 cable; the surface box holds it at the end of the casing, so no wall box is needed. It must be Cat6-rated, or the whole link drops to the lower grade.',
    needs: ['Cat6 keystone, T568B', 'Surface-mount box (1-port at devices, 2-port at switches) with label window', 'Same brand as cable if possible'],
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
    needs: ['16 × 1 GbE PoE+ (802.3at, 30 W / port)', `PoE budget ≥ 150 W (${POE} PoE devices + growth)`, 'Rackmount ears (fits the spare 4U in the cabinet)', 'Smart-managed (VLAN) preferred'],
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
  ['Wall cabinet', 'Digitus 16U 450 deep AED 234.17 (Amazon.ae) — a 9U is smaller and usually cheaper', 'https://www.amazon.ae/mounting-cabinet-Dynamic-789x600x450-color/dp/B001HZBR4A'],
  ['Access point', 'UniFi 6 Lite AED 400 – 555 (Amazon.ae)', 'https://www.amazon.ae/Ubiquiti-Networks-Adapter-Included-U6-Lite/dp/B08T6CKG5B'],
  ['UPS', 'APC SMC1000I AED 1,340 (Amazon.ae)', 'https://www.amazon.ae/APC-Smart-UPS-1000VA-230V-SMC1000I/dp/B07N6PGXBR'],
  ['Labour per run', 'USD 100 – 350 per point incl. materials (generic guide); UK £60 – £150 supplied & installed', 'https://latestcost.com/network-cabling-cost-per-point/'],
];
