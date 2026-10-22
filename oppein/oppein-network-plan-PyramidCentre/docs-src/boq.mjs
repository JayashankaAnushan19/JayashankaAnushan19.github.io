// BOQ, functional descriptions and market product suggestions.
// Rates: AED excl. VAT, budget estimates from UAE web listings seen 17 Oct 2026.
import { DEVICES, OUTLETS, BOXES, TOTAL_M, TRAY_M, BY_PORT, POE } from './data.mjs';

export const VAT_PCT = 5;
export const CONTINGENCY_PCT = 10;
export const CURRENCY = 'AED';
export const PRICE_DATE = '17 Oct 2026';

const CEIL = DEVICES.filter(d => d.ceil).length;
const WALL = OUTLETS - CEIL;
const DESK_CORDS = DEVICES.filter(d => !d.ceil && !d.local).length;
const TRAY = Math.ceil(TRAY_M) + 2;

// [description, unit, qty, rate, function (what it does here), rate basis, guide anchor]
export const BOQ = [
  { code: 'A', title: 'Cabling & containment', items: [
    ['Cat6 U/UTP cable, 23 AWG solid bare copper, LSZH — 305 m box', 'box', BOXES, 480,
      `Carries data (and PoE power) from the cabinet to every outlet. ${TOTAL_M} m needed.`, 'Amazon.ae / noon: AED 342 – 480 for bare-copper boxes', 'cable'],
    ['Cat6 keystone jack', 'pc', OUTLETS, 15, 'Terminates the cable at each outlet and gives the RJ45 socket.', 'CableCreation 10-pack on Amazon.ae', 'outlets'],
    ['Single-gang faceplate 1× RJ45 (wall)', 'pc', WALL, 12, 'Holds the keystone in the wall box at desks.', 'Amazon.ae single plates AED 25 – 70 retail; trade lower', 'outlets'],
    ['Surface mount box 1× RJ45 (ceiling, AP)', 'pc', CEIL, 15, 'Outlet above the ceiling next to each access point.', 'Trade price', 'outlets'],
    ['Ceiling cable tray / J-hooks incl. fixings', 'm', TRAY, 35, 'Supports the bundle across the ceiling so cables never lie on tiles.', 'Trade price', 'containment'],
    ['PVC trunking / conduit for wall drops', 'm', WALL * 3, 8, 'Protects and hides the vertical drop from ceiling to outlet.', '≈ 3 m per wall outlet', 'containment'],
    ['Cable labels, printed, both ends', 'pc', DEVICES.length * 2, 2, `Identifies every cable (${BY_PORT[0].cable} … ${BY_PORT.at(-1).cable}) for fault-finding.`, '', 'containment'],
    ['Velcro ties & sundries', 'lot', 1, 80, 'Bundling without crushing the cable pairs.', '', 'containment'],
  ]},
  { code: 'B', title: 'Cabinet & passive', items: [
    ['19″ 16U wall-mount cabinet, glass door, lock, fan', 'pc', 1, 450, 'Secure, ventilated home for the switch, patch panel, router and ONT.', 'Digitus 16U AED 234 (450 deep) on Amazon.ae; 600 deep + fan higher', 'cabinet'],
    ['24-port Cat6 patch panel, loaded, 1U', 'pc', 1, 150, `Fixed termination point for all ${DEVICES.length} home runs; patch cords connect it to the switch.`, 'D-Link loaded panel AED 141.55 on noon', 'cabinet'],
    ['1U horizontal cable manager', 'pc', 2, 40, 'Keeps the short patch cords tidy between panel and switch.', '', 'cabinet'],
    ['1U cantilever shelf', 'pc', 1, 45, 'Holds the non-rackmount ONT and router.', '', 'cabinet'],
    ['PDU 8-way 230 V, 1U', 'pc', 1, 90, 'Distributes power to everything in the cabinet.', '', 'cabinet'],
    ['Brush cable-entry panel 1U', 'pc', 1, 45, 'Lets cables in at the top while keeping dust out.', '', 'cabinet'],
    ['Blank panel 1U', 'pc', 4, 15, 'Closes empty slots so the fan airflow works.', '', 'cabinet'],
  ]},
  { code: 'C', title: 'Active equipment', items: [
    ['16-port Gigabit PoE+ switch, rackmount, smart-managed (e.g. TP-Link TL-SG1218MPE)', 'pc', 1, 500,
      `Connects every device and powers the ${POE} PoE devices over the cable. VLAN support for guest Wi-Fi.`, 'Amazon.ae AED 469 – 505', 'switch'],
    ['Wi-Fi 6 ceiling access point, PoE (e.g. UniFi U6 Lite / U6+)', 'pc', 2, 450, 'Wireless coverage for laptops and phones in Showroom (AP1) and Design (AP2).', 'Amazon.ae U6 Lite AED 400 – 555', 'ap'],
  ]},
  { code: 'D', title: 'Patching', items: [
    ['Cat6 patch cord 0.5 m (cabinet)', 'pc', DEVICES.length + 1, 15, 'Links each patch-panel port to the same switch port (incl. router uplink).', 'D-Link 0.5 m AED 19.90 on Amazon.ae', 'patch'],
    ['Cat6 patch cord 2 m (desk)', 'pc', DESK_CORDS, 20, 'Links the wall outlet to the PC, printer or phone.', '', 'patch'],
    ['Cat6 patch cord 0.5 m — spares', 'pc', 4, 15, 'For moves and fault-finding.', '', 'patch'],
  ]},
  { code: 'E', title: 'Labour & services', items: [
    ['Install, pull, terminate & label Cat6 point (both ends)', 'point', DEVICES.length, 120, 'Installer labour per home run.', 'Typical small-office contractor rate', 'labour'],
    ['Install ceiling tray / J-hooks and wall trunking', 'm', TRAY + WALL * 3, 20, 'Containment labour.', '', 'labour'],
    ['Mount cabinet, dress cables, fit panels & PDU', 'lot', 1, 400, 'Cabinet build and cable dressing.', '', 'labour'],
    ['Test every link + test report', 'point', DEVICES.length, 30, 'Wire map and length test with a written record (DOC 09).', 'Certification is item F.2', 'labour'],
    ['Configure router, switch & Wi-Fi; commissioning', 'lot', 1, 600, 'IP plan, VLANs, SSIDs, firmware, passwords.', '', 'labour'],
    ['As-built documentation & handover', 'lot', 1, 250, 'Updates this pack with real positions and measured lengths.', '', 'labour'],
  ]},
  { code: 'F', title: 'Optional items', optional: true, items: [
    ['UPS 1000 VA line-interactive, pure sine (e.g. APC SMC1000I)', 'pc', 1, 1340, 'Keeps internet, switch and Wi-Fi running through short power cuts.', 'Amazon.ae AED 1,340. Decision D-05', 'ups'],
    ['Cat6 certification test (Fluke DSX) per link', 'point', DEVICES.length, 25, 'Certified Cat6 report, needed for a manufacturer warranty.', '', 'labour'],
  ]},
];

