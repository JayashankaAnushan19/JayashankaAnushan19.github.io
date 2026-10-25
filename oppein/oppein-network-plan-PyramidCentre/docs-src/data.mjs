// Single source of truth for the Office 14 documentation.
// Positions are in drawing units (pt) on the traced floor plan; MM_PER_PT converts to real size.
//
// Rev D — final (2026-10-23). Positions from the user's marked plan (marks 1–8).
//  ALL switches are in the IT Room cabinet (mark 1): router → SW0 (8-port) → SW1 (5-port) and SW2 (8-port), patch cords.
//  Every device has its own home run from the cabinet: up into the ceiling, PVC conduit to mark 2, down behind the wall,
//  then wall casing to each desk (AP2 carries on across the ceiling from mark 2). IT Room PCs run along the IT Room walls.
//  Plain (non-PoE) switches: each AP has a PoE injector in the cabinet. Separate phone line from the ONT to desk 5.

export const META = {
  project: 'Office 14 — Structured Cabling & Network',
  site: 'Pyramid Centre · Office 14',
  rev: 'Rev D',
  date: '2026-10-23',
  status: 'On going — wiring',
  author: 'Jayashanka · OPPEIN IT',
};
export const REVISIONS = [
  ['Rev A', '2026-10-16', 'First issue. Built from the hand sketch, the Office 14 floor plan and the interactive cabling plan (ceiling tray, one 16-port PoE switch in the cabinet).'],
  ['Rev B', '2026-10-22', 'Re-designed around a 5-port and an 8-port switch in the Design area, PoE injectors for the APs and wall casing instead of a tray. AP3 dropped.'],
  ['Rev C', '2026-10-22', 'Positions from the marked plan: 4 wired PCs in the IT Room on a new cabinet switch (SW0); SW1 at desk 3, SW2 at desk 5; AP1 in the Designers strip, AP2 in the Showroom; no Showroom desks; separate phone line from the ONT to the mobile; cabinet keeps ≥ 4U spare.'],
  ['Rev D', '2026-10-23', 'Final wiring plan: all switches moved into the cabinet. Every device gets its own cable from the cabinet through the ceiling conduit to mark 2 and on in wall casing; PoE injectors in the cabinet; 24-port patch panel.'],
];

export const MM_PER_PT = 9.27; // from the 1800 mm / 5199 mm dimensions on the drawing
export const BOUNDS = { x: 430, y: 50, w: 1560, h: 1560 };
export const RACK = { x: 1690, y: 1535, id: 'RTR', name: 'Router (cabinet)' }; // mark 1

// Cable route (as the user built it): cabinet → up into the ceiling → PVC conduit in the ceiling straight to mark 2 →
// down behind the wall at mark 2 → surface casing along the desk wall to desks 3, 4, 5 and 6.
// ROUTE[0]→ROUTE[1] is the ceiling conduit; every later segment is wall casing.
export const ROUTE = [
  { x: 1690, y: 1535 }, { x: 1088, y: 628 }, { x: 975, y: 520 }, { x: 858, y: 400 },
  { x: 725, y: 232 }, { x: 545, y: 262 },
];
export const CEIL_DROP = 2.8; // m, ceiling down to skirting behind the wall at mark 2 (and back up for AP2)
export const JUNCTION_NOTES = {
  J1: 'Desk 3 (PC3, AP1 up the wall)',
  J2: 'Desk 4',
  J3: 'Desk 5 (PC5, printer, mobile, phone socket)',
  J4: 'Desk 6',
};

export const TYPE_NAME = {
  ap: 'Wi-Fi access point', pc: 'Workstation PC', srv: 'Server PC', prn: 'Network printer', ph: 'Mobile / phone',
  sw: 'Network switch', up: 'Uplink', tel: 'Phone line',
};
export const TYPE_COLOR = { ap: 'var(--c-ap)', pc: 'var(--c-pc)', srv: 'var(--c-srv)', prn: 'var(--c-prn)', ph: 'var(--c-ph)', sw: 'var(--amber)', up: 'var(--c-wan)', tel: 'var(--c-ph)' };

