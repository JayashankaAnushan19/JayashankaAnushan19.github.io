// Single source of truth for the Office 14 documentation.
// Positions are in drawing units (pt) on the traced floor plan; MM_PER_PT converts to real size.

export const META = {
  project: 'Office 14 — Structured Cabling & Network',
  site: 'Pyramid Centre · Office 14',
  rev: 'Rev A',
  date: '2026-10-16',
  status: 'Draft — for review',
  author: 'Jayashanka · OPPEIN IT',
};

export const MM_PER_PT = 9.27; // from the 1800 mm / 5199 mm dimensions on the drawing
export const BOUNDS = { x: 430, y: 50, w: 1560, h: 1560 };
export const RACK = { x: 1760, y: 1500 };
// Ceiling tray: cabinet → exit above IT Room door → J1 … J5
export const TRUNK = [
  { x: 1760, y: 1500 }, { x: 1560, y: 1434 }, { x: 1440, y: 1320 }, { x: 1080, y: 996 },
  { x: 912, y: 768 }, { x: 768, y: 564 }, { x: 624, y: 420 },
];
export const JUNCTION_NOTES = {
  J1: 'Tray bend (no outlet)',
  J2: 'Showroom desk branch (1500 mm desk)',
  J3: 'Showroom ceiling AP',
  J4: 'Design area — centre',
  J5: 'Design area — window-wall end',
};

export const TYPE_NAME = {
  ap: 'Wi-Fi access point', pc: 'Workstation PC', srv: 'Server PC', prn: 'Network printer', ph: 'Mobile / phone point',
};
export const TYPE_COLOR = { ap: 'var(--c-ap)', pc: 'var(--c-pc)', srv: 'var(--c-srv)', prn: 'var(--c-prn)', ph: 'var(--c-ph)' };

export const DEVICES = [
  { id: 'AP1', port: 1, type: 'ap', zone: 'Showroom', name: 'Access Point 1', x: 840, y: 912, poe: true, ceil: true },
  { id: 'AP2', port: 2, type: 'ap', zone: 'Design', name: 'Access Point 2', x: 835, y: 455, poe: true, ceil: true },
  { id: 'PC1', port: 3, type: 'pc', zone: 'Design', name: 'PC 1', x: 703, y: 343 },
  { id: 'PC2', port: 4, type: 'pc', zone: 'Design', name: 'PC 2', x: 763, y: 283 },
  { id: 'PC3', port: 5, type: 'pc', zone: 'Design', name: 'PC 3', x: 941, y: 581 },
  { id: 'PC4', port: 6, type: 'pc', zone: 'Design', name: 'PC 4', x: 1001, y: 521 },
  { id: 'PC5', port: 7, type: 'pc', zone: 'Design', name: 'PC 5', x: 898, y: 398 },
  { id: 'PRN', port: 8, type: 'prn', zone: 'Design', name: 'Printer', x: 600, y: 300 },
  { id: 'MOB', port: 9, type: 'ph', zone: 'Design', name: 'Mobile point', x: 715, y: 465, poe: true },
  { id: 'PC6', port: 10, type: 'pc', zone: 'Showroom', name: 'PC 6', x: 935, y: 1112 },
  { id: 'PC7', port: 11, type: 'srv', zone: 'IT Room', name: 'PC 7 · Server', x: 1640, y: 1500, local: true },
  { id: 'PC8', port: 12, type: 'pc', zone: 'Showroom', name: 'PC 8', x: 1082, y: 1112 },
];
export const UPLINK_PORT = 13;

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const polyLen = p => p.slice(1).reduce((s, q, i) => s + dist(p[i], q), 0);