// Functional guide + where to buy. Prices = what the listing showed on PRICE_DATE (may change).
export const GUIDE = [
  { id: 'cable', title: 'Cat6 cable', icon: 'cable',
    fn: 'The permanent link between the cabinet and each outlet. Each run carries 1 Gbps data, and on the AP and mobile runs it also carries up to 30 W of PoE power.',
    needs: ['Cat6 U/UTP, 23 AWG', 'Solid bare copper (BC), never CCA', 'LSZH jacket for indoor ceilings', '305 m box (pull-box)'],
    picks: [
      { tag: 'Recommended', name: 'OPTERNET Cat6 23 AWG UTP, LSZH, 100 % bare copper, 305 m', store: 'amazon', price: 'AED 342', url: 'https://www.amazon.ae/OPTERNET-CABLE-0-56MM-COPPER-CAT6LSZH23AWGUTPBC3903/dp/B0DCG5MYVD' },
      { tag: 'Brand', name: 'D-Link Cat6 UTP cable roll, 305 m', store: 'noon', price: 'AED 479.99', url: 'https://www.noon.com/uae-en/cat-6-utp-cable-roll-305-meter-networking-cable/N53387021A/p/' },
      { tag: 'Premium', name: 'Belden 7965E Cat6 UTP, 23 AWG solid bare copper, 305 m', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/BELDEN-7965E-Cable-Solid-Copper/dp/B07S1GFQ89' },
      { tag: 'Premium', name: 'Schneider Cat6 UTP cable, 305 m', store: 'noon', price: 'AED 934.32', url: 'https://www.noon.com/uae-en/schneider-cat6-utp-cable-305mtr/ZDA8F694B46369B982FBBZ/p/' },
    ],
    avoid: 'Boxes marked "CCA" (copper-clad aluminium), e.g. many AED 170 – 300 listings. CCA has about 55 % more resistance, so PoE devices can brown out. It also fails Cat6 certification and is not allowed by the standard.' },
  { id: 'switch', title: 'PoE+ switch', icon: 'switch',
    fn: 'The centre of the network. Every cable ends on a switch port. It powers the access points and the mobile point through the cable (PoE), so they need no power socket. A smart-managed model can separate guest Wi-Fi with a VLAN.',
    needs: ['16 × 1 GbE PoE+ (802.3at, 30 W / port)', `PoE budget ≥ 150 W (${POE} PoE devices + growth)`, 'Rackmount ears for the 16U cabinet', 'Smart-managed (VLAN) preferred'],
    picks: [
      { tag: 'Recommended', name: 'TP-Link TL-SG1218MPE — 16 PoE+ + 2 GbE + 2 SFP, 250 W, Easy Smart (VLAN)', store: 'amazon', price: 'AED 475 – 505', url: 'https://www.amazon.ae/TP-Link-TL-SG1218MPE-16-Port-Gigabit-Rackmount/dp/B07YL7C6HP' },
      { tag: 'Budget', name: 'TP-Link TL-SG1218MP — 16 PoE+, 250 W, unmanaged', store: 'amazon', price: 'AED 469', url: 'https://www.amazon.ae/TP-Link-TL-SG1218MP-18-Port-Gigabit-Rackmount/dp/B0895VWGF5' },
      { tag: 'Alternative', name: 'TP-Link / Omada switches (incl. SG2218P, 16 PoE+, 150 W, managed)', store: 'noon', price: 'see store', url: 'https://www.noon.com/uae-en/electronics-and-mobiles/computers-and-accessories/networking-products-16523/switches-22460/tp_link/' },
    ],
    avoid: 'A "16-port with 8 PoE" switch only powers half the ports, and an 802.3af-only switch gives 15 W per port, which is not enough for Wi-Fi 6 APs.' },
  { id: 'ap', title: 'Wi-Fi access points', icon: 'wifi',
    fn: 'Ceiling-mounted radios that give wireless access to laptops, phones and tablets. AP1 covers the Showroom and AP2 the Design area. They run on PoE from the switch and use one app or controller.',
    needs: ['Wi-Fi 6 (802.11ax), dual band', 'PoE powered, ceiling mount kit', 'Same brand for all APs (seamless roaming)', 'Guest SSID with client isolation'],
    picks: [
      { tag: 'Recommended', name: 'Ubiquiti UniFi 6 Lite (U6-Lite) — 2×2 Wi-Fi 6, PoE', store: 'amazon', price: 'AED 400 – 555', url: 'https://www.amazon.ae/Ubiquiti-Networks-Adapter-Included-U6-Lite/dp/B08T6CKG5B' },
      { tag: 'Step up', name: 'Ubiquiti UniFi U6+ — Wi-Fi 6, 300+ clients, ceiling/wall kit', store: 'noon', price: 'check listing', url: 'https://www.noon.com/uae-en/networks-unifi-u6-dual-band-wi-fi-6-access-point-wi-fi-6-standard-up-2402mbps-wpa3-300-clients-ceiling-wall-mount-kit-poe-adapter-not-included-u6-white/N70040300V/p/' },
      { tag: 'Store', name: 'Ubiquiti store on noon UAE (U6 Mesh, U6-IW and others)', store: 'noon', price: 'AED 729 – 899', url: 'https://www.noon.com/uae-en/ubiquiti/' },
    ],
    avoid: 'Buying a PoE injector is not needed. The PoE+ switch powers the APs. Check that the listing is the international (not "-US") model.' },
  { id: 'cabinet', title: 'Cabinet & patch panel', icon: 'rack',
    fn: `The cabinet protects and ventilates the equipment and keeps it locked. The patch panel is where all ${DEVICES.length} cables end permanently, so moves are done with patch cords, not by re-terminating cables.`,
    needs: ['19″ 16U wall-mount, glass door, lock', '≥ 450 mm deep (600 mm if the router is large)', 'Fan + vented sides', 'Loaded 24-port Cat6 UTP patch panel'],
    picks: [
      { tag: 'Recommended', name: 'Digitus 16U wall cabinet 789×600×450 mm, glass door, grey (600 deep option)', store: 'amazon', price: 'AED 234', url: 'https://www.amazon.ae/mounting-cabinet-Dynamic-789x600x450-color/dp/B001HZBR4A' },
      { tag: 'Deeper', name: 'Digitus 16U wall cabinet 789×600×600 mm, black', store: 'amazon', price: 'check stock', url: 'https://www.amazon.ae/mounting-cabinet-789x600x600-color-black/dp/B08GM41QQG' },
      { tag: 'Recommended', name: 'D-Link 24-port Cat6 UTP loaded patch panel (NPP-C61BLK241)', store: 'noon', price: 'AED 141.55', url: 'https://www.noon.com/uae-en/24-port-cat-6-utp-loaded-patch-panel-black/N44149082A/p/' },
      { tag: 'Alternative', name: 'VENTION Cat6 UTP 24-port keystone patch panel (KGCB0)', store: 'noon', price: 'AED 123.55', url: 'https://www.noon.com/uae-en/vention-cat-6-utp-24-ports-keystone-patch-panel-black-model-kgcb0/Z37C3524980E8232FBC39Z/p/' },
    ],
    avoid: 'FTP / STP (shielded) patch panels with UTP cable. Shielding only works if the whole system is shielded and earthed.' },
  { id: 'outlets', title: 'Outlets: keystones & faceplates', icon: 'outlet',
    fn: 'The socket the user plugs into. The keystone jack terminates the Cat6 cable; the faceplate holds it in the wall box. It must be Cat6-rated, or the whole link drops to the lower grade.',
    needs: ['Cat6 keystone, T568B', 'UK-size single faceplate (86 mm) with label window', 'Same brand as cable if possible'],
    picks: [
      { tag: 'Recommended', name: 'CableCreation Cat6 keystone jacks, 10-pack (UL listed)', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/CableCreation-Keystone-10-Pack-Ethernet-Connectors/dp/B01FHC1HXO' },
      { tag: 'Kit', name: 'LEENUE Cat6 single faceplate with keystone jack', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/LEENUE-Ethernet-Faceplate-Network-Keystone/dp/B091D4PMCJ' },
      { tag: 'Kit', name: 'VCELINK Cat6 single wall socket with keystone', store: 'amazon', price: 'check listing', url: 'https://www.amazon.ae/VCELINK-Ethernet-Keystone-Faceplate-Network/dp/B08JYMGSCM' },
    ],
    avoid: 'Cat5e keystones on Cat6 cable. They cap the link at Cat5e.' },
  { id: 'patch', title: 'Patch cords', icon: 'patch',
    fn: 'Short, flexible factory-made leads: 0.5 m in the cabinet (patch panel → switch) and 2 m at the desk (outlet → device).',
    needs: ['Cat6, factory moulded', 'Stranded copper', 'Colour by device type (see DOC 03)'],
    picks: [
      { tag: 'Recommended', name: 'D-Link Cat6 UTP patch cord 0.5 m', store: 'amazon', price: 'AED 19.90', url: 'https://www.amazon.ae/D-Link-Cat6-Patch-Ethernet-Cable/dp/B07MCR3V3L' },
      { tag: 'Search', name: 'Cat6 UTP patch cords — all lengths', store: 'amazon', price: 'various', url: 'https://www.amazon.ae/patch-cord-cable-utp-cat6/s?k=patch+cord+cable+utp+cat6' },
    ],
    avoid: '"0.5 ft" packs. They are 15 cm, too short for patching between the panel and switch.' },
  { id: 'ups', title: 'UPS (optional)', icon: 'ups',
    fn: 'Battery backup for the cabinet. During a power cut it keeps internet, Wi-Fi and the switch alive for several minutes. It also cleans spikes, which protects the equipment.',
    needs: ['1000 VA line-interactive', 'Pure sine wave', '230 V model (not 120 V)', 'Rack or tower'],
    picks: [
      { tag: 'Recommended', name: 'APC Smart-UPS 1000VA LCD 230 V (SMC1000I)', store: 'amazon', price: 'AED 1,340', url: 'https://www.amazon.ae/APC-Smart-UPS-1000VA-230V-SMC1000I/dp/B07N6PGXBR' },
      { tag: 'Budget', name: 'APC UPS range (incl. Easy UPS BV 1000VA tower ≈ AED 292)', store: 'amazon', price: 'from AED 292', url: 'https://www.amazon.ae/apc-ups/s?k=apc+ups' },
    ],
    avoid: '120 V UPS models (e.g. SMX…-US). They are not for UAE mains.' },
  { id: 'containment', title: 'Containment & labelling', icon: 'tray',
    fn: 'Tray, J-hooks and trunking carry the cables safely. Labels make every cable traceable. Containment is usually supplied by the installer at trade price.',
    needs: ['Ceiling tray or J-hooks every 1.2 – 1.5 m', 'PVC trunking for drops', 'Printed labels both ends'], picks: [], avoid: 'Cable ties pulled tight, and cables laid directly on ceiling tiles.' },
  { id: 'labour', title: 'Labour & testing', icon: 'tools',
    fn: 'Installation, termination, testing, configuration and handover by an installer. Ask for a line-by-line price against this BOQ.',
    needs: ['Experienced structured-cabling installer', 'Cable tester (wire map + length) at minimum', 'Certification tester if a warranty is required'], picks: [], avoid: 'Quotes that do not name the cable brand or say whether testing is included.' },
];

export const BOQ_SOURCES = [
  ['Cat6 305 m box', 'OPTERNET bare copper AED 342 (Amazon.ae); D-Link AED 479.99 and Schneider AED 934.32 (noon)', 'https://www.amazon.ae/OPTERNET-CABLE-0-56MM-COPPER-CAT6LSZH23AWGUTPBC3903/dp/B0DCG5MYVD'],
  ['24-port patch panel', 'D-Link loaded AED 141.55 (noon); Araneae Dubai AED 159 excl. VAT', 'https://www.noon.com/uae-en/24-port-cat-6-utp-loaded-patch-panel-black/N44149082A/p/'],
  ['PoE+ switch', 'TP-Link TL-SG1218MP AED 469; TL-SG1218MPE AED 475 – 505 (Amazon.ae)', 'https://www.amazon.ae/TP-Link-TL-SG1218MPE-16-Port-Gigabit-Rackmount/dp/B07YL7C6HP'],
  ['16U cabinet', 'Digitus 16U 450 deep AED 234.17 (Amazon.ae); add fan / 600 mm depth', 'https://www.amazon.ae/mounting-cabinet-Dynamic-789x600x450-color/dp/B001HZBR4A'],
  ['Access point', 'UniFi 6 Lite AED 400 – 555 (Amazon.ae)', 'https://www.amazon.ae/Ubiquiti-Networks-Adapter-Included-U6-Lite/dp/B08T6CKG5B'],
  ['UPS', 'APC SMC1000I AED 1,340 (Amazon.ae)', 'https://www.amazon.ae/APC-Smart-UPS-1000VA-230V-SMC1000I/dp/B07N6PGXBR'],
  ['Labour per point', 'USD 100 – 350 per point incl. materials (generic guide); UK £60 – £150 supplied & installed', 'https://latestcost.com/network-cabling-cost-per-point/'],
];