// Network units — all in the cabinet. SW0 is new; SW1 / SW2 are the existing plain unmanaged desktop switches.
export const CABINET_IDS = ['RTR', 'SW0', 'SW1', 'SW2', 'ONT'];
export const inCabinet = id => CABINET_IDS.includes(id);
export const SWITCHES = [
  { id: 'SW0', name: 'Switch 0 · 8-port', ports: 8, x: 1690, y: 1535, zone: 'IT Room', at: 'cabinet', from: 'RTR', fromPort: 1, inPort: 1, cabinet: true },
  { id: 'SW1', name: 'Switch 1 · 5-port', ports: 5, x: 1690, y: 1535, zone: 'IT Room', at: 'cabinet', from: 'SW0', fromPort: 2, inPort: 1, cabinet: true },
  { id: 'SW2', name: 'Switch 2 · 8-port', ports: 8, x: 1690, y: 1535, zone: 'IT Room', at: 'cabinet', from: 'SW0', fromPort: 3, inPort: 1, cabinet: true },
];
export const ROUTER_LAN = 4;

// `on` = unit the device plugs into, `port` = port on that unit. `local` = patch cord only, no cable run.
// `mark` = number on the user's marked plan.
export const DEVICES = [
  // Every device is a home run from the cabinet. AP1 on SW1 port 4 and AP2 on SW2 (user). AP2 continues from mark 2
  // across the ceiling to the Showroom.
  { id: 'PC2', on: 'SW1', port: 2, type: 'pc', zone: 'Design', name: 'PC 2', x: 1100, y: 660, mark: 2 },
  { id: 'PC3', on: 'SW1', port: 3, type: 'pc', zone: 'Design', name: 'PC 3', x: 945, y: 492, mark: 3 },
  { id: 'AP1', on: 'SW1', port: 4, type: 'ap', zone: 'Design', name: 'Access Point 1', x: 793, y: 487, poe: true, ceil: true, mark: 7 },
  { id: 'AP2', on: 'SW2', port: 2, type: 'ap', zone: 'Showroom', name: 'Access Point 2', x: 813, y: 1064, poe: true, ceil: true, viaCeiling: true, mark: 8 },
  { id: 'PC4', on: 'SW2', port: 3, type: 'pc', zone: 'Design', name: 'PC 4', x: 846, y: 384, mark: 4 },
  { id: 'PC5', on: 'SW2', port: 4, type: 'pc', zone: 'Design', name: 'PC 5', x: 730, y: 205, mark: 5 },
  { id: 'PRN', on: 'SW2', port: 5, type: 'prn', zone: 'Design', name: 'Printer', x: 655, y: 190, mark: 5 },
  { id: 'MOB', on: 'SW2', port: 6, type: 'ph', zone: 'Design', name: 'Mobile / phone', x: 770, y: 268, mark: 5, tel: true },
  { id: 'PC6', on: 'SW2', port: 7, type: 'pc', zone: 'Design', name: 'PC 6', x: 518, y: 270, mark: 6 },
  // IT Room: 4 wired PCs (positions along the walls are approximate, open item A-03); other devices use router Wi-Fi.
  { id: 'IT1', on: 'SW0', port: 4, type: 'pc', zone: 'IT Room', name: 'IT PC 1', x: 1600, y: 1548, room: true, mark: 1 },
  { id: 'IT2', on: 'SW0', port: 5, type: 'pc', zone: 'IT Room', name: 'IT PC 2', x: 1780, y: 1548, room: true, mark: 1 },
  { id: 'IT3', on: 'SW0', port: 6, type: 'pc', zone: 'IT Room', name: 'IT PC 3', x: 1790, y: 1430, room: true, mark: 1 },
  { id: 'IT4', on: 'SW0', port: 7, type: 'pc', zone: 'IT Room', name: 'IT PC 4', x: 1790, y: 1320, room: true, mark: 1 },
];

export const UNITS = [{ ...RACK, ports: ROUTER_LAN, zone: 'IT Room', at: 'cabinet' }, ...SWITCHES];
export const unit = id => UNITS.find(u => u.id === id);
export const portLabel = (on, port) => on === 'RTR' ? `RTR-L${port}` : on === 'ONT' ? `ONT-${port}` : `${on}-P${port}`;