// Same rule as the interactive plan: tray to nearest junction, then straight to the outlet;
// + 2.0 m rack drop + outlet drop (0.6 ceiling / 2.5 wall / 0.5 local) + 10 % slack, rounded up.
for (const d of DEVICES) {
  let path, junction = '—';
  if (d.local) path = [RACK, { x: RACK.x, y: d.y }, { x: d.x, y: d.y }];
  else {
    let best = 2, bd = Infinity;
    for (let i = 2; i < TRUNK.length; i++) { const dd = dist(TRUNK[i], d); if (dd < bd) { bd = dd; best = i; } }
    path = TRUNK.slice(0, best + 1).concat([{ x: d.x, y: d.y }]);
    junction = 'J' + (best - 1);
  }
  const trayM = polyLen(path) * MM_PER_PT / 1000;
  const drops = 2.0 + (d.local ? 0.5 : d.ceil ? 0.6 : 2.5);
  Object.assign(d, {
    path, junction, trayM, drops,
    est: Math.ceil((trayM + drops) * 1.10),
    cable: `C-${String(d.port).padStart(2, '0')}`,
    outlet: d.ceil ? 'Ceiling, 1× RJ45' : d.local ? 'Direct patch (IT Room)' : 'Wall, 1× RJ45 @ 300 mm',
    outletShort: d.ceil ? 'Ceiling' : d.local ? 'Direct' : 'Wall @300',
  });
}

export const BY_PORT = DEVICES.slice().sort((a, b) => a.port - b.port);
export const TOTAL_M = DEVICES.reduce((s, d) => s + d.est, 0);
export const REQUIRED_M = DEVICES.filter(d => !d.opt).reduce((s, d) => s + d.est, 0);
export const TRAY_M = polyLen(TRUNK.slice(1)) * MM_PER_PT / 1000;
export const OUTLETS = DEVICES.filter(d => !d.local).length;
export const POE = DEVICES.filter(d => d.poe).length;
export const BOXES = Math.ceil(TOTAL_M * 1.05 / 305);
export const LONGEST = DEVICES.reduce((a, b) => (b.est > a.est ? b : a));
export const SPARE_SW = [...Array(16)].map((_, i) => i + 1).filter(p => p !== UPLINK_PORT && !DEVICES.some(d => d.port === p));

export const BOM = [
  ['Cabling', 'Cat6 U/UTP solid copper cable, 305 m box (LSZH)', BOXES, 'box', `${TOTAL_M} m + 5 % waste → ${BOXES * 305 - TOTAL_M} m left over`],
  ['Cabling', 'Cat6 keystone jack', OUTLETS, 'pc', 'one per outlet'],
  ['Cabling', 'Single faceplate (wall) / surface box (ceiling)', OUTLETS, 'pc', `${DEVICES.filter(d => d.ceil).length} ceiling + ${OUTLETS - DEVICES.filter(d => d.ceil).length} wall`],
  ['Cabling', 'Cable tray / J-hooks, ceiling', Math.ceil(TRAY_M) + 2, 'm', 'IT Room → Design, incl. 2 m spare'],
  ['Cabling', 'Wire labels (both ends)', DEVICES.length * 2, 'pc', `${BY_PORT[0].cable} … ${BY_PORT.at(-1).cable}`],
  ['Cabinet', '19″ 16U wall-mount cabinet, 600 mm deep', 1, 'pc', 'with fan + glass door + lock'],
  ['Cabinet', '24-port Cat6 patch panel, 1U', 1, 'pc', `${DEVICES.length} used, ${24 - DEVICES.length} spare`],
  ['Cabinet', '1U horizontal cable manager', 2, 'pc', 'above & below switch'],
  ['Cabinet', 'Cantilever shelf 1U', 1, 'pc', 'ONT + router'],
  ['Cabinet', 'PDU 8-way 230 V, 1U', 1, 'pc', ''],
  ['Cabinet', 'Brush cable-entry panel 1U', 1, 'pc', 'top of cabinet'],
  ['Cabinet', 'Blank panels 1U', 4, 'pc', 'U3, U4, U9 + spare'],
  ['Active', '16-port Gigabit PoE+ switch (802.3at, ≥ 150 W budget)', 1, 'pc', `${POE} PoE devices + headroom`],
  ['Patching', 'Cat6 patch cord 0.5 m (cabinet)', DEVICES.length + 1, 'pc', 'incl. router uplink'],
  ['Patching', 'Cat6 patch cord 2–3 m (desk)', DEVICES.filter(d => !d.ceil && !d.local).length, 'pc', 'outlet → device'],
];
// Not in the original plan — recommended, decided under Open items.
export const BOM_EXTRA = [
  ['Line-interactive UPS, ~1 kVA (rack or tower)', 1, 'pc', 'Keeps router, switch and APs up through short power cuts', 'D-05'],
  ['Wi-Fi access points (ceiling, PoE)', 2, 'pc', 'Model not yet chosen', 'D-02'],
  ['Cat6 patch cord 0.5 m — spares', 4, 'pc', 'For moves and fault-finding', '—'],
];

