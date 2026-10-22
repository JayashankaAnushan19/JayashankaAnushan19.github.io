// Device library for the Device lab. Typical datasheet values — always confirm against the
// maker's current datasheet. Users can add their own models in the page (saved in their browser).
window.O14_MODELS = {
  ap: [
    { id: 'u6-lite', brand: 'Ubiquiti', model: 'UniFi 6 Lite (U6-Lite)', std: 'Wi-Fi 6 (802.11ax)', streams: '2×2',
      b24: { tx: 23, gain: 2.8, phy: 300 }, b5: { tx: 26, gain: 3, phy: 1201 }, poe: 'af', watt: 12, clients: 300, area: 115 },
    { id: 'u6-plus', brand: 'Ubiquiti', model: 'UniFi U6+', std: 'Wi-Fi 6 (802.11ax)', streams: '2×2',
      b24: { tx: 23, gain: 4, phy: 574 }, b5: { tx: 26, gain: 6, phy: 2402 }, poe: 'af', watt: 9, clients: 300, area: 140 },
    { id: 'u6-pro', brand: 'Ubiquiti', model: 'UniFi 6 Pro (U6-Pro)', std: 'Wi-Fi 6 (802.11ax)', streams: '2×2 / 4×4',
      b24: { tx: 22, gain: 4, phy: 574 }, b5: { tx: 26, gain: 6, phy: 4800 }, poe: 'at', watt: 13, clients: 350, area: 140 },
    { id: 'u7-pro', brand: 'Ubiquiti', model: 'UniFi U7 Pro', std: 'Wi-Fi 7 (802.11be)', streams: '2×2',
      b24: { tx: 22, gain: 4, phy: 688 }, b5: { tx: 26, gain: 6, phy: 4324 }, poe: 'at', watt: 21, clients: 300, area: 140 },
    { id: 'eap610', brand: 'TP-Link', model: 'Omada EAP610', std: 'Wi-Fi 6 (802.11ax)', streams: '2×2',
      b24: { tx: 23, gain: 4, phy: 574 }, b5: { tx: 23, gain: 5, phy: 1201 }, poe: 'af', watt: 12.2, clients: 300, area: 120 },
    { id: 'eap650', brand: 'TP-Link', model: 'Omada EAP650', std: 'Wi-Fi 6 (802.11ax)', streams: '2×2',
      b24: { tx: 23, gain: 4, phy: 574 }, b5: { tx: 26, gain: 5, phy: 2402 }, poe: 'at', watt: 16.5, clients: 500, area: 140 },
    { id: 'eap225', brand: 'TP-Link', model: 'Omada EAP225', std: 'Wi-Fi 5 (802.11ac)', streams: '2×2',
      b24: { tx: 20, gain: 4, phy: 450 }, b5: { tx: 23, gain: 5, phy: 867 }, poe: 'af', watt: 12, clients: 100, area: 100 },
    { id: 'ap22', brand: 'HPE Aruba', model: 'Instant On AP22', std: 'Wi-Fi 6 (802.11ax)', streams: '2×2',
      b24: { tx: 21, gain: 3.5, phy: 574 }, b5: { tx: 21, gain: 5.5, phy: 1200 }, poe: 'af', watt: 13, clients: 100, area: 120 },
  ],
  switch: [
    { id: 'sg1218mpe', brand: 'TP-Link', model: 'TL-SG1218MPE', ports: 16, poePorts: 16, poe: 'at', budget: 250, managed: 'Easy Smart (VLAN, QoS)', uplinks: '2 GbE + 2 SFP' },
    { id: 'sg1218mp', brand: 'TP-Link', model: 'TL-SG1218MP', ports: 16, poePorts: 16, poe: 'at', budget: 250, managed: 'Unmanaged', uplinks: '2 GbE + 2 SFP' },
    { id: 'sg2218p', brand: 'TP-Link', model: 'Omada SG2218P', ports: 16, poePorts: 16, poe: 'at', budget: 150, managed: 'Smart managed (Omada)', uplinks: '2 SFP' },
    { id: 'sg1016pe', brand: 'TP-Link', model: 'TL-SG1016PE', ports: 16, poePorts: 8, poe: 'at', budget: 110, managed: 'Easy Smart', uplinks: '—' },
    { id: 'usw-lite-16', brand: 'Ubiquiti', model: 'UniFi Switch Lite 16 PoE', ports: 16, poePorts: 8, poe: 'at', budget: 45, managed: 'Managed (UniFi)', uplinks: '—' },
  ],
  cable: [
    // R = DC resistance per conductor (Ω/100 m); IL(f) per 100 m = a√f + b·f + c/√f (dB); limit = permanent-link insertion loss at rated f
    { id: 'cat6-cu', model: 'Cat6 U/UTP 23 AWG solid bare copper', awg: 23, cond: 'Bare copper', R: 6.66, a: 1.808, b: 0.017, c: 0.2, f: 250, limit: 30.7, ok: true },
    { id: 'cat6-cca', model: 'Cat6 "CCA" 23 AWG copper-clad aluminium', awg: 23, cond: 'CCA', R: 10.3, a: 1.99, b: 0.019, c: 0.22, f: 250, limit: 30.7, ok: false },
    { id: 'cat5e-cu', model: 'Cat5e U/UTP 24 AWG solid copper', awg: 24, cond: 'Bare copper', R: 8.42, a: 1.967, b: 0.023, c: 0.05, f: 100, limit: 21.0, ok: true },
    { id: 'cat6a-cu', model: 'Cat6A U/UTP 23 AWG solid copper', awg: 23, cond: 'Bare copper', R: 6.66, a: 1.82, b: 0.0091, c: 0.25, f: 500, limit: 43.8, ok: true },
  ],
};