export const pointName = k => k === 0 ? 'Cabinet' : k === 1 ? 'Mark 2 drop' : 'J' + (k - 1);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const polyLen = p => p.slice(1).reduce((s, q, i) => s + dist(p[i], q), 0);
const nearest = pt => { let best = 1, bd = Infinity; for (let i = 1; i < ROUTE.length; i++) { const d = dist(ROUTE[i], pt); if (d < bd) { bd = d; best = i; } } return best; };

// Cable path between two points: branch to the nearest route point, along the route, branch out.
// Runs from the cabinet start at ROUTE[0] (ceiling conduit to mark 2). Runs inside the IT Room follow the room walls.
// `viaCeiling` devices (AP2) leave the casing at mark 2, go back up and cross the ceiling.
function routePath(a, b, fromCab, room, viaCeiling) {
  if (room) return { path: [RACK, { x: b.x, y: RACK.y }, b], ia: 0, ib: 0, room: true, vert: 0 };
  const ia = fromCab ? 0 : nearest(a), ib = viaCeiling ? 1 : nearest(b);
  const lo = Math.min(ia, ib), hi = Math.max(ia, ib);
  let mid = ROUTE.slice(lo, hi + 1); if (ia > ib) mid = mid.reverse();
  // every run that passes the mark-2 drop (cabinet runs, or AP2 going back up) adds the 2.8 m wall drop
  const vert = (fromCab !== !!viaCeiling) ? CEIL_DROP : 0;
  return { path: fromCab ? mid.concat([b]) : [a, ...mid, b], ia, ib, vert, viaCeiling: !!viaCeiling };
}

// End allowances (m). Cabinet: up to the ceiling conduit (or down to the IT Room casing) + dressing loop.
export const DROP = { rack: 1.5, switch: 1.0, wall: 0.5, ap: 3.0, apCeil: 0.6 };
export const SLACK = 0.10;

// Cable runs: uplink, switch-to-switch link, one run per device that is not a local patch, and the phone line.
let n = 0;
const nextId = () => `C-${String(++n).padStart(2, '0')}`;
export const RUNS = [];
function addRun(r) {
  const fromCab = inCabinet(r.fromId);
  const from = fromCab ? RACK : unit(r.fromId);
  const rp = routePath(from, r.to, fromCab, r.room, r.to.viaCeiling);
  const casingM = polyLen(rp.path) * MM_PER_PT / 1000;
  const drops = (fromCab ? DROP.rack : DROP.switch) + rp.vert + r.endDrop;
  Object.assign(r, rp, { casingM, drops, est: Math.ceil((casingM + drops) * (1 + SLACK)), cable: nextId(), junction: rp.room ? 'IT Room' : pointName(rp.ib) });
  RUNS.push(r); return r;
}
for (const s of SWITCHES) {
  if (s.cabinet) continue; // SW0 is patched to the router inside the cabinet
  const up = s.from === 'SW0';
  addRun({ kind: up ? 'uplink' : 'link', fromId: s.from, fromPort: s.fromPort, toId: s.id, toPort: s.inPort, to: s, type: up ? 'up' : 'sw', name: up ? `Uplink cabinet → ${s.id}` : `Link ${s.from} → ${s.id}`, zone: s.zone, endDrop: DROP.switch });
}
for (const d of DEVICES) {
  d.label = portLabel(d.on, d.port);
  if (d.local) { Object.assign(d, { cable: 'patch', est: 0, outlet: `Patch cord at ${d.on}`, outletShort: 'Patch' }); continue; }
  const r = addRun({ kind: 'device', fromId: d.on, fromPort: d.port, toId: d.id, to: d, type: d.type, name: d.name, zone: d.zone, poe: d.poe, room: d.room, endDrop: d.viaCeiling ? DROP.apCeil : d.ceil ? DROP.ap : DROP.wall });
  Object.assign(d, { run: r, cable: r.cable, est: r.est, path: r.path, junction: r.junction,
    outlet: d.ceil ? 'Surface box at the AP (casing up the wall)' : 'Surface box on the casing @ 300 mm', outletShort: d.ceil ? 'Ceiling' : 'Wall @300' });
}
// Phone line: ONT TEL port → the mobile / phone at desk 5. Cat6 in the same casing; the RJ11 plug fits the RJ45 jacks.
const MOB = DEVICES.find(d => d.tel);
export const PHONE = addRun({ kind: 'phone', fromId: 'ONT', fromPort: 'TEL1', toId: 'TEL', to: { id: 'TEL', x: MOB.x + 25, y: MOB.y + 30, name: 'Phone socket at desk 5' }, type: 'tel', name: 'Phone line ONT → mobile (desk 5)', zone: 'Design', endDrop: DROP.wall });
MOB.phone = PHONE;
// What feeds each switch: SW0 is a patch cord from the router; the others are cable runs.
export const feedOf = id => { const s = unit(id); if (!s.from) return null; const r = RUNS.find(x => x.toId === id); return { from: s.from, fromPort: s.fromPort, cable: r ? r.cable : 'patch', est: r ? r.est : 0, type: r ? r.type : 'up', run: r || null }; };