export const RACK_UNITS = {
  16: ['Brush cable-entry panel', 'brush'], 15: ['Patch panel 24 × Cat6 (PP-1…24)', 'pp'], 14: ['Horizontal cable manager', 'cm'],
  13: ['PoE switch 16-port Gigabit', 'sw'], 12: ['Horizontal cable manager', 'cm'], 11: ['Shelf · ONT + router', 'shelf'],
  10: ['(shelf space)', 'shelfb'], 9: ['Blank panel', 'blank'], 8: ['Spare · future NVR / NAS', 'spare'], 7: ['Spare', 'spare'],
  6: ['Spare', 'spare'], 5: ['Spare', 'spare'], 4: ['Blank panel', 'blank'], 3: ['Blank panel', 'blank'],
  2: ['Fan tray (top-mount alternative)', 'blank'], 1: ['PDU 8-way 230 V', 'pdu'],
};

// Proposed — not decided. See open item D-01.
export const IP_PLAN = [
  ['Network', '192.168.14.0/24', 'Single flat office LAN'],
  ['Gateway / router', '192.168.14.1', 'DHCP server, firewall, NAT'],
  ['PoE switch (mgmt)', '192.168.14.2', 'Static'],
  ['Access points AP1–AP2', '192.168.14.11 – .12', 'Static or DHCP reservation'],
  ['Printer', '192.168.14.20', 'DHCP reservation'],
  ['PC 7 · Server', '192.168.14.30', 'Static'],
  ['Spare static range', '192.168.14.31 – .99', 'Future NVR, NAS, IP phones'],
  ['DHCP pool', '192.168.14.100 – .199', 'PCs, laptops, phones'],
  ['Guest Wi-Fi', 'Isolated by AP / router', 'Client isolation, internet only'],
];

export const ASSUMPTIONS = [
  ['A-01', 'Outlet positions were read from the hand sketch and the floor plan. Every outlet must be walked and marked on site before cables are pulled.', 'Floor plan'],
  ['A-02', '"Showroom" is the main Office 14 floor; "Design" is the Designers strip along the window wall.', 'Floor plan'],
  ['A-03', 'PC6 and PC8 sit at the 1500 mm desk; PC7 (server) sits in the IT Room next to the cabinet.', 'Cable schedule'],
  ['A-04', '"Mobile" is a wired point for a phone / mobile charging dock in the Design area (PoE assumed).', 'Topology'],
  ['A-05', 'Cables leave the IT Room above the door and run in a ceiling tray, dropping down the wall to each desk outlet. Ceiling height is taken as 2.8 m.', 'Installation'],
];

export const DECISIONS = [
  ['D-01', 'IP addressing and Wi-Fi SSIDs: accept the proposed plan or supply an existing scheme.', 'IT'],
  ['D-02', 'Access point brand / model (and whether a cloud controller is used).', 'IT / Management'],
  ['D-03', 'PoE switch model: managed or smart-managed, PoE budget ≥ 150 W.', 'IT'],
  ['D-04', 'ISP and service: fibre ONT location, static IP needed or not.', 'Management'],
  ['D-05', 'Add a UPS for the cabinet (recommended).', 'Management'],
  ['D-06', 'Mobile point: confirm it is an IP phone / PoE device, or a plain data point.', 'Design team'],
  ['D-07', 'Contractor or in-house install; certification tester available or hired.', 'Management'],
];

export const RISKS = [
  ['Ceiling closed before cables are pulled', 'High', `Pull all ${DEVICES.length} cables in one visit while the ceiling is open.`],
  ['Outlet positions change after furniture layout', 'Medium', 'Confirm desk layout first (A-01); leave 300 mm service loop at each outlet.'],
  ['Cable run near power / lighting', 'Medium', 'Keep ≥ 300 mm from unshielded power; cross at 90°.'],
  ['IT Room heat with cabinet door closed', 'Low', 'Fit fan tray; keep the vents clear; check temperature after a week.'],
  ['No UPS — power cut drops Wi-Fi and internet', 'Medium', 'Decide D-05.'],
];