export const BY_UNIT = UNITS.map(u => ({ unit: u, devices: DEVICES.filter(d => d.on === u.id).sort((a, b) => a.port - b.port) }));
export const TOTAL_M = RUNS.reduce((s, r) => s + r.est, 0);
export const DEVICE_RUNS = RUNS.filter(r => r.kind === 'device');
export const OUTLETS = DEVICE_RUNS.length + 1;        // device-end surface boxes (+1 phone socket)
export const LOCAL = DEVICES.filter(d => d.local);
export const POE = DEVICES.filter(d => d.poe).length; // = PoE injectors
export const BOXES = Math.ceil(TOTAL_M * 1.05 / 305);
export const LONGEST = RUNS.reduce((a, b) => (b.est > a.est ? b : a));
export const usedPorts = id => {
  const u = unit(id), used = new Set(DEVICES.filter(d => d.on === id).map(d => d.port));
  if (u.inPort) used.add(u.inPort);
  SWITCHES.forEach(s => { if (s.from === id) used.add(s.fromPort); });
  return used;
};
export const SPARE = Object.fromEntries(UNITS.map(u => [u.id, [...Array(u.ports)].map((_, i) => i + 1).filter(p => !usedPorts(u.id).has(p))]));
// What plugs into each port, for port maps.
export function portMap(id) {
  const u = unit(id);
  return [...Array(u.ports)].map((_, i) => {
    const p = i + 1;
    const d = DEVICES.find(x => x.on === id && x.port === p);
    const out = SWITCHES.find(s => s.from === id && s.fromPort === p);
    if (u.inPort === p) { const f = feedOf(id); return { p, what: `In from ${f.from === 'RTR' ? 'router' : f.from}`, cable: f.cable, type: f.type }; }
    if (out) { const f = feedOf(out.id); return { p, what: `Out to ${out.id}`, cable: f.cable, type: f.type }; }
    if (d) return { p, what: d.name, cable: d.cable, type: d.type, dev: d };
    return { p, what: 'Spare', cable: '—', type: null };
  });
}

// Casing: count of cables in each main-route segment, plus branch legs (shared legs counted once).
const sizeFor = c => c <= 4 ? '25 × 16 mm' : c <= 10 ? '40 × 25 mm' : '60 × 40 mm';
const routeRuns = RUNS.filter(r => !r.room);
const crosses = (r, i) => Math.min(r.ia, r.ib) <= i && Math.max(r.ia, r.ib) >= i + 1;
// Ceiling PVC conduit: cabinet → mark 2, plus the AP2 leg across the ceiling from mark 2.
const conduitSize = c => c <= 3 ? '20 mm' : c <= 6 ? '25 mm' : '32 mm';
const ceilRuns = routeRuns.filter(r => crosses(r, 0));
export const CONDUIT = [
  { what: 'Cabinet → mark 2 (in the ceiling)', len: dist(ROUTE[0], ROUTE[1]) * MM_PER_PT / 1000 + 1.0, cables: ceilRuns.length, list: ceilRuns.map(r => r.cable) },
  ...RUNS.filter(r => r.viaCeiling).map(r => ({ what: `Mark 2 → ${r.toId} (in the ceiling)`, len: dist(ROUTE[1], r.to) * MM_PER_PT / 1000, cables: 1, list: [r.cable] })),
].map(c => ({ ...c, size: conduitSize(c.cables) }));
export const CONDUIT_M = CONDUIT.reduce((t, c) => t + c.len, 0);
// Wall casing: segments from mark 2 onwards.
export const CASING_SEGS = ROUTE.slice(1).map((q, i) => ({ i, q })).filter(({ i }) => i >= 1).map(({ q, i }) => {
  const cables = routeRuns.filter(r => crosses(r, i)).length;
  return { from: pointName(i), to: pointName(i + 1), len: dist(ROUTE[i], q) * MM_PER_PT / 1000, cables, size: cables ? sizeFor(cables) : '—' };
});
// Branch legs from a unit/device to its route point; cables sharing the same leg share one casing.
const legs = new Map();
const addLeg = (node, k, pt) => {
  const key = `${node}>${k}`, l = legs.get(key);
  if (l) l.cables++; else legs.set(key, { from: node, at: pointName(k), len: dist(pt, ROUTE[k]) * MM_PER_PT / 1000, cables: 1 });
};
routeRuns.forEach(r => {
  if (!inCabinet(r.fromId)) addLeg(r.fromId, r.ia, unit(r.fromId));
  if (!r.viaCeiling) addLeg(r.toId, r.ib, r.to);
});
export const CASING_LEGS = [...legs.values()].map(l => ({ ...l, size: sizeFor(l.cables) }));
// IT Room: one casing along the bottom and right walls from the cabinet, sized for all room runs.
const roomRuns = RUNS.filter(r => r.room);
export const CASING_ROOM = roomRuns.length ? [{ what: `IT Room walls (${roomRuns.map(r => r.toId).join(', ')})`, len: Math.max(...roomRuns.map(r => r.casingM)), size: sizeFor(roomRuns.length) }] : [];
// Vertical casing: behind the wall at mark 2 (ceiling ↔ skirting), and each wall-fed AP up to the ceiling.
const dropRuns = routeRuns.filter(r => r.vert);
export const CASING_VERT = [
  { what: `Mark 2: ceiling down to skirting (${dropRuns.map(r => r.cable).join(', ')})`, len: CEIL_DROP, size: sizeFor(dropRuns.length) },
  ...(roomRuns.length ? [{ what: 'Cabinet down to the IT Room casing', len: 1.0, size: sizeFor(roomRuns.length) }] : []),
  ...DEVICES.filter(d => d.ceil && !d.viaCeiling).map(d => ({ what: `${d.id} up the wall to the ceiling`, len: 2.5, size: sizeFor(1) }))];
const sumBy = size => [...CASING_SEGS.filter(s => s.cables), ...CASING_LEGS, ...CASING_ROOM, ...CASING_VERT].filter(s => s.size === size).reduce((t, s) => t + s.len, 0);
export const CASING_SIZES = ['25 × 16 mm', '40 × 25 mm', '60 × 40 mm'].map(size => {
  const m = sumBy(size); return { size, m, lengths: Math.ceil(m * 1.10 / 2) }; // sold in 2 m lengths, +10 % offcuts
}).filter(s => s.m > 0);
export const CASING_M = CASING_SIZES.reduce((t, s) => t + s.m, 0);
export const ROUTE_M = polyLen(ROUTE) * MM_PER_PT / 1000;

// 9U wall cabinet: just what it holds + the 4U spare the user asked for (U2–U5). Cables enter through the top knock-out.
export const RACK_U = 9;
export const RACK_UNITS = {
  9: ['Patch panel 24 × Cat6 (PP-1…24)', 'pp'], 8: ['Shelf · SW0 8-port · SW1 5-port · SW2 8-port', 'sw'],
  7: ['Shelf · ONT + router + 2 PoE injectors', 'shelf'], 6: ['(shelf space)', 'shelfb'],
  5: ['Spare', 'spare'], 4: ['Spare', 'spare'], 3: ['Spare', 'spare'], 2: ['Spare', 'spare'],
  1: ['PDU 8-way 230 V', 'pdu'],
};
export const SPARE_RANGE = (() => { const us = Object.entries(RACK_UNITS).filter(([, [, k]]) => k === 'spare').map(([u]) => +u); return `U${Math.min(...us)}–U${Math.max(...us)}`; })();
export const SPARE_U = Object.values(RACK_UNITS).filter(([, k]) => k === 'spare').length;
// Cables that end in the cabinet land on the patch panel in this order.
export const PANEL = RUNS.filter(r => inCabinet(r.fromId)).map((r, i) => ({ pp: i + 1, run: r }));

// Proposed — not decided. See open item D-01. Plain switches have no management address.
export const IP_PLAN = [
  ['Network', '192.168.14.0/24', 'Single flat office LAN'],
  ['Gateway / router', '192.168.14.1', 'DHCP server, firewall, NAT, router Wi-Fi for the IT Room'],
  ['Access points AP1–AP2', '192.168.14.11 – .12', 'Static or DHCP reservation'],
  ['Printer', '192.168.14.20', 'DHCP reservation'],
  ['IT Room PCs IT1–IT4', '192.168.14.31 – .34', 'DHCP reservation (or static if they run services)'],
  ['Spare static range', '192.168.14.35 – .99', 'Future NVR, NAS, IP phones'],
  ['DHCP pool', '192.168.14.100 – .199', 'PCs, laptops, phones'],
  ['Guest Wi-Fi', 'Isolated by AP / router', 'Client isolation, internet only (the switches are unmanaged, no VLANs)'],
];

export const ASSUMPTIONS = [
  ['A-01', 'Device positions were taken from the marked plan (marks 1–8). Every outlet must be walked and marked on site before casing is fixed.', 'Floor plan'],
  ['A-02', '"Showroom" is the main Office 14 floor; "Design" is the Designers strip along the window wall. There are no wired desks in the Showroom.', 'Floor plan'],
  ['A-03', 'The 4 IT Room PCs sit along the IT Room walls near the cabinet; their exact places are not marked yet. Other IT Room devices use the router Wi-Fi.', 'Cable schedule'],
  ['A-04', 'Desk 5 has four sockets side by side (PC5, printer, mobile data, phone line); every other desk has one. No switch sits at any desk.', 'Topology'],
  ['A-05', 'All Design-area cables go from the cabinet up into the ceiling and through the PVC conduit to mark 2, come down behind the wall there and run in wall casing to desks 2–6 and up to AP1. AP2 stays in the ceiling from mark 2. If the conduit is already in place, set its BOQ line to 0, but check it can take all the cables.', 'Installation'],
  ['A-07', 'SW1 is the existing 5-port switch (AP1 on port 4) and SW2 the existing 8-port switch (AP2); both now sit in the cabinet on one shelf with the new SW0.', 'Topology'],
  ['A-06', 'The mobile at desk 5 uses the ONT phone (TEL) port through its own cable (C-12). Its data port on SW2 (SW2-P5) is kept; free it if the phone only needs the line.', 'Topology'],
];

export const DECISIONS = [
  ['D-01', 'IP addressing and Wi-Fi SSIDs: accept the proposed plan or supply an existing scheme.', 'IT'],
  ['D-02', 'Access point brand / model (and whether a cloud controller is used).', 'IT / Management'],
  ['D-03', 'Keep three small switches (SW0 + existing SW1 / SW2) or replace them with one 16- or 24-port switch in the spare space (tidier, one power supply).', 'IT'],
  ['D-04', 'ISP and service: ONT model, how many TEL ports, static IP needed or not.', 'Management'],
  ['D-05', 'Add a UPS for the cabinet (recommended).', 'Management'],
  ['D-06', 'Later: one PoE switch would replace SW0–SW2 and both injectors (BOQ F.3).', 'IT'],
  ['D-07', 'Contractor or in-house install; certification tester available or hired.', 'Management'],
];

export const RISKS = [
  ['SW0 failure takes SW1 and SW2 (the whole office) offline', 'Medium', 'Keep a spare 8-port switch and patch cords in the cabinet; or move to one larger switch (D-03).'],
  ['Conduit to mark 2 too small for all the cables', 'Medium', 'Check the existing pipe size before pulling; the BOQ sizes it for the full bundle.'],
  ['Casing knocked or lids pulled off at desks', 'Low', 'Screw-fix every 500 mm; run casing behind desks where possible.'],
  ['Cable run near power / lighting', 'Medium', 'Keep ≥ 300 mm from power casing, or use divided casing; cross at 90°.'],
  ['No UPS: a power cut drops Wi-Fi, internet and the phone line', 'Medium', 'Decide D-05. Everything is now powered from the cabinet PDU, so one UPS covers the whole network.'],
];
